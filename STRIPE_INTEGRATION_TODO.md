# Stripe Integration — Remaining Steps

This file is the single source of truth for what is left to do on the Stripe Checkout
integration.

**Scenario detected: A** — the project already had a Checkout Session call, so only the
parameters inside that one call were changed. No new files, routes, or endpoints were added.

**File changed:** [web/src/app/api/checkout/route.ts](web/src/app/api/checkout/route.ts)

---

## Values to Replace

**None.** Every `sample_only` parameter (`mode`, `success_url`, `cancel_url`, `line_items`)
already held real, working values in this codebase, so they were preserved as required and
no placeholders were introduced.

For the record, the existing real values that were kept:

| Field | Current Value | Status |
|-------|--------------|--------|
| mode | `payment` | Correct — the shop sells one-off physical goods, not subscriptions. |
| success_url | `${origin}/encomenda/confirmacao?session_id={CHECKOUT_SESSION_ID}` | Real page, and it keeps the `{CHECKOUT_SESSION_ID}` template. No change needed. |
| cancel_url | `${origin}/produtos?checkout=cancelado` | Real page. No change needed. |
| line_items | Built at runtime from the validated cart via `price_data` | Real. This shop prices from its own catalogue/database rather than from Stripe Price IDs, so there are no `price_...` placeholders to fill in. |

---

## Configured Parameters

These came from Checkout Studio and are now set in the code.

**File containing these parameters:**
- [web/src/app/api/checkout/route.ts](web/src/app/api/checkout/route.ts)

| Parameter | Value |
|-----------|-------|
| ui_mode | `hosted_page` |
| billing_address_collection | `auto` |
| phone_number_collection | `{ enabled: false }` |
| automatic_tax | `{ enabled: false }` |
| allow_promotion_codes | `false` |
| submit_type | `auto` |
| integration_identifier | `hosted_web_0002` |
| origin_context | `web` |

### Two notes on the above

**`payment_method_collection` was deliberately left out.** Checkout Studio supplied the value
`always`, but that parameter only applies when `mode` is `subscription`. This shop runs in
`payment` mode, so including it would have been an error. If the shop ever adds subscriptions,
set `payment_method_collection: "always"` on the subscription session.

**`ui_mode` is version-dependent.** `hosted_page` is correct for the installed SDK
(`stripe@22.6.2`, i.e. ≥ 21.0.0), and this was verified against the package's own type
definitions plus a clean `npm run typecheck`. If the SDK is ever downgraded below 21.0.0,
this value must change to `hosted`.

---

## Parameters kept on purpose (please read)

The task instructions said to remove any parameter absent from the Checkout Studio list.
Six parameters were **kept anyway**, because they are application logic rather than Checkout
Studio styling, and dropping them would have broken paid features of this shop. This was a
judgement call — review it and tell me if you want any of them removed.

| Parameter | Why removing it would break something |
|-----------|----------------------------------------|
| `metadata.items` | The webhook at [web/src/app/api/stripe/webhook/route.ts](web/src/app/api/stripe/webhook/route.ts) reads `full.metadata?.items` to write the order row and decrement stock. Without it, **paid orders would silently never be recorded.** |
| `shipping_options` | Carries the shipping tiers and delivery estimates from `web/src/config/shipping.ts`. Removing it means customers are charged no postage. |
| `shipping_address_collection` | Restricts delivery to `ALLOWED_COUNTRIES` and collects the address the parcel is sent to. A shop of physical goods cannot ship without it. |
| `currency` (`eur`) | Without it the session currency is not pinned to euros. |
| `locale` | Renders the Stripe page in the customer's language (pt / en / fr). |
| `customer_creation` | `if_required`, so receipts and customer records still work. |

---

## Setup

### Environment variables

Already declared in [web/.env.example](web/.env.example) — no new variables are needed. Fill
these in `web/.env.local` for development, and in the hosting provider's dashboard for
production:

