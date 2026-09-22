import { test, expect, type Page } from "@playwright/test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { mkdirSync } from "node:fs";
import { config } from "dotenv";
import { products } from "../src/data/catalog";
import ingredients from "../src/data/ingredients.json";

config({ path: ".env.local", quiet: true });
const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const screenshotDir = "../verification/shots/final";
mkdirSync(screenshotDir, { recursive: true });

async function settleImages(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every((image) => {
    const rect = image.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    return !visible || (image.complete && image.naturalWidth > 0);
  }), undefined, { timeout: 10_000 });
}

async function assertGeometry(page: Page) {
  const geometry = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clipped: all.filter((n) => n.children.length === 0 && n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflow !== "hidden")
        .map((n) => ({ tag: n.tagName, text: n.textContent?.trim().slice(0, 60) })),
      offscreenLeft: all.filter((n) => {
        const r = n.getBoundingClientRect();
        return r.left < -1 && r.width > 0 && getComputedStyle(n).position !== "fixed";
      }).length,
    };
  });
  expect(geometry.overflow).toBe(0);
  expect(geometry.clipped).toEqual([]);
  expect(geometry.offscreenLeft).toBe(0);
}

test("all product ingredient links resolve and link back", async ({ request }) => {
  let checked = 0;
  for (const product of products) {
    const response = await request.get(`/produtos/${product.slug}`);
    expect(response.status(), product.slug).toBe(200);
    const html = await response.text();
    for (const slug of product.ingredient_slugs) {
      checked++;
      expect(html).toContain(`href="/ingredientes/${slug}"`);
      const ingredient = await request.get(`/ingredientes/${slug}`);
      expect(ingredient.status(), slug).toBe(200);
      expect(await ingredient.text()).toContain(`href="/produtos/${product.slug}"`);
    }
  }
  expect(checked).toBe(101);
});

test("all 60 ingredient pages resolve", async ({ request }) => {
  for (const ingredient of ingredients) {
    expect((await request.get(`/ingredientes/${ingredient.slug}`)).status(), ingredient.slug).toBe(200);
  }
});

test("no-price and sold-out states are honest", async ({ page }) => {
  await page.goto("/produtos/vela-citronela");
  await expect(page.getByRole("heading", { level: 1, name: "vela citronela" })).toBeVisible();
  await expect(page.getByRole("paragraph").filter({ hasText: /^por encomenda$/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /fala connosco/ }).first()).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("button", { name: "adicionar ao carrinho" })).toHaveCount(0);
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd["@type"]).toBe("Product");
  expect(jsonLd.offers).toBeUndefined();
  expect(JSON.stringify(jsonLd)).not.toContain('"price"');

  await page.goto("/produtos/sabonete-grande");
  await expect(page.getByText(/esgotado por agora/)).toBeVisible();
  await expect(page.getByText("6,00 €", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "adicionar ao carrinho" })).toHaveCount(0);
});

test("mobile and desktop page types have no horizontal overflow or clipped leaf text", async ({ page }) => {
  const routes = ["/", "/produtos", "/produtos/champo-secos", "/ingredientes", "/ingredientes/oleo-de-coco", "/sobre", "/cuidados"];
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await assertGeometry(page);
    }
  }
});

test("rendered nav, primary action, metadata and footer text meet WCAG AA contrast", async ({ page }) => {
  await page.goto("/produtos/champo-secos");
  const results = await page.evaluate(() => {
    type Rgba = { r: number; g: number; b: number; a: number };
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const rgba = (css: string): Rgba => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = css;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    };
    const blend = (front: Rgba, back: Rgba): Rgba => ({
      r: front.r * front.a + back.r * (1 - front.a),
      g: front.g * front.a + back.g * (1 - front.a),
      b: front.b * front.a + back.b * (1 - front.a),
      a: 1,
    });
    const background = (element: Element) => {
      const chain: Element[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) chain.unshift(node);
      return chain.reduce((back, node) => blend(rgba(getComputedStyle(node).backgroundColor), back), rgba("#ffffff"));
    };
    const luminance = (color: Rgba) => {
      const channel = (value: number) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    };
    const ratio = (front: Rgba, back: Rgba) => {
      const a = luminance(front), b = luminance(back);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const check = (label: string, selector: string) => {
      const element = document.querySelector(selector)!;
      const back = background(element);
      const front = blend(rgba(getComputedStyle(element).color), back);
      return { label, ratio: ratio(front, back) };
    };
    return [
      check("nav", "header nav a"),
      check("primary action", "button.bg-forest"),
      check("product metadata", "main .label-brand"),
      check("footer", "footer a"),
    ];
  });
  for (const result of results) expect(result.ratio, result.label).toBeGreaterThanOrEqual(4.5);
});

