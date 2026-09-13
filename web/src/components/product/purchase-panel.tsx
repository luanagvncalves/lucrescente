"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product, type Variant } from "@/lib/types";
import { AnchorButton, Button } from "@/components/ui/button";

/**
 * Purchase panel: variant selector, quantity, add to cart.
 * States: on-request (no price) → "por encomenda" + WhatsApp; sold-out → honest message + WhatsApp; available → add.
 */
export function PurchasePanel({ product }: { product: Product }) {
  const cart = useCart();
  const variants = product.variants;
  const firstAvailable = variants.find((v) => variantAvailability(v).kind === "available") ?? variants[0];
  const [selected, setSelected] = useState<Variant>(firstAvailable);
  const [qty, setQty] = useState(1);
  const avail = variantAvailability(selected);
  const whatsapp = `${t.brand.whatsapp}?text=${encodeURIComponent(`olá! gostava de encomendar: ${product.name}${selected.label ? ` (${selected.label})` : ""}`)}`;

  function add() {
    if (avail.kind !== "available") return;
    cart.add({
      sku: selected.sku,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: selected.label,
      unitPriceCents: avail.price_cents,
      quantity: qty,
      maxStock: avail.stock,
      image: product.images[0] ? { path: product.images[0].path, alt: product.images[0].alt } : null,
      isCandle: product.is_candle,
    });
    cart.notify(`${product.name}${selected.label ? ` (${selected.label})` : ""} · ${t.products.added}`);
    cart.open();
  }

  return (
    <div className="card-brand p-6 sm:p-8">
      {variants.length > 1 ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">{t.products.variant}</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const va = variantAvailability(v);
              const active = v.sku === selected.sku;
              return (
                <label
                  key={v.sku}
                  className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 font-ui text-[0.92rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-violet ${
                    active ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
                  } ${va.kind === "sold-out" ? "opacity-70" : ""}`}
                >
                  <input
                    type="radio"
                    name="variant"
                    className="sr-only"
                    checked={active}
                    onChange={() => {
                      setSelected(v);
                      setQty(1);
                    }}
                  />
                  {v.label}
                  {va.kind === "sold-out" ? <span className="text-[0.75rem] opacity-80">· {t.products.soldOutShort}</span> : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {avail.kind === "on-request" ? (
        <div className="space-y-4">
          <p className="font-display text-[1.75rem] leading-none text-clay">{t.products.onRequest}</p>
          <AnchorButton href={whatsapp} target="_blank" rel="noreferrer" size="lg" className="w-full sm:w-auto">
            {t.products.talkToUs}
          </AnchorButton>
        </div>
      ) : avail.kind === "sold-out" ? (
        <div className="space-y-4">
          <p className="font-display text-[1.75rem] leading-none text-ink/50 line-through decoration-1">{formatPrice(avail.price_cents)}</p>
          <p className="rounded-2xl bg-ivory px-4 py-3 text-[0.95rem] leading-relaxed text-ink">{t.products.soldOut}</p>
          <AnchorButton href={whatsapp} target="_blank" rel="noreferrer" variant="secondary" size="lg" className="w-full sm:w-auto">
            {t.products.talkToUs}
          </AnchorButton>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-[2rem] leading-none text-forest">{formatPrice(avail.price_cents)}</p>
            {avail.stock <= 3 ? <span className="label-brand text-clay">{t.products.stockLeft(avail.stock)}</span> : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex h-[52px] items-center self-start rounded-full border border-moss/40" role="group" aria-label={t.products.quantity}>
              <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full text-forest hover:bg-forest/5" aria-label={t.cart.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="min-w-8 text-center font-ui font-medium" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full text-forest hover:bg-forest/5 disabled:opacity-40"
                aria-label={t.cart.increase}
                disabled={qty >= avail.stock}
                onClick={() => setQty((q) => Math.min(avail.stock, q + 1))}
              >
                +
              </button>
            </div>
            <Button size="lg" className="flex-1" onClick={add}>
              {t.products.addToCart}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 border-t border-moss/15 pt-4 text-[0.85rem] leading-relaxed text-ink/70">{t.products.reuseNote}</p>
    </div>
  );
}
