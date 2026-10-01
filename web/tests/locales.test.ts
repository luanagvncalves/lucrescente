import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../src/data/catalog";
import { getProductCopy } from "../src/content/product-locales";
import { getVariantLabel } from "../src/content/variant-locales";
import { pt } from "../src/content/pt";
import { en } from "../src/content/en";
import { fr } from "../src/content/fr";

const active = products.filter((p) => p.is_active !== false);

test("every active product has an English and French name that differs from the Portuguese one", () => {
  for (const p of active) {
    for (const l of ["en", "fr"] as const) {
      const c = getProductCopy(p.slug, l, { name: "\u0000" });
      assert.notEqual(c.name, "\u0000", `${p.slug} has no ${l} entry`);
    }
  }
});

test("every product with Portuguese copy has it in English and French too", () => {
  for (const p of active.filter((x) => x.why_it_works)) {
    for (const l of ["en", "fr"] as const) {
      const c = getProductCopy(p.slug, l, { name: "\u0000", whyItWorks: "\u0000" });
      assert.ok(c.whyItWorks && c.whyItWorks !== "\u0000", `${p.slug}: no ${l} description`);
    }
  }
});

type Tree = { [k: string]: unknown };
const leaves = (o: Tree, path = ""): [string, unknown][] =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? leaves(v as Tree, `${path}${k}.`) : [[`${path}${k}`, v] as [string, unknown]]));

// words and values that are the same in all three languages on purpose
const SAME_ON_PURPOSE = /^(brand\.|about\.(lucie|luana)Name|home\.contactButtons\.email|productInfo\.contactEmail|contact\.(whatsapp|email)|(cart|checkout|order)\.(subtotal|total)|cart\.ok|locale)/;

test("no sentence is left in Portuguese in the English or French dictionary", () => {
  const ptLeaves = new Map(leaves(pt as unknown as Tree));
  for (const [name, dict] of [["en", en], ["fr", fr]] as const) {
    for (const [key, value] of leaves(dict as unknown as Tree)) {
      const original = ptLeaves.get(key);
      assert.notEqual(original, undefined, `${name}: unknown key ${key}`);
      if (typeof value === "string" && value === original && value.length > 3 && !SAME_ON_PURPOSE.test(key)) {
        assert.fail(`${name}.${key} is still the Portuguese text: "${value}"`);
      }
    }
  }
});

test("the scent choice, the oil add-ons and the quantity in a cart label are translated", () => {
  assert.equal(getVariantLabel("aroma: canela + laranja doce", "en"), "scent: cinnamon + sweet orange");
  assert.equal(getVariantLabel("+ óleo essencial de laranja doce", "fr"), "+ huile essentielle d'orange douce");
  assert.equal(getVariantLabel("boião · quantidade: 3", "fr"), "pot · quantité : 3");
  assert.equal(getVariantLabel("aroma: erva-príncipe", "fr"), "parfum: citronnelle");
});
