import type { ProductLocale } from "./product-locales";

/**
 * The cross-sell line pointing at `vela-com-mensagem`, shown on the other
 * candles' pages.
 *
 * The candle with a message used to be a section of prose under the catalogue
 * grid, and this file held all of that copy. It is a catalogue product now —
 * a card in the grid, a page with the gallery carousel — so its own words live
 * with every other product's, in `catalog.ts` and `product-locales.ts`. What is
 * left here is the one sentence that belongs to the *other* candles: the nudge
 * from a plain candle towards a written one.
 */
export const MESSAGE_CANDLE_SLUG = "vela-com-mensagem";

type CrossSellCopy = {
  /** Sits inside the candle note box on a candle's page. */
  text: string;
  link: string;
};

export const candleMessageCrossSell: Record<ProductLocale, CrossSellCopy> = {
  pt: {
    text: "e podemos escrever nela a mensagem que quiseres: um nome, uma data, uma dedicatória.",
    link: "vê as velas com mensagem",
  },
  en: {
    text: "and we can write whatever message you like on it: a name, a date, a dedication.",
    link: "see the candles with messages",
  },
  fr: {
    text: "et nous pouvons y écrire le message de votre choix : un prénom, une date, une dédicace.",
    link: "voir les bougies avec messages",
  },
};
