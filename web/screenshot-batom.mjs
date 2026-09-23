import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://localhost:3003/produtos/batom-tijolo", { waitUntil: "networkidle" });

// Scroll down
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(300);

await page.screenshot({ path: "../screenshot-batom.png", fullPage: false });
console.log("Batom screenshot saved!");
await browser.close();
