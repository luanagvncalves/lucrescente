import type { Locale } from "@/lib/i18n";

/**
 * Copy for the confirmation email the customer gets after paying.
 *
 * Kept in its own file rather than in pt.ts / en.ts / fr.ts, which are the
 * hottest contention point in this repo when more than one person is editing.
 *
 * Deliberately says nothing about how long delivery takes or what postage
 * costs. The shipping option the customer chose is printed back to them with
 * the estimate Stripe already showed; inventing a second promise here is how
 * the FAQ ended up carrying three languages of a number that then changed.
 * See config/shipping.ts.
 */
export type OrderEmailCopy = {
  subject: string;
  greeting: (name: string | null) => string;
  thanks: string;
  /** Set below the total, where a customer looks for "and now what?". */
  whatNext: string;
  summary: string;
  subtotal: string;
  shipping: string;
  total: string;
  shippingTo: string;
  reference: string;
  questions: string;
  signoff: string;
};

export const orderEmailCopy: Record<Locale, OrderEmailCopy> = {
  pt: {
    subject: "a tua encomenda na lucrescente",
    greeting: (name) => (name ? `olá ${name},` : "olá,"),
    thanks: "obrigada pela tua encomenda. o pagamento foi recebido e já estamos a prepará-la.",
    whatNext: "como cada peça é feita à mão, damos notícias assim que seguir para os correios.",
    summary: "o que encomendaste",
    subtotal: "subtotal",
    shipping: "envio",
    total: "total",
    shippingTo: "envio para",
    reference: "referência da encomenda",
    questions: "se alguma coisa estiver errada, responde a este email e resolvemos.",
    signoff: "até já,\nlucrescente",
  },
  en: {
    subject: "your lucrescente order",
    greeting: (name) => (name ? `hello ${name},` : "hello,"),
    thanks: "thank you for your order. the payment came through and we are already putting it together.",
    whatNext: "everything is made by hand, so we will write again as soon as it is on its way.",
    summary: "what you ordered",
    subtotal: "subtotal",
    shipping: "shipping",
    total: "total",
    shippingTo: "shipping to",
    reference: "order reference",
    questions: "if anything looks wrong, just reply to this email and we will sort it out.",
    signoff: "speak soon,\nlucrescente",
  },
  fr: {
    subject: "ta commande lucrescente",
    greeting: (name) => (name ? `bonjour ${name},` : "bonjour,"),
    thanks: "merci pour ta commande. le paiement est bien arrivé et nous la préparons déjà.",
    whatNext: "tout est fait à la main, alors nous t'écrirons dès qu'elle partira.",
    summary: "ta commande",
    subtotal: "sous-total",
    shipping: "livraison",
    total: "total",
    shippingTo: "livraison à",
    reference: "référence de la commande",
    questions: "si quelque chose ne va pas, réponds à cet email et nous arrangeons ça.",
    signoff: "à bientôt,\nlucrescente",
  },
};
