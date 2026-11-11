/** One-off catalogue refresh. Run from web; preserves stock, prices and orders. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import ts from "typescript";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

const oils = [
  {
    slug: "oleo-essencial-de-tangerina", name: "Óleo Essencial de Tangerina", category: "Óleos Essenciais", scientific_name: "Citrus reticulata Blanco.",
    origin: "Obtido por expressão a frio da casca da tangerina, onde se concentram os compostos aromáticos do fruto.",
    properties: "Aroma cítrico, doce e frutado, que dá suavidade às composições aromáticas. Combina bem com notas florais e amadeiradas, para um perfume acolhedor e equilibrado.",
    applications: "Podes escolhê-lo como aroma nos ambientadores e nas velas.", sort_order: 68,
    en: { name: "Tangerine Essential Oil", origin: "Obtained by cold expression of tangerine peel, where the fruit's aromatic compounds are concentrated.", properties: "A sweet, fruity citrus aroma that adds softness to aromatic blends. Pairs well with floral and woody notes for a warm, balanced scent.", applications: "You can choose it as a scent for air fresheners and candles." },
    fr: { name: "Huile essentielle de mandarine", origin: "Obtenue par expression à froid du zeste de mandarine, où se concentrent les composés aromatiques du fruit.", properties: "Un parfum d'agrume doux et fruité, qui apporte de la douceur aux compositions aromatiques. S'associe aux notes florales et boisées pour un parfum chaleureux et équilibré.", applications: "Tu peux la choisir pour parfumer les fondants et les bougies." },
  },
  {
    slug: "oleo-essencial-de-toranja", name: "Óleo Essencial de Toranja", category: "Óleos Essenciais", scientific_name: "Citrus × paradisi.",
    origin: "Obtido por expressão a frio da casca da toranja, um citrino de aroma fresco e ligeiramente amargo.",
    properties: "Aroma cítrico, fresco e frutado, com uma nota levemente amarga característica da toranja. Acrescenta uma nota de saída luminosa às composições, combinando bem com outros citrinos e notas herbais.",
    applications: "Podes escolhê-lo como aroma nos ambientadores e nas velas.", sort_order: 69,
    en: { name: "Grapefruit Essential Oil", origin: "Obtained by cold expression of grapefruit peel, a citrus fruit with a fresh, slightly bitter aroma.", properties: "A fresh, fruity citrus scent with grapefruit's characteristic lightly bitter note. Adds a bright top note to blends, pairing well with other citrus fruits and herbal notes.", applications: "You can choose it as a scent for air fresheners and candles." },
    fr: { name: "Huile essentielle de pamplemousse", origin: "Obtenue par expression à froid du zeste de pamplemousse, un agrume à l'arôme frais et légèrement amer.", properties: "Un parfum d'agrume frais et fruité, avec la note légèrement amère caractéristique du pamplemousse. Apporte une note de tête lumineuse aux compositions, en accord avec d'autres agrumes et des notes herbacées.", applications: "Tu peux la choisir pour parfumer les fondants et les bougies." },
  },
];
const removed = new Set(["oleo-de-neem", "oleo-de-baunilha-macerado"]);
const ingredientRows = oils.map((oil) => Object.fromEntries(Object.entries(oil).filter(([key]) => key !== "en" && key !== "fr")));
const ingredientPath = "src/data/ingredients.json";
const ingredients = JSON.parse(readFileSync(ingredientPath, "utf8"))
  .filter((i) => !removed.has(i.slug) && !oils.some((o) => o.slug === i.slug))
  .map((i) => i.slug === "urtiga-verde" ? { ...i, name: "Urtiga Verde em Pó" } : i);
ingredients.push(...ingredientRows);
writeFileSync(ingredientPath, JSON.stringify(ingredients, null, 1) + "\n");

// Remove the obsolete translation entries through the TS syntax tree, preserving other copy.
const translationPath = "src/content/ingredient-locales.ts";
let source = readFileSync(translationPath, "utf8");
const tree = ts.createSourceFile(translationPath, source, ts.ScriptTarget.Latest, true);
const ranges = [];
function visit(node) {
  if (ts.isPropertyAssignment(node) && removed.has(node.name.getText(tree).replaceAll('"', ""))) {
    let end = node.end;
    if (source[end] === ",") end++;
    ranges.push([node.getFullStart(), end]);
  }
  ts.forEachChild(node, visit);
}
visit(tree);
for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) source = source.slice(0, start) + source.slice(end);
source = source.replace('name: "Green Nettle"', 'name: "Green Nettle Powder"').replace('name: "Ortie verte"', 'name: "Ortie verte en poudre"');
const entries = oils.filter((o) => !source.includes(`"${o.slug}":`)).map((o) => `  "${o.slug}": {\n    en: ${JSON.stringify(o.en)},\n    fr: ${JSON.stringify(o.fr)},\n  },\n`).join("");
source = source.replace('  "argila-verde": {', entries + '  "argila-verde": {');
writeFileSync(translationPath, source);

// The FAQ is positional across the three dictionaries; remove the same entry in each.
const marker = "// Removed the initial shampoo-choice question.";
for (const locale of ["pt", "en", "fr"]) {
  const file = `src/content/${locale}.ts`;
  let text = readFileSync(file, "utf8");
  if (text.includes(marker)) continue;
  const syntax = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  function property(object, key) { return object.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(syntax) === key)?.initializer; }
  function findFaq(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(syntax) === "faq") return node.initializer;
    return ts.forEachChild(node, findFaq);
  }
  const group = property(findFaq(syntax), "groups").elements[0];
  const items = property(group, "items").elements;
  text = text.slice(0, items[0].getStart(syntax)) + marker + "\n          " + text.slice(items[1].getStart(syntax));
  writeFileSync(file, text);
}

config({ path: ".env.local", quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function checked(query) { const { data, error } = await query; if (error) throw error; return data; }
const backup = "../backups/catalog-before-2026-11-11-refresh.json";
if (!existsSync(backup)) {
  const previousIngredients = await checked(db.from("ingredients").select("*").in("slug", [...removed, "urtiga-verde", ...oils.map((o) => o.slug)]));
  const candle = await checked(db.from("products").select("id,slug,is_active").eq("slug", "vela-massagem").single());
  writeFileSync(backup, JSON.stringify({ ingredients: previousIngredients, candle }, null, 2));
}
await checked(db.from("ingredients").upsert(ingredientRows, { onConflict: "slug" }));
await checked(db.from("ingredients").update({ name: "Urtiga Verde em Pó" }).eq("slug", "urtiga-verde"));
await checked(db.from("products").update({ is_active: true }).eq("slug", "vela-massagem"));
const fragranceProducts = await checked(db.from("products").select("id").in("slug", ["ambientador", "vela-decorada", "vela-colorida", "vela-com-mensagem", "vela-massagem"]));
const citrus = await checked(db.from("ingredients").select("id").in("slug", oils.map((o) => o.slug)));
await checked(db.from("product_ingredients").upsert(fragranceProducts.flatMap((p) => citrus.map((i, index) => ({ product_id: p.id, ingredient_id: i.id, sort_order: 100 + index }))), { onConflict: "product_id,ingredient_id" }));
const verified = await checked(db.from("ingredients").select("slug,name").in("slug", ["urtiga-verde", ...oils.map((o) => o.slug)]));
const candle = await checked(db.from("products").select("slug,is_active").eq("slug", "vela-massagem").single());
if (verified.length !== 3 || !candle.is_active) throw Error("Catalogue verification failed");
console.log("Verified:", verified, candle);