test("captures every static page type after loaded-state and geometry assertions", async ({ page }) => {
  test.setTimeout(120_000);
  const routes = {
    inicio: "/",
    catalogo: "/produtos",
    produto: "/produtos/champo-secos",
    "produto-encomenda": "/produtos/vela-citronela",
    "produto-esgotado": "/produtos/sabonete-grande",
    ingredientes: "/ingredientes",
    ingrediente: "/ingredientes/oleo-de-coco",
    sobre: "/sobre",
    cuidados: "/cuidados",
    "nao-encontrado": "/pagina-inexistente",
  };
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of Object.entries(routes)) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await settleImages(page);
      await assertGeometry(page);
      await page.screenshot({ path: `${screenshotDir}/${name}-${width}.png`, fullPage: false });
    }
  }
});

test("mobile menu fills the viewport and exposes all routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "abrir menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link")).toHaveCount(5);
  const box = await menu.boundingBox();
  expect(box).toMatchObject({ x: 0, y: 72, width: 390, height: 772 });
  await page.screenshot({ path: `${screenshotDir}/menu-mobile-390.png`, fullPage: false });
});

test("mock guest purchase writes an order, decrements stock, confirms, and remains idempotent", async ({ page }) => {
  const sku = "champo-secos";
  const stockBefore = await service.from("product_variants").select("stock").eq("sku", sku).single();
  assert.ifError(stockBefore.error);
  const mockIds: string[] = [];

  try {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/produtos/champo-secos");
    await page.getByRole("button", { name: "adicionar ao carrinho" }).click();
    await expect(page.getByRole("dialog", { name: "o teu carrinho" })).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/carrinho-1280.png`, fullPage: false });
    await page.setViewportSize({ width: 390, height: 900 });
    await page.screenshot({ path: `${screenshotDir}/carrinho-390.png`, fullPage: false });
    await page.getByRole("button", { name: "finalizar encomenda" }).click();
    await expect(page).toHaveURL(/\/checkout\/mock\?session=mock_/);
    const session = new URL(page.url()).searchParams.get("session");
    assert.ok(session);
    mockIds.push(session);

    await expect(page.getByRole("heading", { level: 1, name: "quase lá" })).toBeVisible();
    await settleImages(page);
    await page.screenshot({ path: `${screenshotDir}/checkout-390.png`, fullPage: false });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: `${screenshotDir}/checkout-1280.png`, fullPage: false });
    await page.getByRole("button", { name: "pagar (simulado)" }).click();
    await expect(page).toHaveURL(new RegExp(`/encomenda/confirmacao\\?session_id=${session}`));
    await expect(page.getByText("preparamos cada pedido com cuidado", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "obrigada. recebemos a tua encomenda." })).toBeVisible();
    await expect(page.getByText("1 × champô secos")).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/confirmacao-1280.png`, fullPage: false });
    await page.setViewportSize({ width: 390, height: 900 });
    await page.screenshot({ path: `${screenshotDir}/confirmacao-390.png`, fullPage: false });

    const order = await service.from("orders").select("id, total_cents, order_items(sku, quantity)").eq("stripe_session_id", session).single();
    assert.ifError(order.error);
    assert.equal(order.data.total_cents, 1650);
    assert.deepEqual(order.data.order_items, [{ sku, quantity: 1 }]);
    const stockAfter = await service.from("product_variants").select("stock").eq("sku", sku).single();
    assert.ifError(stockAfter.error);
    assert.equal(stockAfter.data.stock, stockBefore.data.stock - 1);

    const replayPage = await page.goto(`/checkout/mock?session=${session}`);
    expect(replayPage?.status()).toBe(200);
    const replayStock = await service.from("product_variants").select("stock").eq("sku", sku).single();
    assert.ifError(replayStock.error);
    assert.equal(replayStock.data.stock, stockBefore.data.stock - 1);
  } finally {
    if (mockIds.length) {
      const found = await service.from("orders").select("id").in("stripe_session_id", mockIds);
      if (found.data?.length) await service.from("orders").delete().in("id", found.data.map((o) => o.id));
      await service.from("mock_checkout_sessions").delete().in("id", mockIds);
    }
    await service.from("product_variants").update({ stock: stockBefore.data.stock }).eq("sku", sku);
  }
});
