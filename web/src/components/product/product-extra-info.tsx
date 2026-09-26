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

/** Only solid products save the water, so only they make the claim. */
const WATER_SAVING_CATEGORIES = ["champos", "amaciadores", "sabonetes"];

/** A lipstick tube and an inhaler are not packaging we take back. */
const REUSABLE_EXCLUDED_CATEGORIES = ["batons", "inaladores"];

const BOX =
  "inline-flex h-11 items-center rounded-full border border-sage bg-sage px-4 font-ui text-[0.92rem] font-medium text-white transition-colors hover:border-forest hover:bg-forest";

export function ProductExtraInfo({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const claims: { label: string; anchor: FaqAnchor }[] = [];

  if (product.is_deodorant) {
    // all three are answered by the same question, which is the one that says
    // the deodorants have neither aluminium nor alcohol
    claims.push(
      { label: t.productInfo.notAntiperspirant, anchor: "desodorizantes-antitranspirantes" },
      { label: t.productInfo.aluminiumFree, anchor: "desodorizantes-antitranspirantes" },
      { label: t.productInfo.alcoholFree, anchor: "desodorizantes-antitranspirantes" },
      { label: t.productInfo.customisable, anchor: "produto-personalizado" },
    );
  }
  if (WATER_SAVING_CATEGORIES.includes(product.category.slug)) {
    claims.push({ label: t.productInfo.waterSavingLabel, anchor: "porque-solidos" });
  }
  if (!REUSABLE_EXCLUDED_CATEGORIES.includes(product.category.slug)) {
    claims.push({ label: t.productInfo.reusableLabel, anchor: "devolver-embalagem" });
  }
  if (isSkinSafe(product.slug, product.category.slug)) {
    // the shampoos have a question of their own, about doubling as a body wash
    claims.push({
      label: t.productInfo.skinSafeLabel,
      anchor: product.category.slug === "champos" ? "champo-no-corpo" : "usar-na-pele",
    });
  }

  if (!claims.length) return null;

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {claims.map((claim) => (
        <li key={claim.label}>
          <Link href={faqHref(claim.anchor, query)} className={BOX}>
            {claim.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
