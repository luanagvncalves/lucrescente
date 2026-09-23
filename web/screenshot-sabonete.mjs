import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://localhost:3003/produtos/sabonete-40g", { waitUntil: "networkidle" });

// Scroll to see the button
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(300);

// Click the water saving button
await page.click("button:has-text('água')");
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-sabonete-agua.png", fullPage: false });
console.log("Sabonete water saving screenshot saved!");
await browser.close();
