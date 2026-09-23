import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

// Go to produtos
await page.goto("http://localhost:3003/produtos", { waitUntil: "networkidle" });

// Click on "amaciadores" button
await page.click("button:has-text('amaciadores')");

// Wait for navigation
await page.waitForURL("**/produtos/amaciador", { timeout: 5000 });

// Take screenshot of the product page
await page.screenshot({ path: "../screenshot-direct-navigate.png", fullPage: false });
console.log("Direct navigation screenshot saved!");
await browser.close();
