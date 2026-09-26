import type { Metadata } from "next";
import { getDictionary, t as pt } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { Crescent, Pause } from "@/components/ui/motifs";
import { TextLink } from "@/components/ui/button";
import { ContactLinks } from "@/components/contact/contact-links";

// Metadata is built once per route, before the query string is known, so the
// tab title and the search-result snippet stay in Portuguese.
export const metadata: Metadata = {
  title: pt.faq.label,
  description: pt.faq.intro,
  alternates: { canonical: "/perguntas-frequentes" },
};

export default async function FaqPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  // Lets Google show these questions directly in the results, which is most of
  // the point of having the page at all.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <article className="container-brand pt-10 md:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="max-w-3xl">
        <Label>{t.faq.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{t.faq.title}</h1>
        <p className="mt-6 text-body-lg measure">{t.faq.intro}</p>
      </header>

      <div className="mt-16 space-y-16">
        {t.faq.groups.map((group, groupIndex) => (
          <section key={group.title} aria-labelledby={`grupo-${groupIndex}`}>
            <div className="flex items-center gap-3 text-clay">
              <Crescent size={14} />
              <span className="label-brand">{String(groupIndex + 1).padStart(2, "0")}</span>
            </div>
            <h2 id={`grupo-${groupIndex}`} className="mt-3 text-h2 text-forest lowercase">
              {group.title}
            </h2>

            {/* <details> so every answer is readable, printable and findable with
                ctrl+F even before any JavaScript has run */}
            <ul className="mt-8 space-y-3">
              {group.items.map((item) => (
                <li key={item.q}>
                  <details className="card-brand group overflow-hidden px-6 py-1 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-[1.25rem] leading-snug text-forest lowercase">
                      {item.q}
                      <span className="shrink-0 text-moss transition-transform duration-200 ease-[var(--ease-calm)] group-open:rotate-45" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="measure pb-5 text-body-lg">{item.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Pause className="my-16" />

      <section className="pb-4" aria-labelledby="ainda-com-duvidas">
        <h2 id="ainda-com-duvidas" className="text-h3 text-forest lowercase">
          {t.faq.stillAsking}
        </h2>
        <div className="mt-6">
          <ContactLinks locale={locale} />
        </div>
        <TextLink href={`/cuidados${query}`} className="mt-8">
          {t.nav.care}
        </TextLink>
      </section>
    </article>
  );
}
