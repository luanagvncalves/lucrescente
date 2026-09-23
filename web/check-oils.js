const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 2000 });
  await page.goto("http://localhost:3000/ingredientes", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: "check-oils.png", fullPage: true });
  
  await browser.close();
  console.log("Done");
}

takeScreenshot().catch(console.error);
