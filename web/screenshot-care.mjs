import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
await page.goto("http://localhost:3003/cuidados", { waitUntil: "networkidle" });

await page.screenshot({ path: "../screenshot-cuidados-updated.png", fullPage: false });
console.log("Updated care page screenshot saved!");
await browser.close();
