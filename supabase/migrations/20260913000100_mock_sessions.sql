-- Local mock checkout sessions (used only when STRIPE_SECRET_KEY is empty and CHECKOUT_MOCK=true).
-- Safe to leave in production: the table is never used once Stripe is configured.
create table if not exists public.mock_checkout_sessions (
  id text primary key,
  lines jsonb not null,
  subtotal_cents int not null,
  created_at timestamptz not null default now()
);
alter table public.mock_checkout_sessions enable row level security;
-- no policies: service role only
