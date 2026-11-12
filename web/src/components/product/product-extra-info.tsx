import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import type { ProductLocale } from "@/content/product-locales";
import { isSkinSafe } from "@/content/skin-safe-locales";
import { faqHref, type FaqAnchor } from "@/content/faq-anchors";

/**
 * Every extra claim on a product page, in one row of boxes shaped exactly like
 * the format pills in the panel below: same height, same radius, same type.
 *
 * Each box is a link to the question that explains it on the FAQ page, which
 * arrives with that answer already open. The claims used to carry their own
 * text — some as panels that opened in place, most with nothing behind them at
 * all — so the same explanation lived in two places and only one of them was
 * findable by search or by someone who had not thought to click a green pill.
 *
 * Which question each box points at is named in `faq-anchors.ts`; this file
 * never spells out a position in the FAQ.
 *
 * `sage` is the brand's own green, sampled from the logotype. White on it
 * measures 6.79:1, well past the 4.5:1 that text this size needs.
 */

const BOX =
  "inline-flex min-h-11 items-center rounded-full border border-sage bg-sage px-4 py-2 font-ui text-[0.92rem] font-medium text-white transition-colors hover:border-forest hover:bg-forest";

export function ProductExtraInfo({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const claims: { label: string; anchor?: FaqAnchor }[] = [];

  if (product.is_deodorant) {
    // all three are answered by the same question, which is the one that says
    // the deodorants have neither aluminium nor alcohol
    claims.push(
      { label: t.productInfo.notAntiperspirant, anchor: "desodorizantes-antitranspirantes" },
      { label: t.productInfo.aluminiumFree, anchor: "desodorizantes-antitranspirantes" },
      { label: t.productInfo.alcoholFree, anchor: "desodorizantes-antitranspirantes" },
    );
  }
  // every product can be adapted to what someone needs, not only the deodorants
  claims.push({ label: t.productInfo.customisable, anchor: "produto-personalizado" });

  if (product.category.slug !== "champos" && isSkinSafe(product.slug, product.category.slug)) {
    // one answer for every product now: the shampoos' own question, about
    // doubling as a body wash, was folded into it
    claims.push({ label: locale === "pt" ? "seguro para a pele" : t.productInfo.skinSafeLabel, anchor: "usar-na-pele" });
  }

  if (product.category.slug === "champos") {
    const shampooLabels = {
      pt: ["não aconselhado para cabelos descolorados", "seguro para cabelos com tratamento"],
      en: ["not recommended for bleached hair", "safe for treated hair"],
      fr: ["déconseillé aux cheveux décolorés", "convient aux cheveux traités"],
    };
    claims.push(...shampooLabels[locale].map((label) => ({ label })));
    if (product.slug === "champo-neutro-para-criancas") {
      const neutralLabels = {
        pt: ["seguro para bebés e crianças", "seguro para pele/couro cabeludo sensíveis"],
        en: ["safe for babies and children", "safe for sensitive skin/scalp"],
        fr: ["convient aux bébés et aux enfants", "convient aux peaux/cuirs chevelus sensibles"],
      };
      claims.push(...neutralLabels[locale].map((label) => ({ label })));
    }
  }

  if (!claims.length) return null;

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {claims.map((claim) => (
        <li key={claim.label}>
          {claim.anchor ? (
            <Link href={faqHref(claim.anchor, query)} className={BOX}>
              {claim.label}
            </Link>
          ) : (
            <span className={BOX}>{claim.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
