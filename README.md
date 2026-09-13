# lucrescente — loja online

Next.js 15 (App Router, TypeScript strict) · Tailwind v4 (brand tokens) · Supabase (Postgres) · Stripe Checkout · Framer Motion.

```
assets/      supplied brand material (docx, copy, ingredients, xlsx, photos, photo-map.json)
supabase/    migrations (schema, finalize_order RPC, mock sessions table)
web/         the Next.js app
verification/shots/   screenshots at 1280 / 390 for every page type
```

## Run locally

```bash
cd web
cp .env.example .env.local   # fill Supabase + Stripe keys
npm install
npm run images   # copies/resizes curated photos from ../assets/photo-map.json into public/images
npm run seed     # seeds categories, products, variants, ingredients, links, images
npm run dev
```

Scripts: `build`, `typecheck`, `seed`, `images`, `verify` (read-only Supabase counts + idempotency probe).

## Where the client edits prices and stock (no code)

Supabase → Table editor → **`product_variants`**:

- `price_cents` (integer, EUR cents; `NULL` = "por encomenda", no price shown, no cart button)
- `stock` (integer; `0` = honest sold-out state with WhatsApp CTA)

Pages revalidate every 60 s, so changes appear within a minute. `products.why_it_works` and `products.story` hold the supplied copy; blank = section is omitted (no invented prose).

Re-running `npm run seed` does **not** overwrite price/stock for existing SKUs (use `npm run seed -- --force` to reset to the spreadsheet values).

## Shipping rates (placeholders, confirm with client)

One file: `web/src/config/shipping.ts` → `SHIPPING_TIERS`.
Current proposal: Portugal 4,50 € · Europe 12,00 € · rest of world 22,00 €. Change `amount_cents`, redeploy.

## Payment flow

1. Cart (localStorage) → `POST /api/checkout` validates every line against live stock (409 + adjustments if short; the drawer reconciles and warns).
2. Stripe Checkout Session (guest, EUR, shipping address + shipping options from the config).
3. `POST /api/stripe/webhook` on `checkout.session.completed` → `finalize_order` RPC: inserts order + items and decrements stock atomically; idempotent on `stripe_session_id`.
4. `/encomenda/confirmacao?session_id=…` renders the order from Supabase and clears the cart.

Stock only moves on paid sessions, never on add-to-cart.

### Local mock (no Stripe keys)

With `STRIPE_SECRET_KEY` empty and `CHECKOUT_MOCK=true`, `/api/checkout` creates a row in `mock_checkout_sessions` and redirects to `/checkout/mock`, which calls the same `finalize_order` RPC. The mock route refuses to run when a Stripe key is present.

### Going live

Set in Vercel: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (endpoint `https://<domain>/api/stripe/webhook`, event `checkout.session.completed`), `NEXT_PUBLIC_SITE_URL`, the three Supabase vars, and `CHECKOUT_MOCK=false`.

## Content rules baked in

- All copy comes from `web/src/content/pt.ts` (verbatim from `lucrescente-conteudo.md`); UI strings marked `// ui`. i18n-ready via `web/src/lib/i18n.ts`.
- Only photos from the supplied set; products without a safe photo (champô queda, sabonete corpo aveia, batom herpes) show the crescent placeholder frame.
- Internal spreadsheet data (costs, recipes, margins, suppliers) is not in the repo's client-readable code or DB.
- No newsletter, no login, no reviews, no native alerts.

## Open items

- Live Stripe keys + webhook secret.
- Final shipping rates.
- Prices for vela citronela, vela massagem, sais de banho relaxante (currently "por encomenda").
- Photos for the three placeholder products, and per-variant photos for deodorants / roll-ons / batons (currently shared generic photos, alt text stays truthful).
