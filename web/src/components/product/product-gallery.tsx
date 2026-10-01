"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { getImageAlt } from "@/content/image-alt-locales";
import type { ProductLocale } from "@/content/product-locales";
import type { ProductImage as Img } from "@/lib/types";

export function ProductGallery({ images, name, locale = "pt" }: { images: Img[]; name: string; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToPrevious = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div>
      {/*
        The ceiling is on the WIDTH, not the height. `max-h-[80vh]` used to cap
        the frame directly, and a capped height with a full width is no longer
        three by four — the box went nearly square and `object-cover` answered
        by cutting the top and bottom off every photograph, including the ones
        already shot at 3:4. Capping the width at 60vh leaves the frame exactly
        80vh tall at that ratio, so the frame stays 3:4 at every screen size and
        a 3:4 photograph fills it edge to edge with nothing cropped away.
      */}
      <div
        className="frame-brand relative aspect-[3/4] w-full max-w-[60vh] bg-paper group"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          // a swipe of more than 40px moves one photo, like the arrows
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null || images.length < 2) return;
          const dx = e.changedTouches[0].clientX - start;
          if (dx <= -40) goToNext();
          else if (dx >= 40) goToPrevious();
        }}
      >
        {/*
          Every photograph is on the page from the start, stacked, and the slide
          only changes which one is visible. Mounting the next one on click left
          the frame blank (the paper colour) until it had downloaded — on a slow
          connection that was two white photographs in a row.
        */}
        {images.map((img, i) => (
          <Image
            key={img.path}
            src={img.path}
            alt={getImageAlt(img.alt, locale)}
            fill
            priority={i === 0}
            loading="eager"
            aria-hidden={i !== index}
            sizes="(min-width: 768px) 58vw, 100vw"
            className={`object-cover object-center transition-opacity duration-200 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label={t.products.galleryPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              aria-label={t.products.galleryNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/40 text-white px-3 py-1 rounded-full text-sm font-medium">
              {index + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      {/*
        Scrolls rather than overflowing. Every product used to have three photos
        at most, so a plain flex row fitted; the candle with a message has
        fourteen, and on a phone that row was a thousand pixels wide and gave the
        whole page a sideways scroll.
      */}
      <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label={t.products.galleryOf(name)}>
        {images.map((img, i) => (
          <li key={img.path} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={getImageAlt(img.alt, locale)}
              className={`relative h-20 w-16 overflow-hidden rounded-xl border-2 transition-colors ${i === index ? "border-forest" : "border-transparent hover:border-moss/50"}`}
            >
              <Image src={img.path} alt="" fill sizes="64px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
