import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "@playwright/test";

config({ path: ".env.local", quiet: true });
const base = process.env.VERIFY_SITE_URL ?? "http://localhost:3000";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const { data, error } = await db.from("products").select("slug,product_images(path)").eq("is_active", true);
if (error) throw error;
let checked = 0;
for (const product of data) {
  await Promise.all(product.product_images.map(async (image) => {
    const response = await fetch(base + image.path);
    assert.equal(response.status, 200, image.path);
    assert.ok(response.headers.get("content-type")?.startsWith("image/"), image.path);
    await response.arrayBuffer();
    checked++;
  }));
}
const photos = JSON.parse(readFileSync("src/data/product-photos.json", "utf8"));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const names = { "roll-on-sinusite": "roll-on respiratório", "batom-hidratante-com-cor": "bálsamo labial com cor", "batom-hidratante-sem-cor": "bálsamo labial sem cor" };
  for (const [slug, expected] of Object.entries(names)) {
    await page.goto(`${base}/produtos/${slug}`, { waitUntil: "networkidle" });
    assert.equal((await page.locator("h1").innerText()).trim(), expected);
  }
  for (const slug of Object.keys(photos)) {
    await page.goto(`${base}/produtos/${slug}`, { waitUntil: "networkidle" });
    await page.waitForFunction((slug) => {
      const images = [...document.images].filter((image) => image.src.includes(slug) && image.loading !== "lazy");
      return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, slug);
    if (slug === "champo-oleosos") await page.screenshot({ path: "../verification/restored-shampoo.png" });
    if (slug === "mascara-150ml") await page.screenshot({ path: "../verification/restored-mask.png" });
  }
  for (const slug of ["argila-verde", "urtiga-verde", "oleo-de-coco"]) {
    await page.goto(`${base}/ingredientes/${slug}`, { waitUntil: "networkidle" });
    assert.ok((await page.locator("body").innerText()).includes("aplicações na lucrescente"));
  }
  console.log(`Verified ${checked} public product photos, restored galleries, product names and ingredient section headings.`);
} finally {
  await browser.close();
}
