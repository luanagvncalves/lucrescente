/**
 * The brand writes everything in lowercase. Most of the site gets there with
 * Tailwind's `lowercase`, but CSS cannot make an exception, and a few names
 * carry abbreviations that are wrong in lowercase — "vitamina e" is not a
 * vitamin, and "tensioativo sci" is not an ingredient anyone can look up.
 *
 * So: lowercase every word, except a word that is already written entirely in
 * capitals. Across the 62 ingredients that protects exactly the six that need
 * it — BTMS, Q10, B5, QT, SCI and the E of vitamina E — and touches nothing
 * else, because no ordinary word in the catalogue is written in caps.
 *
 * Deliberately NOT protected: the leading "D-" of D-Pantenol. Splitting on the
 * hyphen would protect it, but it would also open a name with a capital, which
 * is the thing the brand's lowercase is for; the B5 beside it already carries
 * the meaning.
 *
 * Use this wherever an ingredient name or category is shown, instead of the
 * `lowercase` class — including page titles, which CSS never reaches and which
 * are what search results show.
 */
export function brandCase(text: string): string {
  return text
    .split(/(\s+|[()/])/) // keep the separators, so spacing and brackets survive
    .map((part) => (isAbbreviation(part) ? part : part.toLowerCase()))
    .join("");
}

function isAbbreviation(word: string): boolean {
  return /[A-Z]/.test(word) && word === word.toUpperCase();
}
