"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HomeHero({
  hero,
  title,
}: {
  hero: { path: string; alt: string } | null;
  title: string;
}) {
  const [fade, setFade] = useState(1);
  const [scale, setScale] = useState(1.08);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const nextFade = Math.max(0.2, 1 - scroll / 900);
      const nextScale = 1.08 + scroll / 1800;
      setFade(nextFade);
      setScale(nextScale);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative -mt-[72px] h-[100vh] min-h-[680px] overflow-hidden bg-forest">
      {hero ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={hero.path}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover transition-opacity duration-300 ease-out"
            style={{ opacity: fade, transform: `scale(${scale})`, filter: "saturate(0.9) brightness(0.75)" }}
          />
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-violet/50 via-violet/40 to-violet/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ivory/5" />

      <div className="container-brand relative z-10 flex h-full items-end pb-12 pt-24 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl text-ivory">
          <h1 className="max-w-3xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.95] tracking-[-0.04em] lowercase text-ivory">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
