const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto("http://localhost:3001/feedbacks", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: "feedbacks-page.png", fullPage: true });
  
  await browser.close();
  console.log("Feedbacks page screenshot saved!");
}

takeScreenshot().catch(console.error);
