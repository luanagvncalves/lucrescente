import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
await page.goto("http://localhost:3003/produtos/vela-citronela", { waitUntil: "networkidle" });

// Scroll to see the description
await page.evaluate(() => window.scrollBy(0, 300));
await page.waitForTimeout(500);

await page.screenshot({ path: "../screenshot-vela-descricao.png", fullPage: false });
console.log("Vela com descrição screenshot saved!");
await browser.close();
