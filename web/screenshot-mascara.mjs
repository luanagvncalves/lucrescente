import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3003/produtos/mascara-150ml", { waitUntil: "networkidle" });

// Hover for arrows
await page.locator("div.frame-brand").hover();
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-mascara.png", fullPage: false });
console.log("Mascara screenshot saved!");
await browser.close();
