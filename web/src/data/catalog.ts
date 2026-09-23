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
  is_candle: boolean; // candles can be made in the customer's own containers
  is_deodorant: boolean;
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

const one = (sku: string, price_cents: number | null, stock: number): VariantSeed[] => [
  { sku, label: null, price_cents, stock },
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
      "a manteiga de karité e o óleo de coco dão uma base cremosa e confortável, enquanto que o bicarbonato de sódio neutraliza os odores e o amido de milho absorve a humidade. para além disto, o óleo de lavanda 40/42 acalma a pele (evitando irritações) e o de palmarosa ajuda no controlo das bactérias e microorganismos que causam os maus cheiros.",
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
      { sku: "deo-lav-proprio", label: "embalagem própria", price_cents: 1000, stock: 100 },
    ],
  },
  {
    slug: "desodorizante-tea-tree-erva-principe",
    name: "desodorizante tea-tree/erva-príncipe",
    category_slug: "desodorizantes",
    sort_order: 1,
    why_it_works:
      "a manteiga de karité e o óleo de coco dão uma base cremosa e confortável. o bicarbonato de sódio ajuda a neutralizar os odores e o amido de milho ajuda a absorver a humidade. o óleo essencial de tea tree ajuda a controlar naturalmente as bactérias responsáveis pelos maus cheiros, e a erva-príncipe acrescenta um aroma fresco e cítrico. não é um desodorizante antitranspirante: não contém alumínio nem álcool, respeitando o funcionamento natural da pele em vez de bloquear a transpiração ou obstruir os poros. se tiveres uma embalagem antiga, podemos reutilizá-la (com desconto) e adaptar a fórmula às tuas necessidades — mais suave, mais forte, ou com outro aroma.",
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
    name: "champô oleosos",
    category_slug: "champos",
    sort_order: 0,
    why_it_works:
      "este champô não leva água na sua composição — o líquido que vês é hidrolato de hortelã-pimenta, que ajuda a dar uma sensação de frescura e limpeza ao couro cabeludo. o sci limpa suavemente enquanto a argila branca e as farinhas ajudam a purificar e equilibrar. juntamos ainda urtiga e cavalinha, ervas secas trituradas por nós, tradicionalmente associadas ao fortalecimento do cabelo. os óleos de coco e argão, o ácido esteárico e o d-pantenol deixam o cabelo nutrido e macio, sem pesar, e a erva-príncipe acrescenta uma sensação fresca e revigorante.",
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
    name: "champô secos",
    category_slug: "champos",
    sort_order: 1,
    why_it_works:
      "este é dos nossos champôs mais procurados por quem tem couro cabeludo sensível, ajudando a controlar alguns casos de eczema: a aveia e a argila branca da fórmula ajudam a acalmar a comichão, a irritação e a escamação da pele e do couro cabeludo. o sci limpa sem retirar em excesso os óleos naturais, e as farinhas ajudam a limpar suavemente. o óleo de coco, a manteiga de karité e o d-pantenol nutrem e ajudam a manter a hidratação do cabelo seco. o hidrolato de lavanda e o óleo essencial de lavanda 40/42 acrescentam um perfil aromático suave e reconfortante. como os nossos champôs sólidos não têm químicos agressivos, também podem ser usados no corpo como sabonete — este em particular tem sido usado por quem tem pele atópica.",
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
    name: "champôs para cabelos normais",
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
    name: "champô neutro/para crianças",
    category_slug: "champos",
    sort_order: 3,
    why_it_works:
      "o sci proporciona uma limpeza suave, enquanto a argila branca coskao e as farinhas ajudam a limpar sem agredir. o óleo de coco, a manteiga de karité e o d-pantenol deixam o cabelo macio e confortável, e o hidrolato de camomila romana acrescenta um toque calmante à fórmula. o ácido esteárico dá consistência à barra.",
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
    name: "champô queda",
    category_slug: "champos",
    sort_order: 4,
    why_it_works: null,
    ingredient_slugs: [],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("champo-queda", 1200, 2),
  },

  // ---------------- cuidado capilar ----------------
  {
    slug: "amaciador",
    name: "amaciador",
    category_slug: "amaciadores",
    sort_order: 0,
    why_it_works:
      "o btms e o álcool cetílico condicionam e desembaraçam o cabelo, deixando-o mais macio e fácil de pentear. a manteiga de karité e os óleos de amêndoas doces e argão nutrem o comprimento e ajudam a reduzir a sensação de secura. a vitamina E protege a fase oleosa da oxidação, enquanto a lavanda acrescenta um aroma suave.",
    ingredient_slugs: [
      "cera-emulsionante-btms",
      "alcool-cetilico",
      "manteiga-de-karite",
      "oleo-vegetal-de-amendoas-doces",
      "oleo-vegetal-de-argao",
      "oleo-essencial-de-lavanda-4042-blend",
      "vitamina-e",
      "conservante-cosgard",
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
      "o btms condiciona e ajuda a desembaraçar o cabelo, enquanto o óleo de coco deixa os fios mais macios. a água dá leveza à fórmula; o alecrim qt cineol e o limão acrescentam um aroma fresco e revigorante. o cosgard ajuda a proteger a fórmula à base de água.",
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
  // Ingredient lists for soaps were not supplied per product; the brand states all soaps use
  // organic aloe vera harvested fresh at home, so only that link is shown.
  {
    slug: "sabonete-40g",
    name: "sabonete 40g",
    category_slug: "sabonetes",
    sort_order: 0,
    why_it_works: null,
    ingredient_slugs: ["aloe-vera"],
    is_solid: true,
    is_candle: false,
    is_deodorant: false,
    variants: one("sabonete-40g", 400, 3),
  },

  // ---------------- velas (no price supplied: "por encomenda") ----------------
  {
    slug: "vela-citronela",
    name: "vela citronela",
    category_slug: "velas",
    sort_order: 0,
    why_it_works: "as velas lucrescente são feitas com cera vegetal de soja, que derrete lenta e uniformemente: por isso duram mais tempo, sem desperdício de cera, e não têm derivados de petróleo nem fragrâncias sintéticas. a grande maioria dos elementos decorativos que usamos são naturais: flores e folhas secas, conchas, pedrinhas... alguns elementos vegetais são até prensados e preparados por nós. e se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
    ingredient_slugs: ["cera-de-soja", "oleo-essencial-de-citronela", "oleo-essencial-de-lavanda", "oleo-essencial-de-palmarosa"],
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
    why_it_works: "as velas lucrescente são feitas com cera vegetal de soja, que derrete lenta e uniformemente: por isso duram mais tempo, sem desperdício de cera, e não têm derivados de petróleo nem fragrâncias sintéticas. a grande maioria dos elementos decorativos que usamos são naturais: flores e folhas secas, conchas, pedrinhas... alguns elementos vegetais são até prensados e preparados por nós. e se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
    ingredient_slugs: ["cera-de-soja"],
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
    why_it_works: "as velas lucrescente são feitas com cera vegetal de soja, que derrete lenta e uniformemente: por isso duram mais tempo, sem desperdício de cera, e não têm derivados de petróleo nem fragrâncias sintéticas. a grande maioria dos elementos decorativos que usamos são naturais: flores e folhas secas, conchas, pedrinhas... alguns elementos vegetais são até prensados e preparados por nós. e se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
    ingredient_slugs: ["cera-de-soja"],
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
    why_it_works: "as velas lucrescente são feitas com cera vegetal de soja, que derrete lenta e uniformemente: por isso duram mais tempo, sem desperdício de cera, e não têm derivados de petróleo nem fragrâncias sintéticas. a grande maioria dos elementos decorativos que usamos são naturais: flores e folhas secas, conchas, pedrinhas... alguns elementos vegetais são até prensados e preparados por nós. e se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
    ingredient_slugs: ["cera-de-soja"],
    is_solid: false,
    is_candle: true,
    is_deodorant: false,
    variants: one("vela-colorida", null, 1),
  },

  // ---------------- roll-on ----------------
  {
    slug: "roll-on-relaxamento",
    name: "roll-on relax",
    category_slug: "roll-on",
    sort_order: 0,
    why_it_works: null,
    ingredient_slugs: [],
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
    why_it_works: null,
    ingredient_slugs: [],
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
      "o óleo de amêndoas doces serve de base suave para aplicar a mistura na pele. a hortelã-pimenta e o eucalipto radiata acrescentam uma sensação fresca e ajudam a criar um aroma que facilita a sensação de respiração desimpedida, enquanto o tea tree reforça o perfil purificante da fórmula.",
    ingredient_slugs: [
      "oleo-vegetal-de-amendoas-doces",
      "oleo-essencial-de-hortela-pimenta",
      "oleo-essencial-de-eucalipto-radiata",
      "oleo-essencial-de-tea-tree",
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
    why_it_works: null,
    ingredient_slugs: [],
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
      "preparados com sal marinho 100% natural, vindo diretamente da salina e sem qualquer tratamento, com óleos essenciais e flores secas. verdadeiramente lucrescentes, para um banho de imersão ou um escalda-pés bem relaxante e revigorante.",
    ingredient_slugs: ["sal-de-epsom", "oleo-essencial-de-lavanda-4042-blend"],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: [
      { sku: "sais-relaxante-proprio", label: "embalagem própria", price_cents: null, stock: 2 },
      { sku: "sais-relaxante-frasco", label: "frasco de vidro", price_cents: 800, stock: 5 },
    ],
  },

  // ---------------- batons (boião / stick) ----------------
  {
    slug: "batom-tijolo",
    name: "batom tijolo",
    category_slug: "batons",
    sort_order: 0,
    why_it_works: null,
    ingredient_slugs: [],
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
    why_it_works: null,
    ingredient_slugs: [],
    is_solid: false,
    is_candle: false,
    is_deodorant: false,
    variants: balm("batom-herpes", 0, 1, 450),
  },
  {
    slug: "batom-laranja",
    name: "batom laranja",
    category_slug: "batons",
    sort_order: 2,
    why_it_works:
      "a cera de abelha e a cera de soja dão consistência ao bálsamo e ajudam a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, enquanto o óleo essencial de laranja doce acrescenta um aroma cítrico, doce e luminoso.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "cera-de-soja",
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
      "a cera de abelha e a cera de soja dão consistência ao bálsamo e ajudam a criar uma camada protetora nos lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, deixando os lábios confortáveis sem uma sensação pesada.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "cera-de-soja",
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
    name: "batom h.pimenta",
    category_slug: "batons",
    sort_order: 4,
    why_it_works:
      "a cera de abelha e a cera de soja dão consistência ao bálsamo e ajudam a proteger os lábios. a manteiga de cacau e o óleo de amêndoas doces nutrem e suavizam, enquanto o óleo essencial de hortelã-pimenta acrescenta uma sensação fresca e refrescante.",
    ingredient_slugs: [
      "cera-de-abelha-amarela",
      "cera-de-soja",
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
      "a combinação de hortelã-pimenta, eucalipto radiata e ravintsara cria um aroma fresco e penetrante, associado a uma sensação de respiração desimpedida. a lavanda 40/42 e a camomila romana equilibram a mistura com notas mais suaves e reconfortantes.",
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
    why_it_works: null,
    ingredient_slugs: ["cera-de-soja"],
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
