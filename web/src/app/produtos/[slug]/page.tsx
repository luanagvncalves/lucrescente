import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getCategoryName } from "@/content/category-locales";
import { getIngredientName } from "@/content/ingredient-locales";
import { getAllergenNote } from "@/content/allergen-notes";
import { SCENT_INGREDIENT_SLUGS, isScentProduct } from "@/content/scent-choices";
import { getShampooNote } from "@/content/shampoo-notes";
import { productAvailability } from "@/lib/types";
import { brandSentence } from "@/lib/brand-case";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";
import { ProductImage } from "@/components/ui/product-image";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RelatedCarousel } from "@/components/product/related-carousel";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductContact } from "@/components/product/product-contact";
import { ProductExtraInfo } from "@/components/product/product-extra-info";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ idioma?: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const description = p.why_it_works ? brandSentence(p.why_it_works.split(/(?<=\.)\s/)[0]) : `${p.name} · ${p.category.name} · lucrescente`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/produtos/${p.slug}` },
    openGraph: {
      title: `${p.name} · lucrescente`,
      description,
      type: "website",
      images: p.images[0] ? [{ url: p.images[0].path, alt: p.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const avail = productAvailability(product);
  const copy = getProductCopy(product.slug, locale, { name: product.name, whyItWorks: product.why_it_works ?? undefined });
  const categoryName = getCategoryName(product.category.slug, locale, product.category.name);
  // keep the Portuguese story when a translation is missing, rather than dropping the section
  const whyItWorks = copy.whyItWorks ?? product.why_it_works;
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  // the air freshener and the made-to-order candles take whichever oils the customer picks,
  // so the oils are chosen in the purchase panel rather than listed here
  const scentProduct = isScentProduct(product.slug);
  const shownIngredients = scentProduct ? product.ingredients.filter((i) => !SCENT_INGREDIENT_SLUGS.has(i.slug)) : product.ingredients;
  // with a scent picker the cautions are not listed oil by oil (the product holds whichever oils
  // are chosen); the one about cinnamon appears in the picker itself, when it is chosen
  const allergenNote = getAllergenNote(scentProduct ? [] : product.ingredients.map((i) => i.slug), locale, product.slug);
  const hairNote = getShampooNote(product.slug, locale);

  // "cria o teu conjunto": same category first, then the rest of the catalogue.
  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const sameA = a.category.slug === product.category.slug ? 0 : 1;
      const sameB = b.category.slug === product.category.slug ? 0 : 1;
      // it is a carousel of photographs, so the ones without a photo go last
      const photoA = a.images.length ? 0 : 1;
      const photoB = b.images.length ? 0 : 1;
      return sameA - sameB || photoA - photoB || a.sort_order - b.sort_order;
    })
    .slice(0, 12);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Product schema with real prices only. On-request products get no offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.why_it_works ? brandSentence(product.why_it_works) : undefined,
    image: product.images.map((i) => `${siteUrl}${i.path}`),
    brand: { "@type": "Brand", name: "lucrescente" },
    category: product.category.name,
    ...(avail.kind !== "on-request"
      ? {
          offers: product.variants
            .filter((v) => v.price_cents !== null)
            .map((v) => ({
              "@type": "Offer",
              sku: v.sku,
              priceCurrency: "EUR",
              price: ((v.price_cents as number) / 100).toFixed(2),
              availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${siteUrl}/produtos/${product.slug}`,
            })),
        }
      : {}),
  };

  return (
    <article className="container-brand pt-8 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="caminho" className="text-[0.85rem] text-ink/70">
        <Link href={`/produtos${query}`} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
          {t.nav.products}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/produtos?categoria=${product.category.slug}${locale === "pt" ? "" : `&idioma=${locale}`}`}
          className="inline-flex min-h-11 items-center hover:underline underline-offset-4"
        >
          {categoryName}
        </Link>
      </nav>

      {/*
        Two columns, and the left one is only as wide as the photograph really
        is. It used to be a fixed 7 of 12, which is fine while the frame fills
        its track — but the frame is 3:4 and may not exceed 80vh, so on a wide,
        short window it stops short of the column's edge and left a band of
        empty page between the photograph and the words beside it. Sizing the
        column at min(58%, 60vh) — 60vh being the width a 3:4 frame has when it
        is 80vh tall — means the column ends where the picture ends, whichever
        of the two limits is doing the work.
      */}
      <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-start lg:gap-14">
        {/* `min-w-0` because a flex item defaults to min-width:auto: the
            gallery's scrolling thumbnail strip stretched this column to its
            full content width, and the whole page with it. */}
        <div className="min-w-0 md:w-[min(58%,60vh)] md:shrink-0">
          {product.images.length > 1 ? (
            <ProductGallery images={product.images} name={copy.name} locale={locale} />
          ) : (
            // the same 60vh width ceiling the gallery uses, so a single
            // photograph is held to 80vh too without the ratio being bent
            <ProductImage image={product.images[0] ?? null} ratio="portrait" priority sizes="(min-width: 768px) 58vw, 100vw" fallbackLabel={copy.name} locale={locale} className="frame-brand max-w-[60vh]" />
          )}

          {/*
            Why the product works, directly under the photograph it belongs to.
            It used to sit past the spiral, a full screen further down, which
            put the brand's case for a product somewhere most people never
            scrolled to.
          */}
          <div className="mt-8">
            {product.is_candle ? (
              <section aria-labelledby="porque">
                {/* a candle is not answering "does this work" but "why this
                    rather than the one in the supermarket" */}
                {whyItWorks
                  ? whyItWorks.split("\n\n").map((para, i) => (
                      <p key={i} className={i ? "mt-5 text-body-lg measure" : "text-body-lg measure"}>
                        {para}
                      </p>
                    ))
                  : null}
                <Label className={whyItWorks ? "mt-8" : ""}>{t.products.candleCaseLabel}</Label>
                <p id="porque" className="mt-5 text-body-lg measure">
                  {t.products.candleCase}
                </p>
              </section>
            ) : whyItWorks ? (
              <section aria-labelledby="porque">
                <Label>{t.products.whyItWorks}</Label>
                <p id="porque" className="mt-5 text-body-lg measure">
                  {whyItWorks}
                </p>
              </section>
            ) : null}

            {product.is_deodorant ? <p className="mt-5 text-[0.95rem] text-ink/80 measure">{t.products.deodorantFact}</p> : null}
            {product.is_solid ? <p className="mt-5 text-[0.95rem] text-ink/80 measure">{t.products.solidNote}</p> : null}
          </div>
        </div>

        {/*
          5 cols beside the photographs: what the product is made of, and then
          how to buy it.

          The ingredients come first, above the price and the format picker,
          because they are what someone is deciding on — the brand's whole case
          for a product is its ingredient list, and it used to sit far below the
          fold, next to "porque funciona". Everything explaining the product
          rather than choosing it now lives under the photographs instead.
        */}
        <div className="min-w-0 md:flex-1">
          <Label>{categoryName}</Label>
          <h1 className="mt-3 text-h1 text-forest lowercase">{copy.name}</h1>

          <section className="mt-8" aria-labelledby="ingredientes-principais">
            <Label>{t.products.mainIngredients}</Label>
            {shownIngredients.length ? (
              <ul id="ingredientes-principais" className="mt-4 flex flex-wrap gap-2">
                {shownIngredients.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/ingredientes/${i.slug}${query}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-moss/40 bg-paper px-4 py-2 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                    >
                      {getIngredientName(i.slug, locale, i.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p id="ingredientes-principais" className="mt-4 text-[0.95rem] text-ink/70">
                {t.products.noIngredientsListed}
              </p>
            )}
            {/*
              The caution that comes out of the ingredient list itself —
              essential oils, bicarbonate, a citrus oil in the sun, a tree nut.
              It is written per ingredient in `allergen-notes.ts`, which until
              now was never rendered anywhere: the notes and their translations
              existed, and no page asked for them.
            */}
            {allergenNote ? (
              <p className="mt-4 rounded-2xl bg-clay/10 px-4 py-3 text-[0.88rem] leading-relaxed text-ink/85">
                <span className="label-brand mr-2 text-clay">{t.products.allergenNoteLabel}</span>
                {allergenNote}
              </p>
            ) : null}
          </section>

          {/* which hair and scalp each solid shampoo suits — also written and
              translated long ago, and likewise never shown */}
          {hairNote ? (
            <section className="mt-8" aria-labelledby="tipo-de-cabelo">
              <Label>{t.products.hairTypeNote}</Label>
              <div id="tipo-de-cabelo" className="mt-4 space-y-3 text-[0.92rem]">
                <div>
                  <span className="font-ui font-medium text-forest">{t.products.recommendedFor}: </span>
                  <span className="text-ink/85">{hairNote.good.join(", ")}</span>
                </div>
                {hairNote.bad.length ? (
                  <div>
                    <span className="font-ui font-medium text-clay">{t.products.notRecommendedFor}: </span>
                    <span className="text-ink/85">{hairNote.bad.join(", ")}</span>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* the extra claims sit straight under the ingredients, above the price */}
          <ProductExtraInfo product={product} locale={locale} />

          <div className="mt-8">
            <PurchasePanel product={product} locale={locale} />
          </div>
        </div>
      </div>

      {/* the spiral now marks the end of the product itself, before the
          carousel of everything else, rather than splitting the photograph
          from the paragraph explaining it */}
      <Pause className="my-12" />

      <RelatedCarousel items={related} locale={locale} />

      <ProductContact productName={copy.name} locale={locale} />
    </article>
  );
}
