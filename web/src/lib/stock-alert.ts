/**
 * Emails the shop when a variant's stock drops to a low level after an order.
 *
 * Checked right after an order is finalized, against the skus that were just
 * sold, using the same variables as the other order emails (RESEND_API_KEY,
 * CONTACT_EMAIL, CONTACT_FROM_EMAIL) so there is nothing new to set up.
 */

/** At or below this many units left, the shop is told. */
export const LOW_STOCK_THRESHOLD = 3;

export type LowStockLine = { sku: string; label: string; stock: number };

/**
 * Never throws. A stock warning failing to send must not turn a successful
 * order into a webhook failure — the order itself is already safely recorded
 * by the time this runs.
 */
export async function alertLowStock(lines: LowStockLine[]): Promise<void> {
  if (lines.length === 0) return;
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || "lucrescente <onboarding@resend.dev>";

    if (!apiKey || !to) {
      console.warn("[stock] low stock but no alert could be sent — set RESEND_API_KEY and CONTACT_EMAIL", lines);
      return;
    }

    const text = [
      "estes produtos estão com pouco stock, depois de uma encomenda:",
      "",
      ...lines.map((l) => `  ${l.label} (${l.sku}): ${l.stock === 0 ? "esgotado" : `restam ${l.stock}`}`),
    ].join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "lucrescente — stock baixo",
        text,
      }),
    });

    if (!res.ok) {
      console.error("[stock] low stock alert rejected", res.status, await res.text());
    }
  } catch (e) {
    console.error("[stock] low stock alert failed to send", e);
  }
}
