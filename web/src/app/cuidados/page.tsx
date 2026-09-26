import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary, t as pt } from "@/lib/i18n";
import { editorial, type EditorialKey } from "@/data/editorial";
import { getImageAlt } from "@/content/image-alt-locales";
import { Label } from "@/components/ui/typography";
import { Crescent } from "@/components/ui/motifs";

// Metadata is built once per route, before the query string is known, so the
// tab title and the search-result snippet stay in Portuguese. The page itself
// follows the visitor's language.
export const metadata: Metadata = {
  title: pt.care.label,
  description: pt.care.intro,
  alternates: { canonical: "/cuidados" },
};

const imageFor: Record<string, EditorialKey | undefined> = {
  "poupamos-agua": "cuidados-solidos",
  embalagens: "cuidados-reuse",
  velas: "cuidados-velas",
};

export default async function CarePage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  return (
    <article className="container-brand pt-10 md:pt-16">
      <header className="max-w-3xl">
        <Label>{t.care.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{t.care.title}</h1>
        <p className="mt-6 text-body-lg measure">{t.care.intro}</p>
      </header>

      <nav aria-label="capítulos" className="mt-10 flex flex-wrap gap-2">
        {t.care.chapters.map((c) => (
          <a key={c.slug} href={`#${c.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-moss/40 px-4 font-ui text-[0.88rem] font-medium text-forest hover:border-forest">
            {c.title}
          </a>
        ))}
      </nav>

      <div className="mt-16 space-y-20 md:space-y-28">
        {t.care.chapters.map((c, idx) => {
          const key = imageFor[c.slug];
          const img = key ? (editorial[key] as { path: string; alt: string } | null) : null;
          const flip = idx % 2 === 1;
          return (
            <section key={c.slug} id={c.slug} className="scroll-mt-28 grid items-center gap-8 md:grid-cols-12" aria-labelledby={`h-${c.slug}`}>
              <div className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                <div className="flex items-center gap-3 text-clay">
                  <Crescent size={14} />
                  <span className="label-brand">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <h2 id={`h-${c.slug}`} className="mt-3 text-h2 text-forest lowercase">
                  {c.title}
                </h2>
                <p className="mt-5 text-body-lg measure">{c.text}</p>
              </div>
              <div className={`md:col-span-6 ${flip ? "md:order-1" : "md:col-start-7"}`}>
                {img ? (
                  <div className="frame-brand relative aspect-[5/4] bg-paper">
                    <Image src={img.path} alt={getImageAlt(img.alt, locale)} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className={`hidden aspect-[5/4] rounded-[20px] md:block ${idx % 3 === 0 ? "bg-lavender/35" : idx % 3 === 1 ? "bg-moss/15" : "bg-paper border border-moss/18"}`} aria-hidden="true" />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
