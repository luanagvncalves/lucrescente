import type { ProductLocale } from "./product-locales";

/**
 * English and French for every photo description on the site.
 *
 * These are what a screen reader reads out and what a search engine indexes, and
 * they were Portuguese on every page in every language. They live in Supabase
 * (`product_images.alt`) and in editorial.json, neither of which has a language
 * column, so the translation is looked up here.
 *
 * Keyed by the Portuguese text rather than by image path: several products share
 * the same photograph — the three roll-ons, the two deodorants — and the category
 * tiles reuse product photographs, so one entry covers all of them, and a photo
 * that is re-cropped or moved keeps its description.
 */
const alt: Record<string, { en: string; fr: string }> = {
  // amaciadores
  "três amaciadores sólidos redondos de cor creme com relevo floral, sobre tecido floral rosa e azul": {
    en: "three round cream-coloured solid conditioners with a raised floral pattern, on pink and blue floral fabric",
    fr: "trois après-shampoings solides ronds de couleur crème au motif floral en relief, sur un tissu floral rose et bleu",
  },
  "grande plano de amaciadores sólidos cor de creme com relevo de flores": {
    en: "close-up of cream-coloured solid conditioners with raised flowers",
    fr: "gros plan d'après-shampoings solides couleur crème au motif de fleurs en relief",
  },
  "três amaciadores sólidos em forma de coração, cor de creme, sobre tecido floral": {
    en: "three heart-shaped solid conditioners, cream-coloured, on floral fabric",
    fr: "trois après-shampoings solides en forme de cœur, couleur crème, sur un tissu floral",
  },

  // ambientadores
  "três caixas de metal em forma de coração — vermelha, prateada e dourada — com ambientadores de cera branca, flores secas e botões de rosa, sobre tecido floral": {
    en: "three heart-shaped metal tins — red, silver and gold — holding white wax air fresheners, dried flowers and rosebuds, on floral fabric",
    fr: "trois boîtes métalliques en forme de cœur — rouge, argentée et dorée — contenant des parfums d'ambiance en cire blanche, des fleurs séchées et des boutons de rose, sur un tissu floral",
  },
  "grande plano da caixa vermelha em forma de coração cheia de ambientadores de cera em forma de coração com lavanda e botões de rosa secos": {
    en: "close-up of the red heart-shaped tin filled with heart-shaped wax air fresheners with dried lavender and rosebuds",
    fr: "gros plan de la boîte rouge en forme de cœur remplie de parfums d'ambiance en cire en forme de cœur, avec de la lavande et des boutons de rose séchés",
  },
  "caixa prateada em forma de coração com ambientadores de cera em forma de flor e flores secas lilás e azuis, ao lado das caixas vermelha e dourada": {
    en: "silver heart-shaped tin with flower-shaped wax air fresheners and dried lilac and blue flowers, beside the red and gold tins",
    fr: "boîte argentée en forme de cœur avec des parfums d'ambiance en cire en forme de fleur et des fleurs séchées lilas et bleues, à côté des boîtes rouge et dorée",
  },

  // batons
  "bálsamo labial em stick branco com a barra de cor vermelho-tijolo exposta, tampa ao lado e um segundo stick fechado, sobre saco de juta": {
    en: "lip balm in a white stick with the brick-red bar wound up, its cap beside it and a second closed stick, on a jute sack",
    fr: "baume à lèvres en stick blanc avec le bâton rouge brique sorti, son capuchon à côté et un second stick fermé, sur un sac de jute",
  },
  "dois bálsamos labiais em stick branco com etiqueta roxa e barra amarelo-clara exposta, sobre tecido floral rosa": {
    en: "two lip balms in white sticks with a purple label and the pale yellow bar wound up, on pink floral fabric",
    fr: "deux baumes à lèvres en sticks blancs avec une étiquette violette et le bâton jaune pâle sorti, sur un tissu floral rose",
  },
  "bálsamo labial em stick branco ao lado de um boião de máscara capilar e de uma vela acesa em copo de vidro, sobre papel": {
    en: "lip balm in a white stick beside a jar of hair mask and a lit candle in a glass, on paper",
    fr: "baume à lèvres en stick blanc à côté d'un pot de masque capillaire et d'une bougie allumée dans un verre, sur du papier",
  },
  "vários bálsamos labiais em stick branco sobre tecido floral": {
    en: "several lip balms in white sticks on floral fabric",
    fr: "plusieurs baumes à lèvres en sticks blancs sur un tissu floral",
  },
  "lata metálica pequena aberta com bálsamo labial amarelo-claro e etiqueta roxa lucrescente": {
    en: "small open metal tin of pale yellow lip balm with a purple lucrescente label",
    fr: "petite boîte métallique ouverte de baume à lèvres jaune pâle avec une étiquette violette lucrescente",
  },

  // champôs
  "quatro champôs sólidos redondos brancos sobre tecido floral rosa": {
    en: "four round white solid shampoo bars on pink floral fabric",
    fr: "quatre pains de shampoing solide blancs et ronds sur un tissu floral rose",
  },
  "champôs sólidos brancos, um com textura mais rugosa, sobre tecido floral": {
    en: "white solid shampoo bars, one with a rougher texture, on floral fabric",
    fr: "pains de shampoing solide blancs, dont un à la texture plus rugueuse, sur un tissu floral",
  },
  "champôs sólidos brancos sobre tecido floral": {
    en: "white solid shampoo bars on floral fabric",
    fr: "pains de shampoing solide blancs sur un tissu floral",
  },
  "quatro champôs sólidos redondos de cor verde-acinzentada, com textura granulada, sobre tecido floral rosa": {
    en: "four round grey-green solid shampoo bars with a grainy texture, on pink floral fabric",
    fr: "quatre pains de shampoing solide ronds vert-gris à la texture granuleuse, sur un tissu floral rose",
  },
  "champôs sólidos verde-acinzentados empilhados sobre tecido floral": {
    en: "grey-green solid shampoo bars stacked on floral fabric",
    fr: "pains de shampoing solide vert-gris empilés sur un tissu floral",
  },
  "champôs sólidos redondos brancos em grande plano sobre tecido rosa claro": {
    en: "close-up of round white solid shampoo bars on pale pink fabric",
    fr: "gros plan de pains de shampoing solide blancs et ronds sur un tissu rose pâle",
  },
  "quatro champôs sólidos redondos de cor creme, um deles de lado, sobre tecido floral rosa e azul": {
    en: "four round cream-coloured solid shampoo bars, one on its side, on pink and blue floral fabric",
    fr: "quatre pains de shampoing solide ronds couleur crème, dont un sur le côté, sur un tissu floral rose et bleu",
  },
  "champôs sólidos cor de creme sobre tecido floral": {
    en: "cream-coloured solid shampoo bars on floral fabric",
    fr: "pains de shampoing solide couleur crème sur un tissu floral",
  },
  "champôs sólidos cor de creme em grande plano sobre tecido floral": {
    en: "close-up of cream-coloured solid shampoo bars on floral fabric",
    fr: "gros plan de pains de shampoing solide couleur crème sur un tissu floral",
  },

  // desodorizantes
  "boião de vidro âmbar aberto com desodorizante em creme branco, tampa prateada com etiqueta lucrescente, sobre tecido floral": {
    en: "open amber glass jar of white cream deodorant, silver lid with a lucrescente label, on floral fabric",
    fr: "pot en verre ambré ouvert de déodorant en crème blanche, couvercle argenté avec étiquette lucrescente, sur un tissu floral",
  },
  "boião de vidro âmbar fechado de desodorizante em creme, com etiqueta lucrescente, pousado em tecido floral": {
    en: "closed amber glass jar of cream deodorant with a lucrescente label, resting on floral fabric",
    fr: "pot en verre ambré fermé de déodorant en crème, avec étiquette lucrescente, posé sur un tissu floral",
  },
  "conjunto de produtos lucrescente sobre tecido floral: boião branco de desodorizante em creme, sais de banho, sabonete com sementes de papoila, inalador e bálsamo labial": {
    en: "a set of lucrescente products on floral fabric: a white jar of cream deodorant, bath salts, a poppy seed soap, an inhaler and a lip balm",
    fr: "un ensemble de produits lucrescente sur un tissu floral : un pot blanc de déodorant en crème, des sels de bain, un savon aux graines de pavot, un inhalateur et un baume à lèvres",
  },

  // inaladores
  "cinco inaladores nasais brancos com etiqueta redonda cinzenta, um deitado, sobre tecido floral rosa": {
    en: "five white nasal inhalers with a round grey label, one lying down, on pink floral fabric",
    fr: "cinq inhalateurs nasaux blancs avec une étiquette ronde grise, dont un couché, sur un tissu floral rose",
  },
  "inaladores nasais brancos, um deles aberto a mostrar o tubo interior, sobre tecido floral": {
    en: "white nasal inhalers, one opened to show the inner tube, on floral fabric",
    fr: "inhalateurs nasaux blancs, dont un ouvert laissant voir le tube intérieur, sur un tissu floral",
  },
  "quatro inaladores nasais brancos em pé e um deitado sobre tecido floral": {
    en: "four white nasal inhalers standing and one lying down on floral fabric",
    fr: "quatre inhalateurs nasaux blancs debout et un couché sur un tissu floral",
  },

  // máscara capilar
  "boiões brancos de máscara capilar com etiqueta azul lucrescente, um deles aberto a mostrar o creme, sobre tecido floral": {
    en: "white jars of hair mask with a blue lucrescente label, one opened to show the cream, on floral fabric",
    fr: "pots blancs de masque capillaire avec une étiquette bleue lucrescente, dont un ouvert laissant voir la crème, sur un tissu floral",
  },
  "boião aberto de máscara capilar branca em grande plano": {
    en: "close-up of an open jar of white hair mask",
    fr: "gros plan d'un pot ouvert de masque capillaire blanc",
  },
  "boião de máscara capilar com tampa dourada ao lado de um bálsamo labial em stick e de uma vela acesa em copo de vidro": {
    en: "jar of hair mask with a gold lid beside a lip balm stick and a lit candle in a glass",
    fr: "pot de masque capillaire au couvercle doré à côté d'un stick de baume à lèvres et d'une bougie allumée dans un verre",
  },

  // roll-ons
  "três roll-ons de vidro âmbar de 10 ml, um deles aberto a mostrar a esfera de aço, com etiqueta redonda lucrescente, sobre tecido floral": {
    en: "three 10 ml amber glass roll-ons, one opened to show the steel ball, with a round lucrescente label, on floral fabric",
    fr: "trois roll-ons en verre ambré de 10 ml, dont un ouvert laissant voir la bille en acier, avec une étiquette ronde lucrescente, sur un tissu floral",
  },
  "seis roll-ons de vidro âmbar com etiqueta lucrescente, um deitado, sobre tecido floral rosa": {
    en: "six amber glass roll-ons with a lucrescente label, one lying down, on pink floral fabric",
    fr: "six roll-ons en verre ambré avec une étiquette lucrescente, dont un couché, sur un tissu floral rose",
  },
  "três roll-ons de vidro âmbar sobre tecido floral rosa e azul": {
    en: "three amber glass roll-ons on pink and blue floral fabric",
    fr: "trois roll-ons en verre ambré sur un tissu floral rose et bleu",
  },
  "bolsa branca de crochet com roll-on de vidro âmbar, inalador branco e pequena lata, sobre tecido floral": {
    en: "white crochet pouch with an amber glass roll-on, a white inhaler and a small tin, on floral fabric",
    fr: "pochette blanche au crochet avec un roll-on en verre ambré, un inhalateur blanc et une petite boîte, sur un tissu floral",
  },

  // sabonetes
  "sabonetes de rosto translúcidos em forma de flor, com sementes de papoila visíveis, em grande plano": {
    en: "close-up of translucent flower-shaped face soaps with visible poppy seeds",
    fr: "gros plan de savons pour le visage translucides en forme de fleur, avec des graines de pavot visibles",
  },
  "sabonetes de rosto em forma de flor com sementes de papoila sobre tecido claro": {
    en: "flower-shaped face soaps with poppy seeds on pale fabric",
    fr: "savons pour le visage en forme de fleur avec des graines de pavot sur un tissu clair",
  },
  "vários sabonetes de rosto em forma de flor com sementes de papoila": {
    en: "several flower-shaped face soaps with poppy seeds",
    fr: "plusieurs savons pour le visage en forme de fleur avec des graines de pavot",
  },

  // sais de banho
  "três frascos de vidro com sais de banho e rolha de cortiça, etiqueta roxa lucrescente, sobre tecido floral rosa e azul": {
    en: "three glass bottles of bath salts with cork stoppers and a purple lucrescente label, on pink and blue floral fabric",
    fr: "trois flacons en verre de sels de bain avec bouchon de liège et étiquette violette lucrescente, sur un tissu floral rose et bleu",
  },
  "frasco de sais de banho tombado com cristais de sal grosso a sair e rolha de cortiça ao lado": {
    en: "a tipped-over bottle of bath salts with coarse salt crystals spilling out and the cork stopper beside it",
    fr: "flacon de sels de bain renversé, des cristaux de gros sel s'en échappant, avec le bouchon de liège à côté",
  },
  "vela em copo de vidro, frasco alto de sais de banho com flores secas, roll-on e saco de organza com ambientadores, sobre tecido floral": {
    en: "a candle in a glass, a tall bottle of bath salts with dried flowers, a roll-on and an organza bag of air fresheners, on floral fabric",
    fr: "une bougie dans un verre, un grand flacon de sels de bain avec des fleurs séchées, un roll-on et un sachet d'organza de parfums d'ambiance, sur un tissu floral",
  },

  // sprays
  "quatro frascos de vidro âmbar com pulverizador branco e etiqueta roxa lucrescente, em pé sobre tecido floral rosa e azul": {
    en: "four amber glass bottles with a white spray top and a purple lucrescente label, standing on pink and blue floral fabric",
    fr: "quatre flacons en verre ambré avec un vaporisateur blanc et une étiquette violette lucrescente, debout sur un tissu floral rose et bleu",
  },
  "mão a segurar um frasco de spray de vidro âmbar com etiqueta manuscrita 'noite tranquila'": {
    en: "a hand holding an amber glass spray bottle with a handwritten label reading 'noite tranquila'",
    fr: "une main tenant un flacon spray en verre ambré avec une étiquette manuscrite « noite tranquila »",
  },
  "quatro frascos de spray de vidro âmbar deitados sobre tecido floral, vistos de cima": {
    en: "four amber glass spray bottles lying on floral fabric, seen from above",
    fr: "quatre flacons spray en verre ambré couchés sur un tissu floral, vus de dessus",
  },

  // velas
  "três velas de citronela em copos de vidro com etiqueta preta, sobre tecido floral rosa e azul": {
    en: "three citronella candles in glasses with a black label, on pink and blue floral fabric",
    fr: "trois bougies à la citronnelle dans des verres avec une étiquette noire, sur un tissu floral rose et bleu",
  },
  "três velas em copos de vidro com etiqueta preta ao lado de flores secas": {
    en: "three candles in glasses with a black label beside dried flowers",
    fr: "trois bougies dans des verres avec une étiquette noire à côté de fleurs séchées",
  },
  "mão a segurar uma vela de citronela em copo de vidro com etiqueta preta": {
    en: "a hand holding a citronella candle in a glass with a black label",
    fr: "une main tenant une bougie à la citronnelle dans un verre avec une étiquette noire",
  },
  "três velas em forma de estrela amarelas em vidro transparente": {
    en: "three yellow star-shaped candles in clear glass",
    fr: "trois bougies jaunes en forme d'étoile dans du verre transparent",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas brancas": {
    en: "handmade candle in a glass with a yellow ribbon and white dried flowers",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées blanches",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas amarelas": {
    en: "handmade candle in a glass with a yellow ribbon and yellow dried flowers",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées jaunes",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas coloridas": {
    en: "handmade candle in a glass with a yellow ribbon and colourful dried flowers",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées colorées",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas": {
    en: "handmade candle in a glass with a yellow ribbon and dried flowers",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas brancas, sobre tecido floral": {
    en: "handmade candle in a glass with a yellow ribbon and white dried flowers, on floral fabric",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées blanches, sur un tissu floral",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas amarelas, sobre tecido floral": {
    en: "handmade candle in a glass with a yellow ribbon and yellow dried flowers, on floral fabric",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées jaunes, sur un tissu floral",
  },
  "vela artesanal em copo de vidro com laço amarelo, flores secas coloridas e caracol decorativo, sobre tecido floral": {
    en: "handmade candle in a glass with a yellow ribbon, colourful dried flowers and a decorative snail shell, on floral fabric",
    fr: "bougie artisanale dans un verre avec un ruban jaune, des fleurs séchées colorées et un escargot décoratif, sur un tissu floral",
  },
  "vela artesanal em copo de vidro com laço amarelo e flores secas, sobre tecido floral": {
    en: "handmade candle in a glass with a yellow ribbon and dried flowers, on floral fabric",
    fr: "bougie artisanale dans un verre avec un ruban jaune et des fleurs séchées, sur un tissu floral",
  },

  // editorial photographs
  "produtos lucrescente variados: frascos de vidro âmbar, desodorizante em boião branco, sabonetes, bastão de madeira, sobre tecido floral rosa e azul": {
    en: "an assortment of lucrescente products: amber glass bottles, deodorant in a white jar, soaps and a wooden stick, on pink and blue floral fabric",
    fr: "un assortiment de produits lucrescente : flacons en verre ambré, déodorant en pot blanc, savons et bâtonnet en bois, sur un tissu floral rose et bleu",
  },
  "duas mulheres em trajes de época atrás de uma banca de feira com produtos lucrescente sobre toalha laranja": {
    en: "two women in period dress behind a market stall of lucrescente products on an orange cloth",
    fr: "deux femmes en costume d'époque derrière un stand de marché garni de produits lucrescente sur une nappe orange",
  },
  "vela de cera de soja feita dentro de uma caneca de cerâmica reutilizada, com flores secas, sobre tecido floral": {
    en: "soy wax candle made inside a reused ceramic mug, with dried flowers, on floral fabric",
    fr: "bougie en cire de soja coulée dans une tasse en céramique réutilisée, avec des fleurs séchées, sur un tissu floral",
  },
  "grande plano de vela com três pavios numa caneca de cerâmica, decorada com flores secas coloridas": {
    en: "close-up of a three-wick candle in a ceramic mug, decorated with colourful dried flowers",
    fr: "gros plan d'une bougie à trois mèches dans une tasse en céramique, décorée de fleurs séchées colorées",
  },
  "três barras sólidas sem embalagem (branca, verde e bege) em saboneteiras artesanais em forma de folha, sobre tecido floral": {
    en: "three unpackaged solid bars (white, green and beige) on handmade leaf-shaped soap dishes, on floral fabric",
    fr: "trois pains solides sans emballage (blanc, vert et beige) sur des porte-savons artisanaux en forme de feuille, sur un tissu floral",
  },
};

/** Falls back to the Portuguese description, which is better than none at all. */
export function getImageAlt(portuguese: string | null | undefined, locale: ProductLocale): string {
  if (!portuguese) return "";
  if (locale === "pt") return portuguese;
  return alt[portuguese.trim()]?.[locale] ?? portuguese;
}
