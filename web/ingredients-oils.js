const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.goto("http://localhost:3001/ingredientes", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Click on Óleos category
  const oleosBtn = await page.locator('button:has-text("óleos")').first();
  if (await oleosBtn.isVisible()) {
    await oleosBtn.click();
    await page.waitForTimeout(1000);
  }
  
  // Take screenshot
  await page.screenshot({ path: "ingredients-oils.png", fullPage: true });
  
  await browser.close();
  console.log("Ingredients screenshot saved!");
}

takeScreenshot().catch(console.error);
