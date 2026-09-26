/**
 * Stable `#anchors` for the FAQ questions that other pages link to.
 *
 * The dictionaries hold each question as plain text with no id of its own, and
 * the three languages spell out their `faq.groups` separately — in the same
 * order, question for question. So a position in that structure is the only
 * thing that identifies "the same question" across pt, en and fr.
 *
 * That position lives here, once, instead of being written out at every link.
 * Everything else refers to a question by name.
 *
 * If you reorder the FAQ, or insert an item above one of these, fix the
 * coordinates below — these anchors are what the extra-information boxes on
 * every product page point at, and a wrong pair sends the visitor to the wrong
 * answer rather than to an error. Appending to the end of a group is always
 * safe. `npm run typecheck` will not catch a mistake here; the product-page
 * checks do.
 */
const QUESTIONS = {
  /** "os vossos desodorizantes são antitranspirantes?" — also covers aluminium and alcohol */
  "desodorizantes-antitranspirantes": [0, 4],
  /** "o champô sólido também serve como sabonete?" */
  "champo-no-corpo": [0, 2],
  /** "que produtos posso usar diretamente na pele?" */
  "usar-na-pele": [0, 7],
  /** "posso pedir um produto feito à minha medida?" */
  "produto-personalizado": [1, 2],
  /** "posso devolver a embalagem?" */
  "devolver-embalagem": [2, 0],
  /** "porque é que os produtos são sólidos?" */
  "porque-solidos": [2, 2],
} as const satisfies Record<string, readonly [number, number]>;

export type FaqAnchor = keyof typeof QUESTIONS;

/**
 * The id to render on the question at this place in `faq.groups` — its name if
 * something links to it, otherwise a positional fallback so every question is
 * still addressable.
 */
export function faqAnchorId(groupIndex: number, itemIndex: number): string {
  for (const [name, [g, i]] of Object.entries(QUESTIONS)) {
    if (g === groupIndex && i === itemIndex) return name;
  }
  return `pergunta-${groupIndex}-${itemIndex}`;
}

/** Link to a named question, keeping the visitor's language. */
export function faqHref(anchor: FaqAnchor, query: string): string {
  return `/perguntas-frequentes${query}#${anchor}`;
}
