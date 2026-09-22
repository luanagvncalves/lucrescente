import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
const root = "..";

const getFiles = (dir) => readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f) && !/^(Screenshot|VideoCapture)/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const analyze = (year) => {
  const files = getFiles(join(root, year));
  const info = files.map((f) => {
    const s = statSync(join(root, year, f));
    return { f, time: s.mtime.getTime(), path: join(root, year, f) };
  });
  
  // ONLY find rapid bursts: < 5 seconds apart, same timestamp prefix
  const bursts = [];
  for (let i = 0; i < info.length - 1; i++) {
    const td = Math.abs(info[i + 1].time - info[i].time);
    // Burst: same second (±500ms) OR < 500ms apart
    if (td < 500) {
      if (!bursts.length || bursts[bursts.length - 1][bursts[bursts.length - 1].length - 1] !== info[i]) {
        bursts.push([info[i]]);
      }
      bursts[bursts.length - 1].push(info[i + 1]);
    }
  }
  return bursts.filter((b) => b.length > 1);
};

const allBursts = [...analyze("2023"), ...analyze("2024")];
console.log(`Found ${allBursts.length} burst sequences`);
let removed = 0;
for (const burst of allBursts) {
  // Keep first, delete rest
  const keep = burst[0];
  for (let i = 1; i < burst.length; i++) {
    console.log(`DELETE ${burst[i].f}`);
    try { unlinkSync(burst[i].path); removed++; } catch (e) { console.log(`  Error: ${e.message}`); }
  }
}
console.log(`Removed ${removed} duplicate burst photos.`);
