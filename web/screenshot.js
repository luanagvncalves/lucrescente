const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 720 });
  
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  
  // Save screenshot
  await page.screenshot({ path: "screenshot.png" });
  
  await browser.close();
  console.log("Screenshot saved!");
}

takeScreenshot();
