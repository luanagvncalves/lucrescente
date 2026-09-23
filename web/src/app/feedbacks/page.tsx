import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { testimonials } from "@/data/testimonials";
import { getTestimonialCopy, type Testimonial } from "@/data/testimonials";
import { Label } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import type { ProductLocale } from "@/content/product-locales";

export const metadata: Metadata = {
  title: "feedbacks",
  robots: { index: true },
};

function Stars({ count }: { count: number }) {
  return (
    <p aria-label={`${count} de 5 estrelas`} className="text-clay text-[0.95rem] tracking-wide">
      {"★".repeat(count)}
      <span className="text-clay/25">{"★".repeat(Math.max(0, 5 - count))}</span>
    </p>
  );
}

function TestimonialCard({ item, locale }: { item: Testimonial; locale: ProductLocale }) {
  const copy = getTestimonialCopy(item, locale);

  return (
    <div className="card-brand flex flex-col gap-4 p-6">
      <Stars count={item.stars} />
      <p className="font-display text-[1.1rem] leading-snug text-forest">
        {item.verbatim === false ? copy.quote : `"${copy.quote}"`}
      </p>
      <div className="mt-auto pt-2 text-[0.85rem] text-ink/70">
        <p className="lowercase">{copy.product}</p>
        {item.year ? <p className="mt-1 text-ink/50">{item.year}</p> : null}
      </div>
    </div>
  );
}

export default async function FeedbacksPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);

  return (
    <article className="container-brand section-gap">
      <Reveal>
        <header className="max-w-3xl">
          <Label>{t.home.testimonialsLabel}</Label>
          <h1 className="mt-4 text-h1 text-forest lowercase">{t.home.testimonialsTitle}</h1>
          <p className="mt-6 text-body-lg measure">{t.home.testimonialsSubtitle}</p>
        </header>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <TestimonialCard item={item} locale={locale} />
          </Reveal>
        ))}
      </div>
    </article>
  );
}
