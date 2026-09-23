const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 1000 });
  
  // Navigate to home first
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  
  // Set localStorage with cart items using the correct key and format
  await page.evaluate(() => {
    const cartData = [
      {
        sku: "champoo-reutilizavel-1",
        productSlug: "champoo-seguro",
        productName: "champô seguro",
        variantLabel: "cabelo normal",
        unitPriceCents: 1900,
        quantity: 2,
        maxStock: 10,
        image: null,
        isCandle: false
      },
      {
        sku: "sabonete-agua-1",
        productSlug: "sabonete",
        productName: "sabonete",
        variantLabel: "pele sensível",
        unitPriceCents: 800,
        quantity: 1,
        maxStock: 10,
        image: null,
        isCandle: false
      }
    ];
    localStorage.setItem("lucrescente.cart.v1", JSON.stringify(cartData));
  });
  
  // Navigate to checkout
  await page.goto("http://localhost:3001/encomenda/checkout", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  
  // Take a full-page screenshot
  await page.screenshot({ path: "checkout-full.png", fullPage: true });
  
  await browser.close();
  console.log("Full checkout screenshot saved!");
}

takeScreenshot().catch(console.error);
