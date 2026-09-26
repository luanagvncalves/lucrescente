/**
 * One-off renames of product names in Supabase (the site reads names from the
 * database, not from src/data/catalog.ts). Slugs are never touched, so no link
 * breaks. Usage: node scripts/rename-champos.mjs  (reads web/.env.local)
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

const supabase = createClient(url, key, { auth: { persistSession: false } });

// "champôs para cabelos normais" was the last shampoo left in the plural after
// the oily/dry ones were renamed; this lines all four up on the same pattern.
const renames = [{ slug: "champos-para-cabelos-normais", name: "champô sólido para cabelos normais" }];

for (const { slug, name } of renames) {
  const { data, error } = await supabase.from("products").update({ name }).eq("slug", slug).select("slug, name");
  if (error) {
    console.error(`FAILED ${slug}:`, error.message);
  } else if (!data || data.length === 0) {
    console.error(`NOT FOUND: ${slug}`);
  } else {
    console.log(`OK: ${data[0].slug} -> "${data[0].name}"`);
  }
}
