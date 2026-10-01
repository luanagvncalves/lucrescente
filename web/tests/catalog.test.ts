import test from "node:test";
import assert from "node:assert/strict";
import { categories, products } from "../src/data/catalog";
import ingredients from "../src/data/ingredients.json";
import { ALLOWED_COUNTRIES, SHIPPING_TIERS, tierForCountry } from "../src/config/shipping";
import { productAvailability, variantAvailability, type Variant } from "../src/lib/types";

const expectedVariants: Record<string, [number | null, number]> = {
  "deo-lav-60": [600, 3],
  "deo-lav-150": [1500, 0],
  "deo-tt-60": [600, 4],
  "deo-tt-150": [1500, 0],
  "champo-oleosos": [1200, 4],
  "champo-secos": [1200, 5],
  "champo-normais": [1200, 0],
  "champo-criancas": [1200, 6],
  "champo-queda": [1200, 2],
  amaciador: [1500, 5],
  "mascara-150": [600, 4],
  "sabonete-40g": [400, 3],
  "sabonete-de-corpo": [700, 0],
  "vela-massagem": [null, 1],
  "vela-decorada": [null, 1],
  "vela-colorida": [null, 1],
  "vela-com-mensagem": [null, 1],
  "rollon-relax": [850, 6],
  "rollon-cabeca": [850, 6],
  "rollon-sinusite": [850, 5],
  "spray-relaxante": [800, 3],
  "sais-relaxante-frasco": [800, 5],
  "batom-tijolo-boiao": [450, 2],
  "batom-tijolo-stick": [450, 2],
  "batom-herpes-boiao": [450, 0],
  "batom-herpes-stick": [450, 1],
  "batom-laranja-boiao": [450, 3],
  "batom-laranja-stick": [450, 1],
  "batom-natural-boiao": [450, 3],
  "batom-natural-stick": [450, 8],
  "batom-h-pimenta-boiao": [450, 3],
  "batom-h-pimenta-stick": [450, 2],
  inalador: [450, 6],
  ambientador: [120, 0],
};

test("catalogue models the supplied inventory as 28 products and 34 variants", () => {
  assert.equal(products.length, 28);
  assert.equal(products.flatMap((p) => p.variants).length, 34);
  assert.deepEqual(
    categories.map((c) => c.name),
    ["amaciadores", "ambientadores", "batons", "champôs", "desodorizantes", "inaladores", "máscaras capilares", "roll-on", "sabonetes", "sais de banho", "sprays", "velas"],
  );
});

test("every canonical SKU has the exact supplied EUR price and launch stock", () => {
  const actual = Object.fromEntries(products.flatMap((p) => p.variants.map((v) => [v.sku, [v.price_cents, v.stock]])));
  assert.deepEqual(actual, expectedVariants);
});

test("only the four candles are on request", () => {
  const noPrice = products.flatMap((p) => p.variants).filter((v) => v.price_cents === null).map((v) => v.sku).sort();
  assert.deepEqual(noPrice, ["vela-colorida", "vela-com-mensagem", "vela-decorada", "vela-massagem"]);
});

test("availability derives on-request, sold-out and available states without faking stock", () => {
  const variant = (price_cents: number | null, stock: number): Variant => ({ id: "v", sku: "s", label: null, price_cents, stock, sort_order: 0 });
  assert.deepEqual(variantAvailability(variant(null, 4)), { kind: "on-request" });
  assert.deepEqual(variantAvailability(variant(600, 0)), { kind: "sold-out", price_cents: 600 });
  assert.deepEqual(variantAvailability(variant(600, 2)), { kind: "available", price_cents: 600, stock: 2 });
  assert.deepEqual(productAvailability({ variants: [variant(550, 3), variant(800, 0)] }), { kind: "available", price_cents: 550, stock: 3 });
});

test("ingredient encyclopedia contains 63 entries in 8 categories", () => {
  assert.equal(ingredients.length, 63);
  assert.equal(new Set(ingredients.map((i) => i.slug)).size, 63);
  assert.equal(new Set(ingredients.map((i) => i.category)).size, 8);
  assert.equal(ingredients.filter((i) => i.scientific_name?.trim()).length, 44);
  for (const ingredient of ingredients) {
    assert.ok(ingredient.name.trim());
    assert.ok(ingredient.origin.trim());
    assert.ok(ingredient.properties.trim());
    // `applications` may be empty: it only lists products we actually make
  }
});

test("shipping configuration has one unique tier per country", () => {
  assert.deepEqual(SHIPPING_TIERS.map((t) => t.amount_cents), [350, 950, 1250, 3500]);
  assert.equal(ALLOWED_COUNTRIES.length, new Set(ALLOWED_COUNTRIES).size);
  assert.equal(tierForCountry("pt")?.id, "pt");
  assert.equal(tierForCountry("IE")?.id, "eu");
  assert.equal(tierForCountry("ES")?.id, "eu");
  assert.equal(tierForCountry("US")?.id, "world");
  assert.equal(tierForCountry("XX"), null);
});
