// Resizes the WhatsApp photos in the repo root into public/galeria (sorted order = index used in src/data/galeria.ts)
import { readdirSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
const root = resolve(import.meta.dirname, "../..");
const out = resolve(import.meta.dirname, "../public/galeria");
mkdirSync(out, { recursive: true });
const files = readdirSync(root).filter((f) => f.startsWith("WhatsApp Image") && f.endsWith(".jpeg")).sort();
for (const [i, f] of files.entries()) {
  await sharp(join(root, f)).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(out, `${String(i).padStart(2, "0")}.jpg`));
}
console.log(files.length, "images");
