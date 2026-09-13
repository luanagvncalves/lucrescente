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
    tagline: "feito à mão, com amor 🌱",
    description:
      "marca portuguesa de higiene e beleza natural, feita à mão em casa, em pequenas quantidades.",
    instagram: "https://www.instagram.com/lu.crescente/",
    instagramHandle: "@lu.crescente",
    phoneDisplay: "+351 913 161 464",
    phoneTel: "tel:+351913161464",
    sms: "sms:+351913161464",
    whatsapp: "https://wa.me/351913161464",
    email: "luanagvncalves@gmail.com",
  },
  nav: {
    home: "início",
    products: "produtos",
    ingredients: "ingredientes",
    about: "sobre nós",
    care: "cuidados & sustentabilidade",
    cart: "carrinho", // ui
    openMenu: "abrir menu", // ui
    closeMenu: "fechar menu", // ui
    skipToContent: "saltar para o conteúdo", // ui
  },
  home: {
    heroLabel: "feito à mão, com carinho",
    heroTitle: "cuidados simples, feitos com amor e ingredientes que confiamos.",
    heroSubtitle:
      "cá em casa, cada produto começa por um ingrediente que conhecemos bem — e adoramos partilhar essa história contigo antes de ele chegar à tua pele.",
    heroPrimary: "vem conhecer os nossos ingredientes",
    heroSecondary: "ver todos os produtos",
    featuredTitle: "os nossos preferidos do momento",
    cardLink: "vem espreitar →",
    productsTitle: "cuidados para os teus dias",
    productsSubtitle:
      "bálsamos, champôs, velas decoradas e muito mais, feitos à mão com ingredientes escolhidos com cuidado.",
    productsButton: "ver todos os produtos",
    valuesTitle: "o que nos guia",
    valuesSubtitle:
      "ingredientes escolhidos com atenção, menos desperdício e espaço para cada pessoa cuidar à sua maneira.",
    values: ["feito à mão", "ingredientes honestos", "menos desperdício"],
    storyTitle: "uma marca pequena, feita com intenção",
    storyText:
      "A Lucrescente nasceu do desejo de tornar o cuidado diário mais simples e mais próximo. Conhecemos os ingredientes, explicamos o que fazem e fazemos cada produto em pequenas quantidades.",
    storyLink: "conhecer a nossa história →",
    ingredientsTitle: "os ingredientes que usamos, um a um",
    ingredientsSubtitle:
      "cada um tem a sua história e o seu propósito. escolhe um e vem descobrir de onde vem e para que serve 🌿",
    ingredientsLink: "ver todos os ingredientes →", // ui
    contactTitle: "encomendas com calma",
    contactText:
      "Preparamos cada pedido com cuidado e reutilizamos sempre que podemos. Para dúvidas, ingredientes ou encomendas especiais, fala connosco.",
    contactButtons: {
      call: "Chamada",
      sms: "Mensagem normal",
      whatsapp: "Mensagem WhatsApp",
      email: "Email",
    },
    shortAbout:
      "Tudo é feito à mão. Priorizamos a reutilização, por isso as nossas embalagens são feitas com objetos reaproveitados. Adaptamos cada produto a cada pessoa e podes trazer um recipiente que já tenhas em casa para fazermos o teu produto lá dentro.",
  },
  footer: {
    line: "lucrescente — feito à mão, com amor 🌱",
    contactsTitle: "contactos", // ui
    pagesTitle: "páginas", // ui
    shipping: "Envios nacionais e internacionais por encomenda. Quantidades maiores por encomenda (ex.: máscara capilar de 600 g)",
  },
  products: {
    label: "feitos à mão, um a um",
    title: "os nossos produtos",
    allCategories: "todos", // ui
    filterLabel: "categorias", // ui
    whyItWorks: "porque funciona",
    mainIngredients: "ingredientes principais",
    noIngredientsListed:
      "a lista de ingredientes deste produto ainda não está publicada. fala connosco para saber mais.", // ui
    noCopy: "a história deste produto ainda está a ser escrita cá em casa.", // ui
    price: "preço", // ui
    onRequest: "por encomenda",
    talkToUs: "fala connosco →",
    soldOut:
      "esgotado por agora. os produtos sólidos precisam de tempo de maturação, fala connosco para encomendar", // ui
    soldOutShort: "esgotado por agora", // ui
    addToCart: "adicionar ao carrinho", // ui
    added: "adicionado ao carrinho", // ui
    quantity: "quantidade", // ui
    variant: "formato", // ui
    stockLeft: (n: number) => (n === 1 ? "só resta 1 unidade" : `restam ${n} unidades`), // ui
    solidNote:
      "Champôs, amaciadores e sabonetes são sólidos e feitos sem água; precisam de tempo de maturação, por isso podem esgotar",
    reuseNote:
      "trouxeste uma embalagem antiga? fala connosco para o desconto de reutilização", // brief text
    candleNote:
      "E se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
    deodorantFact: "Os desodorizantes NÃO são antitranspirantes: sem alumínio, sem álcool",
    backToCatalog: "← voltar aos produtos", // ui
    relatedTitle: "da mesma família", // ui
    usedInTitle: "onde usamos este ingrediente", // ui
    emptyCategory: "ainda não há produtos nesta categoria. fala connosco para saber o que vem aí.", // ui
    organicNote: "* ingrediente biológico",
  },
  ingredients: {
    label: "de origem vegetal e mineral",
    title: "os ingredientes que usamos, um a um",
    subtitle:
      "cada um tem a sua história e o seu propósito. escolhe um e vem descobrir de onde vem e para que serve 🌿",
    allCategories: "todos", // ui
    sections: {
      scientificName: "Nome Científico",
      origin: "Origem",
      properties: "Propriedades",
      applications: "Aplicações em Lucrescente",
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
      "A Lucrescente nasce do encontro entre o conhecimento científico das plantas e uma forma sensível e criativa de olhar para o quotidiano.",
    lucieName: "Lucie",
    lucieText:
      "Sou doutorada em Biologia e trago para a marca o conhecimento científico das plantas. O meu olhar atento, rigoroso e curioso orienta a escolha dos ingredientes e a criação das receitas da Lucrescente.",
    luanaName: "Luana",
    luanaText:
      "Sou estudante de Artes Plásticas e trago para a marca o cuidado estético, a criatividade e a sensibilidade. Penso na forma como cada produto é apresentado, sentido e integrado nos pequenos rituais do dia a dia.",
    close: "Entre nós, a ciência encontra a expressão e cada produto ganha uma história própria.",
    backLink: "voltar à página inicial",
  },
  care: {
    label: "cuidados & sustentabilidade",
    title: "porque cada escolha pequena conta",
    intro:
      "Para além dos ingredientes, há uma forma de pensar por trás de cada produto lucrescente — mais natural, mais lenta e com menos desperdício. Aqui explicamos porquê.",
    chapters: [
      {
        slug: "poupamos-agua",
        title: "poupamos água",
        text: "Os nossos champôs, amaciadores e sabonetes são sólidos — não usamos água no fabrico. Na tua higiene diária, os produtos sólidos deixam muito menos resíduos e soltam-se mais facilmente do cabelo e da pele, por isso não precisas de gastar tanta água para te sentires limp@. E como os produtos sólidos não usam embalagens, também poupamos a água usada no fabrico de plástico.",
      },
      {
        slug: "embalagens",
        title: "embalagens e embrulhos reutilizados",
        text: "Todas as nossas embalagens são reutilizáveis. Se tiveres uma embalagem antiga (de um desodorizante, de uma máscara capilar, de uma vela), traz-nos e reutilizamo-la no teu próximo produto, com um desconto de reutilização. Os nossos embrulhos são cosidos à mão, com reutilização de tecidos — até o fio é feito de algodão e de outras fibras recicladas. Mais reutilização, menos desperdício.",
      },
      {
        slug: "velas",
        title: "as nossas velas",
        text: "As velas lucrescente são feitas com cera vegetal de soja, que derrete lenta e uniformemente — por isso duram mais tempo, sem desperdício de cera, e não têm derivados de petróleo nem fragrâncias sintéticas. Decoramos muitas com pétalas e flores secas, prensadas e preparadas por nós. E se preferires, podemos fazer as tuas velas nos teus próprios frascos, canecas ou taças — só precisas de nos entregar os recipientes.",
      },
      {
        slug: "feito-a-mao",
        title: "feito à mão, em pequenas quantidades",
        text: "Os produtos lucrescente são inteiramente fabricados a partir de ingredientes naturais, de forma artesanal, em pouca quantidade de cada vez — para garantir a qualidade das matérias-primas e o cuidado no fabrico. Alguns produtos podem ser repostos facilmente a cada dia; outros, como os champôs, os amaciadores e os sabonetes, precisam de mais repouso e maturação. Se algum destes produtos mais 'lentos' esgotar, aceitamos encomendas e fazemos envios nacionais e internacionais — e também podemos preparar quantidades maiores sempre que precisares.",
      },
      {
        slug: "desodorizantes",
        title: "os nossos desodorizantes",
        text: "Os nossos desodorizantes não são antitranspirantes e não têm alumínio nem álcool. É muito importante escolhermos um desodorizante saudável para a nossa pele — aplicado tão perto do corpo, não deve bloquear a transpiração nem obstruir os poros. Preferimos que respeitem o funcionamento natural da pele, controlando as bactérias e os maus cheiros de forma suave.",
      },
      {
        slug: "dicas",
        title: "dicas de uso",
        text: "Os nossos champôs sólidos também podem ser usados no corpo, sem problema nenhum — pelos ingredientes naturais e sem químicos, alguns até ajudam a acalmar problemas de pele, como a pele atópica. A cera de soja das nossas velas é hidratante e pode ser usada diretamente na pele. E se fores viajar, os produtos de higiene sólidos não têm embalagens nem quantidades limitadas — muito mais práticos e sem preocupações com líquidos de cabine.",
      },
      {
        slug: "biologicos",
        title: "ingredientes biológicos",
        text: "Sempre que possível, escolhemos ingredientes biológicos — e assinalamo-los com * na descrição dos produtos, para que tenhas mais e melhor informação sobre o que estás a usar.",
      },
      {
        slug: "cha",
        title: "chá para dias de período",
        text: "Em dias de período, o corpo precisa de mais cuidados — e como a saúde começa sempre por dentro, partilhamos esta receita para um chá relaxante e anti-inflamatório: hibisco, para combater a inflamação e reduzir o inchaço; uma colher de mel, para ajudar a relaxar e combater a presença de micróbios; um pau de canela, para combater a inflamação e relaxar os músculos uterinos; e cúrcuma em pó, também aliada no combate à inflamação. Podes ainda juntar gengibre, para reduzir as dores e a sensação de tontura ou enjoo.",
      },
    ],
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
    reuseNote:
      "trouxeste uma embalagem antiga? fala connosco para o desconto de reutilização",
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
    emailNote: (email: string) => `enviámos a confirmação para ${email}.`, // ui
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
    call: "Chamada",
    sms: "SMS",
    whatsapp: "WhatsApp",
    email: "Email",
  },
} as const;

export type Dictionary = typeof pt;
