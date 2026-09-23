import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } });
await page.goto("http://localhost:3003", { waitUntil: "networkidle" });

await page.screenshot({ path: "../screenshot-header-menu.png", fullPage: false });
console.log("Header menu screenshot saved!");
await browser.close();
