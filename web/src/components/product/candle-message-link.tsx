import Link from "next/link";
import { candleMessageCrossSell, MESSAGE_CANDLE_SLUG } from "@/content/candle-messages";
import type { ProductLocale } from "@/content/product-locales";

/**
 * On a candle's page, the nudge towards the candle with a message.
 *
 * Someone reading about the decorated candle has no way of knowing we can write
 * on it, and the related carousel at the foot of the page is too far down and
 * too quiet to tell them. This sits inside the candle note, where they are
 * already reading about what a lucrescente candle is.
 *
 * Renders nothing on the message candle itself — it would link to the page the
 * visitor is already on.
 */
export function CandleMessageLink({ slug, locale = "pt" }: { slug: string; locale?: ProductLocale }) {
  if (slug === MESSAGE_CANDLE_SLUG) return null;
  const copy = candleMessageCrossSell[locale];
  const href = `/produtos/${MESSAGE_CANDLE_SLUG}${locale === "pt" ? "" : `?idioma=${locale}`}`;

  return (
    <>
      {" "}
      {copy.text}{" "}
      <Link
        href={href}
        className="font-medium text-forest underline decoration-moss/50 underline-offset-4 transition-colors hover:decoration-forest"
      >
        {copy.link} →
      </Link>
    </>
  );
}
