-- Let one SKU appear on more than one order line.
--
-- finalize_order used to reject an order outright if two lines carried the same
-- SKU, on the stated assumption that "checkout carts are normalized to one line
-- per SKU". That stopped being true when add-ons arrived: the coloured lip balms
-- are made to order out of a single stock, so "with sweet orange" and "with
-- peppermint" are the same SKU on two lines, told apart only by the add-on.
--
-- The rejection fired in the worst possible place. Checkout accepted the cart,
-- Stripe took the money, and only then did this function raise 22023 — so the
-- order row was never written, stock was never decremented, and the customer
-- landed on a confirmation page that could not find their order. Nothing in the
-- TypeScript could catch it, because the invariant lived only down here.
--
-- What replaces it is the stock maths that comment was avoiding, which is four
-- lines: sum the quantities per SKU and compare that total against stock, so two
-- lines of two can no longer sell four items out of a stock of two. The rows are
-- still written one per line, never merged, because merging them would collapse
-- the two oils into one and the person packing the parcel would never see the
-- second flavour — which is the whole reason the add-on exists.
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
  v_variant public.product_variants%rowtype;
  v_quantity int;
begin
  select id into v_order_id from public.orders where stripe_session_id = p_session_id;
  if found then
    return jsonb_build_object('order_id', v_order_id, 'duplicate', true);
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception using errcode = '22023', message = 'order has no items';
  end if;

  -- Every line must carry a sane quantity of its own, before any of them are summed.
  for v_item in select * from jsonb_array_elements(p_items) loop
    if (v_item->>'quantity')::int <= 0 then
      raise exception using errcode = '22023', message = 'invalid order quantity';
    end if;
  end loop;

  -- Lock and validate per SKU rather than per line, so a SKU spread over several
  -- lines is checked against stock as one total.
  for v_item in
    select jsonb_build_object('sku', item->>'sku', 'quantity', sum((item->>'quantity')::int))
    from jsonb_array_elements(p_items) item
    group by item->>'sku'
  loop
    v_quantity := (v_item->>'quantity')::int;

    select * into strict v_variant
    from public.product_variants
    where sku = v_item->>'sku'
    for update;

    if v_variant.price_cents is null then
      raise exception using errcode = '22023', message = format('sku %s is not for sale online', v_variant.sku);
    end if;
    if v_variant.stock < v_quantity then
      raise exception using errcode = 'P0001', message = format('insufficient stock for sku %s: requested %s, available %s', v_variant.sku, v_quantity, v_variant.stock);
    end if;
  end loop;

  insert into public.orders (stripe_session_id, stripe_payment_intent, email, customer_name, shipping_address,
                             shipping_option, subtotal_cents, shipping_cents, total_cents)
  values (p_session_id, p_payment_intent, p_email, p_customer_name, p_shipping_address,
          p_shipping_option, p_subtotal_cents, p_shipping_cents, p_total_cents)
  returning id into v_order_id;

  -- One row per line, so both flavours reach the packing list. The per-line
  -- decrements add up to the per-SKU total validated above.
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into strict v_variant
    from public.product_variants
    where sku = v_item->>'sku'
    for update;

    v_quantity := (v_item->>'quantity')::int;
    update public.product_variants set stock = stock - v_quantity where id = v_variant.id;

    insert into public.order_items (order_id, variant_id, sku, product_name, variant_label, quantity, unit_price_cents, total_cents)
    values (v_order_id, v_variant.id, v_item->>'sku', v_item->>'product_name', v_item->>'variant_label',
            v_quantity, (v_item->>'unit_price_cents')::int,
            v_quantity * (v_item->>'unit_price_cents')::int);
  end loop;

  return jsonb_build_object('order_id', v_order_id, 'duplicate', false);
exception
  when no_data_found then
    raise exception using errcode = '22023', message = format('unknown sku %s', v_item->>'sku');
end $$;

revoke all on function public.finalize_order(text,text,text,text,jsonb,text,int,int,int,jsonb) from public, anon, authenticated;
