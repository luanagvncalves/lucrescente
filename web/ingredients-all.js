const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 2000 });
  // Go to ingredients without filter
  await page.goto("http://localhost:3001/ingredientes", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  
  // Scroll down to see oils section
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({ path: "ingredients-all.png", fullPage: true });
  
  await browser.close();
  console.log("All ingredients screenshot saved!");
}

takeScreenshot().catch(console.error);
