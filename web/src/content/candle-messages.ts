import type { ProductLocale } from "./product-locales";

/**
 * Copy for the "velas com mensagens" section on the candles page.
 *
 * Kept here rather than in the main dictionary, beside `allergen-notes.ts` and
 * `home-tile-labels.ts`: it belongs to one section of one category, and the
 * dictionaries are shared ground that two people end up editing at once.
 */
type CandleMessageCopy = {
  label: string;
  title: string;
  body: string;
  lead: string;
  link: string;
  /** Heading for the photographs, read by screen readers only. */
  gallery: string;
  /** Vessel names, by the `vessel` key on each photo below. */
  vessels: Record<CandleMessagePhoto["vessel"], string>;
  /**
   * Builds the alt text for one photograph. The message stays in Portuguese in
   * every language: it is what is actually painted on that candle, not a label
   * we are free to translate.
   */
  alt: (message: string, vessel: string) => string;
};

export type CandleMessagePhoto = {
  /** File under /images/velas-com-mensagem — the camera's own name, so a photo
   *  here can be traced back to the one in the brand's VELAS folder. */
  file: string;
  /** The words painted on the wax, exactly as they are written. */
  message: string;
  vessel: "coco" | "barro" | "concha" | "vidro" | "coco-concha";
};

/**
 * The photographs, oldest first — except the cover, which the brand chose and
 * which therefore leads. Everything after it keeps the order of the source
 * folder, so adding a new photo means appending one line here.
 */
export const candleMessagePhotos: CandleMessagePhoto[] = [
  { file: "20240405_120105.jpg", message: "parabéns", vessel: "coco" },
  { file: "20240212_163453.jpg", message: "gosto de ti MS", vessel: "coco" },
  { file: "20240221_151831.jpg", message: "adoro-te", vessel: "coco" },
  { file: "20240221_151840.jpg", message: "obrigada", vessel: "barro" },
  { file: "20240221_151850.jpg", message: "com carinho", vessel: "barro" },
  { file: "20240328_180030.jpg", message: "tia alexandra, aceitas ser minha madrinha?", vessel: "vidro" },
  { file: "20240405_120045.jpg", message: "parabéns", vessel: "coco" },
  { file: "20240413_095820.jpg", message: "parabéns", vessel: "barro" },
  { file: "20240414_141928.jpg", message: "mamã", vessel: "concha" },
  { file: "20240418_121203.jpg", message: "beijinhos", vessel: "coco-concha" },
  { file: "20240728_173516.jpg", message: "28 com amor", vessel: "coco" },
  { file: "20240728_174809.jpg", message: "28 com amor", vessel: "coco" },
  { file: "20240815_185036.jpg", message: "love youuu", vessel: "coco" },
  { file: "20241230_163830.jpg", message: "feliz 2025", vessel: "barro" },
];

/** The photograph the brand picked to lead the section. */
export const candleMessageCover = candleMessagePhotos[0];

export const candleMessages: Record<ProductLocale, CandleMessageCopy> = {
  pt: {
    label: "feito para ti",
    title: "velas com mensagens",
    body: "podemos escrever a tua mensagem na vela — um nome, uma data, uma dedicatória, uma frase que só vocês entendem. dizes-nos o que queres que fique escrito e fazemos a vela à volta dessa mensagem. funciona com qualquer uma das nossas velas.",
    lead: "cada uma é feita depois de falares connosco, por isso pede com alguma antecedência. e se tiveres um frasco, uma caneca ou uma taça que gostasses de usar, basta entregares-nos o recipiente.",
    link: "pede a tua vela com mensagem",
    gallery: "velas com mensagem já feitas",
    vessels: {
      coco: "casca de coco",
      barro: "taça de barro",
      concha: "concha",
      vidro: "taça de vidro",
      "coco-concha": "casca de coco e concha",
    },
    alt: (message, vessel) => `vela em ${vessel}, com «${message}» escrito à mão na cera e flores secas`,
  },
  en: {
    label: "made for you",
    title: "candles with messages",
    body: "we can write your message on the candle — a name, a date, a dedication, a line only you understand. tell us what it should say and we build the candle around that message. it works with any of our candles.",
    lead: "each one is made after you talk to us, so please ask a little ahead of time. and if you have a jar, a mug or a bowl you would like us to use, just bring us the container.",
    link: "ask for your candle with a message",
    gallery: "candles with messages we have made",
    vessels: {
      coco: "a coconut shell",
      barro: "a terracotta bowl",
      concha: "a seashell",
      vidro: "a glass dish",
      "coco-concha": "a coconut shell and a seashell",
    },
    alt: (message, vessel) => `candle in ${vessel}, with «${message}» written by hand in the wax and dried flowers`,
  },
  fr: {
    label: "fait pour vous",
    title: "bougies avec messages",
    body: "nous pouvons écrire votre message sur la bougie — un prénom, une date, une dédicace, une phrase que vous seuls comprenez. dites-nous ce qui doit y figurer et nous fabriquons la bougie autour de ce message. cela fonctionne avec n'importe laquelle de nos bougies.",
    lead: "chacune est fabriquée après votre message, pensez donc à demander un peu à l'avance. et si vous avez un bocal, une tasse ou un bol que vous aimeriez utiliser, apportez-nous simplement le récipient.",
    link: "demander votre bougie avec message",
    gallery: "bougies avec messages déjà réalisées",
    vessels: {
      coco: "une coque de noix de coco",
      barro: "un bol en terre cuite",
      concha: "un coquillage",
      vidro: "un plat en verre",
      "coco-concha": "une coque de noix de coco et un coquillage",
    },
    alt: (message, vessel) => `bougie dans ${vessel}, avec «${message}» écrit à la main dans la cire et des fleurs séchées`,
  },
};
