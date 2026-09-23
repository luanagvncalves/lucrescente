import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getCategories, getIngredients, getProducts, getProductsBySlugs } from "@/lib/catalog";
import { featuredSlugs } from "@/data/catalog";
import { editorial } from "@/data/editorial";
import { LinkButton, TextLink } from "@/components/ui/button";
import { H2, Label, SectionHeader } from "@/components/ui/typography";
import { Crescent } from "@/components/ui/motifs";
import { ProductCard } from "@/components/product/product-card";
import { ContactLinks } from "@/components/contact/contact-links";
import { Reveal } from "@/components/ui/reveal";
import { HomeHero } from "@/components/home/hero";
import { Testimonials } from "@/components/home/testimonials";
import { IngredientTeaserGrid } from "@/components/home/ingredient-teaser";
import { testimonials } from "@/data/testimonials";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getCategoryName } from "@/content/category-locales";
import { getHomeTileLabel } from "@/content/home-tile-labels";

export const revalidate = 60;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const [featured, categories, products, ingredients] = await Promise.all([
    getProductsBySlugs(featuredSlugs),
    getCategories(),
    getProducts(),
    getIngredients(),
  ]);
  const hero = editorial["home-hero"];
  const categoryImages = editorial.categories;
  const ingredientTeaser = ingredients.filter((i) => ["Óleos Vegetais", "Manteigas", "Hidrolatos", "Argilas"].includes(i.category)).slice(0, 8);

  type Tile = { key: string; href: string; imageSrc: string | null; imageAlt: string; name: string; count: number };

  function categoryTile(slug: string): Tile | null {
    const c = categories.find((cat) => cat.slug === slug);
    if (!c) return null;
    const img = categoryImages[c.slug];
    return {
      key: c.slug,
      href: `/produtos?categoria=${c.slug}`,
      imageSrc: img?.file ?? null,
      imageAlt: img?.alt ?? "",
      name: getCategoryName(c.slug, locale, c.name),
      count: products.filter((p) => p.category.slug === c.slug).length,
    };
  }

  // "cuidado-capilar" (amaciador + máscara) is a single DB category bundling two
  // distinct products — split into one tile per product instead.
  function productTile(slug: string): Tile | null {
    const p = products.find((product) => product.slug === slug);
    if (!p) return null;
    const img = p.images[0];
    return {
      key: p.slug,
      href: `/produtos/${p.slug}`,
      imageSrc: img?.path ?? null,
      imageAlt: img?.alt ?? "",
      name: getHomeTileLabel(p.slug, locale, getProductCopy(p.slug, locale, { name: p.name }).name),
      count: 1,
    };
  }

  const categoryGroupTiles: Record<string, (Tile | null)[]> = {
    [t.home.categoryGroupHigiene]: [
      categoryTile("desodorizantes"),
      categoryTile("champos"),
      categoryTile("sabonetes"),
      productTile("amaciador"),
      productTile("mascara-150ml"),
    ],
    [t.home.categoryGroupBemEstar]: [
      categoryTile("velas"),
      categoryTile("roll-on"),
      categoryTile("batons"),
      categoryTile("sprays"),
      categoryTile("sais-de-banho"),
      productTile("inalador"),
      productTile("ambientador"),
    ],
  };
  const categoryGroups = Object.entries(categoryGroupTiles).map(([label, tiles]) => ({
    label,
    tiles: tiles.filter((tile): tile is Tile => Boolean(tile)),
  }));

  return (
    <>
      <HomeHero hero={hero} title={t.home.heroTitle} />

      {/* featured */}
      <section className="container-brand section-gap" aria-labelledby="destaques">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="destaques" className="text-h2 text-forest lowercase">
              {t.home.featuredTitle}
            </h2>
            <TextLink href="/produtos">{t.home.featuredMoreLink}</TextLink>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* categories */}
      <section className="bg-paper" aria-labelledby="categorias">
        <div className="container-brand section-gap">
          <Reveal>
            <SectionHeader title={t.home.productsTitle} subtitle={t.home.productsSubtitle} />
          </Reveal>
          <div className="mt-10 flex flex-col gap-10">
            {categoryGroups.map((group, groupIndex) => (
              <Reveal key={group.label} delay={groupIndex * 0.08}>
                <div>
                  <h3 className="font-display text-[1.15rem] text-moss lowercase">{group.label}</h3>
                  <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                    {group.tiles.map((tile) => (
                      <li key={tile.key}>
                        <Link href={tile.href} className="group block">
                          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-moss/18 bg-ivory">
                            {tile.imageSrc ? (
                              <Image src={tile.imageSrc} alt={tile.imageAlt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-[1.02]" />
                            ) : (
                              <div className="placeholder-frame flex h-full items-center justify-center">
                                <Crescent size={28} tone="var(--violet)" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-violet/50 px-3 text-center">
                              <span className="font-display text-[1.35rem] leading-tight text-ivory lowercase sm:text-[1.5rem]">{tile.name}</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <LinkButton href="/produtos" variant="secondary">
              {t.home.productsButton}
            </LinkButton>
          </div>
        </div>
      </section>


      {/* values: full-width solid colour field with the family's promise and a lunar mark */}
      <section className="bg-forest text-ivory on-dark" aria-labelledby="valores">
        <div className="container-brand section-gap">
          <Reveal>
            <div className="grid items-start gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-12">
              <div className="md:col-span-5 md:pr-4">
                <h2 id="valores" className="font-display text-h2 lowercase text-ivory">
                  {t.home.valuesSubtitle}
                </h2>
                <p className="mt-6 text-body-lg text-ivory/85 measure">{t.about.promise}</p>
              </div>
              <ul className="grid gap-6 md:col-span-6 md:col-start-7 md:grid-cols-2 md:gap-x-6 md:gap-y-8">
                {t.about.values.map((v) => (
                  <li key={v} className="border-t border-ivory/25 pt-5">
                    <Crescent size={16} tone="var(--lavender)" />
                    <p className="mt-4 font-display text-[1.2rem] leading-tight lowercase text-ivory">{v}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* story teaser: story split 7/5 */}
      <section className="container-brand section-gap" aria-labelledby="historia">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            {editorial.sobre ? (
              <div className="frame-brand relative aspect-[5/4] bg-paper">
                <Image src={editorial.sobre.path} alt={editorial.sobre.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5">
            <div>
              <Label>{t.about.label}</Label>
              <h2 id="historia" className="mt-4 text-h2 text-forest lowercase">
                {t.home.storyTitle}
              </h2>
              <p className="mt-6 text-body-lg measure">{t.home.storyText}</p>
              <TextLink href="/sobre" className="mt-6 inline-block">
                {t.home.storyLink}
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ingredients teaser */}
      <section className="bg-lavender/30" aria-labelledby="ingredientes">
        <div className="container-brand section-gap">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Label tone="violet">{t.ingredients.label}</Label>
                <H2 className="mt-4">{t.home.ingredientsTitle}</H2>
                <p className="mt-4 text-body-lg measure">{t.home.ingredientsSubtitle}</p>
              </div>
              <TextLink href="/ingredientes">{t.home.ingredientsLink}</TextLink>
            </div>
          </Reveal>
          <IngredientTeaserGrid items={ingredientTeaser} showMoreLabel={t.home.showMore} showLessLabel={t.home.showLess} locale={locale} />
        </div>
      </section>

      {/* feedbacks */}
      <Testimonials
        label={t.home.testimonialsLabel}
        title={t.home.testimonialsTitle}
        subtitle={t.home.testimonialsSubtitle}
        items={testimonials}
        locale={locale}
        prevLabel={t.home.testimonialsPrev}
        nextLabel={t.home.testimonialsNext}
      />

      {/* contact */}
      <section className="container-brand section-gap" id="contacto" aria-labelledby="encomendas">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <Label>{t.contact.title}</Label>
              <h2 id="encomendas" className="mt-4 text-h2 text-forest lowercase">
                {t.home.contactTitle}
              </h2>
              <p className="mt-6 text-body-lg measure">{t.home.contactText}</p>
            </div>
            <div className="md:col-span-6 md:pt-14">
              <ContactLinks labels="home" />
              <p className="mt-6 text-[0.9rem] text-ink/70">{t.footer.shipping}</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
