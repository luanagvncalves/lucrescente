import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getCategories, getIngredients, getProducts, getProductsBySlugs } from "@/lib/catalog";
import { featuredSlugs } from "@/data/catalog";
import { editorial } from "@/data/editorial";
import { LinkButton, TextLink } from "@/components/ui/button";
import { H2, Label, SectionHeader } from "@/components/ui/typography";
import { Crescent, Orbit } from "@/components/ui/motifs";
import { ProductCard } from "@/components/product/product-card";
import { ContactLinks } from "@/components/contact/contact-links";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, categories, products, ingredients] = await Promise.all([
    getProductsBySlugs(featuredSlugs),
    getCategories(),
    getProducts(),
    getIngredients(),
  ]);
  const hero = editorial["home-hero"];
  const categoryImages = editorial.categories;
  const ingredientTeaser = ingredients.filter((i) => ["Óleos Essenciais", "Manteigas", "Hidrolatos", "Argilas"].includes(i.category)).slice(0, 8);

  return (
    <>
      {/* hero: promise on a solid ivory field, photo beside it */}
      <section className="container-brand pt-10 md:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6 lg:col-span-5">
            <Label>{t.home.heroLabel}</Label>
            <h1 className="mt-5 text-h1 text-forest lowercase">{t.home.heroTitle}</h1>
            <p className="mt-6 text-body-lg measure text-ink/90">{t.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/ingredientes" size="lg">
                {t.home.heroPrimary} →
              </LinkButton>
              <LinkButton href="/produtos" size="lg" variant="secondary">
                {t.home.heroSecondary}
              </LinkButton>
            </div>
          </div>
          <div className="relative md:col-span-6 md:col-start-7 lg:col-span-6">
            <Orbit className="pointer-events-none absolute -right-10 -top-10 hidden w-56 text-moss lg:block" />
            <div className="frame-brand relative aspect-[4/5] w-full max-h-[70vh] bg-paper md:aspect-[5/6]">
              {hero ? (
                <Image src={hero.path} alt={hero.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* featured */}
      <section className="container-brand section-gap" aria-labelledby="destaques">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="destaques" className="text-h2 text-forest lowercase">
            {t.home.featuredTitle}
          </h2>
          <TextLink href="/produtos">{t.home.productsButton} →</TextLink>
        </div>
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
          <SectionHeader label={t.products.label} title={t.home.productsTitle} subtitle={t.home.productsSubtitle} />
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((c) => {
              const img = categoryImages[c.slug];
              const count = products.filter((p) => p.category.slug === c.slug).length;
              return (
                <li key={c.slug}>
                  <Link href={`/produtos?categoria=${c.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-[20px] border border-moss/18 bg-ivory">
                      {img ? (
                        <Image src={img.file} alt={img.alt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-[1.02]" />
                      ) : (
                        <div className="placeholder-frame flex h-full items-center justify-center">
                          <Crescent size={28} tone="var(--violet)" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-display text-[1.25rem] text-forest lowercase group-hover:underline underline-offset-4">{c.name}</span>
                      <span className="text-[0.8rem] text-ink/60">{count}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-10">
            <LinkButton href="/produtos" variant="secondary">
              {t.home.productsButton}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* values: full-width solid colour field with one short statement and a lunar mark */}
      <section className="bg-forest text-ivory on-dark" aria-labelledby="valores">
        <div className="container-brand section-gap">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Label tone="ivory">{t.home.valuesTitle}</Label>
              <h2 id="valores" className="mt-4 font-display text-h2 lowercase text-ivory">
                {t.home.valuesSubtitle}
              </h2>
            </div>
            <ul className="grid gap-6 md:col-span-6 md:col-start-7 md:grid-cols-3">
              {t.home.values.map((v) => (
                <li key={v} className="border-t border-ivory/25 pt-5">
                  <Crescent size={16} tone="var(--lavender)" />
                  <p className="mt-4 font-display text-[1.6rem] leading-tight lowercase">{v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* story teaser: story split 7/5 */}
      <section className="container-brand section-gap" aria-labelledby="historia">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {editorial.sobre ? (
              <div className="frame-brand relative aspect-[5/4] bg-paper">
                <Image src={editorial.sobre.path} alt={editorial.sobre.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
          <div className="md:col-span-5">
            <Label>{t.about.label}</Label>
            <h2 id="historia" className="mt-4 text-h2 text-forest lowercase">
              {t.home.storyTitle}
            </h2>
            <p className="mt-6 text-body-lg measure">{t.home.storyText}</p>
            <TextLink href="/sobre" className="mt-6 inline-block">
              {t.home.storyLink}
            </TextLink>
          </div>
        </div>
      </section>

      {/* ingredients teaser */}
      <section className="bg-lavender/30" aria-labelledby="ingredientes">
        <div className="container-brand section-gap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Label tone="violet">{t.ingredients.label}</Label>
              <H2 className="mt-4">{t.home.ingredientsTitle}</H2>
              <p className="mt-4 text-body-lg measure">{t.home.ingredientsSubtitle}</p>
            </div>
            <TextLink href="/ingredientes">{t.home.ingredientsLink}</TextLink>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {ingredientTeaser.map((i) => (
              <li key={i.slug}>
                <Link href={`/ingredientes/${i.slug}`} className="card-brand block h-full p-5 transition-transform duration-200 hover:-translate-y-0.5">
                  <p className="label-brand text-violet">{i.category}</p>
                  <p className="mt-2 font-display text-[1.3rem] leading-tight text-forest lowercase">{i.name}</p>
                  {i.scientific_name ? <p className="mt-1 text-[0.85rem] italic text-ink/70">{i.scientific_name}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* contact */}
      <section className="container-brand section-gap" id="contacto" aria-labelledby="encomendas">
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
      </section>
    </>
  );
}
