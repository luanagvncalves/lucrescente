import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 2048 } });
await page.goto("http://localhost:3003/produtos/vela-citronela", { waitUntil: "networkidle" });
await page.screenshot({ path: "../screenshot-vela-citronela.png", fullPage: true });
console.log("vela-citronela screenshot saved!");
await browser.close();
