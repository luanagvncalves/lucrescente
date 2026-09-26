"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/use-locale";
import { getImageAlt } from "@/content/image-alt-locales";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button, LinkButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Crescent } from "@/components/ui/motifs";

export function CartDrawer() {
  const { t, query, locale } = useLocale();
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cart.isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isOpen]);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      window.location.assign(`/encomenda/checkout${query}`);
    } catch {
      setError(t.cart.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  const hasCandle = cart.lines.some((l) => l.isCandle);

  return (
    <>
      <AnimatePresence>
        {cart.isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-forest/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cart.close}
          >
            <motion.aside
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={t.cart.title}
              tabIndex={-1}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-[var(--shadow-soft)] outline-none"
            >
              <div className="flex items-center justify-between border-b border-moss/15 px-6 py-5">
                <h2 className="font-display text-[1.75rem] leading-none text-forest lowercase">{t.cart.title}</h2>
                <button
                  type="button"
                  onClick={cart.close}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-forest/5"
                  aria-label={t.cart.close}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {cart.lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                  <Crescent size={36} tone="var(--lavender)" />
                  <p className="font-display text-[1.5rem] leading-tight text-forest lowercase">{t.cart.empty}</p>
                  <p className="text-[0.95rem] text-ink/80">{t.cart.emptyHint}</p>
                  <LinkButton href={`/produtos${query}`} onClick={cart.close} variant="secondary">
                    {t.cart.browse}
                  </LinkButton>
                </div>
              ) : (
                <>
                  <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    {cart.lines.map((l) => (
                      <li key={l.sku} className="flex gap-4">
                        <Link href={`/produtos/${l.productSlug}${query}`} onClick={cart.close} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-ivory">
                          {l.image ? (
                            <Image src={l.image.path} alt={getImageAlt(l.image.alt, locale)} fill sizes="80px" className="object-cover" />
                          ) : (
                            <span className="placeholder-frame flex h-full w-full items-center justify-center">
                              <Crescent size={18} tone="var(--violet)" />
                            </span>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link href={`/produtos/${l.productSlug}${query}`} onClick={cart.close} className="font-display text-[1.2rem] leading-tight text-forest lowercase hover:underline underline-offset-4">
                                {l.productName}
                              </Link>
                              {l.variantLabel ? <p className="text-[0.85rem] text-ink/70">{l.variantLabel}</p> : null}
                            </div>
                            <span className="font-ui text-[0.95rem] font-medium text-forest">{formatPrice(l.unitPriceCents * l.quantity)}</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="inline-flex h-10 items-center rounded-full border border-moss/30">
                              <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5"
                                aria-label={t.cart.decrease}
                                onClick={() => cart.setQuantity(l.sku, l.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="min-w-6 text-center font-ui text-[0.95rem] font-medium" aria-live="polite">
                                {l.quantity}
                              </span>
                              <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5 disabled:opacity-40"
                                aria-label={t.cart.increase}
                                disabled={l.quantity >= l.maxStock}
                                onClick={() => (l.quantity >= l.maxStock ? cart.notify(t.cart.maxReached, "warn") : cart.setQuantity(l.sku, l.quantity + 1))}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="min-h-11 font-ui text-[0.85rem] text-clay underline-offset-4 hover:underline"
                              onClick={() => cart.remove(l.sku)}
                            >
                              {t.cart.remove}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-4 border-t border-moss/15 px-6 py-6">
                    <p className="rounded-2xl bg-lavender/30 px-4 py-3 text-[0.88rem] leading-snug text-ink">
                      {t.cart.reuseNote}
                      {hasCandle ? <> {t.products.candleNote}</> : null}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="font-ui text-[0.95rem] text-ink/80">{t.cart.subtotal}</span>
                      <span className="font-display text-[1.6rem] text-forest">{formatPrice(cart.subtotalCents)}</span>
                    </div>
                    <p className="text-[0.85rem] text-ink/70">{t.cart.shippingNote}</p>
                    <Button size="lg" className="w-full" onClick={checkout} disabled={busy}>
                      {busy ? t.cart.checkingOut : t.cart.checkout}
                    </Button>
                    <p className="text-center text-[0.8rem] text-ink/60">{t.cart.secure}</p>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal open={Boolean(error)} onClose={() => setError(null)} title={t.cart.errorTitle} primaryLabel={t.cart.ok}>
        {error}
      </Modal>
    </>
  );
}
