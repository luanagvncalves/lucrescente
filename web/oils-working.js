const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 2000 });
  // Go to ingredients
  await page.goto("http://localhost:3001/ingredientes", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: "oils-working.png", fullPage: true });
  
  await browser.close();
  console.log("Oils screenshot taken!");
}

takeScreenshot().catch(console.error);
