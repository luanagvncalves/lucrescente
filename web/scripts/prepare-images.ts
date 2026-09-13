/**
 * Copies + resizes the curated photos from assets/photo-map.json into web/public/images.
 * Usage: npm run images
 * Output: /images/products/<slug>/<n>.jpg (max 1600px long edge, q82) and /images/editorial/*.jpg
 * Also writes src/data/photo-map.json (copy) and src/data/editorial.json (paths + alt) used by pages.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(__dirname, "..");
const ASSETS = resolve(ROOT, "../assets");
const SRC = join(ASSETS, "photos");
const MAP = JSON.parse(readFileSync(join(ASSETS, "photo-map.json"), "utf8")) as {
  products: Record<string, { hero: string | null; gallery: string[]; alt: Record<string, string> }>;
  editorial: Record<string, { hero: string | null; gallery?: string[]; alt: Record<string, string> } | null>;
  categories: Record<string, { file: string; alt: string } | null>;
};

const OUT = join(ROOT, "public/images");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "products"), { recursive: true });
mkdirSync(join(OUT, "editorial"), { recursive: true });
mkdirSync(join(OUT, "categories"), { recursive: true });

async function convert(src: string, dest: string, max = 1600) {
  await sharp(join(SRC, src)).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
}

const catSlug: Record<string, string> = {
  Desodorizantes: "desodorizantes",
  Champôs: "champos",
  "Cuidado Capilar": "cuidado-capilar",
  Sabonetes: "sabonetes",
  Velas: "velas",
  "Roll-on": "roll-on",
  Sprays: "sprays",
  "Sais de Banho": "sais-de-banho",
  Batons: "batons",
  Outros: "outros",
};

async function main() {
  let n = 0;
  for (const [slug, e] of Object.entries(MAP.products)) {
    if (!e.hero) continue;
    const list = [e.hero, ...e.gallery.filter((g) => g !== e.hero)].slice(0, 3);
    mkdirSync(join(OUT, "products", slug), { recursive: true });
    for (const [i, file] of list.entries()) {
      await convert(file, join(OUT, "products", slug, `${i}.jpg`));
      n++;
    }
  }

  const editorial: Record<string, { path: string; alt: string } | null | Record<string, { file: string; alt: string } | null>> = {};
  for (const key of ["home-hero", "sobre", "cuidados-reuse", "cuidados-velas", "cuidados-solidos"]) {
    const e = MAP.editorial[key];
    if (!e?.hero) {
      editorial[key] = null;
      continue;
    }
    await convert(e.hero, join(OUT, "editorial", `${key}.jpg`), 2000);
    editorial[key] = { path: `/images/editorial/${key}.jpg`, alt: e.alt[e.hero] ?? "" };
    n++;
  }

  const categories: Record<string, { file: string; alt: string } | null> = {};
  for (const [name, c] of Object.entries(MAP.categories)) {
    const slug = catSlug[name] ?? name.toLowerCase();
    if (!c) {
      categories[slug] = null;
      continue;
    }
    await convert(c.file, join(OUT, "categories", `${slug}.jpg`), 900);
    categories[slug] = { file: `/images/categories/${slug}.jpg`, alt: c.alt };
    n++;
  }
  editorial.categories = categories;

  writeFileSync(join(ROOT, "src/data/editorial.json"), JSON.stringify(editorial, null, 2));
  writeFileSync(join(ROOT, "src/data/photo-map.json"), JSON.stringify({ products: MAP.products }, null, 2));
  console.log(`processed ${n} images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
