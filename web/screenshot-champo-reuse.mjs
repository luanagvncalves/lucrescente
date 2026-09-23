import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://localhost:3003/produtos/champo-neutro-para-criancas", { waitUntil: "networkidle" });

// Scroll to see the buttons
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(300);

// Click the reutilizável button
await page.click("button:has-text('reutilizável')");
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-champo-reutilizavel.png", fullPage: false });
console.log("Champô reutilizável screenshot saved!");
await browser.close();
