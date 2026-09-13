import { cache } from "react";
import { supabasePublic } from "./supabase";
import type { Category, Ingredient, Product } from "./types";

const PRODUCT_SELECT = `
  id, slug, name, sort_order, why_it_works, is_solid, is_candle, is_deodorant,
  category:categories!inner ( id, slug, name, sort_order ),
  variants:product_variants ( id, sku, label, price_cents, stock, sort_order ),
  images:product_images ( path, alt, is_primary, sort_order ),
  product_ingredients ( sort_order, ingredient:ingredients ( slug, name, category, scientific_name ) )
`;

type Row = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  why_it_works: string | null;
  is_solid: boolean;
  is_candle: boolean;
  is_deodorant: boolean;
  category: Category;
  variants: Product["variants"];
  images: Product["images"];
  product_ingredients: { sort_order: number; ingredient: Product["ingredients"][number] }[];
};

function normalize(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    sort_order: r.sort_order,
    why_it_works: r.why_it_works,
    is_solid: r.is_solid,
    is_candle: r.is_candle,
    is_deodorant: r.is_deodorant,
    category: r.category,
    variants: [...r.variants].sort((a, b) => a.sort_order - b.sort_order),
    images: [...r.images].sort((a, b) => a.sort_order - b.sort_order),
    ingredients: [...r.product_ingredients].sort((a, b) => a.sort_order - b.sort_order).map((x) => x.ingredient),
  };
}

function sortProducts(list: Product[]) {
  return list.sort((a, b) => a.category.sort_order - b.category.sort_order || a.sort_order - b.sort_order);
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabasePublic.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data;
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabasePublic.from("products").select(PRODUCT_SELECT).eq("is_active", true);
  if (error) throw error;
  return sortProducts((data as unknown as Row[]).map(normalize));
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? normalize(data as unknown as Row) : null;
});

export const getProductsBySlugs = cache(async (slugs: string[]): Promise<Product[]> => {
  const all = await getProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
});

export const getIngredients = cache(async (): Promise<Ingredient[]> => {
  const { data, error } = await supabasePublic.from("ingredients").select("*").order("sort_order");
  if (error) throw error;
  return data;
});

export const getIngredientBySlug = cache(async (slug: string): Promise<Ingredient | null> => {
  const { data, error } = await supabasePublic.from("ingredients").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
});

/** Products that link to an ingredient (for the "onde usamos" section). */
export const getProductsForIngredient = cache(async (ingredientSlug: string): Promise<Product[]> => {
  const all = await getProducts();
  return all.filter((p) => p.ingredients.some((i) => i.slug === ingredientSlug));
});

/** Server-side variant lookup by sku for checkout validation (public data, anon client is fine). */
export async function getVariantsBySkus(skus: string[]) {
  const { data, error } = await supabasePublic
    .from("product_variants")
    .select("id, sku, label, price_cents, stock, product:products!inner ( slug, name, is_active )")
    .in("sku", skus);
  if (error) throw error;
  return data as unknown as {
    id: string;
    sku: string;
    label: string | null;
    price_cents: number | null;
    stock: number;
    product: { slug: string; name: string; is_active: boolean };
  }[];
}
