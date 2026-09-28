-- One definition of finalize_order, and lock the rows in a fixed order.
--
-- Two migrations were written for the repeated-sku fix within the same hour, by
-- two people who did not know about each other: 20260928000000 and
-- 20260928000100. Both were correct, both were applied, and the one the
-- database ended up running was simply whichever went last — while a database
-- rebuilt from this folder would have run whichever sorted last. Those are not
-- the same thing, and that gap is worth closing even while both behave alike.
-- The earlier file has since been withdrawn; this migration exists so that what
-- is live and what is in the repository are the same text, whichever of the two
-- happened to be applied.
--
-- It also keeps the better half of the other version. Rows are locked in sku
-- order, which the per-line loop did not do: two orders placed at the same
-- moment, each holding two of the same skus, could take them in opposite orders
-- and deadlock, and Postgres would resolve it by aborting one — after payment,
-- which is the failure this whole sequence has been about. Ordering the locks
-- means both orders queue instead.
--
-- The shape is otherwise as before: quantities are summed per sku for the stock
-- check and the decrement, so several lines of one sku cannot oversell it, and
-- order_items still gets one row per line, never merged, so the person packing
-- sees which oil belongs in which jar.
create or replace function public.finalize_order(
  p_session_id text,
  p_payment_intent text,
  p_email text,
  p_customer_name text,
  p_shipping_address jsonb,
  p_shipping_option text,
  p_subtotal_cents int,
  p_shipping_cents int,
  p_total_cents int,
  p_items jsonb
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_grouped record;
  v_variant public.product_variants%rowtype;
  -- the sku being looked up, so the handler can name it without reading a
  -- record variable that may never have been assigned
  v_sku text;
  v_quantity int;
begin
  select id into v_order_id from public.orders where stripe_session_id = p_session_id;
  if found then
    return jsonb_build_object('order_id', v_order_id, 'duplicate', true);
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception using errcode = '22023', message = 'order has no items';
  end if;

  -- Every line must carry a sane quantity of its own, before any are summed.
  for v_item in select * from jsonb_array_elements(p_items) loop
    if (v_item->>'quantity')::int <= 0 then
      raise exception using errcode = '22023', message = 'invalid order quantity';
    end if;
  end loop;

  -- Lock, validate and decrement per sku, in sku order. `order by 1` is the
  -- deadlock guard: every order takes these rows in the same sequence.
  for v_grouped in
    select item->>'sku' as sku, sum((item->>'quantity')::int)::int as quantity
    from jsonb_array_elements(p_items) item
    group by item->>'sku'
    order by 1
  loop
    v_sku := v_grouped.sku;
    select * into strict v_variant
    from public.product_variants
    where sku = v_sku
    for update;

    if v_variant.price_cents is null then
      raise exception using errcode = '22023', message = format('sku %s is not for sale online', v_variant.sku);
    end if;
    if v_variant.stock < v_grouped.quantity then
      raise exception using errcode = 'P0001', message = format('insufficient stock for sku %s: requested %s, available %s', v_variant.sku, v_grouped.quantity, v_variant.stock);
    end if;

    update public.product_variants set stock = stock - v_grouped.quantity where id = v_variant.id;
  end loop;

  insert into public.orders (stripe_session_id, stripe_payment_intent, email, customer_name, shipping_address,
                             shipping_option, subtotal_cents, shipping_cents, total_cents)
  values (p_session_id, p_payment_intent, p_email, p_customer_name, p_shipping_address,
          p_shipping_option, p_subtotal_cents, p_shipping_cents, p_total_cents)
  returning id into v_order_id;

  -- One row per line. The rows are already locked and already decremented above,
  -- so this only needs the variant's id.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_sku := v_item->>'sku';
    select * into strict v_variant
    from public.product_variants
    where sku = v_sku;

    v_quantity := (v_item->>'quantity')::int;

    insert into public.order_items (order_id, variant_id, sku, product_name, variant_label, quantity, unit_price_cents, total_cents)
    values (v_order_id, v_variant.id, v_item->>'sku', v_item->>'product_name', v_item->>'variant_label',
            v_quantity, (v_item->>'unit_price_cents')::int,
            v_quantity * (v_item->>'unit_price_cents')::int);
  end loop;

  return jsonb_build_object('order_id', v_order_id, 'duplicate', false);
exception
  when no_data_found then
    raise exception using errcode = '22023', message = format('unknown sku %s', v_sku);
end $$;

revoke all on function public.finalize_order(text,text,text,text,jsonb,text,int,int,int,jsonb) from public, anon, authenticated;
