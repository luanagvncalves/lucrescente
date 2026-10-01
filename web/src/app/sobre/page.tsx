import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, t } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { ProductGallery } from "@/components/product/product-gallery";
import { editorial } from "@/data/editorial";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: t.nav.about,
  description: t.about.intro,
  alternates: { canonical: "/sobre" },
};

export default async function AboutPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const d = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  const photo = editorial.sobre;
  return (
    <article className="container-brand pt-10 md:pt-16">
      <Reveal>
        <header className="max-w-3xl">
          <Label>{d.about.label}</Label>
          <h1 className="mt-4 text-h1 text-forest lowercase">{d.about.title}</h1>
          <p className="mt-6 text-body-lg measure">{d.about.intro}</p>
        </header>
      </Reveal>

      <div className="mt-14 grid items-start gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          {photo ? (
            <ProductGallery
              images={[
                { path: photo.path, alt: photo.alt, is_primary: true, sort_order: 0 },
                { path: "/images/editorial/sobre-2.jpg", alt: "duas mulheres a sorrir dentro de uma tenda branca, com uma mesa rosa de produtos lucrescente e girassóis", is_primary: false, sort_order: 1 },
              ]}
              name={d.about.title}
              locale={locale}
            />
          ) : null}
        </Reveal>
        <div className="space-y-12 md:col-span-5 md:pt-6">
          <Reveal delay={0.12}>
            <section aria-labelledby="lucie">
              <h2 id="lucie" className="text-h2 text-forest lowercase">
              {d.about.lucieName.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg measure">{d.about.lucieText}</p>
            <div className="mt-6 space-y-2 text-[0.95rem] text-forest">
              <p>
                <a href={`mailto:${d.brand.lucieEmail}`} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
                  {d.brand.lucieEmail}
                </a>
              </p>
              <p>
                <a href={d.brand.luciePhonePTTel} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
                  {d.brand.luciePhonePTDisplay}
                </a>
                <span className="text-ink/60"> (PT)</span>
              </p>
              <p>
                <a href={d.brand.luciePhoneCHTel} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
                  {d.brand.luciePhoneCHDisplay}
                </a>
                <span className="text-ink/60"> (CH)</span>
              </p>
            </div>
            </section>
          </Reveal>
          <Reveal delay={0.12}>
            <section aria-labelledby="luana">
              <h2 id="luana" className="text-h2 text-forest lowercase">
                {d.about.luanaName.toLowerCase()}
              </h2>
              <p className="mt-4 text-body-lg measure">{d.about.luanaText}</p>
              <div className="mt-6 space-y-2 text-[0.95rem] text-forest">
                <p>
                  <a href={`mailto:${d.brand.email}`} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
                    {d.brand.email}
                  </a>
                </p>
                <p>
                  <a href={d.brand.phoneTel} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">
                    {d.brand.phoneDisplay}
                  </a>
                </p>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      <Pause className="my-16" />

      <Reveal>
        <section className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-forest">{d.about.close}</p>
          {/* a curl of growth to close the story on — decorative only */}
          <p aria-hidden="true" className="mt-7 text-[2.4rem] leading-none text-clay/80">
            ಄
          </p>
          <Link href={`/${query}`} className="mt-6 inline-flex min-h-11 items-center font-ui font-medium text-moss hover:underline underline-offset-4">
            {d.about.backLink}
          </Link>
        </section>
      </Reveal>
    </article>
  );
}
