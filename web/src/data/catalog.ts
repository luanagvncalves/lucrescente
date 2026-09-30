/**
 * Canonical catalogue seed.
 * Source of truth for prices/stock: assets/Produtos - Stock e Preços.xlsx (re-checked 2026-09-13).
 * Copy and ingredient lists: assets/lucrescente-conteudo.md (verbatim).
 *
 * After the first seed, the client edits prices and stock directly in Supabase
 * (tables `products` and `product_variants`); this file is only used by `npm run seed`.
 */

export type CategorySeed = { slug: string; name: string; sort_order: number };

export type VariantSeed = {
  sku: string;
  label: string | null; // e.g. "60ml", "boião", "stick"; null for single-variant products
  price_cents: number | null; // null = "por encomenda" (no price supplied; never invent one)
  stock: number;
};

export type ProductSeed = {
  slug: string;
  name: string; // lowercase display name, as the brand writes it
  category_slug: string;
  sort_order: number;
  why_it_works: string | null; // verbatim "porque funciona" text, or null when not supplied
  ingredient_slugs: string[]; // links into /ingredientes/[slug]
  is_solid: boolean; // solid / water-free products (maturation note)
  is_candle: boolean;
  is_deodorant: boolean;
  /**
   * Archived products stay in this file (and in the database, so past orders
   * keep resolving) but drop out of every listing, product page and checkout.
   * Omitted means active.
   */
  is_active?: boolean;
  variants: VariantSeed[];
};

// Ordered alphabetically by PT display name — this drives both the horizontal
// category bar and the stacked sections/images on /produtos.
export const categories: CategorySeed[] = [
  { slug: "amaciadores", name: "amaciadores", sort_order: 0 },
  { slug: "ambientadores", name: "ambientadores", sort_order: 1 },
  { slug: "batons", name: "batons", sort_order: 2 },
  { slug: "champos", name: "champôs", sort_order: 3 },
  { slug: "desodorizantes", name: "desodorizantes", sort_order: 4 },
  { slug: "inaladores", name: "inaladores", sort_order: 5 },
  { slug: "mascaras-capilares", name: "máscaras capilares", sort_order: 6 },
  { slug: "roll-on", name: "roll-on", sort_order: 7 },
  { slug: "sabonetes", name: "sabonetes", sort_order: 8 },
  { slug: "sais-de-banho", name: "sais de banho", sort_order: 9 },
  { slug: "sprays", name: "sprays", sort_order: 10 },
  { slug: "velas", name: "velas", sort_order: 11 },
];

// `label` is for a product sold in one format that still has a size worth naming
// ("40g"); left out, the format picker shows no pill at all.
const one = (sku: string, price_cents: number | null, stock: number, label: string | null = null): VariantSeed[] => [
  { sku, label, price_cents, stock },
];

const balm = (
  base: string,
  jarStock: number,
  stickStock: number,
  price_cents: number,
): VariantSeed[] => [
  { sku: `${base}-boiao`, label: "boião", price_cents, stock: jarStock },
  { sku: `${base}-stick`, label: "stick", price_cents, stock: stickStock },
];

