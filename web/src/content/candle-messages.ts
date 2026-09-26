import type { ProductLocale } from "./product-locales";

/**
 * Copy for the "velas com mensagens" section on the candles page.
 *
 * Kept here rather than in the main dictionary, beside `allergen-notes.ts` and
 * `home-tile-labels.ts`: it belongs to one section of one category, and the
 * dictionaries are shared ground that two people end up editing at once.
 *
 * There is no photograph of a message candle yet — `candle-models.tsx` has been
 * waiting on one for a while — so the section is words only. Add an image here
 * when one exists rather than reaching for a stand-in that shows the wrong thing.
 */
type CandleMessageCopy = {
  label: string;
  title: string;
  body: string;
  lead: string;
  link: string;
};

export const candleMessages: Record<ProductLocale, CandleMessageCopy> = {
  pt: {
    label: "feito para ti",
    title: "velas com mensagens",
    body: "podemos escrever a tua mensagem na vela — um nome, uma data, uma dedicatória, uma frase que só vocês entendem. dizes-nos o que queres que fique escrito e fazemos a vela à volta dessa mensagem. funciona com qualquer uma das nossas velas.",
    lead: "cada uma é feita depois de falares connosco, por isso pede com alguma antecedência. e se tiveres um frasco, uma caneca ou uma taça que gostasses de usar, basta entregares-nos o recipiente.",
    link: "pede a tua vela com mensagem",
  },
  en: {
    label: "made for you",
    title: "candles with messages",
    body: "we can write your message on the candle — a name, a date, a dedication, a line only you understand. tell us what it should say and we build the candle around that message. it works with any of our candles.",
    lead: "each one is made after you talk to us, so please ask a little ahead of time. and if you have a jar, a mug or a bowl you would like us to use, just bring us the container.",
    link: "ask for your candle with a message",
  },
  fr: {
    label: "fait pour vous",
    title: "bougies avec messages",
    body: "nous pouvons écrire votre message sur la bougie — un prénom, une date, une dédicace, une phrase que vous seuls comprenez. dites-nous ce qui doit y figurer et nous fabriquons la bougie autour de ce message. cela fonctionne avec n'importe laquelle de nos bougies.",
    lead: "chacune est fabriquée après votre message, pensez donc à demander un peu à l'avance. et si vous avez un bocal, une tasse ou un bol que vous aimeriez utiliser, apportez-nous simplement le récipient.",
    link: "demander votre bougie avec message",
  },
};
