import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
await page.goto("http://localhost:3003/produtos/champo-neutro-para-criancas", { waitUntil: "networkidle" });

// Scroll to see the buttons
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(300);

// Click the skin safe button
await page.click("button:has-text('seguros para a pele')");
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-champo-seguro.png", fullPage: false });
console.log("Champô skin safe screenshot saved!");
await browser.close();
