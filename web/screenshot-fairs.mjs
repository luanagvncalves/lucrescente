import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } });
await page.goto("http://localhost:3003/feiras-e-mercados", { waitUntil: "networkidle" });

await page.screenshot({ path: "../screenshot-feiras-mercados.png", fullPage: false });
console.log("Fairs and markets page screenshot saved!");
await browser.close();
