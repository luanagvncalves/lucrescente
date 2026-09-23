"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage as Img } from "@/lib/types";

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  const goToPrevious = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div>
      <div className="frame-brand relative aspect-[3/4] max-h-[80vh] w-full bg-paper group">
        <Image key={current.path} src={current.path} alt={current.alt} fill priority={index === 0} sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="imagem anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              aria-label="próxima imagem"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
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
      <ul className="mt-3 flex gap-3" aria-label={`fotografias de ${name}`}>
        {images.map((img, i) => (
          <li key={img.path}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={img.alt}
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
