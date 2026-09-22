"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { getTestimonialCopy, type Testimonial } from "@/data/testimonials";
import type { ProductLocale } from "@/content/product-locales";

function Stars({ count }: { count: number }) {
  return (
    <p aria-label={`${count} de 5 estrelas`} className="text-clay text-[0.95rem] tracking-wide">
      {"★".repeat(count)}
      <span className="text-clay/25">{"★".repeat(Math.max(0, 5 - count))}</span>
    </p>
  );
}

/**
 * Testimonial cards clamp their quote to 10 lines (the `line-clamp-[10]`
 * class below) and expand on hover to show the rest — that 10-line ceiling
 * is a deliberate product rule (not just a visual default). Tailwind needs
 * the literal class string in source to generate its CSS, so if this ever
 * changes, edit the class directly rather than making it a variable.
 */
export function Testimonials({
  label,
  title,
  subtitle,
  items,
  locale = "pt",
  prevLabel = "anterior",
  nextLabel = "seguinte",
}: {
  label: string;
  title: string;
  subtitle?: string;
  items: Testimonial[];
  locale?: ProductLocale;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: 1 | -1) {
    scroller.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  return (
    <section className="bg-ivory" aria-labelledby="testemunhos">
      <div className="container-brand section-gap !pb-10">
        <SectionHeader label={label} title={title} subtitle={subtitle} />

        <Reveal>
          <div className="relative mt-10">
            <button
              type="button"
              aria-label={prevLabel}
              onClick={() => scrollByCard(-1)}
              className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/25 bg-ivory text-forest shadow-[0_6px_16px_rgba(49,61,53,0.12)] transition-colors hover:border-forest hover:bg-forest hover:text-white sm:flex"
            >
              ←
            </button>

            <ul
              ref={scroller}
              className="flex items-start gap-5 overflow-x-auto scroll-px-5 px-1 py-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((item) => {
                const copy = getTestimonialCopy(item, locale);
                return (
                  <li
                    key={item.id}
                    className="card-brand group flex w-[300px] shrink-0 snap-start flex-col gap-3 p-6 transition-shadow hover:z-10 hover:shadow-[0_18px_36px_rgba(49,61,53,0.14)] sm:w-[340px]"
                  >
                    <Stars count={item.stars} />
                    <p className="line-clamp-[10] font-display text-[1.1rem] leading-snug text-forest group-hover:line-clamp-none">
                      {item.verbatim === false ? copy.quote : `“${copy.quote}”`}
                    </p>
                    <div className="mt-auto pt-1 text-[0.82rem] text-ink/70">
                      <p className="lowercase">{copy.product}</p>
                      {item.year ? <p className="mt-0.5 text-ink/50">{item.year}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => scrollByCard(1)}
              className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/25 bg-ivory text-forest shadow-[0_6px_16px_rgba(49,61,53,0.12)] transition-colors hover:border-forest hover:bg-forest hover:text-white sm:flex"
            >
              →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
