import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3003/sobre", { waitUntil: "networkidle" });

// Scroll to see the image
await page.evaluate(() => window.scrollBy(0, 300));
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-sobre-novo.png", fullPage: false });
console.log("About page with new image screenshot saved!");
await browser.close();
