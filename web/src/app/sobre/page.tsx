import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, t } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { editorial } from "@/data/editorial";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";

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
      <header className="max-w-3xl">
        <Label>{d.about.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{d.about.title}</h1>
        <p className="mt-6 text-body-lg measure">{d.about.intro}</p>
      </header>

      <div className="mt-14 grid items-start gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          {photo ? (
            <div className="frame-brand relative aspect-[4/5] bg-paper md:aspect-[5/6]">
              <Image src={photo.path} alt={photo.alt} fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
            </div>
          ) : null}
        </div>
        <div className="space-y-12 md:col-span-5 md:pt-6">
          <section aria-labelledby="lucie">
            <h2 id="lucie" className="text-h2 text-forest lowercase">
              {d.about.lucieName.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg measure">{d.about.lucieText}</p>
            <div className="mt-6 space-y-2 text-[0.95rem] text-forest">
              <p>
                <a href={`mailto:${d.brand.lucieEmail}`} className="hover:underline underline-offset-4">
                  {d.brand.lucieEmail}
                </a>
              </p>
              <p>
                <a href={d.brand.luciePhonePTTel} className="hover:underline underline-offset-4">
                  {d.brand.luciePhonePTDisplay}
                </a>
                <span className="text-ink/60"> (PT)</span>
              </p>
              <p>
                <a href={d.brand.luciePhoneCHTel} className="hover:underline underline-offset-4">
                  {d.brand.luciePhoneCHDisplay}
                </a>
                <span className="text-ink/60"> (CH)</span>
              </p>
            </div>
          </section>
          <section aria-labelledby="luana">
            <h2 id="luana" className="text-h2 text-forest lowercase">
              {d.about.luanaName.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg measure">{d.about.luanaText}</p>
            <div className="mt-6 space-y-2 text-[0.95rem] text-forest">
              <p>
                <a href={`mailto:${d.brand.email}`} className="hover:underline underline-offset-4">
                  {d.brand.email}
                </a>
              </p>
              <p>
                <a href={d.brand.phoneTel} className="hover:underline underline-offset-4">
                  {d.brand.phoneDisplay}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Pause className="my-16" />

      <section className="mx-auto max-w-2xl text-center">
        <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-forest">{d.about.close}</p>
        <Link href={`/${query}`} className="mt-8 inline-flex min-h-11 items-center font-ui font-medium text-moss hover:underline underline-offset-4">
          {d.about.backLink}
        </Link>
      </section>
    </article>
  );
}
