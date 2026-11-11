/** Import the supplied folder, preserving originals and existing gallery photos. */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash, randomInt } from "node:crypto";
import { resolve, basename } from "node:path";
import sharp from "sharp";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

const folder = process.argv[2];
if (!folder) throw Error("Pass the supplied decorated-candles folder as the first argument.");
config({ path: ".env.local", quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function checked(query) { const { data, error } = await query; if (error) throw error; return data; }
const product = await checked(db.from("products").select("id,slug,product_images(id,path,alt,is_primary,sort_order)").eq("slug", "vela-decorada").single());
const backup = "../backups/decorated-candles-before-2026-11-11.json";
if (!existsSync(backup)) writeFileSync(backup, JSON.stringify(product, null, 2));
const manifestPath = "src/data/product-photos.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const previous = manifest[product.slug] ?? [...product.product_images].sort((a, b) => a.sort_order - b.sort_order).map(({ path, alt }) => ({ path, alt }));
const files = readdirSync(folder).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const added = [];
const audit = [];
for (const [index, file] of files.entries()) {
  const source = resolve(folder, file);
  const hash = createHash("sha256").update(readFileSync(source)).digest("hex").slice(0, 12);
  const path = `/images/products/vela-decorada/decorada-${hash}.jpg`;
  if (!existsSync("public" + path)) {
    // One supplied JPEG carries a non-fatal decoder warning; its full image is intact.
    await sharp(source, { failOn: "none" }).rotate().resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile("public" + path);
  }
  const image = { path, alt: `vela decorada artesanal da lucrescente, fotografia ${index + 1}` };
  if (!previous.some((p) => p.path === path) && !added.some((p) => p.path === path)) added.push(image);
  audit.push({ source: basename(file), path });
}
const images = [...previous, ...added];
if (added.length) {
  // Persist a single random order, so navigation never reshuffles under a visitor.
  for (let i = images.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [images[i], images[j]] = [images[j], images[i]];
  }
}
manifest[product.slug] = images;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
for (const [index, image] of images.entries()) {
  const existing = product.product_images.find((p) => p.path === image.path);
  const row = { product_id: product.id, ...image, sort_order: index, is_primary: index === 0 };
  if (existing) await checked(db.from("product_images").update(row).eq("id", existing.id));
  else await checked(db.from("product_images").insert(row));
}
const verified = await checked(db.from("product_images").select("path,sort_order").eq("product_id", product.id).order("sort_order"));
if (verified.length !== images.length || verified.some((image, index) => image.path !== images[index].path)) throw Error("Gallery verification failed");
writeFileSync("../backups/decorated-candles-import-2026-11-11.json", JSON.stringify(audit, null, 2));
console.log(JSON.stringify({ supplied: files.length, added: added.length, total: images.length, originalPhotosPreserved: product.product_images.every((p) => images.some((i) => i.path === p.path)) }));
