/**
 * The confirmation email the customer gets after paying.
 *
 * Until now the only thing a customer received was Stripe's own receipt, which
 * says what was charged but nothing about what was bought, where it is going,
 * or who it is from.
 *
 * Sent from the webhook, not from the confirmation page: the page is reached
 * by a redirect the customer can close, refresh or never load, while the
 * webhook fires once per paid session whatever the browser does. It is sent
 * only when an order is actually recorded, and never on a duplicate, so
 * Stripe's retries cannot mail the same person twice.
 *
 * Goes out through Resend's HTTP API on the same variables as the contact form
 * (RESEND_API_KEY, CONTACT_FROM_EMAIL), so there is nothing new to configure.
 */
import { orderEmailCopy } from "@/content/order-email-locales";
import { getVariantLabel } from "@/content/variant-locales";
import { formatPrice } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export type OrderConfirmationAddress = {
  line1?: string;
  line2?: string;
  postal_code?: string;
  city?: string;
  country?: string;
};

export type OrderConfirmation = {
  to: string;
  locale: Locale;
  orderId: string;
  customerName: string | null;
  shippingOption: string | null;
  shippingAddress: OrderConfirmationAddress | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  items: { sku: string; quantity: number; product_name: string; variant_label: string | null }[];
};

/** Prices read in the customer's own language, as they did at checkout. */
const PRICE_LOCALE: Record<Locale, string> = { pt: "pt-PT", en: "en-IE", fr: "fr-FR" };

function body(o: OrderConfirmation): string {
  const c = orderEmailCopy[o.locale];
  const money = (cents: number) => formatPrice(cents, PRICE_LOCALE[o.locale]);
  const a = o.shippingAddress;

  const lines = o.items.map((i) => {
    const label = getVariantLabel(i.variant_label, o.locale);
    return `  ${i.quantity} × ${i.product_name}${label ? ` · ${label}` : ""}`;
  });

  const address = a
    ? [o.customerName, a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.country]
        .filter((l) => l && String(l).trim())
        .map((l) => `  ${l}`)
    : [];

  return [
    c.greeting(o.customerName),
    "",
    c.thanks,
    "",
    `${c.summary}:`,
    ...lines,
    "",
    `${c.subtotal}: ${money(o.subtotalCents)}`,
    `${c.shipping}${o.shippingOption ? ` (${o.shippingOption})` : ""}: ${money(o.shippingCents)}`,
    `${c.total}: ${money(o.totalCents)}`,
    "",
    c.whatNext,
    ...(address.length ? ["", `${c.shippingTo}:`, ...address] : []),
    "",
    `${c.reference}: ${o.orderId}`,
    "",
    c.questions,
    "",
    c.signoff,
  ].join("\n");
}

/**
 * Never throws. The order is already recorded and the money already taken by
 * the time this runs, so a mail provider having a bad minute must not turn a
 * good order into a webhook failure — that would make Stripe retry a sale that
 * succeeded. A failure here is logged and nothing else.
 */
export async function sendOrderConfirmation(o: OrderConfirmation): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[webhook] no RESEND_API_KEY — confirmation email not sent for order", o.orderId);
      return;
    }
    const from = process.env.CONTACT_FROM_EMAIL || "lucrescente <onboarding@resend.dev>";
    const replyTo = process.env.CONTACT_EMAIL;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [o.to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject: orderEmailCopy[o.locale].subject,
        text: body(o),
      }),
    });

    if (!res.ok) {
      console.error("[webhook] confirmation email rejected for order", o.orderId, res.status, await res.text());
    }
  } catch (e) {
    console.error("[webhook] confirmation email failed to send for order", o.orderId, e);
  }
}
