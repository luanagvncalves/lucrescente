import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@/lib/i18n";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { productAvailability } from "@/lib/types";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";
import { ProductImage } from "@/components/ui/product-image";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const description = p.why_it_works ? p.why_it_works.split(/(?<=\.)\s/)[0] : `${p.name} · ${p.category.name} · lucrescente`;
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

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const all = await getProducts();
  const related = all.filter((p) => p.category.slug === product.category.slug && p.slug !== product.slug).slice(0, 4);
  const avail = productAvailability(product);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Product schema with real prices only. On-request products get no offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.why_it_works ?? undefined,
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
        <Link href="/produtos" className="hover:underline underline-offset-4">
          {t.nav.products}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/produtos?categoria=${product.category.slug}`} className="hover:underline underline-offset-4">
          {product.category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-12 lg:gap-14">
        {/* image 7 cols */}
        <div className="md:col-span-7">
          {product.images.length > 1 ? (
            <ProductGallery images={product.images} name={product.name} />
          ) : (
            <ProductImage image={product.images[0] ?? null} ratio="portrait" priority sizes="(min-width: 768px) 58vw, 100vw" fallbackLabel={product.name} className="frame-brand max-h-[80vh]" />
          )}
        </div>

        {/* copy 5 cols */}
        <div className="md:col-span-5">
          <Label>{product.category.name}</Label>
          <h1 className="mt-3 text-h1 text-forest lowercase">{product.name}</h1>

          {product.is_deodorant ? <p className="mt-5 text-[0.95rem] text-ink/80">{t.products.deodorantFact}</p> : null}
          {product.is_solid ? <p className="mt-5 text-[0.95rem] text-ink/80">{t.products.solidNote}</p> : null}

          <div className="mt-8">
            <PurchasePanel product={product} />
          </div>

          {product.is_candle ? <p className="mt-6 rounded-2xl bg-lavender/30 px-5 py-4 text-[0.92rem] leading-relaxed">{t.products.candleNote}</p> : null}
        </div>
      </div>

      <Pause className="my-16" />

      <div className="grid gap-12 md:grid-cols-12">
        {product.why_it_works ? (
          <section className="md:col-span-7" aria-labelledby="porque">
            <Label>{t.products.whyItWorks}</Label>
            <p id="porque" className="mt-5 text-body-lg measure">
              {product.why_it_works}
            </p>
          </section>
        ) : null}

        <section className={product.why_it_works ? "md:col-span-4 md:col-start-9" : "md:col-span-7"} aria-labelledby="ingredientes-principais">
          <Label>{t.products.mainIngredients}</Label>
          {product.ingredients.length ? (
            <ul id="ingredientes-principais" className="mt-5 flex flex-wrap gap-2">
              {product.ingredients.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/ingredientes/${i.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-moss/40 bg-paper px-4 py-2 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id="ingredientes-principais" className="mt-5 text-[0.95rem] text-ink/70">
              {t.products.noIngredientsListed}
            </p>
          )}
        </section>
      </div>

      {related.length ? (
        <section className="mt-24" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-h2 text-forest lowercase">
            {t.products.relatedTitle}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
