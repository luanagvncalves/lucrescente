/** Add the supplied air-freshener photo; --publish registers it after deployment. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import sharp from "sharp";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
config({ path: ".env.local", quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function checked(query) { const { data, error } = await query; if (error) throw error; return data; }
const product = await checked(db.from("products").select("id,product_images(id,path,alt,is_primary,sort_order)").eq("slug", "ambientador").single());
const backup = "../backups/ambientador-before-2026-11-14.json";
if (!existsSync(backup)) writeFileSync(backup, JSON.stringify(product, null, 2));
const image = { path: "/images/products/ambientador/formatos-20241101.jpg", alt: "ambientadores de cera de cor creme em forma de flor, coração e círculo, sobre tecido floral rosa e azul" };
if (!existsSync("public" + image.path)) {
  const source = process.argv.find((arg) => /20241101_105229\.jpg$/i.test(arg));
  if (!source) throw Error("Pass the supplied 20241101_105229.jpg path.");
  await sharp(source).rotate().resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true, progressive: true }).toFile("public" + image.path);
}
const manifestPath = "src/data/product-photos.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const previous = manifest.ambientador ?? [...product.product_images].sort((a,b) => a.sort_order-b.sort_order).map(({path,alt}) => ({path,alt}));
if (!previous.some((p) => p.path === image.path)) previous.push(image);
manifest.ambientador = previous;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
if (process.argv.includes("--publish")) {
  if (!product.product_images.some((p) => p.path === image.path)) {
    await checked(db.from("product_images").insert({product_id:product.id,...image,is_primary:false,sort_order:Math.max(-1,...product.product_images.map((p)=>p.sort_order))+1}));
  }
  const verified = await checked(db.from("product_images").select("path").eq("product_id",product.id));
  if (!verified.some((p)=>p.path===image.path)) throw Error("Photo registration failed");
  console.log("Verified gallery photo registered; existing photos preserved.");
} else console.log("Prepared air-freshener photo and gallery manifest; database unchanged.");
