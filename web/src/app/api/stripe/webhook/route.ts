import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { finalizeOrder, type OrderLineInput } from "@/lib/orders";
import { unpackItems } from "@/lib/checkout-metadata";
import { getVariantsBySkus } from "@/lib/catalog";
import { alertOrderNotRecorded } from "@/lib/order-alert";
import { sendOrderConfirmation, type OrderConfirmationAddress } from "@/lib/order-email";
import type { Locale } from "@/lib/i18n";

export const runtime = "nodejs";

/**
 * Rebuilds the ordered lines from the session. Prefers the expanded line items,
 * where the sku, name and variant live on each product; falls back to the
 * compact metadata triples, looking the names up in the catalogue, so an order
 * is still recorded if the expansion ever comes back empty.
 */
async function itemsFromLineItems(full: Stripe.Checkout.Session): Promise<OrderLineInput[]> {
  const lines: OrderLineInput[] = [];

  for (const li of full.line_items?.data ?? []) {
    const product = li.price?.product;
    if (!product || typeof product === "string" || product.deleted) continue;
    const sku = product.metadata?.sku;
    if (!sku) continue;
    lines.push({
      sku,
      quantity: li.quantity ?? 0,
      unit_price_cents: li.price?.unit_amount ?? 0,
      product_name: product.metadata?.product_name || product.name || sku,
      variant_label: product.metadata?.variant_label || null,
    });
  }
  if (lines.length > 0) return lines;

  const compact = unpackItems(full.metadata);
  if (compact.length === 0) return [];
  console.warn("[webhook] falling back to session metadata for", full.id);

  const variants = await getVariantsBySkus(compact.map(([sku]) => sku));
  return compact.map(([sku, quantity, unit_price_cents]) => {
    const v = variants.find((x) => x.sku === sku);
    return {
      sku,
      quantity,
      unit_price_cents,
      product_name: v?.product.name ?? sku,
      variant_label: v?.label ?? null,
    };
  });
}

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

  // Held outside the try so the alert below can name what was bought, even when
  // it is finalizing — not reading — that failed.
  let items: OrderLineInput[] = [];
  let full: Stripe.Checkout.Session | null = null;

  try {
    full = await stripe().checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product", "shipping_cost.shipping_rate"],
    });

    // The line items are the primary record: Stripe stores the sku, the name
    // and the variant on each product, so nothing has to survive the 500-char
    // metadata cap. Metadata is only the fallback, and carries no names — see
    // lib/checkout-metadata.ts for why.
    items = await itemsFromLineItems(full);
    if (items.length === 0) throw new Error(`no items could be read for session ${full.id}`);
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

    // Only on the delivery that recorded the order. `duplicate` means Stripe is
    // retrying one it already recorded, and mailing the customer again for that
    // would be our fault, not theirs.
    const email = full.customer_details?.email;
    if (email && !result.duplicate) {
      const metaLocale = full.metadata?.locale;
      await sendOrderConfirmation({
        to: email,
        locale: (metaLocale === "en" || metaLocale === "fr" ? metaLocale : "pt") as Locale,
        orderId: result.order_id,
        customerName: details?.name ?? full.customer_details?.name ?? null,
        shippingOption,
        shippingAddress: (details?.address as OrderConfirmationAddress | undefined) ?? null,
        subtotalCents: full.amount_subtotal ?? 0,
        shippingCents: full.shipping_cost?.amount_total ?? 0,
        totalCents: full.amount_total ?? 0,
        items,
      });
    }

    return NextResponse.json({ received: true, order_id: result.order_id, duplicate: result.duplicate });
  } catch (e) {
    console.error("[webhook] finalize failed", e);
    // The customer has paid by this point, so this must never be a silent
    // failure. Stripe will retry (500, and finalize_order is idempotent), but a
    // fault that survives the retries would otherwise leave a paid order that
    // nobody knows about — so the shop is told now, not when a customer asks
    // where their parcel is.
    await alertOrderNotRecorded({
      sessionId: session.id,
      paymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
      email: full?.customer_details?.email ?? session.customer_details?.email ?? null,
      customerName: full?.customer_details?.name ?? session.customer_details?.name ?? null,
      totalCents: full?.amount_total ?? session.amount_total ?? 0,
      items,
      error: e,
    });
    return NextResponse.json({ error: "finalize failed" }, { status: 500 });
  }
}
