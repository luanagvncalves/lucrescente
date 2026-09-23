import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3003/produtos/desodorizante-tea-tree-erva-principe", { waitUntil: "networkidle" });

// Hover over the product gallery
await page.locator("div.frame-brand").hover();
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-tea-tree-arrows.png", fullPage: false });
console.log("Tea tree with arrows screenshot saved!");
await browser.close();
