const { chromium } = require("@playwright/test");

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 1600 });
  
  // Navigate to products page
  await page.goto("http://localhost:3001/produtos", { waitUntil: "networkidle" });
  
  // Wait for products to load
  await page.waitForTimeout(2000);
  
  // Find and click the first "adicionar ao carrinho" button
  const addButton = await page.locator('button:has-text("adicionar ao carrinho")').first();
  if (await addButton.isVisible()) {
    await addButton.click();
    await page.waitForTimeout(500);
  }
  
  // Open cart
  const cartButton = await page.locator('button:has-text("carrinho")');
  if (await cartButton.isVisible()) {
    await cartButton.click();
    await page.waitForTimeout(1500);
  }
  
  // Find and click the "finalizar encomenda" button
  const checkoutButton = await page.locator('button:has-text("finalizar encomenda")');
  if (await checkoutButton.isVisible()) {
    await checkoutButton.click();
    await page.waitForTimeout(2000);
  }
  
  // Save screenshot
  await page.screenshot({ path: "checkout-with-payment.png", fullPage: true });
  
  await browser.close();
  console.log("Payment method screenshot saved!");
}

takeScreenshot().catch(console.error);