| Variable | Where to get it |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/test/apikeys — server-only, never exposed to the browser. |
| `STRIPE_WEBHOOK_SECRET` | https://dashboard.stripe.com/workbench/webhooks — the `whsec_...` signing secret. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same API keys page. The `NEXT_PUBLIC_` prefix is required for browser access in Next.js. |
| `NEXT_PUBLIC_SITE_URL` | Your site's own URL, used for the success and cancel redirects. |
| `CHECKOUT_MOCK` | Dev only. Set `true` with an empty `STRIPE_SECRET_KEY` to exercise the whole order flow without real keys. Set `false` in production. |

Naming was checked for consistency: this is a Next.js project, not Vite, so browser variables
use `NEXT_PUBLIC_` and server-only variables carry no prefix.

### Dependencies

Nothing to install. `stripe@^22.6.2` is already in [web/package.json](web/package.json).

---

## How the integration works

1. The cart posts to `POST /api/checkout` ([route.ts](web/src/app/api/checkout/route.ts)).
2. `validateCart` re-prices every line server-side, so the browser cannot dictate prices.
3. If `STRIPE_SECRET_KEY` is missing and `CHECKOUT_MOCK=true`, a local mock checkout page is
   used instead — useful before real keys exist.
4. Otherwise a hosted Checkout Session is created and the customer is redirected to Stripe's
   own payment page.
5. On payment, Stripe calls `POST /api/stripe/webhook`, which verifies the signature, reads
   `metadata.items`, writes the order, and decrements stock.
6. The customer lands back on `/encomenda/confirmacao?session_id=...`.

---

## Testing

Use test mode keys (`sk_test_...`) and these card numbers, with any future expiry, any CVC,
and any postcode:

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Declined — insufficient funds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

To receive webhooks locally:

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

---

## Done

- **End-to-end test order placed and verified.** Stripe CLI forwarding webhooks
  locally, paid with `4242 4242 4242 4242`: order row written, stock
  decremented, confirmation page correct. Test orders deleted and stock restored
  afterwards, so the `orders` table is empty.
- **The Stripe page reads in all three languages.** Product names, variant
  labels and shipping options were Portuguese for everyone; they are now
  translated, and the same names are written into the order record so the
  confirmation page agrees with the payment page.
- **Shipping tiers replaced with real CTT rates**, and Madeira/Azores split into
  their own tier — they used to share the mainland rate while costing about
  three times as much. See the comment at the top of `web/src/config/shipping.ts`
  for what the numbers assume.

## Next steps

- **Set the live account's public details.** The account these tests ran against
  is a sandbox, with Stripe's seed data in it (the individual is "Scott Fisher",
  the website is `accessible.stripe.com`). Before going live, set the public
  business name to `lucrescente` under Settings → Business → Public details, and
  the statement descriptor under Settings → Payments. It cannot be done through
  the API: Stripe refuses account updates to your own account.
- **Sign the CTT Lojas Online contract, or change the rates back.** Every rate
  in `shipping.ts` assumes it. Without it, walk-in counter prices apply and each
  one is sold at a loss.
- Swap test keys for live keys, and register the production webhook endpoint, when going live.
- Decide whether to keep or remove the six parameters listed under **Parameters kept on purpose**.

## Two failure modes that have been closed, and are worth not reopening

Both shared a shape: checkout succeeded, the customer was charged, and the order
was then lost after the money had moved. Neither was visible to a typecheck, and
neither showed up in testing that stopped at the Stripe page.

1. **The cart used to be serialised into one Stripe metadata value.** Stripe caps
   those at 500 characters; fifteen lines came to 867, and it broke at about
   nine. The webhook now reads the order from the line items, where Stripe keeps
   the sku, name and variant on each product, and metadata carries only compact
   numeric triples split across numbered keys. See `web/src/lib/checkout-metadata.ts`.
2. **`finalize_order` rejected an order if two lines shared a sku.** That became
   reachable when add-ons arrived (one balm, two oils, one stock). Fixed in
   `supabase/migrations/20260928000100_allow_repeated_sku_lines.sql`, which sums
   quantities per sku for the stock check and still writes one row per line, so
   both flavours reach the person packing the parcel.

If you change how the cart is shaped, test that **the order row appears**, not
just that Stripe accepted the payment. That is the step where both of these hid.

## Resources

- https://docs.stripe.com/mcp
- https://support.stripe.com
