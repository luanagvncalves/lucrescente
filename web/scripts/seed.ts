/**
 * Seed Supabase with the canonical catalogue and the 60 ingredients.
 * Usage: npm run seed   (reads web/.env.local; needs SUPABASE_SERVICE_ROLE_KEY)
 *
 * Idempotent: upserts by slug/sku. Stock and price are ONLY written when the row
 * does not exist yet (or with --force), so the client's later edits in Supabase survive re-seeding.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { categories, products } from "../src/data/catalog";
import ingredients from "../src/data/ingredients.json";
import photoMap from "../src/data/photo-map.json";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
const force = process.argv.includes("--force");
const db = createClient(url, key, { auth: { persistSession: false } });

type PhotoEntry = { hero: string | null; gallery: string[]; alt: Record<string, string> };
const photos = photoMap as { products: Record<string, PhotoEntry> };

async function main() {
  // categories
  const { error: cErr } = await db.from("categories").upsert(categories, { onConflict: "slug" });
  if (cErr) throw cErr;
  const { data: cats } = await db.from("categories").select("id, slug");
  const catId = new Map(cats!.map((c) => [c.slug, c.id]));

  // ingredients
  const { error: iErr } = await db.from("ingredients").upsert(
    ingredients.map((i) => ({
      slug: i.slug,
      name: i.name,
      category: i.category,
      scientific_name: i.scientific_name,
      origin: i.origin,
      properties: i.properties,
      applications: i.applications,
      sort_order: i.sort_order,
    })),
    { onConflict: "slug" },
  );
  if (iErr) throw iErr;
  const { data: ings } = await db.from("ingredients").select("id, slug");
  const ingId = new Map(ings!.map((i) => [i.slug, i.id]));

  // products
  const { data: existingVariants } = await db.from("product_variants").select("sku");
  const existingSkus = new Set((existingVariants ?? []).map((v) => v.sku));

  for (const p of products) {
    const { data: prod, error } = await db
      .from("products")
      .upsert(
        {
          slug: p.slug,
          name: p.name,
          category_id: catId.get(p.category_slug),
          sort_order: p.sort_order,
          why_it_works: p.why_it_works,
          is_solid: p.is_solid,
          is_candle: p.is_candle,
          is_deodorant: p.is_deodorant,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;

    for (const [idx, v] of p.variants.entries()) {
      const base = { product_id: prod.id, sku: v.sku, label: v.label, sort_order: idx };
      const row = !existingSkus.has(v.sku) || force ? { ...base, price_cents: v.price_cents, stock: v.stock } : base;
      const { error: vErr } = await db.from("product_variants").upsert(row, { onConflict: "sku" });
      if (vErr) throw vErr;
    }

    // ingredient links (replace set)
    await db.from("product_ingredients").delete().eq("product_id", prod.id);
    const links = p.ingredient_slugs.map((s, i) => {
      const id = ingId.get(s);
      if (!id) throw new Error(`unknown ingredient slug ${s} on ${p.slug}`);
      return { product_id: prod.id, ingredient_id: id, sort_order: i };
    });
    if (links.length) {
      const { error: lErr } = await db.from("product_ingredients").insert(links);
      if (lErr) throw lErr;
    }

    // images (replace set)
    await db.from("product_images").delete().eq("product_id", prod.id);
    const entry = photos.products[p.slug];
    if (entry?.hero) {
      const ordered = [entry.hero, ...entry.gallery.filter((g) => g !== entry.hero)];
      const rows = ordered.map((path, i) => ({
        product_id: prod.id,
        path: `/images/products/${p.slug}/${i}.jpg`,
        alt: entry.alt[path] ?? p.name,
        is_primary: i === 0,
        sort_order: i,
      }));
      const { error: imgErr } = await db.from("product_images").insert(rows);
      if (imgErr) throw imgErr;
    }
  }

  const count = async (t: string) => (await db.from(t).select("*", { count: "exact", head: true })).count;
  console.log({
    categories: await count("categories"),
    products: await count("products"),
    product_variants: await count("product_variants"),
    ingredients: await count("ingredients"),
    product_ingredients: await count("product_ingredients"),
    product_images: await count("product_images"),
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
