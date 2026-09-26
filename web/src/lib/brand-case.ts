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
 * A Latin binomial ("Theobroma cacao") and a chemical formula (NaHCO₃) carry
 * meaning in their capitals the way BTMS does, but they are not written all in
 * caps, so `isAbbreviation` cannot see them. Only the first word needs naming:
 * "cacao" and "sativa" are lowercase in the binomial anyway.
 */
const KEEPS_ITS_CAPITAL = new Set(["Theobroma", "Avena", "NaHCO₃"]);

/**
 * The same lowercase, for a sentence of body copy — the ingredient
 * descriptions and the "porque funciona" of each product, which arrive from
 * the database written as ordinary sentences.
 *
 * It lowercases every word, exactly like `brandCase`: the sentence opening
 * ("Também chamada caulino…"), the sentence after a full stop ("…sem penetrar
 * profundamente. É a mais suave…"), place names ("Sudeste Asiático") and any
 * capital typed into Supabase later. What survives is what `brandCase` also
 * protects — abbreviations written in caps, BTMS and SCI and the E of vitamina
 * E — plus the binomials and formulas named above.
 *
 * It exists separately from `brandCase` only because a sentence keeps its
 * brackets and slashes as punctuation, where a name splits on them.
 */
export function brandSentence(text: string): string {
  return text
    .split(/(\s+)/) // keep the separators, so spacing survives
    .map((part) => {
      const word = part.replace(/^[("'«¿¡]+/, "").replace(/[.,;:)»"'!?…]+$/, "");
      if (isAbbreviation(word) || KEEPS_ITS_CAPITAL.has(word)) return part;
      return part.replace(/\p{L}/u, (letter) => letter.toLowerCase()); // the first letter, past any bracket
    })
    .join("");
}
