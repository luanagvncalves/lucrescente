import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { finalizeOrder } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Stripe webhook: on checkout.session.completed, store the order and decrement stock.
 * Configure the endpoint in Stripe as POST {site}/api/stripe/webhook and set STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  if (!stripeEnabled) return NextResponse.json({ error: "stripe not configured" }, { status: 503 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  const session = event.data.object;
  if (session.payment_status !== "paid") return NextResponse.json({ received: true, skipped: "unpaid" });

  try {
    const full = await stripe().checkout.sessions.retrieve(session.id, { expand: ["line_items", "shipping_cost.shipping_rate"] });
    type Compact = [string, number, number, string, string | null];
    const compact = JSON.parse(full.metadata?.items ?? "[]") as Compact[];
    const items = compact.map(([sku, quantity, unit_price_cents, product_name, variant_label]) => ({
      sku,
      quantity,
      unit_price_cents,
      product_name,
      variant_label,
    }));
    const rate = full.shipping_cost?.shipping_rate;
    const shippingOption = rate && typeof rate !== "string" ? rate.display_name : null;
    const details = full.collected_information?.shipping_details ?? null;

    const result = await finalizeOrder({
      sessionId: full.id,
      paymentIntent: typeof full.payment_intent === "string" ? full.payment_intent : (full.payment_intent?.id ?? null),
      email: full.customer_details?.email ?? null,
      customerName: details?.name ?? full.customer_details?.name ?? null,
      shippingAddress: (details?.address as Record<string, unknown> | undefined) ?? null,
      shippingOption,
      subtotalCents: full.amount_subtotal ?? 0,
      shippingCents: full.shipping_cost?.amount_total ?? 0,
      totalCents: full.amount_total ?? 0,
      items,
    });
    if (result.shortfall?.length) console.warn("[webhook] stock shortfall on order", result.order_id, result.shortfall);
    return NextResponse.json({ received: true, order_id: result.order_id, duplicate: result.duplicate });
  } catch (e) {
    console.error("[webhook] finalize failed", e);
    // 500 makes Stripe retry; finalize_order is idempotent so retries are safe.
    return NextResponse.json({ error: "finalize failed" }, { status: 500 });
  }
}
