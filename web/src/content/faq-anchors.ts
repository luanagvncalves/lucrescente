/**
 * `#anchors` for the FAQ questions, and the names other pages link to them by.
 *
 * Every question's anchor is a slug of its Portuguese wording. The three
 * languages spell out `faq.groups` separately, in the same order, with no ids
 * of their own — so the Portuguese text is the one thing that identifies a
 * question across pt, en and fr, and it gives the same anchor in all three.
 *
 * This used to be a table of [group, item] coordinates. Merging two questions
 * shifted every index below them, and a stale pair points a visitor at the
 * wrong answer without anything failing — so the wording is the key now.
 * Reordering the FAQ, or inserting questions, costs nothing.
 *
 * Reword a question in `QUESTIONS` and the product page's link stops resolving
 * — the visitor lands on the FAQ but not on the answer. The checks catch it;
 * the fix is to update the wording here to match pt.ts.
 */

/** The questions a product page's extra-information boxes point at. */
const QUESTIONS = {
  "desodorizantes-antitranspirantes": "os vossos desodorizantes são antitranspirantes?",
  "usar-na-pele": "que produtos posso usar diretamente na pele?",
  "produto-personalizado": "posso pedir um produto feito à minha medida?",
  "porque-solidos": "porque é que os produtos são sólidos?",
} as const;

export type FaqAnchor = keyof typeof QUESTIONS;

/** Every question is addressable, whether or not anything links to it. */
function slug(question: string): string {
  return question
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The id to render on a question, given its Portuguese wording. */
export function faqAnchorId(portugueseQuestion: string): string {
  return slug(portugueseQuestion);
}

/** Link to a named question, keeping the visitor's language. */
export function faqHref(anchor: FaqAnchor, query: string): string {
  return `/perguntas-frequentes${query}#${slug(QUESTIONS[anchor])}`;
}

/** The Portuguese wording each name expects, for the checks to verify against pt.ts. */
export const linkedQuestions: Readonly<Record<FaqAnchor, string>> = QUESTIONS;
