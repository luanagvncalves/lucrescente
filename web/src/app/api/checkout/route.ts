import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { stripe, stripeEnabled, mockEnabled } from "@/lib/stripe";
import { validateCart, type CheckoutItemInput } from "@/lib/checkout";
import { ALLOWED_COUNTRIES, SHIPPING_TIERS } from "@/config/shipping";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

async function siteUrl() {
  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return origin;
}

export async function POST(req: Request) {
  let body: { items?: CheckoutItemInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }

  const validated = await validateCart(body.items ?? []);
  if (!validated.ok) return NextResponse.json(validated, { status: 409 });

  const origin = await siteUrl();

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
      currency: "eur",
      locale: "pt",
      customer_creation: "if_required",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: SHIPPING_TIERS.map((tier) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: tier.label,
          fixed_amount: { amount: tier.amount_cents, currency: "eur" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: tier.min_days },
            maximum: { unit: "business_day", value: tier.max_days },
          },
          metadata: { tier: tier.id },
        },
      })),
      line_items: validated.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "eur",
          unit_amount: l.unitPriceCents,
          product_data: {
            name: `${l.productName}${l.variantLabel ? ` · ${l.variantLabel}` : ""}`,
            metadata: { sku: l.sku },
          },
        },
      })),
      metadata: {
        // compact item list for the webhook (sku:qty:unit_cents:name|label)
        items: JSON.stringify(validated.lines.map((l) => [l.sku, l.quantity, l.unitPriceCents, l.productName, l.variantLabel])),
      },
      success_url: `${origin}/encomenda/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/produtos?checkout=cancelado`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] stripe error", e);
    return NextResponse.json({ error: "não conseguimos preparar o pagamento" }, { status: 502 });
  }
}
