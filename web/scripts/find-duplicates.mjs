import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2] || "..";
const getFiles = (dir) => readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f) && !/^(Screenshot|VideoCapture)/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const analyze = (year) => {
  const files = getFiles(join(root, year));
  const info = files.map((f) => {
    const s = statSync(join(root, year, f));
    return { f, size: s.size, time: s.mtime.getTime() };
  });
  const groups = [];
  let g = [];
  for (let i = 0; i < info.length; i++) {
    if (i > 0 && (Math.abs(info[i].time - info[i - 1].time) > 120000 || Math.abs(info[i].size - info[i - 1].size) > 200000)) {
      if (g.length) groups.push(g);
      g = [];
    }
    g.push(info[i]);
  }
  if (g.length) groups.push(g);
  return { year, duplicates: groups.filter((x) => x.length > 1) };
};
const result = { "2023": analyze("2023"), "2024": analyze("2024") };
console.log(JSON.stringify(result, null, 2));
