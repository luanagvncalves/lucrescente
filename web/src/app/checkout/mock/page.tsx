import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { mockEnabled } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { finalizeOrder } from "@/lib/orders";
import { SHIPPING_TIERS, tierForCountry } from "@/config/shipping";
import { formatPrice } from "@/lib/types";
import type { ValidatedLine } from "@/lib/checkout";
import { Label } from "@/components/ui/typography";
import { buttonClass } from "@/components/ui/button";
import { Crescent } from "@/components/ui/motifs";

export const metadata: Metadata = { title: "pagamento (modo de teste local)", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * LOCAL MOCK of Stripe Checkout. Only rendered when STRIPE_SECRET_KEY is empty and CHECKOUT_MOCK=true.
 * Simulates: shipping address collection, shipping option, "pay" → finalize_order → confirmation page.
 * Delete nothing here when real keys arrive; it simply stops being reachable.
 */
export default async function MockCheckout({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  if (!mockEnabled) notFound();
  const { session } = await searchParams;
  if (!session) notFound();
  const db = supabaseAdmin();
  const { data } = await db.from("mock_checkout_sessions").select("*").eq("id", session).maybeSingle();
  if (!data) notFound();
  const lines = data.lines as ValidatedLine[];
  const subtotal = data.subtotal_cents as number;

  async function pay(formData: FormData) {
    "use server";
    if (!mockEnabled) notFound();
    const country = String(formData.get("country") ?? "PT");
    const tier = tierForCountry(country) ?? SHIPPING_TIERS[0];
    const shipping = tier.amount_cents;
    await finalizeOrder({
      sessionId: session!,
      paymentIntent: `mock_pi_${session}`,
      email: String(formData.get("email") ?? ""),
      customerName: String(formData.get("name") ?? ""),
      shippingAddress: {
        line1: String(formData.get("line1") ?? ""),
        postal_code: String(formData.get("postal_code") ?? ""),
        city: String(formData.get("city") ?? ""),
        country,
      },
      shippingOption: tier.label,
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: subtotal + shipping,
      items: lines.map((l) => ({
        sku: l.sku,
        quantity: l.quantity,
        unit_price_cents: l.unitPriceCents,
        product_name: l.productName,
        variant_label: l.variantLabel,
      })),
    });
    redirect(`/encomenda/confirmacao?session_id=${session}`);
  }

  const input = "h-12 w-full rounded-2xl border border-moss/30 bg-paper px-4 font-ui text-[0.95rem] text-ink outline-none focus-visible:border-forest";

  return (
    <div className="container-brand section-gap">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 rounded-2xl border border-violet/40 bg-lavender/25 px-5 py-4 text-[0.9rem] text-ink">
          <strong className="font-medium">modo de teste local.</strong> esta página simula o Stripe Checkout enquanto não há chaves de teste. não é feito nenhum pagamento real.
        </div>
        <Label>pagamento</Label>
        <h1 className="mt-3 text-h2 text-forest lowercase">quase lá</h1>

        <form action={pay} className="mt-8 grid gap-8 md:grid-cols-5">
          <div className="space-y-4 md:col-span-3">
            <label className="block">
              <span className="label-brand mb-2 block text-moss">email</span>
              <input name="email" type="email" required defaultValue="teste@lucrescente.pt" className={input} />
            </label>
            <label className="block">
              <span className="label-brand mb-2 block text-moss">nome</span>
              <input name="name" required defaultValue="cliente de teste" className={input} />
            </label>
            <label className="block">
              <span className="label-brand mb-2 block text-moss">morada</span>
              <input name="line1" required defaultValue="rua das flores 1" className={input} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-brand mb-2 block text-moss">código postal</span>
                <input name="postal_code" required defaultValue="3100-000" className={input} />
              </label>
              <label className="block">
                <span className="label-brand mb-2 block text-moss">localidade</span>
                <input name="city" required defaultValue="pombal" className={input} />
              </label>
            </div>
            <label className="block">
              <span className="label-brand mb-2 block text-moss">país</span>
              <select name="country" className={input} defaultValue="PT">
                <option value="PT">portugal</option>
                <option value="ES">espanha</option>
                <option value="FR">frança</option>
                <option value="US">estados unidos</option>
              </select>
            </label>
            <p className="text-[0.85rem] text-ink/70">
              portes: {SHIPPING_TIERS.map((s) => `${s.label} ${formatPrice(s.amount_cents)}`).join(" · ")}
            </p>
            <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
              pagar (simulado)
            </button>
          </div>

          <aside className="card-brand h-fit p-6 md:col-span-2">
            <div className="flex items-center gap-2">
              <Crescent size={14} tone="var(--violet)" />
              <span className="label-brand text-moss">resumo</span>
            </div>
            <ul className="mt-4 space-y-3 text-[0.92rem]">
              {lines.map((l) => (
                <li key={l.sku} className="flex justify-between gap-3">
                  <span>
                    {l.quantity} × {l.productName}
                    {l.variantLabel ? ` (${l.variantLabel})` : ""}
                  </span>
                  <span className="font-medium">{formatPrice(l.unitPriceCents * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-moss/15 pt-4 font-medium">
              <span>subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
