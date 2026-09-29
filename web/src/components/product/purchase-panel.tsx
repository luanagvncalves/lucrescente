"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product, type Variant } from "@/lib/types";
import { AnchorButton, Button } from "@/components/ui/button";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getVariantLabel } from "@/content/variant-locales";
import { getAddOns } from "@/content/product-addons";
import { doseUnitPriceCents, sanitiseDose, DOSE_MAX_LENGTH } from "@/lib/dose-price";

/**
 * Purchase panel: variant selector, quantity, add to cart.
 * States: on-request (no price) → "por encomenda" + WhatsApp; sold-out → crossed-out price + WhatsApp; available → add.
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
  const [howMany, setHowMany] = useState("");
  const avail = variantAvailability(selected);
  const localizedName = getProductCopy(product.slug, locale, { name: product.name }).name;

  /**
   * Some products sell "embalagem própria" as a real variant, with its own
   * price — on the bath salts it is "por encomenda" rather than the glass jar's
   * 8,00 €. Those products were ALSO getting the hardcoded button below, which
   * drew a second pill with exactly the same words and could not carry the
   * variant's price. The variant wins: it is the one that can be bought.
   *
   * Compared against the Portuguese label because variant labels are stored in
   * Portuguese; `t.products.ownContainerLabel` is whatever language is on screen.
   */
  const ownContainerLabelPt = getDictionary("pt").products.ownContainerLabel;
  const hasOwnContainerVariant = variants.some((v) => v.label === ownContainerLabelPt);

  /**
   * A product sold in one format can still have a size worth printing — the
   * soap is 40 g and nothing else. Without this the label was stored, seeded
   * and then never shown, because the picker only ever rendered a list of two
   * or more. Null for the single unlabelled variants, which stay as they were.
   */
  const soleLabel = variants.length === 1 ? getVariantLabel(variants[0].label, locale) : null;

  const isOwnPackaging = selected.label === ownContainerLabelPt;

  /**
   * The air freshener has one format, so a "formato" picker had nothing to
   * offer beyond the own-container toggle. What varies is how many the
   * customer wants, so this product gets a free-text "quantidade" field
   * instead of the format picker below.
   */
  const isAirFreshener = product.slug === "ambientador";
  /*
    The optional oil on the coloured lip balms. It is not a variant: the balms
    are made to order out of one stock, with a few drops stirred in, so there
    is no second sku and no second stock. Empty string is "sem sabor".

    Held as the canonical Portuguese, like `selected.label`, because that is
    what the server checks against the product's own list; the pill shows the
    translated wording.
  */
  const addOns = getAddOns(product.slug);
  const [addOn, setAddOn] = useState("");
  const orderLabel = [
    isAirFreshener ? null : selected.label,
    addOn || null,
    ownContainer ? t.products.ownContainerLabel : null,
    isOwnPackaging && dose ? `dose: ${dose}` : null,
    isAirFreshener && howMany ? `quantidade: ${howMany}` : null,
  ].filter(Boolean).join(" · ") || null;
  const whatsapp = `${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""}`))}`;

  /*
    The price for a custom dose, worked out by the SAME function the server
    uses, over the same database price — see lib/dose-price.ts. This panel used
    to carry its own copy of the sum, so it showed a number that `validateCart`
    then re-priced away; the customer decided on one figure and was charged
    another. Now the figure on screen is the one that will be charged, because
    both come from doseUnitPriceCents.
  */
  const cleanDose = isOwnPackaging ? sanitiseDose(dose) : null;
  const calculatedPrice = avail.kind === "available"
    ? doseUnitPriceCents(avail.price_cents as number, cleanDose)
    : 0;

  function add() {
    if (avail.kind !== "available") return;
    cart.add({
      sku: selected.sku,
      productSlug: product.slug,
      productName: localizedName,
      variantLabel: orderLabel,
      unitPriceCents: calculatedPrice,
      quantity: qty,
      maxStock: avail.stock,
      addOn: addOn || null,
      ownContainer,
      dose: cleanDose,
      image: product.images[0] ? { path: product.images[0].path, alt: product.images[0].alt } : null,
      isCandle: product.is_candle,
    });
    cart.notify(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""} · ${t.products.added}`);
    cart.open();
  }

  return (
    <div className="card-brand p-6 sm:p-8">
      {!isAirFreshener && (variants.length > 1 || !product.is_solid || soleLabel) ? (
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
                      {/* display only — `selected.label` keeps the Portuguese
                          original everywhere it is compared or stored */}
                      {getVariantLabel(v.label, locale)}
                      {/* the bare word, inside the pill beside the size, so a
                          sold-out format reads as one without having to be
                          selected first */}
                      {va.kind === "sold-out" ? <span className="text-[0.75rem]">· {t.products.soldOutTag}</span> : null}
                    </label>
                  );
                })
              : soleLabel ? (
                  /*
                    One variant that still names a size — the 40 g soap. There is
                    nothing to choose between, so this is a plain pill and not a
                    radio: making it selectable would offer a choice of one.
                  */
                  <span className="inline-flex h-11 items-center rounded-full border border-moss/40 px-4 font-ui text-[0.92rem] font-medium text-forest">
                    {soleLabel}
                  </span>
                ) : null}
            {!product.is_solid && !product.is_deodorant && !hasOwnContainerVariant ? (
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

      {addOns.length ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">{t.products.flavourLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {[{ value: "", label: t.products.flavourNone }, ...addOns.map((a) => ({ value: a.value, label: a.label[locale] }))].map((option) => {
              const active = option.value === addOn;
              return (
                <label
                  key={option.value || "none"}
                  className={`inline-flex h-11 cursor-pointer items-center rounded-full border px-4 font-ui text-[0.92rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-violet ${
                    active ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
                  }`}
                >
                  <input type="radio" name="sabor" className="sr-only" checked={active} onChange={() => setAddOn(option.value)} />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {isAirFreshener ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">{t.products.quantity}</legend>
          <input
            type="text"
            placeholder="quantos ambientadores queres?"
            maxLength={DOSE_MAX_LENGTH}
            value={howMany}
            onChange={(e) => setHowMany(e.target.value)}
            className="w-full rounded-2xl border border-moss/40 px-4 py-3 text-[0.95rem] placeholder-moss/50 focus:border-forest focus:outline-none"
          />
        </fieldset>
      ) : null}

      {isOwnPackaging ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">dose da embalagem</legend>
          <input
            type="text"
            placeholder="ex: 500g, 1L, etc"
            // the same ceiling the server trims to, so nobody types a dose that
            // silently loses its tail on the way to the order
            maxLength={DOSE_MAX_LENGTH}
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
        /*
          A sold-out format still cannot be added to the cart, but the brand
          does take orders for it — see "o produto que quero está esgotado.
          posso encomendar na mesma?" in the FAQ. So the crossed-out price
          stays, and a "fala connosco" WhatsApp link sits under it, same as
          the on-request state above.
        */
        <div className="space-y-4">
          <p className="font-display text-[1.75rem] leading-none text-ink/50 line-through decoration-1">
            <span className="sr-only">{t.products.price}: </span>
            {formatPrice(avail.price_cents)}
          </p>
          <AnchorButton href={whatsapp} target="_blank" rel="noreferrer" size="lg" className="w-full sm:w-auto">
            {t.products.talkToUs}
          </AnchorButton>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-[2rem] leading-none text-forest">{formatPrice(calculatedPrice)}</p>
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
