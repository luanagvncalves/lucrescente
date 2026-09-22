/** Photos in /public/galeria (numbered by scripts/prepare-galeria.mjs), grouped by what they show. */
type Lang = "pt" | "en" | "fr";
type L = Record<Lang, string>;

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const galleryGroups: { id: string; title: L; alt: L; photos: number[] }[] = [
  {
    id: "velas-lacos",
    title: { pt: "velas com laço e flores secas", en: "ribbon candles with dried flowers", fr: "bougies à ruban et fleurs séchées" },
    alt: { pt: "vela artesanal com flores secas e laço de cetim", en: "handmade candle with dried flowers and a satin ribbon", fr: "bougie artisanale aux fleurs séchées et ruban de satin" },
    photos: range(0, 27),
  },
  {
    id: "velas-tacas",
    title: { pt: "velas em taça de vidro e velas estrela", en: "candles in glass dishes and star candles", fr: "bougies en coupe de verre et bougies étoile" },
    alt: { pt: "vela em taça de vidro em forma de flor com flores secas, ao lado de velas amarelas em forma de estrela", en: "candle in a flower-shaped glass dish with dried flowers, beside yellow star candles", fr: "bougie en coupe de verre en forme de fleur avec fleurs séchées, près de bougies étoile jaunes" },
    photos: range(28, 32),
  },
  {
    id: "sais",
    title: { pt: "sais de banho", en: "bath salts", fr: "sels de bain" },
    alt: { pt: "frascos de vidro com rolha de cortiça e sais de banho, com etiqueta lucrescente", en: "glass jars with cork stoppers holding bath salts, with a lucrescente label", fr: "flacons en verre à bouchon de liège contenant des sels de bain, avec étiquette lucrescente" },
    photos: range(33, 38),
  },
  {
    id: "sprays",
    title: { pt: "sprays", en: "sprays", fr: "sprays" },
    alt: { pt: "frascos de vidro âmbar com vaporizador branco e etiqueta lucrescente", en: "amber glass bottles with white spray tops and a lucrescente label", fr: "flacons en verre ambré à vaporisateur blanc avec étiquette lucrescente" },
    photos: range(39, 41),
  },
  {
    id: "velas-outono",
    title: { pt: "velas de outono e girassol", en: "autumn and sunflower candles", fr: "bougies d'automne et tournesol" },
    alt: { pt: "vela artesanal com abóboras decorativas ou pétalas de girassol, com etiqueta lucrescente", en: "handmade candle with decorative pumpkins or sunflower petals, with a lucrescente label", fr: "bougie artisanale avec citrouilles décoratives ou pétales de tournesol, étiquette lucrescente" },
    photos: range(42, 49),
  },
];

export const galleryCopy: Record<Lang, { label: string; title: string; intro: string }> = {
  pt: { label: "galeria", title: "o nosso trabalho, de perto", intro: "velas, sais de banho e sprays feitos à mão, tal como saem da nossa bancada." },
  en: { label: "gallery", title: "our work, up close", intro: "handmade candles, bath salts and sprays, just as they leave our workbench." },
  fr: { label: "galerie", title: "notre travail, de près", intro: "bougies, sels de bain et sprays faits à la main, tels qu'ils quittent notre établi." },
};

export const galleryNav: L = { pt: "galeria", en: "gallery", fr: "galerie" };

export const galleryPhoto = (n: number) => `/galeria/${String(n).padStart(2, "0")}.jpg`;
