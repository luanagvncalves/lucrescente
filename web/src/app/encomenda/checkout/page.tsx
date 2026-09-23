"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Crescent, Pause } from "@/components/ui/motifs";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";

type PaymentMethod = "card" | "mbway" | "apple";

export default function CheckoutPage() {
  const cart = useCart();
  const isPT = t.locale.startsWith("pt");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cart.lines.length === 0) {
      return;
    }
  }, []);

  async function handleCheckout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart.lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
          paymentMethod,
        }),
      });
      const data = (await res.json()) as
        | { url: string }
        | { error: string; adjustments?: { sku: string; name: string; available: number }[] };
      if (!res.ok || "error" in data) {
        if ("adjustments" in data && data.adjustments?.length) {
          cart.reconcile(data.adjustments.map((a) => ({ sku: a.sku, available: a.available })));
          for (const a of data.adjustments) cart.notify(t.cart.stockAdjusted(a.name, a.available), "warn");
          return;
        }
        setError("error" in data ? data.error : t.cart.errorGeneric);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError(t.cart.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container-brand section-gap">
        <div className="mx-auto max-w-xl text-center">
          <Crescent size={36} tone="var(--lavender)" className="mx-auto" />
          <h1 className="mt-6 text-h2 text-forest lowercase">{t.cart.empty}</h1>
          <p className="mt-4 text-ink/80">{t.cart.emptyHint}</p>
          <Link href="/produtos" className="mt-8 inline-block rounded-full bg-forest px-8 py-3 font-ui text-[0.95rem] font-medium text-paper transition hover:bg-forest/90">
            {t.cart.browse}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-brand section-gap">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-forest">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-ui text-[0.95rem]">{t.checkout.backToCart}</span>
          </Link>
        </div>

        <h1 className="mb-12 text-h1 text-forest lowercase">{t.checkout.title}</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Summary */}
          <section className="card-brand p-6 md:col-span-2" aria-labelledby="resumo">
            <h2 id="resumo" className="font-display text-[1.5rem] text-forest lowercase">
              {t.checkout.summary}
            </h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {cart.lines.map((l) => (
                <li key={l.sku} className="flex justify-between gap-4">
                  <span>
                    {l.quantity} × {l.productName}
                    {l.variantLabel ? ` (${l.variantLabel})` : ""}
                  </span>
                  <span className="font-medium">{formatPrice(l.unitPriceCents * l.quantity)}</span>
                </li>
              ))}
            </ul>

            <Pause className="my-8" />

            {/* Payment Method Selection */}
            <div>
              <h3 className="mb-4 font-display text-[1.2rem] text-forest lowercase">{t.checkout.paymentMethod}</h3>
              <p className="mb-6 text-[0.95rem] text-ink/80">{t.checkout.selectPayment}</p>
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            </div>
          </section>

          {/* Order Total */}
          <aside className="space-y-6">
            <div className="card-brand p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[0.95rem]">
                  <span className="text-ink/80">{t.checkout.subtotal}</span>
                  <span className="font-medium">{formatPrice(cart.subtotalCents)}</span>
                </div>
                <div className="border-t border-moss/15 pt-3">
                  <p className="text-[0.85rem] text-ink/70 mb-2">{t.cart.shippingNote}</p>
                </div>
                <div className="flex justify-between font-medium text-forest">
                  <span>{t.checkout.total}</span>
                  <span className="font-display text-[1.4rem]">{formatPrice(cart.subtotalCents)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-[0.95rem] text-red-700">
                {error}
              </div>
            )}

            <Button size="lg" className="w-full" onClick={handleCheckout} disabled={busy}>
              {busy ? t.checkout.continuePayment : t.checkout.continuePayment}
            </Button>

            <p className="text-center text-[0.8rem] text-ink/60">{t.cart.secure}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
