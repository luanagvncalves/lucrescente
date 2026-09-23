import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 2048 } });
await page.goto("http://localhost:3003/produtos/vela-colorida", { waitUntil: "networkidle" });
await page.screenshot({ path: "../screenshot-vela-colorida.png", fullPage: true });
console.log("vela-colorida screenshot saved!");
await browser.close();
