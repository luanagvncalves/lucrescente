import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } });
await page.goto("http://localhost:3003", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "../screenshot-typewriter.png", fullPage: false });
console.log("Typewriter effect screenshot saved!");
await browser.close();
