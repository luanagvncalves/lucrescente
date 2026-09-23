const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  
  // Set cart data
  await page.evaluate(() => {
    const cartData = [
      {
        sku: "champoo-reutilizavel-1",
        productSlug: "champoo-seguro",
        productName: "secure shampoo",
        variantLabel: "normal hair",
        unitPriceCents: 1900,
        quantity: 2,
        maxStock: 10,
        image: null,
        isCandle: false
      },
      {
        sku: "sabonete-agua-1",
        productSlug: "sabonete",
        productName: "soap",
        variantLabel: "sensitive skin",
        unitPriceCents: 800,
        quantity: 1,
        maxStock: 10,
        image: null,
        isCandle: false
      }
    ];
    localStorage.setItem("lucrescente.cart.v1", JSON.stringify(cartData));
  });
  
  // Navigate to English checkout
  await page.goto("http://localhost:3001/en/encomenda/checkout", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  
  await page.screenshot({ path: "checkout-en.png", fullPage: true });
  
  await browser.close();
  console.log("English checkout screenshot saved!");
}

takeScreenshot().catch(console.error);
