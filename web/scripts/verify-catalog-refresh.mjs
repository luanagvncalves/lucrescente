import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.VERIFY_SITE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
function sorted(names, locale) {
  assert.ok(names.length > 0, "Expected catalogue cards");
  assert.deepEqual(names, [...names].sort(new Intl.Collator(locale, { sensitivity: "base", numeric: true }).compare));
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const locale of ["pt", "en", "fr"]) {
    const query = locale === "pt" ? "" : `?idioma=${locale}`;
    await page.goto(`${base}/produtos${query}`, { waitUntil: "networkidle" });
    sorted(await page.locator('div[aria-live="polite"] ul h3').allTextContents(), locale);
    assert.equal(await page.locator('a[href*="/produtos/vela-massagem"]').count(), 1);
    await page.goto(`${base}/ingredientes${query}`, { waitUntil: "networkidle" });
    const groups = page.locator('div[aria-live="polite"] > section');
    sorted(await groups.locator("h2").allTextContents(), locale);
    for (let i = 0; i < await groups.count(); i++) sorted(await groups.nth(i).locator("h3").allTextContents(), locale);
    assert.equal(await page.locator('a[href*="/ingredientes/oleo-de-neem"], a[href*="/ingredientes/oleo-de-baunilha-macerado"]').count(), 0);
    for (const slug of ["oleo-essencial-de-tangerina", "oleo-essencial-de-toranja", "urtiga-verde"]) {
      assert.equal(await page.locator(`a[href*="/ingredientes/${slug}"]`).count(), 1);
    }
    await page.goto(`${base}/perguntas-frequentes${query}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("details").count(), 13);
  }
  for (const slug of ["oleo-de-neem", "oleo-de-baunilha-macerado"]) {
    const response = await page.goto(`${base}/ingredientes/${slug}`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 404);
  }
  await page.goto(`${base}/produtos/vela-massagem`, { waitUntil: "networkidle" });
  assert.ok((await page.locator("h1").innerText()).includes("massagem"));
  await page.locator('section[aria-labelledby="conjunto"]').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const list = page.locator('section[aria-labelledby="conjunto"] ul');
  sorted(await list.locator('li:not([aria-hidden="true"]) h3').allTextContents(), "pt");
  const position = () => list.evaluate((el) => el.scrollLeft);
  const before = await position();
  await page.waitForTimeout(1500);
  const after = await position();
  assert.ok(after - before > 20 && after - before < 70, "Carousel should drift continuously");
  await list.hover();
  const paused = await position();
  await page.waitForTimeout(600);
  assert.ok(Math.abs(await position() - paused) < 2, "Hover should pause the carousel");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(600);
  assert.ok(await position() > paused + 5, "Leaving hover should resume the carousel");
  await page.screenshot({ path: "../verification/catalog-refresh-carousel.png" });
  const reduced = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  await reduced.goto(`${base}/produtos/vela-massagem`, { waitUntil: "networkidle" });
  const still = reduced.locator('section[aria-labelledby="conjunto"] ul');
  await still.scrollIntoViewIfNeeded();
  const start = await still.evaluate((el) => el.scrollLeft);
  await reduced.waitForTimeout(600);
  assert.equal(await still.evaluate((el) => el.scrollLeft), start, "Reduced motion should disable autoplay");
  console.log("Verified alphabetical PT/EN/FR catalogues, restored candle, refreshed ingredients, FAQ removal, and carousel movement/pause/reduced motion.");
} finally {
  await browser.close();
}
