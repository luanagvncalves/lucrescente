"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product, type Variant } from "@/lib/types";
import { AnchorButton, Button } from "@/components/ui/button";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";

/**
 * Purchase panel: variant selector, quantity, add to cart.
 * States: on-request (no price) → "por encomenda" + WhatsApp; sold-out → honest message + WhatsApp; available → add.
 */
export function PurchasePanel({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const cart = useCart();
  const variants = product.variants;
  const firstAvailable = variants.find((v) => variantAvailability(v).kind === "available") ?? variants[0];
  const [selected, setSelected] = useState<Variant>(firstAvailable);
  const [qty, setQty] = useState(1);
  const [ownContainer, setOwnContainer] = useState(false);
  const [dose, setDose] = useState("");
  const avail = variantAvailability(selected);
  const localizedName = getProductCopy(product.slug, locale, { name: product.name }).name;
  const isOwnPackaging = selected.label === "embalagem própria";
  const orderLabel = [selected.label, ownContainer ? t.products.ownContainerLabel : null, isOwnPackaging && dose ? `dose: ${dose}` : null].filter(Boolean).join(" · ") || null;
  const whatsapp = `${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""}`))}`;

  // Calculate price for own packaging based on dose
  const doseAmount = isOwnPackaging && dose ? parseFloat(dose.match(/\d+(?:\.\d+)?/)?.[0] || "0") : 0;
  const calculatedPrice = isOwnPackaging && avail.kind === "available" && doseAmount > 0
    ? Math.round((avail.price_cents as number) * doseAmount / 100)
    : avail.kind === "available" ? (avail.price_cents as number) : 0;

  function add() {
    if (avail.kind !== "available") return;
    cart.add({
      sku: selected.sku,
      productSlug: product.slug,
      productName: localizedName,
      variantLabel: orderLabel,
      unitPriceCents: isOwnPackaging && doseAmount > 0 ? calculatedPrice : avail.price_cents,
      quantity: qty,
      maxStock: avail.stock,
      image: product.images[0] ? { path: product.images[0].path, alt: product.images[0].alt } : null,
      isCandle: product.is_candle,
    });
    cart.notify(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""} · ${t.products.added}`);
    cart.open();
  }

  return (
    <div className="card-brand p-6 sm:p-8">
      {variants.length > 1 || !product.is_solid ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">{t.products.variant}</legend>
          <div className="flex flex-wrap gap-2">
            {variants.length > 1
              ? variants.map((v) => {
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
                })
              : null}
            {!product.is_solid ? (
              <button
                type="button"
                aria-pressed={ownContainer}
                onClick={() => setOwnContainer((o) => !o)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 font-ui text-[0.92rem] font-medium transition-colors ${
                  ownContainer ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
                }`}
              >
                {t.products.ownContainerLabel}
              </button>
            ) : null}
          </div>
        </fieldset>
      ) : null}

      {isOwnPackaging ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">dose da embalagem</legend>
          <input
            type="text"
            placeholder="ex: 500g, 1L, etc"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="w-full rounded-2xl border border-moss/40 px-4 py-3 text-[0.95rem] placeholder-moss/50 focus:border-forest focus:outline-none"
          />
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
            <p className="font-display text-[2rem] leading-none text-forest">{isOwnPackaging && doseAmount > 0 ? formatPrice(calculatedPrice) : formatPrice(avail.price_cents)}</p>
            {avail.stock <= 3 ? <span className="label-brand text-clay">{t.products.stockLeft(avail.stock)}</span> : null}
          </div>
          <div className="flex flex-col gap-3">
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
            <Button size="lg" className="h-auto min-h-[52px] w-full min-w-0 whitespace-normal break-words px-4 py-3 text-center text-[0.9rem] leading-tight sm:text-base" onClick={add}>
              {t.products.addToCart}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
