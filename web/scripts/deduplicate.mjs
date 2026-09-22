import sharp from "sharp";
import { readdirSync, statSync, unlinkSync, renameSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve("..");
const getFiles = (dir) => readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f) && !/^(Screenshot|VideoCapture)/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Score image quality: higher = better (focus, contrast, etc.)
const scoreImage = async (path) => {
  try {
    const { data, info } = await sharp(path, { failOn: "none" }).raw().toBuffer({ returnInfo: true });
    if (!data || data.length === 0) return 0;
    // Simple heuristic: variance of pixel values = higher contrast = better focus
    let sum = 0, sum2 = 0, n = 0;
    for (let i = 0; i < Math.min(data.length, 100000); i += 3) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += gray;
      sum2 += gray * gray;
      n++;
    }
    const mean = sum / n;
    const variance = sum2 / n - mean * mean;
    return Math.sqrt(variance); // Standard deviation as focus proxy
  } catch {
    return 0;
  }
};

const dedupGroup = async (group, year) => {
  const scored = [];
  for (const item of group) {
    const score = await scoreImage(item.path);
    scored.push({ ...item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const keep = scored[0];
  const remove = scored.slice(1);
  return { keep, remove };
};

const analyze = (year) => {
  const files = getFiles(join(root, year));
  const info = files.map((f) => {
    const s = statSync(join(root, year, f));
    return { f, size: s.size, time: s.mtime.getTime(), path: join(root, year, f), year };
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

const allGroups = [...analyze("2023"), ...analyze("2024")];
let totalRemoved = 0;
for (const group of allGroups) {
  const { keep, remove } = await dedupGroup(group, group[0].year);
  for (const item of remove) {
    console.log(`DELETE ${item.f} (score ${item.score.toFixed(1)} < ${keep.score.toFixed(1)})`);
    try { unlinkSync(item.path); totalRemoved++; } catch (e) { console.log(`  Error: ${e.message}`); }
  }
}
console.log(`\nRemoved ${totalRemoved} duplicate photos.`);
