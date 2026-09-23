const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 1200 });
  
  // Navigate to checkout with mock cart data
  await page.goto("http://localhost:3001/encomenda/checkout", { waitUntil: "networkidle" });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 1000));
  
  // Save screenshot
  await page.screenshot({ path: "checkout-screenshot.png" });
  
  await browser.close();
  console.log("Checkout screenshot saved!");
}

takeScreenshot();
