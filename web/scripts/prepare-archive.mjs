// Resizes the 2023/2024 photo folders into public/galeria/<year>/NNN.jpg and writes src/data/archive.json (counts per year).
// Videos, forms (docx/pdf) and Instagram screenshots are intentionally skipped. Usage: node scripts/prepare-archive.mjs
import { readdirSync, mkdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
const root = resolve(import.meta.dirname, "../..");
const pub = resolve(import.meta.dirname, "../public/galeria");
const collator = new Intl.Collator("en", { numeric: true });
const result = {};
for (const year of ["2023", "2024"]) {
  const dir = join(root, year);
  const files = readdirSync(dir)
    .filter((f) => /\.jpe?g$/i.test(f) && !/^(Screenshot|VideoCapture)/.test(f))
    .sort(collator.compare);
  const out = join(pub, year);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  let i = 0;
  for (const f of files) {
    const dest = join(out, `${String(i + 1).padStart(3, "0")}.jpg`);
    await sharp(join(dir, f), { failOn: "none" }).rotate().resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 70, mozjpeg: true }).toFile(dest);
    i++;
  }
  result[year] = i;
  console.log(year, i);
}
writeFileSync(resolve(import.meta.dirname, "../src/data/archive.json"), JSON.stringify(result));
