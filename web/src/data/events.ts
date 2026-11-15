import type { ProductLocale } from "@/content/product-locales";

export const eventOrders = [
  {
    slug: "crisma",
    photos: ["20250526_164056", "20250526_164106", "20250526_164453", "20250526_164609", "20250526_164747"],
    copy: {
      pt: { title: "crisma", intro: "velas personalizadas para guardar e partilhar um dia especial.", description: "estas fotografias mostram uma encomenda de velas para um crisma, em frascos de vidro com laços violeta. uma lembrança preparada para celebrar em conjunto.", details: "para falarmos da tua encomenda, diz-nos a data da celebração, a quantidade de lembranças e as tuas ideias para as cores e a apresentação. podemos partir deste exemplo e conversar sobre os detalhes do teu evento.", alt: "velas personalizadas para um crisma, em frascos de vidro com laços violeta" },
      en: { title: "confirmation", intro: "personalised candles to remember and share a special day.", description: "these photographs show a candle order for a confirmation, in glass jars with violet ribbons. keepsakes prepared for a shared celebration.", details: "tell us the celebration date, the number of keepsakes and your ideas for colours and presentation. we can use this example to discuss the details of your event.", alt: "personalised confirmation candles in glass jars with violet ribbons" },
      fr: { title: "confirmation", intro: "des bougies personnalisées pour garder et partager un jour spécial.", description: "ces photographies présentent une commande de bougies pour une confirmation, en pots de verre avec des rubans violets. des souvenirs préparés pour célébrer ensemble.", details: "indique-nous la date de la célébration, le nombre de souvenirs et tes idées de couleurs et de présentation. cet exemple peut servir de point de départ pour parler des détails de ton événement.", alt: "bougies personnalisées pour une confirmation, en pots de verre avec rubans violets" },
    },
  },
  {
    slug: "prenda-de-grupo",
    photos: ["20251220_145853", "20251220_150227", "20251220_150615", "20251220_150624", "20251220_150635"],
    copy: {
      pt: { title: "prenda de grupo", intro: "um conjunto de presentes com uma intenção em comum e detalhes diferentes.", description: "nesta encomenda, as velas foram reunidas para uma prenda de grupo. flores secas, conchas e laços de várias cores dão a cada uma a sua própria combinação, mantendo uma apresentação em conjunto.", details: "conta-nos a ocasião, a data, quantas pessoas vão receber a prenda e as tuas ideias para as cores ou a mensagem. falamos contigo sobre as opções, as quantidades e os detalhes da encomenda.", alt: "velas decoradas com flores secas, conchas e laços coloridos para uma prenda de grupo" },
      en: { title: "group gift", intro: "a collection of gifts with a shared intention and individual details.", description: "these candles were brought together for a group gift. dried flowers, shells and colourful ribbons give each candle its own combination within a coordinated collection.", details: "tell us the occasion, date, number of recipients and your ideas for colours or a message. we will discuss the options, quantities and order details with you.", alt: "candles decorated with dried flowers, shells and colourful ribbons for a group gift" },
      fr: { title: "cadeau de groupe", intro: "un ensemble de cadeaux avec une intention commune et des détails différents.", description: "ces bougies ont été réunies pour un cadeau de groupe. fleurs séchées, coquillages et rubans colorés donnent à chacune sa propre combinaison dans un ensemble coordonné.", details: "raconte-nous l’occasion, la date, le nombre de destinataires et tes idées de couleurs ou de message. nous discuterons des options, des quantités et des détails de la commande avec toi.", alt: "bougies décorées de fleurs séchées, coquillages et rubans colorés pour un cadeau de groupe" },
    },
  },
] as const;

export const eventPageCopy: Record<ProductLocale, { title: string; intro: string; detail: string; back: string; plan: string }> = {
  pt: { title: "eventos", intro: "encomendas maiores para aniversários, batizados, crismas e lembranças. criamos os teus presentes e detalhes para celebrar em conjunto.", detail: "escolhe uma ocasião para veres as fotografias e saberes mais sobre a encomenda.", back: "voltar aos eventos", plan: "vamos preparar a tua encomenda?" },
  en: { title: "events", intro: "larger orders for birthdays, baptisms, confirmations and keepsakes. gifts and details made to celebrate together.", detail: "choose an occasion to see the photographs and learn more about the order.", back: "back to events", plan: "shall we plan your order?" },
  fr: { title: "événements", intro: "commandes en quantité pour anniversaires, baptêmes, confirmations et souvenirs. des cadeaux et des détails pour célébrer ensemble.", detail: "choisis une occasion pour voir les photographies et découvrir la commande.", back: "retour aux événements", plan: "préparons ta commande ?" },
};
