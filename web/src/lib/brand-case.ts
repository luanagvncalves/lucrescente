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

/**
 * The same lowercase, for a sentence of body copy: it opens the sentence, so
 * "Também chamada caulino…" becomes "também chamada caulino…". Capitals further
 * in are ordinary Portuguese (Marrocos, Theobroma cacao) and are left alone —
 * unlike `brandCase`, which is for names, not sentences.
 *
 * It lowers the whole opening run of capitalised words, not just the first
 * letter, because one sentence in the catalogue opens on an INCI name ("Sodium
 * Cocoyl Isethionate — tensioativo suave…") and "sodium Cocoyl Isethionate"
 * would be neither the brand's lowercase nor the INCI name. The run stops at
 * the first lowercase word, which across all 555 descriptions is the second
 * word everywhere else.
 *
 * A sentence opening on an abbreviation keeps it, for the same reason
 * `brandCase` protects BTMS and the E of vitamina E.
 */
export function lowerFirst(text: string): string {
  let reachedSentence = false;
  return text
    .split(/(\s+)/) // keep the separators, so spacing survives
    .map((part) => {
      if (reachedSentence || !part.trim()) return part;
      if (isAbbreviation(part) || !/^\p{Lu}/u.test(part)) {
        reachedSentence = true;
        return part;
      }
      return part.charAt(0).toLowerCase() + part.slice(1);
    })
    .join("");
}
