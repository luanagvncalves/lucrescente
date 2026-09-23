const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1800 });
  // Go directly to oils category
  await page.goto("http://localhost:3001/ingredientes?categoria=oleos", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: "oils-category-final.png", fullPage: true });
  
  await browser.close();
  console.log("Final oils screenshot saved!");
}

takeScreenshot().catch(console.error);
