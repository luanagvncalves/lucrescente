import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://localhost:3003/produtos/champo-neutro-para-criancas", { waitUntil: "networkidle" });

// Scroll to see the button
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-champo-agua.png", fullPage: false });
console.log("Champô water saving screenshot saved!");
await browser.close();
