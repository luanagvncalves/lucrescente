/**
 * Emails the shop when a payment succeeded but the order could not be recorded.
 *
 * This exists because of a failure that was invisible for two days: a cart with
 * the same sku on two lines was paid for, Stripe reported success to the
 * customer, and `finalize_order` refused the order. Nothing was written, nobody
 * was told, and the only trace was a webhook Stripe quietly kept retrying.
 *
 * Money has already changed hands by the time this runs, so the email carries
 * everything needed to fulfil or refund the order by hand — the session id, the
 * customer, the amount and the lines — rather than just saying something broke.
 *
 * Sends through Resend's HTTP API, like the contact form, on the same two
 * variables (RESEND_API_KEY, CONTACT_EMAIL) so there is nothing new to set up.
 */

export type FailedOrderAlert = {
  sessionId: string;
  paymentIntent: string | null;
  email: string | null;
  customerName: string | null;
  totalCents: number;
  items: { sku: string; quantity: number; product_name: string; variant_label: string | null }[];
  error: unknown;
};

const euros = (cents: number) => `${(cents / 100).toFixed(2).replace(".", ",")} €`;

/**
 * Never throws and never rejects. The caller is already in a failure path, and
 * an alert that could itself fail would replace a recorded problem with a
 * silent one — the exact fault this is here to prevent.
 */
export async function alertOrderNotRecorded(alert: FailedOrderAlert): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || "lucrescente <onboarding@resend.dev>";

    if (!apiKey || !to) {
      console.error("[webhook] paid order NOT recorded and no alert could be sent — set RESEND_API_KEY and CONTACT_EMAIL", {
        session: alert.sessionId,
      });
      return;
    }

    const reason = alert.error instanceof Error ? alert.error.message : String(alert.error);

    const text = [
      "um pagamento foi aceite mas a encomenda NÃO ficou registada.",
      "",
      "o cliente já pagou. é preciso tratar esta encomenda à mão, ou devolver o dinheiro.",
      "",
      `sessão stripe: ${alert.sessionId}`,
      alert.paymentIntent ? `pagamento: ${alert.paymentIntent}` : null,
      `cliente: ${alert.customerName ?? "(sem nome)"}`,
      `email: ${alert.email ?? "(sem email)"}`,
      `total: ${euros(alert.totalCents)}`,
      "",
      "linhas:",
      ...(alert.items.length
        ? alert.items.map(
            (i) => `  ${i.quantity} x ${i.product_name}${i.variant_label ? ` · ${i.variant_label}` : ""} (${i.sku})`,
          )
        : ["  (não foi possível ler as linhas)"]),
      "",
      `motivo técnico: ${reason}`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `lucrescente — encomenda paga NÃO registada (${euros(alert.totalCents)})`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("[webhook] alert email rejected", res.status, await res.text());
    }
  } catch (e) {
    console.error("[webhook] alert email failed to send", e);
  }
}
