const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  
  // Scroll down to testimonials section
  await page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="testemunhos"]');
    if (section) {
      const rect = section.getBoundingClientRect();
      window.scrollBy(0, rect.top - 200);
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Take screenshot
  const screenshotPath = "C:\\Users\\Lenovo\\OneDrive - IPLeiria\\Lucrescente\\lucrescente\\web\\carousel.png";
  await page.screenshot({ path: screenshotPath });
  
  await browser.close();
  console.log("Screenshot saved to: " + screenshotPath);
}

takeScreenshot().catch(console.error);
