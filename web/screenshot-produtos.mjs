import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } });
await page.goto("http://localhost:3003/produtos", { waitUntil: "networkidle" });

// Screenshot mostrando a página de produtos
await page.screenshot({ path: "../screenshot-produtos.png", fullPage: false });
console.log("Produtos page screenshot saved!");
await browser.close();
