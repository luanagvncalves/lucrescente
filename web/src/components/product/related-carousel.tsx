"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { formatPrice, productAvailability, type Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/product-image";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";

const STEP_MS = 3200;

/**
 * "cria o teu conjunto": the other products, drifting leftwards on its own.
 * Auto-advance pauses while the visitor is hovering, touching or tabbing through
 * it, and never starts for anyone who asked for reduced motion.
 */
export function RelatedCarousel({ items, locale = "pt" }: { items: Product[]; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const trackRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    // wrap round to the start instead of stalling against the right-hand edge
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 8) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: step * dir, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => scrollByCard(1), STEP_MS);
    return () => clearInterval(id);
  }, [paused, scrollByCard]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="conjunto">
      <div className="flex items-end justify-between gap-4">
        <h2 id="conjunto" className="text-h3 text-forest lowercase md:text-[2rem]">
          {t.products.relatedTitle}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <CarouselButton label={t.products.relatedPrev} onClick={() => scrollByCard(-1)} dir="left" />
          <CarouselButton label={t.products.relatedNext} onClick={() => scrollByCard(1)} dir="right" />
        </div>
      </div>

      <ul
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {items.map((p) => {
          const copy = getProductCopy(p.slug, locale, { name: p.name });
          const avail = productAvailability(p);
          return (
            <li key={p.slug} className="w-[220px] shrink-0 snap-start sm:w-[250px]">
              <Link
                href={`/produtos/${p.slug}${query}`}
                className="group card-brand flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <ProductImage
                  image={p.images[0] ?? null}
                  ratio="square"
                  rounded={false}
                  sizes="250px"
                  fallbackLabel={copy.name}
                  className="transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="font-display text-[1.15rem] leading-tight text-forest lowercase">{copy.name}</h3>
                  <span className="mt-auto pt-2 font-ui text-[0.95rem] font-medium text-forest">
                    {avail.kind === "on-request" ? t.products.onRequest : formatPrice(avail.price_cents)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CarouselButton({ label, onClick, dir }: { label: string; onClick: () => void; dir: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-moss/40 text-forest transition-colors hover:border-forest hover:bg-forest/5"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
