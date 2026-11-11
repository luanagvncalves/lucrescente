import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.VERIFY_SITE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [slug, locale] of [["vela-decorada", "pt"], ["amaciador", "pt"], ["ambientador", "pt"], ["vela-decorada", "en"], ["vela-decorada", "fr"]]) {
      const query = locale === "pt" ? "" : `?idioma=${locale}`;
      await page.goto(`${base}/produtos/${slug}${query}`, { waitUntil: "networkidle" });
      const actions = page.locator("[data-product-actions]");
      const contact = actions.locator('button[aria-haspopup="dialog"]');
      assert.equal(await contact.count(), 1);
      const sizes = await actions.evaluate((el) => [...el.children].filter((child) => child.matches("a,button")).map((child) => {
        const rect = child.getBoundingClientRect();
        return { width: rect.width, height: rect.height, top: rect.top };
      }));
      assert.equal(sizes.length, 2);
      assert.ok(Math.abs(sizes[0].width - sizes[1].width) < 1);
      assert.equal(sizes[0].height, 52);
      assert.equal(sizes[1].height, 52);
      assert.equal(sizes[0].top, sizes[1].top);
      assert.equal(await page.locator("dialog[open]").count(), 0);
      assert.equal(await page.locator("article > section form").count(), 0, "No contact box at the bottom of the page");
      await contact.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor({ state: "visible" });
      assert.equal(await dialog.locator("form").count(), 1);
      assert.ok(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1), "Contact dialog should fit mobile width");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      assert.equal(await contact.evaluate((el) => el === document.activeElement), true, "Closing restores focus to the trigger");
    }
  }

  // Intercept both attempts; this verification never sends an email or reaches the contact API.
  const payloads = [];
  await page.route("**/api/contact", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ status: payloads.length === 1 ? 500 : 200, contentType: "application/json", body: "{}" });
  });
  await page.goto(`${base}/produtos/amaciador`, { waitUntil: "networkidle" });
  await page.locator('[data-product-actions] button[aria-haspopup="dialog"]').click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('input[name="name"]').fill("Teste local");
  await dialog.locator('input[name="email"]').fill("teste@example.invalid");
  await dialog.locator('textarea[name="message"]').fill("Mensagem de teste intercetada no navegador.");
  await dialog.locator('button[type="submit"]').click();
  await dialog.getByRole("alert").waitFor();
  assert.equal(await dialog.locator('input[name="name"]').inputValue(), "Teste local");
  await page.screenshot({ path: "../verification/product-contact-mobile.png" });
  await dialog.locator('button[type="submit"]').click();
  await dialog.locator("form").waitFor({ state: "hidden" });
  assert.equal(payloads.length, 2);
  assert.equal(payloads[1].productName, "amaciador");
  assert.equal(payloads[1].hp_website, "");
  console.log("Verified equal side-by-side buttons on desktop/mobile, PT/EN/FR dialogs, focus/escape and mocked error/retry submission. No messages sent.");
} finally {
  await browser.close();
}
