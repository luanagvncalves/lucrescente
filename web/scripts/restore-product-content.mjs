/** Restore broken photo references and apply the requested display names. Run from web. */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

const names = {
  "roll-on-sinusite": "roll-on respiratório",
  "batom-hidratante-com-cor": "bálsamo labial com cor",
  "batom-hidratante-sem-cor": "bálsamo labial sem cor",
};
function portuguese(text) {
  return text.replaceAll("roll-on para sinusite", "roll-on respiratório")
    .replaceAll("roll-on para a sinusite", "roll-on respiratório")
    .replaceAll("e para sinusite", "e respiratórios")
    .replaceAll("e para a sinusite", "e respiratórios")
    .replaceAll("batons hidratantes", "bálsamos labiais")
    .replaceAll("batom hidratante", "bálsamo labial")
    .replaceAll("nossos batons", "nossos bálsamos labiais")
    .replaceAll("os batons", "os bálsamos labiais");
}
for (const file of ["src/data/catalog.ts", "src/data/ingredients.json", "src/content/pt.ts"]) {
  const before = readFileSync(file, "utf8");
  let after = portuguese(before);
  if (file.endsWith("catalog.ts")) after = after.replace('name: "batons"', 'name: "bálsamos labiais"');
  if (before !== after) writeFileSync(file, after);
}
const localeFile = "src/content/product-locales.ts";
let localeText = readFileSync(localeFile, "utf8").replace('name: "sinusitis roll-on"', 'name: "respiratory roll-on"')
  .replace('name: "roll-on sinusite"', 'name: "roll-on respiratoire"')
  .replaceAll('name: "moisturising lip balm', 'name: "lip balm')
  .replaceAll('name: "baume à lèvres hydratant', 'name: "baume à lèvres');
writeFileSync(localeFile, localeText);
const ingredientLocaleFile = "src/content/ingredient-locales.ts";
const translated = readFileSync(ingredientLocaleFile, "utf8")
  .replaceAll("headache and sinusitis roll-ons", "headache and respiratory roll-ons")
  .replaceAll("sinusitis roll-on", "respiratory roll-on")
  .replaceAll("headache and sinus roll-ons", "headache and respiratory roll-ons")
  .replaceAll("sinus roll-on", "respiratory roll-on")
  .replaceAll("roll-on sinusite", "roll-on respiratoire")
  .replaceAll("maux de tête et sinusite", "maux de tête et respiratoire");
writeFileSync(ingredientLocaleFile, translated);

// The original group photograph was still supplied with the project, but never shipped.
const restored = "public/images/products/desodorizante-tea-tree-erva-principe/2.jpg";
if (!existsSync(restored)) copyFileSync("../assets/photos/Desodorizantes/20250430_DJFLnzgCjk2_03.jpg", restored);
const photos = JSON.parse(readFileSync("src/data/product-photos.json", "utf8"));
for (const images of Object.values(photos)) for (const image of images) {
  if (!existsSync("public" + image.path)) throw Error("Missing photo: " + image.path);
}

config({ path: ".env.local", quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function checked(query) { const { data, error } = await query; if (error) throw error; return data; }
const products = await checked(db.from("products").select("id,slug,name,why_it_works,product_images(id,path,alt,is_primary,sort_order)").eq("is_active", true));
const ingredients = await checked(db.from("ingredients").select("id,slug,applications"));
const backup = "../backups/content-and-photos-before-2026-11-11.json";
if (!existsSync(backup)) writeFileSync(backup, JSON.stringify({ products, ingredients }, null, 2));
for (const product of products) {
  const patch = {};
  if (names[product.slug]) patch.name = names[product.slug];
  if (product.why_it_works && portuguese(product.why_it_works) !== product.why_it_works) patch.why_it_works = portuguese(product.why_it_works);
  if (Object.keys(patch).length) await checked(db.from("products").update(patch).eq("id", product.id));
  const curated = photos[product.slug];
  if (!curated) continue;
  const existing = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
  for (const [index, image] of curated.entries()) {
    const row = { ...image, product_id: product.id, is_primary: index === 0, sort_order: index };
    if (existing[index]) await checked(db.from("product_images").update(row).eq("id", existing[index].id));
    else await checked(db.from("product_images").insert(row));
  }
}
for (const ingredient of ingredients) {
  if (ingredient.applications && portuguese(ingredient.applications) !== ingredient.applications) {
    await checked(db.from("ingredients").update({ applications: portuguese(ingredient.applications) }).eq("id", ingredient.id));
  }
}
await checked(db.from("categories").update({ name: "bálsamos labiais" }).eq("slug", "batons"));
const verified = await checked(db.from("products").select("slug,name,product_images(path)").eq("is_active", true));
for (const product of verified) {
  for (const image of product.product_images) if (!existsSync("public" + image.path)) throw Error("Still missing: " + image.path);
  if (names[product.slug] && product.name !== names[product.slug]) throw Error("Incorrect name: " + product.slug);
}
console.log("Verified all active product photo paths and the three renamed products.");
