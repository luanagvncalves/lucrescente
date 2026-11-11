import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.VERIFY_SITE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    for (const locale of ["pt", "en", "fr"]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      // Cold browser cache with a small image delay, without scrolling the strip into view.
      await page.route("**/_next/image?**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 120));
        await route.continue();
      });
      await page.goto(`${base}/produtos/amaciador${locale === "pt" ? "" : `?idioma=${locale}`}`, { waitUntil: "networkidle" });
      const strip = page.locator('section[aria-labelledby="conjunto"] ul');
      const cards = strip.locator("li");
      assert.equal(await cards.locator("img").count(), await cards.count(), "Every card needs a photo, including loop duplicates");
      await page.waitForFunction(() => [...document.querySelectorAll('section[aria-labelledby="conjunto"] img')].every((img) => img.complete && img.naturalWidth > 0));
      const images = await cards.locator("img").evaluateAll((elements) => elements.map((img) => ({ loading: img.loading, width: img.naturalWidth, height: img.getBoundingClientRect().height })));
      assert.ok(images.every((img) => img.loading === "eager" && img.width > 0 && img.height > 250));
      await strip.scrollIntoViewIfNeeded();
      await strip.hover();
      for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
        await strip.evaluate((el, part) => { el.scrollLeft = (el.scrollWidth - el.clientWidth) * part; }, fraction);
        assert.ok(await cards.locator("img").evaluateAll((elements) => elements.every((img) => img.complete && img.naturalWidth > 0)));
      }
      if (width === 1440 && locale === "pt") await page.screenshot({ path: "../verification/related-photos-fixed.png" });
      await page.close();
    }
  }

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 1440, height: 720 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${base}/sobre`, { waitUntil: "networkidle" });
    const dimensions = await page.locator("[data-about-layout]").evaluate((grid) => {
      const photo = grid.querySelector(".frame-brand").getBoundingClientRect();
      const pictureColumn = grid.children[0].getBoundingClientRect();
      const text = grid.children[1].getBoundingClientRect();
      return { horizontal: text.left - photo.right, vertical: text.top - pictureColumn.bottom };
    });
    if (viewport.width >= 768) assert.ok(Math.abs(dimensions.horizontal - 32) < 1, JSON.stringify(dimensions));
    else assert.ok(Math.abs(dimensions.vertical - 24) < 1, JSON.stringify(dimensions));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `../verification/about-gap-${viewport.width}-${viewport.height}.png` });
    await page.close();
  }
  console.log("Verified all carousel covers and loop copies before scrolling in PT/EN/FR on desktop/mobile; about photo/text gaps are 32px desktop and 24px mobile.");
} finally {
  await browser.close();
}
