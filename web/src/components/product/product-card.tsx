import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { formatPrice, productAvailability, type Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/product-image";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getCategoryName } from "@/content/category-locales";

/** One-line story for the card: first sentence of "porque funciona" when supplied; otherwise nothing. */
export function storyLine(whyItWorks: string | null | undefined) {
  if (!whyItWorks) return null;
  const first = whyItWorks.split(/(?<=\.)\s/)[0];
  return first.length > 140 ? first.slice(0, 137).trimEnd() + "…" : first;
}

export function ProductCard({
  product,
  priority = false,
  locale = "pt",
  showStory = true,
}: {
  product: Product;
  priority?: boolean;
  locale?: ProductLocale;
  /** The catalogue hides the one-line story so its grid stays even. */
  showStory?: boolean;
}) {
  const t = getDictionary(locale);
  const avail = productAvailability(product);
  const image = product.images[0] ?? null;
  // fall back to the Portuguese copy when a translation for this product is missing,
  // so the card keeps its story instead of collapsing to name + price.
  const copy = getProductCopy(product.slug, locale, { name: product.name, whyItWorks: product.why_it_works ?? undefined });
  const story = storyLine(copy.whyItWorks ?? product.why_it_works);
  const categoryName = getCategoryName(product.category.slug, locale, product.category.name);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  return (
    <Link
      href={`/produtos/${product.slug}${query}`}
      className="group card-brand flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-offset-4"
    >
      <div className="relative overflow-hidden">
        <ProductImage
          image={image}
          ratio="portrait"
          rounded={false}
          priority={priority}
          fallbackLabel={copy.name}
          className="transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-[1.02]"
        />
        {avail.kind === "sold-out" ? (
          <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1.5 label-brand text-clay">{t.products.soldOutShort}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="label-brand text-moss">{categoryName}</p>
        <h3 className="font-display text-[1.45rem] leading-tight text-forest lowercase">{copy.name}</h3>
        {showStory && story ? <p className="text-[0.92rem] leading-relaxed text-ink/80">{story}</p> : null}
        <div className="mt-auto flex items-center justify-between pt-3">
          {avail.kind === "on-request" ? (
            <span className="font-ui text-[0.95rem] font-medium text-clay">{t.products.onRequest}</span>
          ) : (
            <span className={`font-ui text-[1rem] font-medium ${avail.kind === "sold-out" ? "text-ink/50" : "text-forest"}`}>
              {product.variants.filter((v) => v.price_cents !== null).length > 1 && new Set(product.variants.map((v) => v.price_cents)).size > 1 ? t.products.priceFrom : ""}
              {formatPrice(avail.price_cents)}
            </span>
          )}
          <span className="font-ui text-[0.9rem] font-medium text-moss">{t.home.cardLink}</span>
        </div>
      </div>
    </Link>
  );
}
