import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.VERIFY_SITE_URL ?? "http://localhost:3000";
const photos = JSON.parse(readFileSync("src/data/product-photos.json", "utf8"))["vela-decorada"];
assert.equal(photos.length, 57);
for (let start = 0; start < photos.length; start += 6) {
  await Promise.all(photos.slice(start, start + 6).map(async (photo) => {
    const response = await fetch(base + photo.path);
    assert.equal(response.status, 200, photo.path);
    assert.ok(response.headers.get("content-type")?.startsWith("image/"), photo.path);
    await response.arrayBuffer();
  }));
}
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${base}/produtos/vela-decorada`, { waitUntil: "networkidle" });
  const frame = page.locator(".frame-brand").first();
  const gallery = frame.locator("..");
  const thumbnails = gallery.locator("ul button");
  assert.equal(await thumbnails.count(), 57);
  assert.ok(await frame.locator("img").count() <= 5, "Large gallery should only mount neighbouring large images");
  await thumbnails.last().click();
  await frame.getByText("57/57", { exact: true }).waitFor();
  await frame.hover();
  await frame.locator("button").nth(1).click();
  await frame.getByText("1/57", { exact: true }).waitFor();
  await thumbnails.nth(28).click();
  await frame.getByText("29/57", { exact: true }).waitFor();
  assert.ok(await frame.locator("img").count() <= 5);
  await page.screenshot({ path: "../verification/decorated-candles-gallery.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await thumbnails.last().click();
  await frame.getByText("57/57", { exact: true }).waitFor();
  console.log("Verified 57 photos, random gallery order, thumbnail navigation, wraparound and bounded full-size loading on desktop/mobile.");
} finally {
  await browser.close();
}
