import type { ProductLocale } from "@/content/product-locales";

/**
 * Real customer feedback for @lu.crescente, transcribed directly from
 * Jonas's own Instagram highlight screenshots (2026-09-16) plus a first pass
 * from an earlier Apify scrape. Quotes are the client's own message text
 * only — brand-authored captions/replies around each screenshot are
 * excluded, which is also why no names/handles appear here: the initials
 * the brand sometimes adds in its own caption ("a mensagem da V...") aren't
 * part of the client's words, so they're simply not carried over.
 * Some quotes are trimmed to their relevant part (the brand shortened five of
 * them on 2026-09-25) — cut down, never reworded, and the `translations` below
 * are cut to match so the three locales say the same thing.
 * `verbatim: false` entries are paraphrased — no exact wording was captured
 * for those, so they're rendered without quote marks instead of inventing a
 * fake first-person line.
 * `year` is a best-effort date (from a visible highlight/story timestamp
 * where available).
 *
 * `quoteLang` is the language the client actually wrote in (pt for almost
 * all, fr for the two international orders). `translations` holds this
 * quote translated into the *other* two site locales, so every feedback is
 * readable regardless of which language a visitor picks — the client's own
 * original wording (in `quote`) is always what's shown for `quoteLang`.
 * `product` is brand-authored (not the client's words), so it only needs a
 * plain per-locale translation via `productTranslations`.
 */
export type Testimonial = {
  id: string;
  quote: string;
  quoteLang: ProductLocale;
  translations?: Partial<Record<ProductLocale, string>>;
  product: string;
  productTranslations?: Partial<Record<ProductLocale, string>>;
  stars: number;
  year?: number;
  verbatim?: boolean;
};

export function getTestimonialCopy(item: Testimonial, locale: ProductLocale): { quote: string; product: string } {
  const quote = locale === item.quoteLang ? item.quote : (item.translations?.[locale] ?? item.quote);
  const product = locale === "pt" ? item.product : (item.productTranslations?.[locale] ?? item.product);
  return { quote, product };
}

/**
 * Authored grouped by product, because that is how they are collected and
 * edited. What the site shows is `testimonials` below, which interleaves these
 * so two feedbacks about the same product never sit side by side.
 */
