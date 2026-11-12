/** Plena Natura product sheets checked 2026-11-12.
 * Country values are supplier-declared origins, never botanical native ranges.
 * Multiple countries/regions are preserved; unknown countries are not inferred.
 * INCI names use the EU glossary (Decision 2025/1175).
 * Yellow beeswax: supplier says Cera Flava; EU cosmetic name is Cera Alba.
 * No exact supplier match: use the glossary name for the identity already in the catalogue.
 * Cinnamon and iron oxide require the exact purchased reference before assigning INCI.
 */
export type IngredientIdentity = {
  inci: string;
  origin: Record<"pt" | "en" | "fr", string>;
  sources: string[];
};

export const ingredientIdentity: Record<string, IngredientIdentity> = {
  "oleo-de-coco": {
    "inci": "Cocos Nucifera Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/oleo-de-coco-virgem-organico-bio-cp/",
      "https://plena-natura.pt/product/oleo-de-coco-convencional-1-l-5-l/",
      "https://plena-natura.pt/product/oleo-de-coco-organico-bio/"
    ]
  },
  "oleo-de-ricino": {
    "inci": "Ricinus Communis Seed Oil",
    "origin": {
      "pt": "Índia",
      "en": "India",
      "fr": "Inde"
    },
    "sources": [
      "https://plena-natura.pt/product/oleo-de-ricino-mamona-castor-cp/"
    ]
  },
  "oleo-de-abacate": {
    "inci": "Persea Gratissima Oil",
    "origin": {
      "pt": "África do Sul",
      "en": "South Africa",
      "fr": "Afrique du Sud"
    },
    "sources": [
      "https://plena-natura.pt/product/oleo-de-abacate-cp/"
    ]
  },
  "oleo-vegetal-de-amendoas-doces": {
    "inci": "Prunus Amygdalus Dulcis Oil",
    "origin": {
      "pt": "Estados Unidos / Turquia",
      "en": "United States / Turkey",
      "fr": "États-Unis / Turquie"
    },
    "sources": [
      "https://plena-natura.pt/product/oleo-de-amendoas-doces/"
    ]
  },
  "oleo-vegetal-de-argao": {
    "inci": "Argania Spinosa Kernel Oil",
    "origin": {
      "pt": "Marrocos",
      "en": "Morocco",
      "fr": "Maroc"
    },
    "sources": [
      "https://plena-natura.pt/product/oleo-de-argan-argao-cp-organico-bio/"
    ]
  },
  "oleo-essencial-de-alecrim": {
    "inci": "Rosmarinus Officinalis Leaf Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-alecrim-qt-cineol": {
    "inci": "Rosmarinus Officinalis Leaf Oil",
    "origin": {
      "pt": "Norte de África — país não indicado",
      "en": "North Africa — country not specified",
      "fr": "Afrique du Nord — pays non précisé"
    },
    "sources": [
      "https://plena-natura.pt/product/alecrim-qt-cineol-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-bergamota": {
    "inci": "Citrus Aurantium Bergamia Fruit Oil",
    "origin": {
      "pt": "Reino Unido",
      "en": "United Kingdom",
      "fr": "Royaume-Uni"
    },
    "sources": [
      "https://plena-natura.pt/product/bergamota-fcf-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-camomila-romana": {
    "inci": "Anthemis Nobilis Flower Oil",
    "origin": {
      "pt": "Reino Unido",
      "en": "United Kingdom",
      "fr": "Royaume-Uni"
    },
    "sources": [
      "https://plena-natura.pt/product/camomila-romana-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-erva-principe": {
    "inci": "Cymbopogon Citratus Leaf Oil",
    "origin": {
      "pt": "Índia",
      "en": "India",
      "fr": "Inde"
    },
    "sources": [
      "https://plena-natura.pt/product/erva-principe-citratus/"
    ]
  },
  "oleo-essencial-de-erva-principe-citratus": {
    "inci": "Cymbopogon Citratus Leaf Oil",
    "origin": {
      "pt": "Índia",
      "en": "India",
      "fr": "Inde"
    },
    "sources": [
      "https://plena-natura.pt/product/erva-principe-citratus/"
    ]
  },
  "oleo-essencial-de-eucalipto-radiata": {
    "inci": "Eucalyptus Radiata Leaf/Stem Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-geranio-rosa": {
    "inci": "Pelargonium Graveolens Flower Oil",
    "origin": {
      "pt": "Madagáscar",
      "en": "Madagascar",
      "fr": "Madagascar"
    },
    "sources": [
      "https://plena-natura.pt/product/geranio-rosa-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-hortela-pimenta": {
    "inci": "Mentha Piperita Oil",
    "origin": {
      "pt": "Índia",
      "en": "India",
      "fr": "Inde"
    },
    "sources": [
      "https://plena-natura.pt/product/hortela-pimenta-menta-piperita-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-laranja-doce": {
    "inci": "Citrus Aurantium Dulcis Peel Oil",
    "origin": {
      "pt": "Brasil",
      "en": "Brazil",
      "fr": "Brésil"
    },
    "sources": [
      "https://plena-natura.pt/product/laranja-doce-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-lavanda": {
    "inci": "Lavandula Angustifolia Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-lavanda-4042-blend": {
    "inci": "Parfum, Lavandula Angustifolia Oil",
    "origin": {
      "pt": "parcialmente sintética",
      "en": "partly synthetic",
      "fr": "partiellement synthétique"
    },
    "sources": [
      "https://plena-natura.pt/product/lavanda-40-42-oleo-essencial-blend/"
    ]
  },
  "oleo-essencial-de-limao": {
    "inci": "Citrus Limon Peel Oil",
    "origin": {
      "pt": "Itália",
      "en": "Italy",
      "fr": "Italie"
    },
    "sources": [
      "https://plena-natura.pt/product/limao-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-palmarosa": {
    "inci": "Cymbopogon Martini Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-petitgrain": {
    "inci": "Citrus Aurantium Amara Leaf/Twig Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-ravintsara": {
    "inci": "Cinnamomum Camphora Leaf Oil",
    "origin": {
      "pt": "Madagáscar",
      "en": "Madagascar",
      "fr": "Madagascar"
    },
    "sources": [
      "https://plena-natura.pt/product/ravintsara-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-tea-tree": {
    "inci": "Melaleuca Alternifolia Leaf Oil",
    "origin": {
      "pt": "Austrália",
      "en": "Australia",
      "fr": "Australie"
    },
    "sources": [
      "https://plena-natura.pt/product/tea-tree-arvore-do-cha-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-ylang-ylang": {
    "inci": "Cananga Odorata Flower Oil",
    "origin": {
      "pt": "Comores / Madagáscar",
      "en": "Comoros / Madagascar",
      "fr": "Comores / Madagascar"
    },
    "sources": [
      "https://plena-natura.pt/product/ylang-ylang-iii-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-gengibre": {
    "inci": "Zingiber Officinale Root Oil",
    "origin": {
      "pt": "China / Índia",
      "en": "China / India",
      "fr": "Chine / Inde"
    },
    "sources": [
      "https://plena-natura.pt/product/gengibre-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-canela": {
    "inci": "",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-patchouli": {
    "inci": "Pogostemon Cablin Oil",
    "origin": {
      "pt": "Indonésia",
      "en": "Indonesia",
      "fr": "Indonésie"
    },
    "sources": [
      "https://plena-natura.pt/product/patchouli-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-ho-wood": {
    "inci": "Cinnamomum Camphora Wood Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "manteiga-de-cacau": {
    "inci": "Theobroma Cacao Seed Butter",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/manteiga-de-cacau-natural/",
      "https://plena-natura.pt/product/manteiga-de-cacau-desodorizada/"
    ]
  },
  "manteiga-de-karite": {
    "inci": "Butyrospermum Parkii Butter",
    "origin": {
      "pt": "Gana",
      "en": "Ghana",
      "fr": "Ghana"
    },
    "sources": [
      "https://plena-natura.pt/product/manteiga-de-karite-natural/"
    ]
  },
  "hidrolato-de-camomila-romana": {
    "inci": "Anthemis Nobilis Flower Water",
    "origin": {
      "pt": "Reino Unido",
      "en": "United Kingdom",
      "fr": "Royaume-Uni"
    },
    "sources": [
      "https://plena-natura.pt/product/hidrolato-de-camomila-romana/"
    ]
  },
  "hidrolato-de-hortela-pimenta": {
    "inci": "Mentha Piperita Leaf Water",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "hidrolato-de-lavanda": {
    "inci": "Lavandula Angustifolia Flower Water",
    "origin": {
      "pt": "Reino Unido",
      "en": "United Kingdom",
      "fr": "Royaume-Uni"
    },
    "sources": [
      "https://plena-natura.pt/product/hidrolato-de-lavanda/"
    ]
  },
  "acido-estearico": {
    "inci": "Stearic Acid",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/acido-estearico-estearina/"
    ]
  },
  "alcool-cetilico": {
    "inci": "Cetyl Alcohol",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "cera-de-abelha-amarela": {
    "inci": "Cera Alba",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/cera-de-abelha-amarela-em-perolas/"
    ]
  },
  "cera-de-soja": {
    "inci": "Hydrogenated Soybean Oil",
    "origin": {
      "pt": "Estados Unidos",
      "en": "United States",
      "fr": "États-Unis"
    },
    "sources": [
      "https://plena-natura.pt/product/cera-de-soja-c3-em-flocos-ponto-de-fusao-50-55-oc/"
    ]
  },
  "cera-emulsionante-btms": {
    "inci": "Behentrimonium Methosulfate, Cetearyl Alcohol",
    "origin": {
      "pt": "parcialmente sintética",
      "en": "partly synthetic",
      "fr": "partiellement synthétique"
    },
    "sources": [
      "https://plena-natura.pt/product/btms-cera-emulsionante/",
      "https://www.aroma-zone.com/en/product/cosmetic-ingredient-btms-emulsifier"
    ]
  },
  "argila-branca": {
    "inci": "Kaolin",
    "origin": {
      "pt": "França",
      "en": "France",
      "fr": "France"
    },
    "sources": [
      "https://plena-natura.pt/product/argila-branca-coskao/"
    ]
  },
  "argila-verde": {
    "inci": "Illite, Kaolin, Montmorillonite",
    "origin": {
      "pt": "França",
      "en": "France",
      "fr": "France"
    },
    "sources": [
      "https://plena-natura.pt/product/argila-verde-cosgreen-superfina/"
    ]
  },
  "conservante-cosgard": {
    "inci": "Benzyl Alcohol, Dehydroacetic Acid, Aqua",
    "origin": {
      "pt": "sintética",
      "en": "synthetic",
      "fr": "synthétique"
    },
    "sources": [
      "https://plena-natura.pt/product/conservante-cosgard/"
    ]
  },
  "d-pantenol-provitamina-b5": {
    "inci": "Panthenol",
    "origin": {
      "pt": "sintética",
      "en": "synthetic",
      "fr": "synthétique"
    },
    "sources": [
      "https://plena-natura.pt/product/d-pantenol-liquido/",
      "https://download.basf.com/p1/EN_StaticDocuments_6173/en/Technical_Information"
    ]
  },
  "tensioativo-sci": {
    "inci": "Sodium Cocoyl Isethionate",
    "origin": {
      "pt": "parcialmente sintética",
      "en": "partly synthetic",
      "fr": "partiellement synthétique"
    },
    "sources": [
      "https://plena-natura.pt/product/tensioactivo-sci-85-gf-granulado-fino/",
      "https://plena-natura.pt/product/tensioactivo-sci-80-p-em-po/",
      "https://www.ellementalpro.com/download/M-1384_TDS_S.pdf"
    ]
  },
  "vitamina-e": {
    "inci": "Tocopherol, Helianthus Annuus Seed Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/vitamina-e-tocopherol-70/"
    ]
  },
  "aloe-vera": {
    "inci": "Aloe Barbadensis Leaf Juice",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "amido-de-milho": {
    "inci": "Zea Mays Starch",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "bicarbonato-de-sodio": {
    "inci": "Sodium Bicarbonate",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "cavalinha-em-po": {
    "inci": "Equisetum Arvense Powder",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "farinha-de-aveia": {
    "inci": "Avena Sativa Kernel Flour",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "farinha-de-coco": {
    "inci": "Cocos Nucifera Fruit Powder",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "glicerina-vegetal": {
    "inci": "Glycerin",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": [
      "https://plena-natura.pt/product/glicerina-vegetal-liquida/"
    ]
  },
  "hibisco-flor-moida": {
    "inci": "Hibiscus Sabdariffa Flower Powder",
    "origin": {
      "pt": "Egipto",
      "en": "Egypt",
      "fr": "Égypte"
    },
    "sources": [
      "https://plena-natura.pt/product/hibisco-flor-moida-esfoliante/"
    ]
  },
  "sal-marinho-integral": {
    "inci": "Maris Sal",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "sementes-de-papoila": {
    "inci": "Papaver Somniferum Seed",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "urtiga-verde": {
    "inci": "Urtica Dioica Leaf Powder",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-citronela": {
    "inci": "",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-canfora": {
    "inci": "Cinnamomum Camphora Wood Oil",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oxido-de-ferro": {
    "inci": "",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "flores-de-camomila": {
    "inci": "Anthemis Nobilis Flower",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "flores-de-lavanda": {
    "inci": "Lavandula Angustifolia Flower",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "flores-de-rosa": {
    "inci": "Rosa Damascena Flower",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "alcool-96": {
    "inci": "Alcohol, Aqua",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "agua-destilada": {
    "inci": "Aqua",
    "origin": {
      "pt": "país de produção por confirmar",
      "en": "country of production to be confirmed",
      "fr": "pays de production à confirmer"
    },
    "sources": []
  },
  "oleo-essencial-de-tangerina": {
    "inci": "Citrus Reticulata Peel Oil",
    "origin": {
      "pt": "Estados Unidos",
      "en": "United States",
      "fr": "États-Unis"
    },
    "sources": [
      "https://plena-natura.pt/product/tangerina-oleo-essencial/"
    ]
  },
  "oleo-essencial-de-toranja": {
    "inci": "Citrus Paradisi Peel Oil",
    "origin": {
      "pt": "Estados Unidos / Israel / Cuba",
      "en": "United States / Israel / Cuba",
      "fr": "États-Unis / Israël / Cuba"
    },
    "sources": [
      "https://plena-natura.pt/product/toranja-oleo-essencial/"
    ]
  }
};
