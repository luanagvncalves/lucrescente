export type Category = { id: string; slug: string; name: string; sort_order: number };

export type Variant = {
  id: string;
  sku: string;
  label: string | null;
  price_cents: number | null;
  stock: number;
  sort_order: number;
};

export type ProductImage = { path: string; alt: string; is_primary: boolean; sort_order: number };

export type IngredientLite = { slug: string; name: string; category: string; scientific_name: string | null };

export type Product = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  why_it_works: string | null;
  is_solid: boolean;
  is_candle: boolean;
  is_deodorant: boolean;
  category: Category;
  variants: Variant[];
  images: ProductImage[];
  ingredients: IngredientLite[];
};

export type Ingredient = IngredientLite & {
  id: string;
  origin: string;
  properties: string;
  applications: string;
  sort_order: number;
};

/** Derived commerce state for a product (the UI never computes this ad hoc). */
export type Availability =
  | { kind: "on-request" } // no price supplied -> "por encomenda"
  | { kind: "sold-out"; price_cents: number }
  | { kind: "available"; price_cents: number; stock: number };

export function productAvailability(p: Pick<Product, "variants">): Availability {
  const priced = p.variants.filter((v) => v.price_cents !== null);
  if (priced.length === 0) return { kind: "on-request" };
  const inStock = priced.filter((v) => v.stock > 0);
  const minPrice = Math.min(...priced.map((v) => v.price_cents as number));
  if (inStock.length === 0) return { kind: "sold-out", price_cents: minPrice };
  return { kind: "available", price_cents: minPrice, stock: inStock.reduce((a, v) => a + v.stock, 0) };
}

export function variantAvailability(v: Variant): Availability {
  if (v.price_cents === null) return { kind: "on-request" };
  if (v.stock <= 0) return { kind: "sold-out", price_cents: v.price_cents };
  return { kind: "available", price_cents: v.price_cents, stock: v.stock };
}

export function formatPrice(cents: number, locale = "pt-PT") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100);
}