const collected: Testimonial[] = [
  {
    id: "spray-relax-kit",
    quote: "amei cada produto! recomendo 5*",
    quoteLang: "pt",
    translations: { en: "loved every product! 5* recommend", fr: "j'ai adoré chaque produit ! je recommande 5*" },
    product: "spray relaxante, roll-on relax e batom herpes",
    productTranslations: { en: "relaxing spray, relaxation roll-on and cold sore balm", fr: "spray relaxant, roll-on relaxation et baume boutons de fièvre" },
    stars: 5,
    year: 2026,
  },
  {
    id: "sabonete-cheiro-natureza",
    quote: "Aquele bom cheiro e bemfeitos da natureza. Muito obrigada à lucrescente.",
    quoteLang: "pt",
    translations: {
      en: "That lovely scent and the good things nature makes. Thank you so much, lucrescente.",
      fr: "Cette belle odeur et les bienfaits de la nature. Merci beaucoup à lucrescente.",
    },
    product: "sabonete",
    productTranslations: { en: "soap", fr: "savon" },
    stars: 5,
  },
  {
    id: "envio-franca",
    quote: "Cc ma beauté, j'ai reçu le colis ça sent trop trop bon merci beaucoup! Demain je te biperais pour plus d'info.",
    quoteLang: "fr",
    translations: {
      en: "Hey gorgeous, I got the package, it smells so so good, thank you so much! I'll message you tomorrow for more info.",
      pt: "oi linda, recebi a encomenda, cheira mesmo muito bem, muito obrigada! amanhã dou-te mais informações.",
    },
    product: "encomenda internacional (frança)",
    productTranslations: { en: "international order (france)", fr: "commande internationale (france)" },
    stars: 5,
    year: 2025,
  },
  {
    id: "envio-franca-fevereiro",
    quote: "Colis bien reçu, c'est tellement mignon! Merci encore !!",
    quoteLang: "fr",
    translations: {
      en: "Package received, it's so cute! Thanks again!!",
      pt: "encomenda bem recebida, é tão gira! obrigada mais uma vez!!",
    },
    product: "encomenda internacional (frança)",
    productTranslations: { en: "international order (france)", fr: "commande internationale (france)" },
    stars: 5,
    year: 2024,
  },
  {
    id: "roll-on-respiratorio",
    quote: "Já usei o roll on respiratório!! Já expectorei e tudo. Coloquei no peito, na base e laterais das narinas.",
    quoteLang: "pt",
    translations: {
      en: "I've already used the respiratory roll-on!! I've even expectorated. I put it on my chest, and around the base and sides of my nostrils.",
      fr: "J'ai déjà utilisé le roll-on respiratoire !! J'ai même expectoré. Je l'ai mis sur la poitrine, à la base et sur les côtés des narines.",
    },
    product: "roll-on para sinusite",
    productTranslations: { en: "sinus roll-on", fr: "roll-on sinus" },
    stars: 5,
    year: 2025,
  },
  {
    id: "sabonete-rosto",
    quote: "Adoro o sabonete para a cara! Nota-se mesmo a diferença, deixa a cara super limpinha e muito macia, amooooo.",
    quoteLang: "pt",
    translations: {
      en: "I love the face soap! You can really tell the difference, it leaves my face super clean and really soft, I loooove it.",
      fr: "J'adore le savon pour le visage ! On sent vraiment la différence, il laisse la peau super propre et très douce, j'aaadore.",
    },
    product: "sabonete de rosto",
    productTranslations: { en: "face soap", fr: "savon pour le visage" },
    stars: 5,
    year: 2025,
  },
  {
    id: "sabonete-rosto-must",
    quote: "O sabonete de rosto para mim já é um must, gosto muito x)",
    quoteLang: "pt",
    translations: {
      en: "The face soap is already a must for me, I really like it x)",
      fr: "Le savon pour le visage est déjà un indispensable pour moi, j'aime beaucoup x)",
    },
    product: "sabonete de rosto",
    productTranslations: { en: "face soap", fr: "savon pour le visage" },
    stars: 5,
  },
  {
    id: "champo-dermatite",
    quote:
      "comprei um champô sólido para o couro cabeludo sensível que adorei, tinha imensa dermatite e desde que o uso não voltei a ter.",
    quoteLang: "pt",
    translations: {
      en: "I bought a solid shampoo for sensitive scalp that I loved — I had a lot of dermatitis and since using it I haven't had it again.",
      fr: "j'ai acheté un shampoing solide pour cuir chevelu sensible que j'ai adoré, j'avais beaucoup de dermatite et depuis que je l'utilise je n'en ai plus eu.",
    },
    product: "champô sólido para cabelos secos",
    productTranslations: { en: "solid shampoo for dry hair", fr: "shampoing solide pour cheveux secs" },
    stars: 5,
    year: 2025,
  },
  {
    id: "roll-on-dores-de-cabeca",
    quote: "O meu namorado já utilizou e resultou.",
    quoteLang: "pt",
    translations: { en: "My boyfriend has already used it and it worked.", fr: "Mon copain l'a déjà utilisé et ça a marché." },
    product: "roll-on dor de cabeça",
    productTranslations: { en: "head roll-on", fr: "roll-on tête" },
    stars: 5,
    year: 2025,
  },
  {
    id: "roll-on-relax",
    quote: "tenho gostado muito! Principalmente o roll-on relax é incrível, relaxa mesmo muito, principalmente quando estou com ansiedade e mais nervosa.",
    quoteLang: "pt",
    translations: {
      en: "I've been really enjoying it! Especially the relax roll-on, it's amazing, it really relaxes me a lot, especially when I'm anxious and more nervous.",
      fr: "j'aime beaucoup ! Surtout le roll-on relax, il est incroyable, il détend vraiment beaucoup, surtout quand je suis anxieuse et plus nerveuse.",
    },
    product: "roll-on relax",
    stars: 5,
    year: 2025,
  },
  {
    id: "roll-on-relax-presente",
    quote:
      "Eu comprei convosco um roll-on terapêutico relax, e queria comprar outro — é para uma pessoa muito querida minha que tem muitos problemas com ansiedade e stress, experimentou o meu e adorou.",
    quoteLang: "pt",
    translations: {
      en: "I bought a therapeutic relax roll-on from you, and I'd like to buy another one — it's for someone very dear to me who has a lot of problems with anxiety and stress. She tried mine and loved it.",
      fr: "J'ai acheté chez vous un roll-on thérapeutique relax, et j'aimerais en racheter un autre — c'est pour quelqu'un de très cher à moi qui a beaucoup de soucis d'anxiété et de stress. Elle a essayé le mien et a adoré.",
    },
    product: "roll-on relax",
    stars: 5,
  },
  {
    id: "balsamo-labial-noite",
    quote: "Adorei! Ponho todos os dias antes de dormir e de manhã ainda tenho. Fico com os lábios mega suaves. Até durante o dia.",
    quoteLang: "pt",
    translations: {
      en: "I loved it! I put it on every night before bed and in the morning I still have it on. My lips stay super soft. Even during the day.",
      fr: "J'ai adoré ! Je le mets tous les soirs avant de dormir et le matin j'en ai encore. Mes lèvres restent super douces. Même pendant la journée.",
    },
    product: "batom",
    productTranslations: { en: "lip balm", fr: "baume à lèvres" },
    stars: 5,
  },
  {
    id: "balsamo-labial-hidratacao",
    quote: "Adoro a hidratação que ele deixa nos lábios! Anda sempre comigo e quando estou aflita vou logo meter e é impecável!!!",
    quoteLang: "pt",
    translations: {
      en: "I love the hydration it leaves on my lips! It's always with me, and whenever I'm desperate I put it on right away and it's flawless!!!",
      fr: "J'adore l'hydratation qu'il laisse sur mes lèvres ! Il m'accompagne toujours et quand j'en ai vraiment besoin je le mets tout de suite, c'est impeccable !!!",
    },
    product: "batom",
    productTranslations: { en: "lip balm", fr: "baume à lèvres" },
    stars: 5,
  },
  {
    id: "balsamo-e-sabonete",
    quote: "Adorei o bálsamo labial e o sabãozinho para a cara. Já recomendei a várias pessoas.",
    quoteLang: "pt",
    translations: {
      en: "I loved the lip balm and the little face soap. I've already recommended them to several people.",
      fr: "J'ai adoré le baume à lèvres et le petit savon pour le visage. Je les ai déjà recommandés à plusieurs personnes.",
    },
    product: "batom e sabonete de rosto",
    productTranslations: { en: "lip balm and face soap", fr: "baume à lèvres et savon pour le visage" },
    stars: 5,
  },
  {
    id: "desodorizante-corpo",
    quote: "Ainda só experimentei o desodorizante e estou a adorar. Quando acabar quero mais, pois gosto da qualidade e a aceitação do meu corpo.",
    quoteLang: "pt",
    translations: {
      en: "I've only tried the deodorant so far and I'm loving it. When it runs out I want more, because I like the quality and how well my body takes to it.",
      fr: "Je n'ai encore essayé que le déodorant et j'adore. Quand il sera fini j'en veux d'autre, j'aime la qualité et la façon dont mon corps le supporte.",
    },
    product: "desodorizante",
    productTranslations: { en: "deodorant", fr: "déodorant" },
    stars: 5,
  },
  {
    id: "desodorizante-amostra",
    quote: "Já recebi as coisas!!! Obrigada, e vou experimentar o desodorizante!!! Assim que abri a caixa saiu um cheirinho maravilhoso.",
    quoteLang: "pt",
    translations: {
      en: "I already got the things!!! Thank you, and I'm going to try the deodorant!!! As soon as I opened the box a wonderful little scent came out.",
      fr: "J'ai déjà reçu les produits !!! Merci, et je vais essayer le déodorant !!! Dès que j'ai ouvert la boîte une odeur merveilleuse s'en est dégagée.",
    },
    product: "desodorizante",
    productTranslations: { en: "deodorant", fr: "déodorant" },
    stars: 5,
  },
  {
    id: "desodorizante-recompra",
    quote: "Ainda tenho algum desodorizante, mas já não o dispenso, então preferi encomendar já outro.",
    quoteLang: "pt",
    translations: {
      en: "I still have some deodorant left, but I can't do without it anymore, so I'd rather order another one already.",
      fr: "J'ai encore un peu de déodorant, mais je ne peux plus m'en passer, alors j'ai préféré déjà en recommander un autre.",
    },
    product: "desodorizante",
    productTranslations: { en: "deodorant", fr: "déodorant" },
    stars: 5,
  },
  {
    id: "desodorizantes-par",
    quote: "Adorei os desodorizantes os dois.",
    quoteLang: "pt",
    translations: { en: "I loved both deodorants.", fr: "J'ai adoré les deux déodorants." },
    product: "desodorizante lavanda/palmarosa e desodorizante tea-tree/erva-príncipe",
    productTranslations: {
      en: "lavender/palmarosa and lemon verbena/tea tree deodorants",
      fr: "déodorants lavande/palmarosa et verveine citronnée/tea tree",
    },
    stars: 5,
  },
  {
    id: "encomenda-velas-filho",
    quote: "Já vi a encomenda, adorei tudo, fiquei deslumbrada com tudo e o meu filho ficou encantado com as velas, trabalho excelente.",
    quoteLang: "pt",
    translations: {
      en: "I've seen the order, I loved everything, I was amazed by it all, and my son was delighted with the candles — excellent work.",
      fr: "J'ai vu la commande, j'ai tout adoré, j'étais éblouie par tout et mon fils a été enchanté par les bougies, excellent travail.",
    },
    product: "velas",
    productTranslations: { en: "candles", fr: "bougies" },
    stars: 5,
  },
  {
    id: "vela-caneca-pintada",
    quote: "Adorei mesmo!!! Amei a vela ter sido feita na caneca que eu pintei, ainda mais especial ficou.",
    quoteLang: "pt",
    translations: {
      en: "I really loved it!!! I loved that the candle was made in the mug I painted, it made it even more special.",
      fr: "J'ai vraiment adoré !!! J'ai aimé que la bougie ait été faite dans la tasse que j'ai peinte, ça l'a rendue encore plus spéciale.",
    },
    product: "vela personalizada",
    productTranslations: { en: "custom candle", fr: "bougie personnalisée" },
    stars: 5,
  },
  {
    id: "champo-normal-amaciador",
    quote:
      "venho dar feedback no champô e no amaciador, tenho gostado muitoo, o champô faz uma limpeza muito boa, nem sinto a necessidade de passar duas vezes como às vezes sentia antes, e o amaciador deixa o cabelo macio, gostei!",
    quoteLang: "pt",
    translations: {
      en: "I'm here to give feedback on the shampoo and conditioner, I've been liking them a looot, the shampoo cleans really well, I don't even feel the need to wash twice like I sometimes did before, and the conditioner leaves my hair soft, I liked it!",
      fr: "je viens donner mon avis sur le shampoing et l'après-shampoing, j'aime beaucoup, le shampoing nettoie très bien, je ne ressens même plus le besoin de laver deux fois comme parfois avant, et l'après-shampoing laisse les cheveux doux, j'ai aimé !",
    },
    product: "champô sólido para cabelos normais e amaciador",
    productTranslations: { en: "solid shampoo for normal hair and conditioner", fr: "shampoing solide pour cheveux normaux et après-shampoing" },
    stars: 5,
  },
  {
    id: "champo-fortalecimento",
    quote: "Já tenho usado! Gosto muito. Uso todos os dias da semana. Em breve irei adquirir mais, se tiver disponível!",
    quoteLang: "pt",
    translations: {
      en: "I've been using it! I like it a lot. I use it every day of the week. I'll be getting more soon, if it's available!",
      fr: "Je l'utilise déjà ! J'aime beaucoup. Je l'utilise tous les jours de la semaine. Je vais bientôt en racheter, si c'est disponible !",
    },
    product: "champô sólido para queda de cabelo (em estudo)",
    productTranslations: {
      en: "solid shampoo for hair loss (in development)",
      fr: "shampoing solide pour la chute de cheveux (en développement)",
    },
    stars: 5,
  },
  {
    id: "champo-oleoso-espuma",
    quote: "adorei o champô! Faz muita espuma, cheira muito bem e sentimos mesmo o cabelo lavado! Comprei mais um porque o outro está quase a acabar.",
    quoteLang: "pt",
    translations: {
      en: "I loved the shampoo! It lathers a lot, smells really good, and my hair really feels washed! I bought another one because the other is almost finished.",
      fr: "j'ai adoré le shampoing ! Il mousse beaucoup, sent très bon et on sent vraiment les cheveux lavés ! J'en ai racheté un car l'autre est presque fini.",
    },
    product: "champô sólido para cabelos oleosos",
    productTranslations: { en: "solid shampoo for oily hair", fr: "shampoing solide pour cheveux gras" },
    stars: 5,
  },
  {
    id: "champo-oleoso-leve",
    quote: "Adorei o shampoo! O cabelo ficou limpo e sem sensação de pesar!",
    quoteLang: "pt",
    translations: {
      en: "I loved the shampoo! My hair felt clean and with no heavy feeling!",
      fr: "J'ai adoré le shampoing ! Les cheveux étaient propres et sans sensation de lourdeur !",
    },
    product: "champô sólido para cabelos oleosos",
    productTranslations: { en: "solid shampoo for oily hair", fr: "shampoing solide pour cheveux gras" },
    stars: 5,
  },
  {
    id: "amaciador-suave",
    quote: "finalmente experimentei o amaciador, gostei muito, o meu cabelo ficou super suave e hidratado.",
    quoteLang: "pt",
    translations: {
      en: "I finally tried the conditioner, I liked it a lot, my hair felt super soft and hydrated.",
      fr: "j'ai enfin essayé l'après-shampoing, j'ai beaucoup aimé, mes cheveux étaient super doux et hydratés.",
    },
    product: "amaciador",
    productTranslations: { en: "conditioner", fr: "après-shampoing" },
    stars: 5,
  },
  {
    id: "mascara-capilar-inspiracao",
    quote: "Em breve já necessito de mais máscara. Adorei!! Adoro uma boa marca autêntica assim como a sua.",
    quoteLang: "pt",
    translations: {
      en: "I'll soon need more of the hair mask. I loved it!! I love a good, authentic brand like yours.",
      fr: "Je vais bientôt avoir besoin de plus de masque. J'ai adoré !! J'adore une marque aussi authentique que la vôtre.",
    },
    product: "máscara capilar",
    productTranslations: { en: "hair mask", fr: "masque capillaire" },
    stars: 5,
  },
  {
    id: "batom-herpes",
    quote:
      "O meu pai já tinha colocado um creme e só depois é que colocou o batom, mas disse que no dia seguinte já estava com crosta. Nem deu para notar que tinha alguma coisa. A minha mãe colocou logo e no dia seguinte já estava a sarar. Além disso, disse que também estava a começar a ficar com os lábios gretados e que era um ótimo hidratante.",
    quoteLang: "pt",
    translations: {
      en: "My dad had already put on a cream, and only used the balm afterwards, but he said that by the next day it had already scabbed over. You could barely tell there was anything there. My mom put it on right away, and by the next day it was already healing. She also said her lips were starting to get chapped, and that it was a great moisturiser.",
      fr: "Mon père avait déjà mis une crème, et ce n'est qu'après qu'il a mis le baume, mais il a dit que dès le lendemain il avait déjà une croûte. On ne voyait presque plus rien. Ma mère l'a mis tout de suite et dès le lendemain ça guérissait déjà. En plus, elle a dit qu'elle commençait aussi à avoir les lèvres gercées et que c'était un excellent hydratant.",
    },
    product: "batom herpes",
    productTranslations: { en: "cold sore balm", fr: "baume boutons de fièvre" },
    stars: 5,
    year: 2026,
  },
];

