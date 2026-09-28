/**
 * Every product in the catalogue must have an English and French name.
 * Usage: npm run check:locales   (no network, no database — safe in CI)
 *
 * This exists because of a near miss. A product slug was renamed from
 * "sabonete-40g" to "sabonete-de-rosto"; `getProductCopy` looks its translations
 * up BY SLUG and silently falls back to the Portuguese name when there is no
 * entry. Nothing throws, no test fails, no type is wrong — English and French
 * customers simply start reading Portuguese, on the product page and on the
 * Stripe payment page. It was caught by eye that time.
 *
 * A slug and its locale entry have to move together, so this fails the moment
 * they do not.
 */
import { products } from "../src/data/catalog";
import { getProductCopy } from "../src/content/product-locales";

const SENTINEL = "\u0000missing\u0000";

type Gap = { slug: string; missing: string[] };

const gaps: Gap[] = [];

for (const product of products) {
  // An archived product keeps its row so past orders still resolve, but nobody
  // can reach it, so it does not need translating.
  if (product.is_active === false) continue;

  const missing: string[] = [];
  for (const locale of ["en", "fr"] as const) {
    if (getProductCopy(product.slug, locale, { name: SENTINEL }).name === SENTINEL) {
      missing.push(locale);
    }
  }
  if (missing.length) gaps.push({ slug: product.slug, missing });
}

if (gaps.length === 0) {
  const active = products.filter((p) => p.is_active !== false).length;
  console.log(`✓ all ${active} active products have English and French names`);
  process.exit(0);
}

console.error(`✗ ${gaps.length} product(s) would fall back to Portuguese:\n`);
for (const gap of gaps) {
  console.error(`  ${gap.slug} — no ${gap.missing.join(" or ")} name`);
}
console.error(`\nAdd them to web/src/content/product-locales.ts, keyed by slug.`);
console.error(`If a slug was just renamed, rename its key there in the same commit.`);
process.exit(1);
