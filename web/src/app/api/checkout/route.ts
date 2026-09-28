import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { stripe, stripeEnabled, mockEnabled } from "@/lib/stripe";
import { validateCart, type CheckoutItemInput } from "@/lib/checkout";
import { packItems, type CompactItem } from "@/lib/checkout-metadata";
import { ALLOWED_COUNTRIES, SHIPPING_TIERS, shippingLabel } from "@/config/shipping";
import { getProductCopy } from "@/content/product-locales";
import { getDictionary } from "@/lib/i18n";
import { getAddOnLabel } from "@/content/product-addons";
import { getVariantLabel } from "@/content/variant-locales";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

async function siteUrl() {
  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return origin;
}

export async function POST(req: Request) {
  let body: { items?: CheckoutItemInput[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }

  const validated = await validateCart(body.items ?? []);
  if (!validated.ok) return NextResponse.json(validated, { status: 409 });

  const origin = await siteUrl();
  // Stripe hosts the payment page itself, so it needs telling which language to
  // render; `query` carries the language back to our own confirmation page.
  const locale = body.locale === "en" || body.locale === "fr" ? body.locale : "pt";
  const query = locale === "pt" ? "" : `&idioma=${locale}`;

  // The catalogue holds names in Portuguese only, so `validateCart` — which
  // re-reads them from the database on purpose, never trusting the browser —
  // hands back Portuguese. Translate here, once, and use the same names for the
  // Stripe page and for the order record, so the confirmation page the customer
  // lands on afterwards says what the payment page said. `sku` is carried
  // alongside and stays language-neutral, so an order is still identifiable
  // whatever language it was bought in.
  const named = validated.lines.map((l) => {
    const variant = getVariantLabel(l.variantLabel, locale);
    // The add-on has no sku of its own — the balms are made to order — so this
    // is the only place it can reach the payment page, the order record and the
    // packing list. It was checked against the product's own list in
    // `validateCart`, so by here it is one of ours or it is null.
    const addOn = l.addOn ? getAddOnLabel(l.productSlug, l.addOn, locale) : null;
    // The container and the dose were composed into a browser-side label that
    // `validateCart` then threw away, so neither reached Stripe, the order or
    // the person filling the container. They are rebuilt here from the
    // server's own sanitised values.
    const ownContainer = l.ownContainer ? getDictionary(locale).products.ownContainerLabel : null;
    const dose = l.dose ? `${getDictionary(locale).products.doseLabel}: ${l.dose}` : null;
    return {
      ...l,
      displayName: getProductCopy(l.productSlug, locale, { name: l.productName }).name,
      displayVariant: [variant, addOn, ownContainer, dose].filter(Boolean).join(" · ") || null,
    };
  });

  // ---------- mock mode (no Stripe keys yet) ----------
  if (!stripeEnabled) {
    if (!mockEnabled) return NextResponse.json({ error: "pagamentos ainda não estão ativos. fala connosco para encomendar." }, { status: 503 });
    const id = `mock_${randomUUID()}`;
    const db = supabaseAdmin();
    const { error } = await db.from("mock_checkout_sessions").insert({
      id,
      lines: validated.lines,
      subtotal_cents: validated.subtotalCents,
    });
    if (error) return NextResponse.json({ error: "não conseguimos preparar o pagamento" }, { status: 500 });
    return NextResponse.json({ url: `${origin}/checkout/mock?session=${id}` });
  }

  // ---------- real Stripe Checkout ----------
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      ui_mode: "hosted_page",
      currency: "eur",
      locale,
      customer_creation: "if_required",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: "auto",
      integration_identifier: "hosted_web_0002",
      origin_context: "web",
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      // Every tier is offered to every customer, and the customer picks. A
      // hosted Checkout Session is created before the address is known, and
      // Stripe will not re-price options against the address afterwards — so
      // "madeira e açores" cannot be enforced from the postcode here. The
      // labels are named plainly so the right one is the obvious one, and
      // island orders are worth a glance before posting. Enforcing it properly
      // would mean collecting the address first and creating the session after.
      shipping_options: SHIPPING_TIERS.map((tier) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: shippingLabel(tier, locale),
          fixed_amount: { amount: tier.amount_cents, currency: "eur" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: tier.min_days },
            maximum: { unit: "business_day", value: tier.max_days },
          },
          metadata: { tier: tier.id },
        },
      })),
      line_items: named.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "eur",
          unit_amount: l.unitPriceCents,
          product_data: {
            name: `${l.displayName}${l.displayVariant ? ` · ${l.displayVariant}` : ""}`,
            // The webhook reads the order back from here rather than from
            // session metadata, which is capped at 500 characters per value.
            // Name and variant are kept apart so it never has to split the
            // display name on a separator that could appear inside a name.
            metadata: {
              sku: l.sku,
              product_name: l.displayName,
              variant_label: l.displayVariant ?? "",
            },
          },
        },
      })),
      metadata: {
        // A compact [sku, qty, unit_cents] fallback, split across numbered keys
        // so no single value can overflow. See lib/checkout-metadata.ts.
        ...packItems(named.map((l) => [l.sku, l.quantity, l.unitPriceCents] as CompactItem)),
        locale,
      },
      success_url: `${origin}/encomenda/confirmacao?session_id={CHECKOUT_SESSION_ID}${query}`,
      cancel_url: `${origin}/produtos?checkout=cancelado${query}`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] stripe error", e);
    return NextResponse.json({ error: "não conseguimos preparar o pagamento" }, { status: 502 });
  }
}
