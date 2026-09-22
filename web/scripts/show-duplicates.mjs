import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve("..");
const out = resolve("C:/Users/Lenovo/AppData/Local/Temp/claude/c--Users-Lenovo-OneDrive---IPLeiria-Lucrescente-lucrescente/df0d14ee-865f-47aa-915c-c7e7b3148e35/scratchpad");
const getFiles = (dir) => readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f) && !/^(Screenshot|VideoCapture)/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const analyze = (year) => {
  const files = getFiles(join(root, year));
  const info = files.map((f) => {
    const s = statSync(join(root, year, f));
    return { f, size: s.size, time: s.mtime.getTime(), path: join(root, year, f) };
  });
  const groups = [];
  let g = [];
  for (let i = 0; i < info.length; i++) {
    if (i > 0 && (Math.abs(info[i].time - info[i - 1].time) > 120000 || Math.abs(info[i].size - info[i - 1].size) > 200000)) {
      if (g.length > 1) groups.push(g);
      g = [];
    }
    g.push(info[i]);
  }
  if (g.length > 1) groups.push(g);
  return groups;
};

const dupes = [...analyze("2023"), ...analyze("2024")];
console.log(`Found ${dupes.length} groups with 2+ photos`);
for (let gi = 0; gi < Math.min(dupes.length, 5); gi++) {
  const group = dupes[gi];
  console.log(`Group ${gi + 1}/${dupes.length}: ${group.map((x) => x.f).join(" | ")}`);
  const w = 300 * group.length;
  const h = 300;
  const base = new Uint8ClampedArray(w * h * 3);
  base.fill(255);
  const overlays = [];
  for (let i = 0; i < group.length; i++) {
    const img = await sharp(group[i].path, { failOn: "none" }).resize(300, 300, { fit: "cover" }).raw().toBuffer();
    overlays.push({ input: img, left: i * 300, top: 0, raw: { width: 300, height: 300, channels: 3 } });
  }
  await sharp({ create: { width: w, height: h, channels: 3, background: { r: 255, g: 255, b: 255 } } })
    .composite(overlays)
    .toFile(join(out, `dupe_${gi + 1}.png`));
}
console.log("Contact sheets created");