export const products: ProductSeed[] = [
  // ---------------- desodorizantes ----------------
  {
    slug: "desodorizante-lavanda-palmarosa",
    name: "desodorizante lavanda/palmarosa",
    category_slug: "desodorizantes",
    sort_order: 0,
    why_it_works:
      "a manteiga de karité e o óleo de coco dão uma base cremosa e confortável. o bicarbonato de sódio ajuda a neutralizar os odores e o amido de milho ajuda a absorver a humidade. os óleos essenciais de lavanda 40/42 e de palmarosa acrescentam um aroma floral suave, e a palmarosa ajuda a controlar as bactérias responsáveis pelos maus cheiros. não é um desodorizante antitranspirante: não contém alumínio nem álcool, respeitando o funcionamento natural da pele em vez de bloquear a transpiração ou obstruir os poros. podemos adaptar a fórmula às tuas necessidades: mais suave, mais forte, ou com outro aroma.",
    ingredient_slugs: [
      "manteiga-de-karite",
      "oleo-de-coco",
      "oleo-essencial-de-lavanda-4042-blend",
      "oleo-essencial-de-palmarosa",
      "amido-de-milho",
      "bicarbonato-de-sodio",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: true,
    variants: [
      { sku: "deo-lav-60", label: "60ml", price_cents: 600, stock: 3 },
      { sku: "deo-lav-150", label: "150ml", price_cents: 1500, stock: 0 },
    ],
  },
  {
    slug: "desodorizante-tea-tree-erva-principe",
    name: "desodorizante tea-tree/erva-príncipe",
    category_slug: "desodorizantes",
    sort_order: 1,
    why_it_works:
      "a manteiga de karité e o óleo de coco dão uma base cremosa e confortável. o bicarbonato de sódio ajuda a neutralizar os odores e o amido de milho ajuda a absorver a humidade. o óleo essencial de tea tree ajuda a controlar naturalmente as bactérias responsáveis pelos maus cheiros, e a erva-príncipe acrescenta um aroma fresco e cítrico. não é um desodorizante antitranspirante: não contém alumínio nem álcool, respeitando o funcionamento natural da pele em vez de bloquear a transpiração ou obstruir os poros. podemos adaptar a fórmula às tuas necessidades: mais suave, mais forte, ou com outro aroma.",
    ingredient_slugs: [
      "manteiga-de-karite",
      "oleo-de-coco",
      "oleo-essencial-de-tea-tree",
      "oleo-essencial-de-erva-principe",
      "amido-de-milho",
      "bicarbonato-de-sodio",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: true,
    variants: [
      { sku: "deo-tt-60", label: "60ml", price_cents: 600, stock: 4 },
      { sku: "deo-tt-150", label: "150ml", price_cents: 1500, stock: 0 },
    ],
  },

  // ---------------- champôs ----------------
  {
    slug: "champo-oleosos",
    name: "champô sólido para cabelos oleosos",
    category_slug: "champos",
    sort_order: 0,
    why_it_works:
      "para cabelos oleosos ou com tendência a oleoso, em cabelo liso, encaracolado, pintado ou alisado. este champô não leva água na sua composição: o líquido que vês é hidrolato de hortelã-pimenta, que ajuda a dar uma sensação de frescura e limpeza ao couro cabeludo. o sci limpa suavemente enquanto a argila branca e as farinhas ajudam a purificar e equilibrar. juntamos ainda urtiga e cavalinha, ervas secas trituradas por nós, tradicionalmente associadas ao fortalecimento do cabelo. os óleos de coco e argão, o ácido esteárico e o d-pantenol deixam o cabelo nutrido e macio, sem pesar, e a erva-príncipe acrescenta uma sensação fresca e revigorante.",
    ingredient_slugs: [
      "tensioativo-sci",
      "acido-estearico",
      "argila-branca",
      "farinha-de-aveia",
      "farinha-de-coco",
      "oleo-de-coco",
      "oleo-vegetal-de-argao",
      "hidrolato-de-hortela-pimenta",
      "urtiga-verde",
      "cavalinha-em-po",
      "d-pantenol-provitamina-b5",
      "oleo-essencial-de-erva-principe",
      "conservante-cosgard",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("champo-oleosos", 1200, 4),
  },
  {
    slug: "champo-secos",
    name: "champô sólido para cabelos secos",
    category_slug: "champos",
    sort_order: 1,
    why_it_works:
      "este é um dos champôs que mais nos procuram as pessoas com couro cabeludo sensível, e tem ajudado a controlar alguns casos de eczema. a aveia e a argila branca da fórmula ajudam a acalmar a comichão, a irritação e a escamação da pele e do couro cabeludo. o sci limpa sem retirar em excesso os óleos naturais e as farinhas ajudam a limpar suavemente, enquanto o óleo de coco, a manteiga de karité e a provitamina b5 (d-pantenol) nutrem e ajudam a manter a hidratação do cabelo seco. o hidrolato de lavanda e o óleo essencial de lavanda 40/42 trazem um aroma suave e reconfortante. podes usá-lo em cabelo liso, encaracolado, pintado ou alisado. e como os nossos champôs sólidos não levam químicos agressivos, também podes usá-lo no corpo, como sabonete (este em particular tem sido usado por quem tem pele atópica).",
    ingredient_slugs: [
      "tensioativo-sci",
      "acido-estearico",
      "argila-branca",
      "farinha-de-aveia",
      "farinha-de-coco",
      "oleo-de-coco",
      "manteiga-de-karite",
      "hidrolato-de-lavanda",
      "d-pantenol-provitamina-b5",
      "oleo-essencial-de-lavanda-4042-blend",
      "conservante-cosgard",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("champo-secos", 1200, 5),
  },
  {
    slug: "champos-para-cabelos-normais",
    name: "champô sólido para cabelos normais",
    category_slug: "champos",
    sort_order: 2,
    why_it_works:
      "a fórmula combina uma limpeza suave do sci com a ação equilibrante da argila branca, das farinhas e do hidrolato de lavanda. o óleo de coco, o óleo de argão e o d-pantenol ajudam a manter o cabelo normal macio e hidratado, enquanto o ácido esteárico dá corpo à barra sem tornar a lavagem agressiva.",
    ingredient_slugs: [
      "tensioativo-sci",
      "acido-estearico",
      "argila-branca",
      "farinha-de-aveia",
      "farinha-de-coco",
      "oleo-de-coco",
      "oleo-vegetal-de-argao",
      "hidrolato-de-lavanda",
      "d-pantenol-provitamina-b5",
      "oleo-essencial-de-erva-principe",
      "conservante-cosgard",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("champo-normais", 1200, 0),
  },
  {
    slug: "champo-neutro-para-criancas",
    name: "champô sólido neutro/para crianças",
    category_slug: "champos",
    sort_order: 3,
    why_it_works:
      "pensado para pele delicada, sensível ou atópica e para crianças, em cabelo liso, encaracolado, pintado ou alisado. o sci proporciona uma limpeza suave, enquanto a argila branca e as farinhas ajudam a limpar sem agredir. o óleo de coco, a manteiga de karité e o d-pantenol deixam o cabelo macio e confortável, e o hidrolato de camomila romana acrescenta um toque calmante à fórmula. o ácido esteárico dá consistência à barra.",
    ingredient_slugs: [
      "tensioativo-sci",
      "acido-estearico",
      "argila-branca",
      "farinha-de-aveia",
      "farinha-de-coco",
      "oleo-de-coco",
      "manteiga-de-karite",
      "hidrolato-de-camomila-romana",
      "d-pantenol-provitamina-b5",
      "conservante-cosgard",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("champo-criancas", 1200, 6),
  },
  {
    slug: "champo-queda",
    name: "champô sólido para queda de cabelo",
    category_slug: "champos",
    sort_order: 4,
    why_it_works: null,
    ingredient_slugs: [],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    is_active: false, // archived: no photograph yet
    variants: one("champo-queda", 1200, 2),
  },

  // ---------------- cuidado capilar ----------------
  {
    slug: "amaciador",
    name: "amaciador",
    category_slug: "amaciadores",
    sort_order: 0,
    why_it_works:
      "para todos os tipos de cabelo: seco, oleoso, normal, liso ou encaracolado. o btms e o álcool cetílico condicionam e desembaraçam o cabelo, deixando-o mais macio e fácil de pentear. a manteiga de karité e os óleos de amêndoas doces e argão nutrem o comprimento e ajudam a reduzir a sensação de secura, e o óleo de abacate acrescenta hidratação extra. a vitamina E protege a fase oleosa da oxidação, enquanto a lavanda acrescenta um aroma suave.",
    ingredient_slugs: [
      "cera-emulsionante-btms",
      "alcool-cetilico",
      "manteiga-de-karite",
      "oleo-vegetal-de-amendoas-doces",
      "oleo-vegetal-de-argao",
      "oleo-essencial-de-lavanda-4042-blend",
      "vitamina-e",
      "conservante-cosgard",
      "oleo-de-ricino",
      "oleo-de-abacate",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("amaciador", 1500, 5),
  },
  {
    slug: "mascara-150ml",
    name: "máscara capilar",
    category_slug: "mascaras-capilares",
    sort_order: 1,
    why_it_works:
      "hidratante e nutritiva, para usar uma vez por semana. o btms condiciona e ajuda a desembaraçar o cabelo, enquanto o óleo de coco deixa os fios mais macios. a água dá leveza à fórmula; o alecrim qt cineol e o limão acrescentam um aroma fresco e revigorante. o cosgard ajuda a proteger a fórmula à base de água. se precisares de outra quantidade, fala connosco.",
    ingredient_slugs: [
      "cera-emulsionante-btms",
      "oleo-de-coco",
      "oleo-essencial-de-alecrim-qt-cineol",
      "oleo-essencial-de-limao",
      "conservante-cosgard",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("mascara-150", 600, 4),
  },

  // ---------------- sabonetes ----------------
  // The 40 g soap is the face soap; the brand renamed it from "sabonete 40g" (2026-09-28), which is
  // also what the photo captions in photo-map.json had been calling it all along. The aloe vera is
  // organic and harvested fresh at home. The sku keeps its old spelling so past orders still resolve.
  {
    slug: "sabonete-de-rosto",
    name: "sabonete de rosto",
    category_slug: "sabonetes",
    sort_order: 0,
    why_it_works:
      "o aloé vera é o que hidrata mais a fundo, e é biológico, colhido fresco cá em casa. a glicerina vegetal ajuda a pele a segurar essa hidratação em vez de a ir perdendo ao longo do dia. o óleo essencial de lavanda ajuda a acalmar a pele e dá o aroma, com a bergamota a acrescentar uma nota cítrica mais fresca. e as sementes de papoila esfoliam delicadamente: são redondas e todas do mesmo tamanho, por isso limpam sem arranhar, mesmo num sítio tão sensível como a cara.",
    ingredient_slugs: [
      "glicerina-vegetal",
      "aloe-vera",
      "oleo-essencial-de-lavanda",
      "oleo-essencial-de-bergamota",
      "sementes-de-papoila",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    // the photographed soap is the 40 g one, and the size belongs on the format picker
    variants: one("sabonete-40g", 400, 3, "40g"),
  },
  {
    // The same bar as the face soap, cast larger for the body — the brand makes one soap recipe,
    // so the ingredient list is deliberately identical rather than a copy that could drift.
    // It stands in for the old "sabonete-grande", which never existed beyond a stale locale key
    // and a photo-map entry. 7,00 €, and none in stock at the moment.
    slug: "sabonete-de-corpo",
    name: "sabonete de corpo",
    category_slug: "sabonetes",
    sort_order: 1,
    why_it_works:
      "é o mesmo sabonete que fazemos para a cara, numa barra maior, para o corpo durar mais tempo. o aloé vera é o que hidrata mais a fundo, e é biológico, colhido fresco cá em casa. a glicerina vegetal ajuda a pele a segurar essa hidratação em vez de a ir perdendo ao longo do dia. o óleo essencial de lavanda ajuda a acalmar a pele e dá o aroma, com a bergamota a acrescentar uma nota cítrica mais fresca. e as sementes de papoila esfoliam delicadamente: são redondas e todas do mesmo tamanho, por isso limpam sem arranhar.",
    ingredient_slugs: [
      "glicerina-vegetal",
      "aloe-vera",
      "oleo-essencial-de-lavanda",
      "oleo-essencial-de-bergamota",
      "sementes-de-papoila",
    ],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("sabonete-de-corpo", 700, 0),
  },
  {
    // The row this product used to be, kept only so re-seeding switches it off: Supabase still holds
    // it under the old slug, and an upsert on the new slug writes a second row rather than moving the
    // old one. It has no variants, because the sku above moves across to the renamed product.
    slug: "sabonete-40g",
    name: "sabonete de rosto",
    category_slug: "sabonetes",
    sort_order: 0,
    why_it_works: null,
    ingredient_slugs: [],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    is_active: false, // archived: renamed to sabonete-de-rosto
    variants: [],
  },

  // ---------------- velas (no price supplied: "por encomenda") ----------------
  {
    slug: "vela-citronela",
    name: "vela citronela",
    category_slug: "velas",
    sort_order: 0,
    // the case for these candles over a supermarket one is the same for all of
    // them, so it lives in the dictionary (products.candleCase) and is shown to
    // every candle rather than repeated five times here
    why_it_works:
      "cá por casa trocámos os sprays repletos de químicos por estas velas de citronela, simples e eficazes. os mosquitos não gostam do cheiro da citronela, por isso ajuda a afastar melgas, moscas e outros mosquitos. a lavanda e o eucalipto criam um contraste entre tranquilidade e frescura, para um ambiente agradável e sem visitas indesejadas. continua a ser uma vela segura para a pele, como as outras. se quiseres outra combinação de aromas, podes personalizar os óleos essenciais na caixa de aroma: a citronela fica sempre, e juntas-lhe os que preferires.",
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-canela", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-citronela", null, 2),
  },
  {
    slug: "vela-massagem",
    name: "vela massagem",
    category_slug: "velas",
    sort_order: 1,
    // The one candle with something of its own to say: it goes on the skin.
    // The shared case for a soy candle over a supermarket one still shows below
    // it, from the dictionary (products.candleCase).
    why_it_works:
      "esta vela também é para a pele. a cera de soja não alcança temperaturas tão elevadas como a parafina das velas de supermercado, e é isso que permite deitar a cera derretida diretamente na pele para uma massagem, sem queimar. a soja é hidratante, por isso a pele fica macia e sem aquela película pegajosa que as outras deixam.",
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-massagem", null, 1),
  },
  {
    slug: "vela-decorada",
    name: "vela decorada",
    category_slug: "velas",
    sort_order: 2,
    // the case for these candles over a supermarket one is the same for all of
    // them, so it lives in the dictionary (products.candleCase) and is shown to
    // every candle rather than repeated five times here
    why_it_works: null,
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-canela", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-decorada", null, 1),
  },
  {
    slug: "vela-colorida",
    name: "vela colorida",
    category_slug: "velas",
    sort_order: 3,
    // the case for these candles over a supermarket one is the same for all of
    // them, so it lives in the dictionary (products.candleCase) and is shown to
    // every candle rather than repeated five times here
    why_it_works: null,
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-canela", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-colorida", null, 1),
  },
  {
    slug: "vela-com-mensagem",
    name: "vela com mensagem",
    category_slug: "velas",
    sort_order: 4,
    why_it_works:
      "podemos escrever a tua mensagem na vela: um nome, uma data, uma dedicatória, uma frase que só vocês entendem. já fizemos velas para aniversários, dia da mãe e dia do pai, batizados e convites a madrinhas e padrinhos, casamentos, dia dos namorados, agradecimentos, despedidas e passagens de ano. dizes-nos o que queres que fique escrito e fazemos a vela à volta dessa mensagem (funciona com qualquer uma das nossas velas). também podes escolher o formato, o óleo essencial e o estilo de decoração que preferires. cada uma é feita depois de falares connosco, por isso pede com alguma antecedência.",
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-canela", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-com-mensagem", null, 1),
  },

  // ---------------- roll-on ----------------
  {
    slug: "roll-on-relaxamento",
    name: "roll-on relax",
    category_slug: "roll-on",
    sort_order: 0,
    why_it_works:
      "para um momento de relaxamento: aplica nos pulsos e faz inalações profundas. o óleo de amêndoas doces serve de base suave para aplicar a mistura na pele. a camomila romana e a lavanda são as duas notas mais calmantes da fórmula, o petitgrain dá-lhe profundidade e o ylang-ylang uma nota floral mais envolvente, enquanto a laranja doce acrescenta um toque cítrico e luminoso. a mistura de óleos pode ser adaptada ao que precisares: fala connosco.",
    ingredient_slugs: [
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-camomila-romana",
      "oleo-essencial-de-laranja-doce",
      "oleo-essencial-de-petitgrain",
      "oleo-essencial-de-lavanda",
      "oleo-essencial-de-ylang-ylang",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("rollon-relax", 850, 6),
  },
  {
    slug: "roll-on-cabeca",
    name: "roll-on dor de cabeça",
    category_slug: "roll-on",
    sort_order: 1,
    why_it_works:
      "para quando a cabeça pesa: aplica nas têmporas e na testa e massaja. o óleo de amêndoas doces serve de base suave para aplicar a mistura na pele. a hortelã-pimenta, o eucalipto radiata e a cânfora dão a sensação fresca e penetrante que se sente logo na pele, e a lavanda equilibra a mistura com uma nota mais suave e reconfortante. a mistura de óleos pode ser adaptada ao que precisares: fala connosco.",
    ingredient_slugs: [
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-hortela-pimenta",
      "oleo-essencial-de-lavanda",
      "oleo-essencial-de-eucalipto-radiata",
      "oleo-essencial-de-canfora",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("rollon-cabeca", 850, 6),
  },
  {
    slug: "roll-on-sinusite",
    name: "roll-on para sinusite",
    category_slug: "roll-on",
    sort_order: 2,
    why_it_works:
      "para quando o nariz está entupido: aplica na testa e por baixo dos olhos, de cada lado do nariz, e massaja. o óleo de amêndoas doces serve de base suave para aplicar a mistura na pele. a hortelã-pimenta, o eucalipto radiata e a cânfora acrescentam uma sensação fresca e ajudam a criar um aroma que facilita a sensação de respiração desimpedida, enquanto o tea tree reforça o perfil purificante da fórmula. a mistura de óleos pode ser adaptada ao que precisares: fala connosco.",
    ingredient_slugs: [
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-eucalipto-radiata",
      "oleo-essencial-de-tea-tree",
      "oleo-essencial-de-hortela-pimenta",
      "oleo-essencial-de-canfora",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("rollon-sinusite", 850, 5),
  },

  // ---------------- sprays ----------------
  {
    slug: "spray-relaxante",
    name: "spray relaxante",
    category_slug: "sprays",
    sort_order: 0,
    why_it_works:
      "demorámos algumas experiências e aperfeiçoamentos até chegar a este spray, e finalmente está pronto. borrifa-o na almofada, nos lençóis ou nos cortinados antes de dormir, ou simplesmente no quarto, para criar um ambiente tranquilo. também serve na pele, como perfume, e como não mancha os tecidos podes usá-lo onde te apetecer: na roupa, ou até no carro, para conduzires com mais calma. foi pensado para poder usar-se no quarto do bebé, para noites mais relaxadas. quem faz o trabalho são os óleos essenciais: a lavanda é o aroma floral e herbáceo mais reconhecível de todos os que usamos, tradicionalmente associado a uma sensação de descanso, e a camomila romana junta-lhe uma nota doce e amaciada, daquelas que se associam a um momento de calma ao fim do dia. o álcool a 96º é o que deixa esses óleos misturarem-se com a água (coisa que a água sozinha não faz), por isso o spray não se separa em duas camadas, e como evapora depressa também não deixa a superfície molhada. a água destilada, sem minerais nem resíduos, mantém a fórmula limpa e não deixa marcas onde o spray assenta. as flores de lavanda ficam inteiras a flutuar no frasco e vão soltando o aroma devagar. se quiseres outra combinação de aromas, fala connosco.",
    ingredient_slugs: [
      "alcool-96",
      "agua-destilada",
      "oleo-essencial-de-lavanda",
      "oleo-essencial-de-camomila-romana",
      "flores-de-lavanda",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("spray-relaxante", 800, 3),
  },

  // ---------------- sais de banho (no price supplied) ----------------
  {
    slug: "sais-de-banho-relaxante",
    name: "sais de banho relaxante",
    category_slug: "sais-de-banho",
    sort_order: 0,
    why_it_works:
      "feitos à mão com sal marinho integral, vindo diretamente da salina, sem qualquer tratamento de purificação, limpeza ou branqueamento, por isso mantém todas as suas propriedades energizantes. juntamos-lhe óleo essencial de lavanda para um efeito calmante e uma mistura de flores secas para intensificar o relaxamento. perfeitos para um banho de imersão ou para um escalda-pés. verdadeiramente lucrescentes.",
    ingredient_slugs: [
      "sal-marinho-integral",
      "flores-de-camomila",
      "flores-de-lavanda",
      "flores-de-rosa",
      "oleo-essencial-de-lavanda",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: [
      { sku: "sais-relaxante-frasco", label: "frasco de vidro", price_cents: 800, stock: 5 },
    ],
  },

  // ---------------- batons (boião / stick) ----------------
  {
    slug: "batom-tijolo",
    name: "batom tijolo",
    category_slug: "batons",
    sort_order: 0,
    why_it_works:
      "bálsamo para usar todos os dias. a cera de abelha dá consistência ao bálsamo e ajuda a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, deixando os lábios confortáveis sem uma sensação pesada. a cor de tijolo vem do óxido de ferro, um pigmento mineral: é o único dos nossos batons que leva cor.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "manteiga-de-cacau",
      "oleo-vegetal-de-amendoas-doces",
      "oxido-de-ferro",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: balm("batom-tijolo", 2, 2, 450),
  },
  {
    slug: "batom-herpes",
    name: "batom herpes",
    category_slug: "batons",
    sort_order: 1,
    why_it_works:
      "bálsamo para usar todos os dias. a cera de abelha dá consistência ao bálsamo e ajuda a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, deixando os lábios confortáveis sem uma sensação pesada.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "manteiga-de-cacau",
      "oleo-vegetal-de-amendoas-doces",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    is_active: false, // archived: no photograph yet
    variants: balm("batom-herpes", 0, 1, 450),
  },
  {
    slug: "batom-laranja",
    name: "batom laranja",
    category_slug: "batons",
    sort_order: 2,
    why_it_works:
      "bálsamo para usar todos os dias. a cera de abelha dá consistência ao bálsamo e ajuda a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, enquanto o óleo essencial de laranja doce acrescenta um aroma cítrico, doce e luminoso.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "manteiga-de-cacau",
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-laranja-doce",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: balm("batom-laranja", 3, 1, 450),
  },
  {
    slug: "batom-natural",
    name: "batom natural",
    category_slug: "batons",
    sort_order: 3,
    why_it_works:
      "bálsamo para usar todos os dias. a cera de abelha dá consistência ao bálsamo e ajuda a criar uma camada protetora nos lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, deixando os lábios confortáveis sem uma sensação pesada.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "manteiga-de-cacau",
      "oleo-vegetal-de-amendoas-doces",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: balm("batom-natural", 3, 8, 450),
  },
  {
    slug: "batom-h-pimenta",
    name: "batom hortelã-pimenta",
    category_slug: "batons",
    sort_order: 4,
    why_it_works:
      "bálsamo para usar todos os dias. a cera de abelha dá consistência ao bálsamo e ajuda a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, enquanto o óleo essencial de hortelã-pimenta acrescenta uma sensação fresca e refrescante.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "manteiga-de-cacau",
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-hortela-pimenta",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: balm("batom-h-pimenta", 3, 2, 450),
  },

  // ---------------- inaladores / ambientadores ----------------
  {
    slug: "inalador",
    name: "inalador",
    category_slug: "inaladores",
    sort_order: 0,
    why_it_works:
      "para levar na mala ou no bolso e usar sempre que precisares: inspira os óleos essenciais diretamente do inalador. a combinação de hortelã-pimenta, eucalipto radiata e ravintsara cria um aroma fresco e penetrante, associado a uma sensação de respiração desimpedida. a lavanda 40/42 e a camomila romana equilibram a mistura com notas mais suaves e reconfortantes.",
    ingredient_slugs: [
      "oleo-essencial-de-hortela-pimenta",
      "oleo-essencial-de-lavanda-4042-blend",
      "oleo-essencial-de-camomila-romana",
      "oleo-essencial-de-ravintsara",
      "oleo-essencial-de-eucalipto-radiata",
    ],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("inalador", 450, 6),
  },
  {
    slug: "ambientador",
    name: "ambientador",
    category_slug: "ambientadores",
    sort_order: 1,
    why_it_works:
      "funciona de duas maneiras, conforme o que preferires. derretido (num queimador ou numa lamparina) a cera de soja liberta o aroma dos óleos essenciais com o calor, e o cheiro espalha-se por toda a divisão. sem derreter, pousado numa gaveta, num armário ou dentro do carro, os óleos continuam a soltar o aroma na mesma, só que devagar e num espaço mais pequeno à volta dele. é a mesma cera vegetal das nossas velas, por isso não leva parafina nem fragrâncias sintéticas. depois de derretida, também podes aproveitar a cera para massagens, porque a cera de soja hidrata a pele. escolhe o óleo essencial de que mais gostas e diz-nos qual é quando encomendares!",
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-alecrim", "oleo-essencial-de-bergamota", "oleo-essencial-de-camomila-romana", "oleo-essencial-de-canela", "oleo-essencial-de-citronela", "oleo-essencial-de-erva-principe", "oleo-essencial-de-erva-principe-citratus", "oleo-essencial-de-eucalipto-radiata", "oleo-essencial-de-gengibre", "oleo-essencial-de-geranio-rosa", "oleo-essencial-de-ho-wood", "oleo-essencial-de-hortela-pimenta", "oleo-essencial-de-laranja-doce", "oleo-essencial-de-lavanda", "oleo-essencial-de-limao", "oleo-essencial-de-palmarosa", "oleo-essencial-de-patchouli", "oleo-essencial-de-petitgrain", "oleo-essencial-de-ravintsara", "oleo-essencial-de-tea-tree", "oleo-essencial-de-ylang-ylang"],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: one("ambientador", 120, 0),
  },
];

/** Featured on the homepage ("os nossos preferidos do momento"). Editable. */
export const featuredSlugs = [
  "champo-secos",
  "desodorizante-lavanda-palmarosa",
  "amaciador",
  "roll-on-sinusite",
];
