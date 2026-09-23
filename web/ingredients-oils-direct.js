const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1600 });
  // Go directly to oils category with query param
  await page.goto("http://localhost:3001/ingredientes?categoria=oleos", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: "ingredients-oils-direct.png", fullPage: true });
  
  await browser.close();
  console.log("Screenshot saved!");
}

takeScreenshot().catch(console.error);
