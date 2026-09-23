const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Click on feedbacks dropdown
  const feedbacksBtn = await page.locator("text=feedbacks");
  if (await feedbacksBtn.isVisible()) {
    await feedbacksBtn.click();
    await page.waitForTimeout(1000);
  }
  
  // Take screenshot
  await page.screenshot({ path: "feedbacks-dropdown.png" });
  
  await browser.close();
  console.log("Screenshot saved!");
}

takeScreenshot().catch(console.error);
