import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 2048 } });
await page.goto("http://localhost:3003/produtos/desodorizante-tea-tree-erva-principe", { waitUntil: "networkidle" });
await page.screenshot({ path: "../screenshot-tea-tree.png", fullPage: true });
console.log("Tea tree product screenshot saved!");
await browser.close();
