"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product, type Variant } from "@/lib/types";
import { AnchorButton, Button } from "@/components/ui/button";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getVariantLabel } from "@/content/variant-locales";
import { getAddOns } from "@/content/product-addons";
import { DEFAULT_SCENTS, FIXED_SCENTS, HARSH_SCENT, MAX_SCENTS, SCENTS, combosFor, isScentProduct, scentValue, scentsFor } from "@/content/scent-choices";

/** The longest answer to "quantos ambientadores" we keep. */
const HOW_MANY_MAX_LENGTH = 40;

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
  const [howMany, setHowMany] = useState("");
  const avail = variantAvailability(selected);
  const localizedName = getProductCopy(product.slug, locale, { name: product.name }).name;

  /**
   * A product sold in one format can still have a size worth printing — the
   * soap is 40 g and nothing else. Without this the label was stored, seeded
   * and then never shown, because the picker only ever rendered a list of two
   * or more. Null for the single unlabelled variants, which stay as they were.
   */
  const soleLabel = variants.length === 1 ? getVariantLabel(variants[0].label, locale) : null;

  /**
   * The air freshener has one format, so a "formato" picker had nothing to
   * offer. What varies is how many the
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
  const [pickedAddOn, setAddOn] = useState("");
  /*
    The air freshener and the made-to-order candles take up to two essential
    oils, chosen here. Held as the canonical Portuguese names, like the add-on,
    because that is what the server checks and what is read when packing.
  */
  const hasScentPicker = isScentProduct(product.slug);
  const fixedScents = FIXED_SCENTS[product.slug] ?? [];
  const [scents, setScents] = useState<string[]>(DEFAULT_SCENTS[product.slug] ?? []);
  const addOn = hasScentPicker ? scentValue([...fixedScents, ...scents]) : pickedAddOn;
  const orderLabel = [
    isAirFreshener ? null : selected.label,
    addOn || null,
    isAirFreshener && howMany ? `quantidade: ${howMany}` : null,
  ].filter(Boolean).join(" · ") || null;
  const whatsapp = `${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""}`))}`;

  function add() {
    if (avail.kind !== "available") return;
    cart.add({
      sku: selected.sku,
      productSlug: product.slug,
      productName: localizedName,
      variantLabel: orderLabel,
      unitPriceCents: avail.price_cents,
      quantity: qty,
      maxStock: avail.stock,
      addOn: addOn || null,
      image: product.images[0] ? { path: product.images[0].path, alt: product.images[0].alt } : null,
      isCandle: product.is_candle,
    });
    cart.notify(`${localizedName}${orderLabel ? ` (${orderLabel})` : ""} · ${t.products.added}`);
    cart.open();
  }

  return (
    <div className="card-brand p-6 sm:p-8">
      {!isAirFreshener && (variants.length > 1 || soleLabel) ? (
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

      {hasScentPicker ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-1 text-moss">{t.products.scentLabel}</legend>
          <p className="mb-3 text-[0.88rem] text-ink/70">{fixedScents.length ? t.products.scentHintFixed : t.products.scentHint}</p>

          <div className="flex flex-wrap gap-2">
            {fixedScents.map((name) => (
              <span
                key={name}
                className="inline-flex h-11 items-center rounded-full border border-forest bg-forest px-4 font-ui text-[0.92rem] font-medium text-white"
              >
                {SCENTS.find((x) => x.value === name)?.label[locale] ?? name}
              </span>
            ))}
            {scentsFor(product.slug).map((scent) => {
              const active = scents.includes(scent.value);
              const full = !active && scents.length >= MAX_SCENTS;
              return (
                <label
                  key={scent.value}
                  className={`inline-flex h-11 items-center rounded-full border px-4 font-ui text-[0.92rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-violet ${
                    active ? "cursor-pointer border-forest bg-forest text-white" : full ? "cursor-not-allowed border-moss/20 text-forest/40" : "cursor-pointer border-moss/40 text-forest hover:border-forest"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    disabled={full}
                    onChange={() => setScents((cur) => (cur.includes(scent.value) ? cur.filter((c) => c !== scent.value) : [...cur, scent.value]))}
                  />
                  {scent.label[locale]}
                </label>
              );
            })}
          </div>
          <div className="mt-5">
          <p className="mb-2 font-ui text-[0.95rem] font-medium text-forest">
            {t.products.scentCombosLabel}
            <span aria-hidden="true" className="ml-2 align-middle text-[0.8em] text-clay">★</span>
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {combosFor(product.slug).map((combo) => {
              const active = combo.length === scents.length && combo.every((c) => scents.includes(c));
              return (
                <button
                  key={combo.join("+")}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setScents(active ? [] : combo)}
                  className={`inline-flex h-11 items-center rounded-full border px-4 font-ui text-[0.92rem] font-medium transition-colors ${
                    active ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
                  }`}
                >
                  {combo.map((c) => SCENTS.find((x) => x.value === c)?.label[locale] ?? c).join(" + ")}
                  <span aria-hidden="true" className={`ml-2 text-[0.8em] ${active ? "text-white" : "text-clay"}`}>★</span>
                </button>
              );
            })}
          </div>
          </div>
          {scents.length >= MAX_SCENTS ? <p className="mt-3 text-[0.85rem] text-ink/70">{t.products.scentMaxReached}</p> : null}
          {scents.includes(HARSH_SCENT) ? (
            <p role="alert" className="mt-3 rounded-2xl bg-clay/10 px-4 py-3 text-[0.88rem] leading-relaxed text-ink/85">
              <span className="label-brand mr-2 text-clay">{t.products.allergenNoteLabel}</span>
              {t.products.scentHarsh}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {isAirFreshener ? (
        <fieldset className="mb-6">
          <legend className="label-brand mb-3 text-moss">{t.products.quantity}</legend>
          <input
            type="text"
            placeholder="quantos ambientadores queres?"
            maxLength={HOW_MANY_MAX_LENGTH}
            value={howMany}
            onChange={(e) => setHowMany(e.target.value)}
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
            <p className="font-display text-[2rem] leading-none text-forest">{formatPrice(avail.price_cents)}</p>
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
