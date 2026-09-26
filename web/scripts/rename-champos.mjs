/**
 * One-off content fixes applied straight to Supabase — the site reads product
 * names and "porque funciona" from the database, not from src/data/catalog.ts,
 * so a change only lands once it is written here too. Slugs are never touched,
 * so no link breaks. Usage: node scripts/rename-champos.mjs  (reads web/.env.local)
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

const supabase = createClient(url, key, { auth: { persistSession: false } });

const renames = [
  // "champôs para cabelos normais" was the last shampoo left in the plural
  // after the oily/dry ones were renamed; this lines them all up.
  { slug: "champos-para-cabelos-normais", name: "champô sólido para cabelos normais" },
  // Archived, but renamed now so it cannot come back into the catalogue under
  // the old short name. "para queda de cabelo" describes who it is for without
  // claiming it stops hair loss.
  { slug: "champo-queda", name: "champô sólido para queda de cabelo" },
];

for (const { slug, name } of renames) {
  const { data, error } = await supabase.from("products").update({ name }).eq("slug", slug).select("slug, name");
  if (error) console.error(`FAILED ${slug}:`, error.message);
  else if (!data?.length) console.error(`NOT FOUND: ${slug}`);
  else console.log(`renamed: ${data[0].slug} -> "${data[0].name}"`);
}

// The supplier's name has no place in the copy people read: "argila branca
// CosKAO" is just white clay. Scrubbed from every text column rather than one
// known row, so nothing is left behind.
const TEXT_COLUMNS = {
  products: ["name", "why_it_works"],
  ingredients: ["name", "origin", "properties", "applications"],
};
const supplier = /\s*\bcoskao\b/gi;

for (const [table, columns] of Object.entries(TEXT_COLUMNS)) {
  const { data, error } = await supabase.from(table).select(["slug", ...columns].join(", "));
  if (error) throw error;
  for (const row of data) {
    const patch = {};
    for (const c of columns) {
      if (typeof row[c] !== "string") continue;
      // compare rather than .test(): a /g regex carries lastIndex between calls
      const cleaned = row[c].replace(supplier, "");
      if (cleaned !== row[c]) patch[c] = cleaned;
    }
    if (!Object.keys(patch).length) continue;
    const { error: uErr } = await supabase.from(table).update(patch).eq("slug", row.slug);
    if (uErr) console.error(`FAILED ${table}.${row.slug}:`, uErr.message);
    else console.log(`scrubbed: ${table}.${row.slug} (${Object.keys(patch).join(", ")})`);
  }
}
