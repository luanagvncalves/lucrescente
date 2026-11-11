"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { formatPrice, productAvailability, type Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/product-image";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";

const SCROLL_SPEED = 28;

function cycleLength(list: HTMLUListElement, count: number) {
  const first = list.children[0] as HTMLElement | undefined;
  const twin = list.children[count] as HTMLElement | undefined;
  return first && twin ? twin.offsetLeft - first.offsetLeft : 0;
}

/**
 * "cria o teu conjunto": the other products, drifting leftwards on its own.
 * Auto-advance pauses while the visitor is hovering, touching or tabbing through
 * it, and never starts for anyone who asked for reduced motion.
 */
export function RelatedCarousel({ items, locale = "pt" }: { items: Product[]; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const trackRef = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const focused = useRef(false);
  const dragging = useRef(false);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const cycle = cycleLength(el, items.length);
    if (dir === -1 && cycle > 0 && el.scrollLeft < step) el.scrollLeft += cycle;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduced ? "auto" : "smooth" });
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last = performance.now();
    let position = el.scrollLeft;
    function step(now: number) {
      frame = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (hovering.current || focused.current || dragging.current || document.hidden) {
        position = el!.scrollLeft;
        return;
      }
      const cycle = cycleLength(el!, items.length);
      if (cycle <= 0) return;
      position = (position + SCROLL_SPEED * dt) % cycle;
      el!.scrollLeft = position;
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="conjunto"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => { hovering.current = false; dragging.current = false; }}
      onFocusCapture={(e) => { focused.current = e.target instanceof HTMLElement && e.target.matches(":focus-visible"); }}
      onBlurCapture={() => (focused.current = false)}
      onPointerDown={() => (dragging.current = true)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onTouchStart={() => (dragging.current = true)}
      onTouchEnd={() => (dragging.current = false)}
      onTouchCancel={() => (dragging.current = false)}
    >
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
        className="relative mt-6 flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(items.length > 1 ? [0, 1] : [0]).flatMap((copyIndex) => items.map((p) => {
          const copy = getProductCopy(p.slug, locale, { name: p.name });
          const avail = productAvailability(p);
          return (
            <li key={`${copyIndex}-${p.slug}`} aria-hidden={copyIndex === 1 || undefined} className="w-[220px] shrink-0 sm:w-[250px]">
              <Link
                href={`/produtos/${p.slug}${query}`}
                tabIndex={copyIndex === 1 ? -1 : undefined}
                className="group card-brand flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <ProductImage
                  image={p.images[0] ?? null}
                  ratio="portrait"
                  rounded={false}
                  sizes="(min-width: 640px) 250px, 220px"
                  loading="eager"
                  fallbackLabel={copy.name}
                  locale={locale}
                  className="shrink-0 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 data-wrap-heading className="font-display text-[1.15rem] leading-tight text-forest lowercase">{copy.name}</h3>
                  <span className="mt-auto pt-2 font-ui text-[0.95rem] font-medium text-forest">
                    {avail.kind === "on-request" ? t.products.onRequest : formatPrice(avail.price_cents)}
                  </span>
                </div>
              </Link>
            </li>
          );
        }))}
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
