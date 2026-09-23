const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Scroll to testimonials section
  await page.evaluate(() => {
    document.querySelector('[aria-labelledby="testemunhos"]')?.scrollIntoView({ behavior: "smooth" });
  });
  
  await page.waitForTimeout(1500);
  
  await page.screenshot({ path: "testimonials-carousel.png", fullPage: false });
  
  await browser.close();
  console.log("Testimonials carousel screenshot saved!");
}

takeScreenshot().catch(console.error);
