import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3003/produtos/vela-citronela", { waitUntil: "networkidle" });

// Hover over the product gallery
await page.locator("div.frame-brand").hover();
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-vela-citronela-arrows.png", fullPage: false });
console.log("Vela citronela with arrows screenshot saved!");
await browser.close();
