"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage as Img } from "@/lib/types";

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  return (
    <div>
      <div className="frame-brand relative aspect-[4/5] max-h-[80vh] w-full bg-paper">
        <Image key={current.path} src={current.path} alt={current.alt} fill priority={index === 0} sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
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
