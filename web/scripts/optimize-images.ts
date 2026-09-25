/**
 * Shrinks the already-published images in web/public in place.
 * Usage: npm run images:optimize    (add --dry to only report)
 *
 * Why this exists alongside prepare-images.ts: that script rebuilds public/images
 * from assets/photo-map.json and rewrites src/data/editorial.json, so running it
 * would discard the hand-picked editorial images. This one only re-encodes the
 * files that are already there — every path, and therefore every database
 * product_images row, stays valid.
 *
 * Idempotent: a file is only replaced when the new encoding is actually smaller.
 */
import { readdirSync, statSync, renameSync, unlinkSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import sharp from "sharp";

const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const DRY = process.argv.includes("--dry");

/** Long-edge budget per area, matching prepare-images.ts. */
function maxEdgeFor(path: string): number {
  if (path.includes("/images/editorial/")) return 2000;
  if (path.includes("/images/categories/")) return 900;
  if (path.includes("/galeria/")) return 1600;
  return 1600; // products + anything else
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.jpe?g$/i.test(e.name) ? [p] : [];
  });
}

async function main() {
  const files = walk(PUBLIC);
  let saved = 0;
  let touched = 0;

  for (const file of files) {
    const rel = relative(PUBLIC, file).split("\\").join("/");
    const before = statSync(file).size;
    const max = maxEdgeFor(`/${rel}`);
    const meta = await sharp(file).metadata();
    const oversized = (meta.width ?? 0) > max || (meta.height ?? 0) > max;

    // Nothing to gain on a small, correctly sized file.
    if (!oversized && before < 400_000) continue;

    const tmp = `${file}.tmp`;
    await sharp(file)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp);

    // Re-encoding a correctly sized JPEG costs a little quality, so only keep the
    // result when it earns it: any oversized file, or a real (>10%) saving.
    const after = statSync(tmp).size;
    if (after >= before || (!oversized && after > before * 0.9)) {
      unlinkSync(tmp);
      continue;
    }

    const mb = (n: number) => (n / 1048576).toFixed(2);
    console.log(
      `${DRY ? "would shrink" : "shrank"} ${rel}  ${meta.width}x${meta.height} ${mb(before)}MB -> ${mb(after)}MB`,
    );
    if (DRY) unlinkSync(tmp);
    else renameSync(tmp, file);

    saved += before - after;
    touched++;
  }

  console.log(
    `\n${touched} file(s) ${DRY ? "would be" : ""} re-encoded, ${(saved / 1048576).toFixed(1)}MB ${DRY ? "would be" : ""} saved`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
