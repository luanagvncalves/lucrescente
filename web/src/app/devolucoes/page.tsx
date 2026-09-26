import type { Metadata } from "next";
import { getDictionary, t as pt } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { Crescent, Pause } from "@/components/ui/motifs";
import { ContactLinks } from "@/components/contact/contact-links";

// Metadata is built once per route, before the query string is known, so the
// tab title and the search-result snippet stay in Portuguese.
export const metadata: Metadata = {
  title: pt.returns.label,
  description: pt.returns.intro,
  alternates: { canonical: "/devolucoes" },
};

export default async function ReturnsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);

  return (
    <article className="container-brand pt-10 md:pt-16">
      <header className="max-w-3xl">
        <Label>{t.returns.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{t.returns.title}</h1>
        <p className="mt-6 text-body-lg measure">{t.returns.intro}</p>
      </header>

      {/*
        Plain sections rather than an accordion: someone reading this has a
        broken jar in their hand and wants the answer, not something to click.
      */}
      <div className="mt-14 space-y-12">
        {t.returns.groups.map((group, i) => (
          <section key={group.title} aria-labelledby={`devolucao-${i}`}>
            <div className="flex items-center gap-3 text-clay">
              <Crescent size={14} />
              <span className="label-brand">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h2 id={`devolucao-${i}`} className="mt-3 text-h3 text-forest lowercase">
              {group.title}
            </h2>
            <p className="mt-4 text-body-lg measure">{group.text}</p>
          </section>
        ))}
      </div>

      <Pause className="my-16" />

      <section className="pb-4" aria-labelledby="devolucoes-contacto">
        <h2 id="devolucoes-contacto" className="text-h3 text-forest lowercase">
          {t.returns.contactTitle}
        </h2>
        <div className="mt-6">
          <ContactLinks locale={locale} />
        </div>
      </section>
    </article>
  );
}
