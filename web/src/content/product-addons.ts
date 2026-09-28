import type { ProductLocale } from "./product-locales";

/**
 * Optional extras a customer can ask for on a product, chosen in the purchase
 * panel and made up when the order is packed.
 *
 * These are NOT variants. The coloured lip balm is made to order from one stock
 * of balms, with a few drops of the chosen oil stirred in, so there is no
 * separate SKU to sell and no separate stock to keep — which is exactly why the
 * choice has to be carried to the order by hand: `validateCart` re-reads every
 * line from the database on purpose and never trusts a label sent by a browser.
 *
 * So the browser sends the chosen add-on, and the server keeps it only if it is
 * one of the strings listed here for that product. Anything else is dropped. It
 * can never affect the price — that still comes from the database — so the worst
 * a tampered request can do is ask for an oil the brand already offers.
 *
 * The keys are the canonical Portuguese, exactly as they appear in the cart and
 * in the Stripe line item, with the leading "+ " included.
 */
export type AddOn = { value: string; label: Record<ProductLocale, string> };

const ADD_ONS: Record<string, AddOn[]> = {
  "batom-tijolo": [
    {
      value: "+ óleo de laranja doce",
      label: {
        pt: "+ óleo de laranja doce",
        en: "+ sweet orange oil",
        fr: "+ huile d'orange douce",
      },
    },
    {
      value: "+ óleo de hortelã-pimenta",
      label: {
        pt: "+ óleo de hortelã-pimenta",
        en: "+ peppermint oil",
        fr: "+ huile de menthe poivrée",
      },
    },
  ],
};

/** The extras offered on a product, or an empty list when it offers none. */
export function getAddOns(slug: string): AddOn[] {
  return ADD_ONS[slug] ?? [];
}

/**
 * The add-on as the server will accept it, or null.
 *
 * Everything that reaches an order passes through here, so an unknown string,
 * an add-on borrowed from another product, or a missing one all come back null
 * and the line is simply packed without an extra.
 */
export function sanitiseAddOn(slug: string, value: unknown): string | null {
  if (typeof value !== "string") return null;
  return getAddOns(slug).find((a) => a.value === value)?.value ?? null;
}

/** For display only — falls through unchanged if it is not one we know. */
export function getAddOnLabel(slug: string, value: string, locale: ProductLocale): string {
  return getAddOns(slug).find((a) => a.value === value)?.label[locale] ?? value;
}
