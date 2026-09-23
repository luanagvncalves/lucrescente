import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://localhost:3003/produtos/sabonete-40g", { waitUntil: "networkidle" });

// Scroll to see the button
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(300);

// Click the button
await page.click("button:has-text('menos água')");
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-menos-agua-expanded.png", fullPage: false });
console.log("Menos água expanded screenshot saved!");
await browser.close();