/**
 * The family a feedback belongs to, for spreading purposes: the first word of
 * the product, minus a plural. Grouping on the full product name is too strict
 * to be useful — "velas" and "vela personalizada" are different strings but the
 * same thing to someone reading the strip, as are five differently worded
 * shampoos — and a reader notices the family, not the exact label.
 */
function productFamily(item: Testimonial): string {
  return item.product.toLowerCase().split(/[\s,/]/)[0].replace(/s$/, "");
}

/**
 * Interleave so no two neighbours are about the same kind of product: take from
 * whichever family still has the most feedback left, skipping the one just
 * placed. Doing it here rather than by hand-ordering the list above means it
 * keeps holding as feedback is added — and it only fails to separate a family
 * that on its own accounts for more than half the list, which would be a
 * different problem.
 *
 * The longest quote is pinned last, so the strip does not open on the biggest
 * wall of text; it is also what sets every card's height.
 */
function spreadByProduct(list: Testimonial[]): Testimonial[] {
  if (list.length < 3) return [...list];

  const longest = list.reduce((a, b) => (b.quote.length > a.quote.length ? b : a));
  const byProduct = new Map<string, Testimonial[]>();
  for (const item of list) {
    if (item === longest) continue;
    const family = productFamily(item);
    const bucket = byProduct.get(family);
    if (bucket) bucket.push(item);
    else byProduct.set(family, [item]);
  }

  const spread: Testimonial[] = [];
  for (;;) {
    const available = [...byProduct.entries()]
      .filter(([, items]) => items.length > 0)
      .sort((a, b) => b[1].length - a[1].length);
    if (!available.length) break;
    const last = spread[spread.length - 1];
    const previous = last ? productFamily(last) : undefined;
    const pick = available.find(([family]) => family !== previous) ?? available[0];
    spread.push(pick[1].shift()!);
  }

  return [...spread, longest];
}

export const testimonials: Testimonial[] = spreadByProduct(collected);
