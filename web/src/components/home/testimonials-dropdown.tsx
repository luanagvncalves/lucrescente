"use client";

import { useState } from "react";
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

export function TestimonialsDropdown({
  label,
  title,
  subtitle,
  items,
  locale = "pt",
}: {
  label: string;
  title: string;
  subtitle?: string;
  items: Testimonial[];
  locale?: ProductLocale;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-ivory" aria-labelledby="testemunhos">
      <div className="container-brand section-gap">
        <SectionHeader label={label} title={title} subtitle={subtitle} />

        <Reveal>
          <div className="mt-10 max-w-3xl space-y-3">
            {items.map((item) => {
              const copy = getTestimonialCopy(item, locale);
              const isOpen = openId === item.id;

              return (
                <div key={item.id} className="card-brand overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full px-6 py-4 text-left transition-colors hover:bg-forest/5"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Stars count={item.stars} />
                        <p className="mt-2 line-clamp-2 text-[1rem] leading-snug text-forest">
                          {item.verbatim === false ? copy.quote : `"${copy.quote}"`}
                        </p>
                        <p className="mt-2 text-[0.82rem] text-ink/70 lowercase">{copy.product}</p>
                      </div>
                      <span className={`mt-1 text-forest transition-transform ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-moss/15 bg-ivory/50 px-6 py-4">
                      <p className="text-[1rem] leading-relaxed text-forest">
                        {item.verbatim === false ? copy.quote : `"${copy.quote}"`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
