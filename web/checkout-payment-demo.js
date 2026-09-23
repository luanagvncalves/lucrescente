const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 900 });
  
  // Set localStorage to add items to cart first
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  
  // Add some test data to localStorage for the cart
  await page.evaluate(() => {
    const cartData = {
      lines: [
        {
          sku: "champoo-reutilizavel-1",
          productSlug: "champoo-seguro",
          productName: "champô seguro",
          variantLabel: "cabelo normal",
          unitPriceCents: 1900,
          quantity: 2,
          image: null,
          isCandle: false,
          maxStock: 10
        },
        {
          sku: "sabonete-agua-1",
          productSlug: "sabonete",
          productName: "sabonete",
          variantLabel: "pele sensível",
          unitPriceCents: 800,
          quantity: 1,
          image: null,
          isCandle: false,
          maxStock: 10
        }
      ],
      isOpen: false
    };
    localStorage.setItem("cart", JSON.stringify(cartData));
  });
  
  // Now navigate to checkout
  await page.goto("http://localhost:3001/encomenda/checkout", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Save screenshot
  await page.screenshot({ path: "checkout-payment-methods.png", fullPage: true });
  
  await browser.close();
  console.log("Checkout screenshot saved!");
}

takeScreenshot().catch(console.error);
