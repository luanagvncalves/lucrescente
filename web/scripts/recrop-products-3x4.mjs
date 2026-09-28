/**
 * Re-crops every product photograph to a true 3:4.
 *
 * The product pages frame photographs at 3:4 and fill the frame with
 * object-cover, so anything shot at another ratio was being cropped by the
 * browser — differently at every screen size, and with no say over which part
 * of the picture survived. Cropping once, here, means the framing is decided
 * on the photograph rather than by the layout, and it is the same framing
 * everywhere.
 *
 * Sources are the originals in assets/photos, mapped through photo-map.json
 * exactly as prepare-images.ts maps them ([hero, ...gallery] → 0.jpg, 1.jpg …).
 * Where an output file cannot be traced back to an original — a folder renamed
 * by hand, say — it is re-cropped in place instead, which costs one extra JPEG
 * pass but keeps the set consistent.
 *
 * sharp's "attention" strategy picks the crop window, which on these photographs
 * keeps the product rather than the tablecloth. Unlike prepare-images.ts this
 * script never deletes anything: it only rewrites files that are not 3:4.
 *
 * Usage: node scripts/recrop-products-3x4.mjs [--dry]
 */
import { existsSync, readdirSync, readFileSync, statSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const DRY = process.argv.includes("--dry");
const ROOT = resolve(import.meta.dirname, "..");
const SRC = resolve(ROOT, "../assets/photos");
const OUT = join(ROOT, "public/images/products");
const MAP = JSON.parse(readFileSync(join(ROOT, "src/data/photo-map.json"), "utf8"));

const TARGET = 3 / 4;
const MAX_W = 1200; // 1200x1600, the long edge prepare-images.ts already uses

/** Output file -> original, in the order prepare-images.ts writes them. */
const origins = new Map();
for (const [slug, entry] of Object.entries(MAP.products)) {
  if (!entry?.hero) continue;
  const ordered = [entry.hero, ...entry.gallery.filter((g) => g !== entry.hero)];
  ordered.forEach((src, i) => origins.set(`${slug}/${i}.jpg`, src));
}

let done = 0;
let already = 0;
let inPlace = 0;

for (const slug of readdirSync(OUT)) {
  const dir = join(OUT, slug);
  if (!statSync(dir).isDirectory()) continue;

  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".jpg")) continue;
    const dest = join(dir, file);
    const meta = await sharp(dest).metadata();
    if (Math.abs(meta.width / meta.height - TARGET) < 0.005) {
      already++;
      continue;
    }

    const origin = origins.get(`${slug}/${file}`);
    const from = origin && existsSync(join(SRC, origin)) ? join(SRC, origin) : dest;
    if (from === dest) inPlace++;

    /*
      Size the crop from the SOURCE, not from a fixed 1200x1600. Asking for a
      height the original does not have makes sharp either enlarge it or, with
      withoutEnlargement, quietly return something that is not 3:4 at all —
      which is how a square 1440 photograph came back as 1200x1440. So take the
      largest 3:4 rectangle that fits inside the original, then shrink that to
      the long edge the rest of the set uses.
    */
    const src = await sharp(from).rotate().metadata();
    const fits = src.width / src.height > TARGET
      ? { w: Math.round(src.height * TARGET), h: src.height } // wider than 3:4: height decides
      : { w: src.width, h: Math.round(src.width / TARGET) }; //  taller than 3:4: width decides
    const width = Math.min(MAX_W, fits.w);
    const height = Math.round(width / TARGET);
    console.log(
      `${DRY ? "would crop" : "cropped"} ${slug}/${file}  ${meta.width}x${meta.height} -> ${width}x${height}${from === dest ? "  (in place)" : ""}`,
    );
    if (DRY) continue;

    // sharp cannot read and write the same file in one pass
    const tmp = `${dest}.tmp`;
    await sharp(from)
      .rotate()
      .resize({ width, height, fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp);
    rmSync(dest);
    renameSync(tmp, dest);
    done++;
  }
}

console.log({ cropped: done, alreadyThreeByFour: already, fromWebCopy: inPlace });
