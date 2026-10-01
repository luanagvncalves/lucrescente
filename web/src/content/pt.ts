/**
 * All site copy for the Portuguese locale.
 * Source: lucrescente-conteudo.md (verbatim). Strings marked `// ui` were written
 * for interface states that have no supplied copy; keep them short and honest.
 *
 * i18n: add `en.ts` / `fr.ts` with the same shape and register them in `src/lib/i18n.ts`.
 */
export const pt = {
  locale: "pt-PT",
  brand: {
    name: "lucrescente",
    // ♡, not the seedling emoji that used to sit here: emoji are drawn in
    // their own fixed colours, which fought the palette. these marks take the
    // colour of the text around them.
    tagline: "feito à mão, com amor ♡",
    description:
      "marca portuguesa de higiene e beleza natural, feita à mão em casa, em pequenas quantidades.",
    instagram: "https://www.instagram.com/lu.crescente/",
    instagramHandle: "@lu.crescente",
    phoneDisplay: "+351 913 161 464",
    phoneTel: "tel:+351913161464",
    sms: "sms:+351913161464",
    whatsapp: "https://wa.me/351913161464",
    email: "luanagvncalves@gmail.com",
    lucieEmail: "luciemota.bio@gmail.com",
    luciePhonePTDisplay: "+351 911 120 753",
    luciePhonePTTel: "tel:+351911120753",
    luciePhoneCHDisplay: "+41 77 279 56 44",
    luciePhoneCHTel: "tel:+41772795644",
  },
  nav: {
    home: "início",
    products: "produtos",
    ingredients: "ingredientes",
    about: "sobre nós",
    feedback: "feedbacks",
    cart: "carrinho", // ui
    openMenu: "abrir menu", // ui
    closeMenu: "fechar menu", // ui
    skipToContent: "saltar para o conteúdo", // ui
    homeLink: "lucrescente, página inicial", // ui
    breadcrumb: "caminho", // ui
    mainNav: "principal", // ui
    mainNavMobile: "principal (móvel)", // ui
    dismissNotice: "fechar aviso", // ui
  },
  home: {
    heroLabel: "feito à mão, com carinho",
    // the three line breaks are deliberate: the hero sets this sentence in
    // three lines (see HomeHero), and types it out one line at a time
    heroTitle: "cuidados simples,\nfeitos com amor e com\ningredientes de confiança.",
    heroPrimary: "ver todos os produtos",
    heroSecondary: "ver todos os ingredientes",
    featuredTitle: "os nossos preferidos do momento",
    cardLink: "vem espreitar →",
    productsTitle: "cuidados para os teus dias",
    productsSubtitle:
      "bálsamos, champôs, velas decoradas e muito mais, feitos à mão com ingredientes escolhidos com cuidado.",
    productsButton: "ver todos os produtos",
    featuredMoreLink: "ver mais",
    valuesTitle: "o que nos guia",
    valuesSubtitle:
      "ingredientes escolhidos com atenção, menos desperdício e espaço para cada pessoa cuidar à sua maneira.",
    values: ["feito à mão", "ingredientes honestos", "menos desperdício"],
    storyTitle: "uma marca pequena, feita com intenção",
    storyText:
      "a lucrescente começou como um projeto completamente familiar (muito antes de ser sequer um projeto) e foi crescendo, aos poucos, até chegar a mais pessoas. conhecemos os ingredientes, contamos a história de cada um, e continuamos a fazer tudo em pequenas quantidades, com o mesmo carinho do primeiro dia.",
    storyLink: "conhecer a nossa história →",
    ingredientsTitle: "os ingredientes que usamos, um a um",
    ingredientsSubtitle:
      "cada um tem a sua história e o seu propósito. escolhe um e vem descobrir de onde vem e para que serve.",
    ingredientsLink: "ver todos os ingredientes", // ui
    contactTitle: "encomenda os teus produtos",
    contactText: "para dúvidas, personalizações ou encomendas especiais, contacta-nos.",
    contactButtons: {
      call: "chamada",
      sms: "mensagem normal",
      whatsapp: "mensagem whatsapp",
      email: "email",
    },
    categoryGroupHigiene: "higiene",
    categoryGroupBeleza: "beleza",
    categoryGroupBemEstar: "bem-estar",
    shortAbout:
      "produtos de higiene, beleza e bem-estar feitos à mão por mãe e filha, para um cuidado pessoal mais saudável e personalizado.",
    testimonialsLabel: "quem já experimentou",
    testimonialsTitle: "os vossos comentários",
    testimonialsSubtitle: "recebidos na nossa caixa de mensagens ao longo dos anos, escritos por vocês.",
    testimonialsPrev: "feedback anterior", // ui
    testimonialsNext: "feedback seguinte", // ui
    showMore: "ver mais",
    showLess: "ver menos",
  },
  footer: {
    // the waxing moon of the name, doing the work the dash used to do
    line: "lucrescente ☾ feito à mão, com amor",
    contactsTitle: "contactos", // ui
    pagesTitle: "páginas", // ui
    shipping: "envios nacionais e internacionais por encomenda. quantidades maiores por encomenda.",
    returnsSummary: "produto errado ou danificado? tens 14 dias para nos dizer, e o envio de volta é por nossa conta.", // ui
    returnsLink: "ler a política de devoluções →", // ui
  },
  products: {
    label: "feitos à mão, um a um",
    title: "os nossos produtos",
    allCategories: "todos", // ui
    filterLabel: "categorias", // ui
    scrollLeft: "ver categorias anteriores", // ui
    scrollRight: "ver categorias seguintes", // ui
    whyItWorks: "porque funciona",
    // the candles answer a different question from every other product: not
    // "porque funciona" but "porquê estas e não as do supermercado"
    candleCaseLabel: "porque funcionam",
    candleCase:
      "a parafina é um resto da refinação do petróleo que, ao arder, liberta fuligem e compostos tóxicos que ficam no ar e que danificam os nossos pulmões. as velas de cera de soja ardem mais devagar e uniformemente (sem criar túneis) e nunca alcançam temperaturas tão elevadas quanto as de parafina. também não libertam fuligem, e não contêm qualquer tipo de componente tóxico ou sintético! o aroma vem de óleos essenciais e nunca de fragrâncias sintéticas, e a decoração é natural: flores e folhas secas, conchas e pedrinhas.",
    candleOrder: "basta mandar-nos mensagem para encomendar!",
    hairTypeNote: "para que tipo de cabelo",
    // the optional flavour oil on the coloured lip balms
    flavourLabel: "óleo essencial",
    flavourNone: "sem óleo",
    quantityPlaceholder: "quantos ambientadores queres?", // ui
    flavourHint: "laranja doce: aroma doce e cítrico. hortelã-pimenta: sensação fresca nos lábios.",
    deodorantFact: "aplica uma camada fina em pele limpa e seca: com o calor do corpo espalha-se melhor.",
    solidNote: "produto sólido, sem água na fórmula. guarda-o num sítio seco entre utilizações para durar mais tempo.",
    recommendedFor: "aconselhado para",
    notRecommendedFor: "não aconselhado para",
    mainIngredients: "ingredientes principais",
    allergenNoteLabel: "atenção",
    noIngredientsListed:
      "a lista de ingredientes deste produto ainda não está publicada. fala connosco para saber mais.", // ui
    noCopy: "a história deste produto ainda está a ser escrita cá em casa.", // ui
    noPhoto: "ainda sem fotografia", // ui
    galleryPrevious: "imagem anterior", // ui
    galleryNext: "próxima imagem", // ui
    galleryOf: (name: string) => `fotografias de ${name}`, // ui
    price: "preço", // ui
    onRequest: "por encomenda",
    talkToUs: "encomendar →",
    // one word, in both places it appears: beside the size inside a format
    // pill, and as the badge on a product card in the grid
    soldOutTag: "esgotado", // ui
    priceFrom: "desde ", // ui
    addToCart: "adicionar ao carrinho", // ui
    added: "adicionado ao carrinho", // ui
    quantity: "quantidade", // ui
    variant: "formato", // ui
    stockLeft: (n: number) => (n === 1 ? "só resta 1 unidade" : `restam ${n} unidades`), // ui
    orderMessage: (name: string) => `olá! gostava de encomendar: ${name}`, // ui
    backToCatalog: "← voltar aos produtos", // ui
    relatedTitle: "cria o teu conjunto", // ui
    relatedPrev: "produtos anteriores", // ui
    relatedNext: "produtos seguintes", // ui
    usedInTitle: "onde usamos este ingrediente", // ui
    emptyCategory: "ainda não há produtos nesta categoria. fala connosco para saber o que vem aí.", // ui
    organicNote: "* ingrediente biológico",
    // the scent picker on the air freshener and the made-to-order candles
    scentLabel: "aroma",
    scentHint: "escolhe até 2 óleos essenciais.",
    scentCombosLabel: "as escolhas mais populares",
    scentMaxReached: "já escolheste 2 óleos: tira um para trocar.",
    scentHarsh:
      "a canela é dos óleos essenciais mais agressivos para a pele. se a escolheres, não uses a cera derretida em massagens nem diretamente na pele.",
  },
  productInfo: {
    // deodorant feature chips
    notAntiperspirant: "não é antitranspirante",
    aluminiumFree: "sem alumínio",
    alcoholFree: "sem álcool",
    customisable: "personalizável",
    // expandable info panels
    waterSavingLabel: "menos água",
    waterSavingText:
      "não usamos água no fabrico deste produto. os produtos sólidos deixam muito menos resíduos e soltam-se mais facilmente do cabelo e da pele, por isso não precisas de gastar tanta água para te sentires limpe, e como não necessitam de embalagens, também poupamos a água usada no fabrico de plástico.",
    paperWrappedText:
      "embrulhamos todos os produtos em papel reutilizado, porque priorizamos a sustentabilidade e a produção consciente face ao consumo desnecessário.",
    skinSafeLabel: "seguros para a pele",
    skinSafeText:
      "os nossos champôs sólidos também podem ser usados no corpo, sem preocupações: pelos ingredientes naturais e por não terem químicos, podes desfrutar de um champô multifuncional todos os dias!",
    // per-product contact form
    contactTitle: "fala connosco sobre este produto",
    contactSuccess: "✓ mensagem enviada com sucesso! agradecemos o contacto.",
    contactError:
      "não conseguimos enviar a tua mensagem. tenta outra vez, ou escreve-nos diretamente para",
    contactName: "nome",
    contactNamePlaceholder: "como te chamas?",
    contactEmail: "email",
    contactEmailPlaceholder: "o teu email",
    contactMessage: "mensagem",
    contactMessagePlaceholder: "deixa-nos saber o que achas, dúvidas, pedidos especiais...",
    contactSend: "enviar",
    contactSending: "a enviar...",
  },
  ingredients: {
    label: "de origem vegetal e mineral",
    title: "os ingredientes que usamos, um a um",
    subtitle:
      "cada um tem a sua história e o seu propósito. escolhe um e vem descobrir de onde vem e para que serve",
    allCategories: "todos", // ui
    sections: {
      scientificName: "nome científico",
      origin: "origem",
      properties: "propriedades",
      applications: "aplicações em lucrescente",
    },
    backToIndex: "← voltar aos ingredientes", // ui
    productsUsing: "produtos com este ingrediente", // ui
    noProducts: "ainda não ligámos este ingrediente a um produto do catálogo.", // ui
    searchPlaceholder: "procurar um ingrediente", // ui
    noResults: "não encontrámos nenhum ingrediente com esse nome.", // ui
  },
  about: {
    label: "a nossa história",
    title: "duas formas de olhar para o cuidado",
    intro:
      "a lucrescente nasce do encontro entre o conhecimento científico das plantas e uma forma sensível e criativa de olhar para o quotidiano.",
    values: [
      "empresa familiar",
      "ecológica e sustentável",
      "segura para crianças e peles sensíveis",
      "sem disruptores endócrinos",
      "preços acessíveis para todes",
    ],
    lucieName: "lucie",
    lucieText:
      "sou doutorada em biociências, na área da agroecologia: os últimos anos foram passados mergulhada em girassóis, polinizadores e conservação da natureza. esse mesmo olhar atento, rigoroso e curioso orienta a escolha dos ingredientes e a criação de cada receita da lucrescente.",
    luanaName: "luana",
    luanaText:
      "estou no terceiro ano da licenciatura em artes plásticas e trago para a marca o cuidado estético, a criatividade e a sensibilidade. penso na forma como cada produto é apresentado, descrito e integrado nos pequenos rituais de cuidado do dia a dia.",
    close: "entre nós, a ciência encontra a expressão e cada produto ganha uma história própria.",
    backLink: "voltar à página inicial",
  },
  /**
   * Most answers here restate something the site says elsewhere — the product
   * copy, the hair-type notes, the allergen notes, the shipping tiers in
   * src/config/shipping.ts. Nothing about how long a bar lasts or which payment
   * methods are live: those are facts only the brand has, and a confident guess
   * would be worse than no answer.
   *
   * Two answers are the last copy of what they say, since "cuidados &
   * sustentabilidade" was folded in here and its page removed: the water that
   * making plastic would have taken under "porque é que os produtos são
   * sólidos?", and all of "de que são feitas as vossas velas?" bar the
   * anything else. Do not trim them as duplicates — nothing else on the site
   * carries them. The hand-sewn-wraps sentence was removed for good, everywhere,
   * at the brand's request — do not reintroduce it. Nor the offer to take back
   * packaging or to fill the customer's own containers: the brand only sells
   * products in its own new packaging and accepts no other, used or not.
   *
   * The questions the product pages link to are listed by their Portuguese
   * wording in content/faq-anchors.ts. Rewording one there and not here breaks
   * the link.
   */
  /**
   * The brand's own words, nothing added.
   *
   * The window is fourteen days, matching what EU distance selling gives a
   * customer, and a return is accepted whether the product was opened or is
   * still sealed. That answers the earlier worry — a flat "no returns" would
   * not have held for something that arrived and was never opened.
   *
   * Still narrower than the law: this covers a product that arrived wrong or
   * damaged, not someone who simply changed their mind. For an opened hygiene
   * product that exemption is solid; for one still sealed it is thinner.
   * Raised with the brand, and theirs to decide.
   */
  returns: {
    label: "devoluções",
    title: "se algo chegar mal",
    intro:
      "fazemos tudo à mão e embrulhamos com cuidado, mas o caminho até ti nem sempre corre bem. se correr mal, resolvemos.",
    groups: [
      {
        title: "quando aceitamos uma devolução",
        text: "aceitamos devoluções se receberes o produto errado, ou o produto certo mas danificado: um frasco partido, uma embalagem suja, ou um produto derretido ou quebrado. tanto faz se já o abriste ou se ainda está fechado: o que precisamos é de prova de que não está bom.",
      },
      {
        title: "quanto tempo tens",
        text: "depois de o produto chegar até ti, tens 14 dias para pedires a devolução.",
      },
      {
        title: "como pedir",
        text: "fala connosco por qualquer meio indicado no site: whatsapp, mensagem, chamada ou email. pedimos-te apenas um comprovativo: uma fotografia do produto como chegou, ou do produto errado que recebeste.",
      },
      {
        title: "quem paga o envio de volta",
        text: "nós. se a devolução for aceite, os portes de retorno são por nossa conta.",
      },
    ],
    contactTitle: "fala connosco",
  },
  faq: {
    label: "perguntas frequentes",
    title: "o que nos perguntam mais",
    intro:
      "as dúvidas que chegam mais vezes por mensagem, reunidas aqui. se a tua não estiver, escreve-nos: respondemos sempre.",
    groups: [
      {
        title: "os produtos",
        items: [
          {
            q: "qual dos champôs sólidos é para mim?",
            a: "temos quatro: para cabelos oleosos, secos e normais, e um neutro que serve também para crianças. o de cabelos secos é o que mais nos pedem as pessoas com o couro cabeludo sensível, e o neutro é o que aconselhamos a peles e couros cabeludos ultrassensíveis, porque não leva óleos essenciais na fórmula. se ficares na dúvida, diz-nos como é o teu cabelo e ajudamos a escolher!",
          },
          {
            q: "posso usar um champô sólido se pinto ou aliso o cabelo?",
            a: "podes, sim! todos os nossos champôs sólidos dão-se bem com cabelo pintado e com cabelo alisado. em cabelo descolorado não os aconselhamos, porque não têm efeito anti-amarelamento.",
          },
          {
            q: "como guardo os produtos sólidos?",
            a: "num sítio seco entre utilizações. não levam água na fórmula, e mantê-los longe da água quando não os estás a usar é o que mais os faz durar.",
          },
          {
            q: "os vossos desodorizantes são antitranspirantes?",
            a: "não, e fazemos questão de o dizer. não levam alumínio nem álcool, por isso não bloqueiam a transpiração nem entopem os poros: controlam as bactérias e os maus cheiros de forma suave, e deixam a pele fazer aquilo que ela já sabe fazer.",
          },
          {
            q: "tenho pele sensível. há alguma coisa a que deva prestar atenção?",
            a: "vários produtos levam óleos essenciais, que podem irritar ou causar reação alérgica em peles mais sensíveis, e os desodorizantes levam bicarbonato de sódio, que nalgumas peles irrita as axilas, sobretudo depois de uma depilação recente. assinalamos isto em cada produto, por baixo dos ingredientes. na dúvida, experimenta primeiro numa zona pequena da pele e fala connosco: podemos adaptar a fórmula.",
          },
          {
            q: "que produtos posso usar diretamente na pele?",
            a: "quase todos: as velas (menos as coloridas, que levam pigmento), os champôs, os ambientadores, os batons, os desodorizantes, os roll-ons, os sabonetes e o spray relaxante. os champôs sólidos servem também de sabonete, porque não levam químicos agressivos (o de cabelos secos tem sido usado por quem tem pele atópica), e a cera de soja das velas é hidratante, por isso também pode ir à pele. escolhemos os ingredientes a pensar nisso, mas a pele é tua e és tu quem a conhece melhor: se for sensível, experimenta primeiro numa zona pequena.",
          },
        ],
      },
      {
        title: "encomendas e envios",
        items: [
          {
            q: "fazem envios para fora de Portugal?",
            a: "fazemos! enviamos para todo o país e para o estrangeiro. o custo depende do destino, e vês o valor certo no final da compra, antes de confirmares.",
          },
          {
            q: "o produto que quero está esgotado. posso encomendar na mesma?",
            a: "podes, sim. fazemos tudo à mão e em pouca quantidade de cada vez, e alguns produtos (os champôs, os amaciadores e os sabonetes) precisam de tempo de repouso e maturação antes de seguirem. se esgotar, aceitamos a encomenda e avisamos-te assim que estiver pronta. e se precisares de uma quantidade maior, também preparamos!",
          },
          {
            q: "posso pedir um produto feito à minha medida?",
            a: "claro! adaptamos uma fórmula ao que precisas: mais suave, mais forte, ou com outro aroma. diz-nos o que tens em mente antes de encomendares e pensamos nisso contigo.",
          },
          {
            q: "posso devolver um produto?",
            a: "claro. se te chegar o produto errado, ou o certo mas estragado (um frasco partido, uma embalagem suja, um produto derretido ou quebrado), diz-nos: tanto faz se já o abriste ou não, só precisamos de uma fotografia para perceber o que aconteceu. tens 14 dias depois de o receberes e os portes de volta são por nossa conta. na página de devoluções está tudo explicado.",
          },
        ],
      },
      {
        title: "sustentabilidade",
        items: [
          {
            q: "porque é que os produtos são sólidos?",
            a: "porque cá por casa não usamos água no fabrico, e um produto sólido dispensa embalagem (o que poupa também a água que se gastaria a fazer esse plástico). no dia a dia deixam menos resíduo e soltam-se mais facilmente do cabelo e da pele, por isso gastas menos água a enxaguar. e para viajar são muito mais práticos: sem embalagem e sem limites de líquidos na cabine.",
          },
          {
            q: "de que são feitas as vossas velas?",
            a: "de cera de soja, que é vegetal. arde mais devagar e uniformemente (sem criar túneis) e nunca alcança temperaturas tão elevadas quanto a parafina das velas de supermercado, por isso dura mais tempo e não desperdiça cera. não liberta fuligem e não contém qualquer componente tóxico ou sintético. o aroma vem de óleos essenciais e nunca de fragrâncias sintéticas, e a decoração é natural: flores e folhas secas, conchas e pedrinhas, muitas delas prensadas e preparadas por nós.",
          },
        ],
      },
    ],
    stillAsking: "ficaste com uma dúvida que não está aqui?",
    contactLink: "fala connosco →",
  },
  cart: {
    title: "o teu carrinho", // ui
    empty: "o teu carrinho está vazio, por agora.", // ui
    emptyHint: "vem espreitar os produtos e escolhe com calma.", // ui
    browse: "ver produtos", // ui
    subtotal: "subtotal", // ui
    shippingNote: "os portes são calculados no passo seguinte, consoante o destino.", // ui
    checkout: "finalizar encomenda", // ui
    checkingOut: "a preparar o pagamento…", // ui
    remove: "remover", // ui
    increase: "mais uma unidade", // ui
    decrease: "menos uma unidade", // ui
    close: "fechar", // ui
    continue: "continuar a ver produtos", // ui
    viewCart: "ver carrinho", // ui
    cancelled: "o pagamento não foi concluído. o teu carrinho continua aqui, quando quiseres.", // ui
    stockAdjusted: (name: string, n: number) =>
      n === 0
        ? `${name} esgotou entretanto e foi retirado do carrinho.`
        : `de ${name} só conseguimos enviar ${n} por agora; ajustámos a quantidade.`, // ui
    maxReached: "não temos mais unidades disponíveis por agora.", // ui
    secure: "pagamento seguro através do Stripe", // ui
    itemsCount: (n: number) => (n === 1 ? "1 artigo" : `${n} artigos`), // ui
    errorTitle: "não conseguimos avançar", // ui
    errorGeneric: "algo falhou ao preparar o pagamento. tenta de novo daqui a pouco ou fala connosco.", // ui
    ok: "está bem", // ui
  },
  checkout: {
    title: "confirmar encomenda", // ui
    summary: "resumo da encomenda", // ui
    shippingTo: "envio para", // ui
     // ui
    paymentMethod: "método de pagamento", // ui
     // ui
    paymentNote: "podes pagar com cartão, MB WAY ou apple pay: escolhes no passo seguinte, na página segura do Stripe.", // ui
    
    
    
    
    
    
    continuePayment: "continuar para o pagamento", // ui
    subtotal: "subtotal", // ui
    shipping: "portes", // ui
    total: "total", // ui
    backToCart: "voltar ao carrinho", // ui
  },
  order: {
    title: "obrigada. recebemos a tua encomenda.", // ui
    message: "preparamos cada pedido com cuidado",
    detail:
      "vamos preparar tudo cá em casa e enviamos assim que estiver pronto. se tiveres alguma dúvida, fala connosco.", // ui
    summary: "resumo da encomenda", // ui
    reference: "referência", // ui
    shippingTo: "envio para", // ui
    shipping: "portes", // ui
    total: "total", // ui
    notFound: "não encontrámos esta encomenda. se acabaste de pagar, aguarda um momento e atualiza a página.", // ui
    processing: "estamos a confirmar o pagamento. isto pode demorar alguns segundos.", // ui
    backHome: "voltar à página inicial", // ui
    emailNote: (email: string) => `registámos o teu contacto: ${email}. falamos contigo por aqui sobre a tua encomenda.`, // ui
  },
  errors: {
    notFoundTitle: "não encontrámos esta página.", // ui
    notFoundText: "talvez tenha mudado de sítio. vem espreitar os produtos ou os ingredientes.", // ui
    genericTitle: "algo não correu bem.", // ui
    genericText: "tenta de novo daqui a pouco. se continuar, fala connosco.", // ui
    retry: "tentar de novo", // ui
  },
  contact: {
    title: "fala connosco", // ui
    call: "chamada",
    sms: "sms",
    whatsapp: "whatsapp",
    email: "email",
    otherMethods: "outros métodos", // ui
  },
} as const;

/**
 * `pt` is declared `as const` so editors/consumers get literal autocomplete,
 * but that also makes every string an exact literal type — which would force
 * en/fr to use the identical Portuguese text. `Widen` recursively relaxes
 * every string leaf back to `string` (structure/keys are still checked),
 * while leaving function-typed entries (e.g. `stockLeft`) untouched.
 */
type Widen<T> = T extends string
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : T extends object
        ? { [K in keyof T]: Widen<T[K]> }
        : T;

export type Dictionary = Omit<Widen<typeof pt>, "locale"> & { locale: string };
