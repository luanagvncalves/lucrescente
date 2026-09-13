-- lucrescente · catalogue + orders schema
-- Prices are stored in cents (integer). NULL price = "por encomenda" (no price supplied).

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  sort_order int not null default 0,
  why_it_works text,
  is_solid boolean not null default false,
  is_candle boolean not null default false,
  is_deodorant boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  label text,
  price_cents int check (price_cents is null or price_cents >= 0),
  stock int not null default 0 check (stock >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  scientific_name text,
  origin text not null,
  properties text not null,
  applications text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_ingredients (
  product_id uuid not null references public.products(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  sort_order int not null default 0,
  primary key (product_id, ingredient_id)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  path text not null,          -- public path under /images/products/
  alt text not null,
  is_primary boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  status text not null default 'paid' check (status in ('paid','fulfilled','cancelled','refunded')),
  email text,
  customer_name text,
  shipping_address jsonb,
  shipping_option text,
  currency text not null default 'eur',
  subtotal_cents int not null default 0,
  shipping_cents int not null default 0,
  total_cents int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  sku text not null,
  product_name text not null,
  variant_label text,
  quantity int not null check (quantity > 0),
  unit_price_cents int not null,
  total_cents int not null
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists variants_product_idx on public.product_variants(product_id);
create index if not exists product_ingredients_ingredient_idx on public.product_ingredients(ingredient_id);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists variants_updated_at on public.product_variants;
create trigger variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Atomic order write + stock decrement (called from the Stripe webhook with the service role).
-- Idempotent on stripe_session_id: a repeated webhook delivery returns the existing order id.
-- Never lets stock go negative: clamps at 0 and records the shortfall in the returned json.
-- ---------------------------------------------------------------------------
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
  p_items jsonb  -- [{sku, quantity, unit_price_cents, product_name, variant_label}]
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_short jsonb := '[]'::jsonb;
  v_take int;
begin
  select id into v_order_id from public.orders where stripe_session_id = p_session_id;
  if found then
    return jsonb_build_object('order_id', v_order_id, 'duplicate', true);
  end if;

  insert into public.orders (stripe_session_id, stripe_payment_intent, email, customer_name, shipping_address,
                             shipping_option, subtotal_cents, shipping_cents, total_cents)
  values (p_session_id, p_payment_intent, p_email, p_customer_name, p_shipping_address,
          p_shipping_option, p_subtotal_cents, p_shipping_cents, p_total_cents)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_variant from public.product_variants where sku = v_item->>'sku' for update;
    if found then
      v_take := least(v_variant.stock, (v_item->>'quantity')::int);
      if v_take < (v_item->>'quantity')::int then
        v_short := v_short || jsonb_build_object('sku', v_variant.sku, 'requested', (v_item->>'quantity')::int, 'available', v_variant.stock);
      end if;
      update public.product_variants set stock = stock - v_take where id = v_variant.id;
    end if;
    insert into public.order_items (order_id, variant_id, sku, product_name, variant_label, quantity, unit_price_cents, total_cents)
    values (v_order_id, v_variant.id, v_item->>'sku', v_item->>'product_name', v_item->>'variant_label',
            (v_item->>'quantity')::int, (v_item->>'unit_price_cents')::int,
            (v_item->>'quantity')::int * (v_item->>'unit_price_cents')::int);
  end loop;

  return jsonb_build_object('order_id', v_order_id, 'duplicate', false, 'shortfall', v_short);
end $$;

revoke all on function public.finalize_order(text,text,text,text,jsonb,text,int,int,int,jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security: catalogue is public read; orders are server-only.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.ingredients enable row level security;
alter table public.product_ingredients enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (is_active);
drop policy if exists "public read variants" on public.product_variants;
create policy "public read variants" on public.product_variants for select using (true);
drop policy if exists "public read ingredients" on public.ingredients;
create policy "public read ingredients" on public.ingredients for select using (true);
drop policy if exists "public read product_ingredients" on public.product_ingredients;
create policy "public read product_ingredients" on public.product_ingredients for select using (true);
drop policy if exists "public read product_images" on public.product_images;
create policy "public read product_images" on public.product_images for select using (true);
-- orders / order_items: no policies => only service role can read/write.
