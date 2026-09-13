import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { editorial } from "@/data/editorial";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";

export const metadata: Metadata = {
  title: t.nav.about,
  description: t.about.intro,
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  const photo = editorial.sobre;
  return (
    <article className="container-brand pt-10 md:pt-16">
      <header className="max-w-3xl">
        <Label>{t.about.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{t.about.title}</h1>
        <p className="mt-6 text-body-lg measure">{t.about.intro}</p>
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
              {t.about.lucieName.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg measure">{t.about.lucieText}</p>
          </section>
          <section aria-labelledby="luana">
            <h2 id="luana" className="text-h2 text-forest lowercase">
              {t.about.luanaName.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg measure">{t.about.luanaText}</p>
          </section>
        </div>
      </div>

      <Pause className="my-16" />

      <section className="mx-auto max-w-2xl text-center">
        <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-forest">{t.about.close}</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center font-ui font-medium text-moss hover:underline underline-offset-4">
          {t.about.backLink}
        </Link>
      </section>
    </article>
  );
}
