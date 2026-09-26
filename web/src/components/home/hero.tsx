"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HomeHero({
  hero,
  title,
  primaryLabel,
  secondaryLabel,
  query = "",
}: {
  hero: { path: string; alt: string } | null;
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  /** "?idioma=en" etc., so the hero links keep the chosen language. */
  query?: string;
}) {
  const [fade, setFade] = useState(1);
  const [scale, setScale] = useState(1.08);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Someone who has asked their system to reduce motion gets the whole
  // sentence at once instead of watching it appear letter by letter.
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) { setDisplayedText(title); setIsTyping(false); }
  }, [title]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < title.length) {
      const timer = setTimeout(() => {
        setDisplayedText(title.slice(0, displayedText.length + 1));
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, title]);

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
            style={{ opacity: fade, transform: `scale(${scale})`, filter: "saturate(1) brightness(0.92)" }}
          />
        </div>
      ) : null}

      {/*
        One even wash of the brand's light violet over the whole photograph, as
        the header was originally — no gradient, nothing heavier at the bottom.

        The words had to change colour for it. #beb2dd is light: cream letters
        on it measure 1.74:1, where large text needs 3.0:1, so the headline
        would have been unreadable however thick the wash. Dark green on the
        same violet measures 6.31:1, which is why the heading and the outlined
        button are forest now rather than ivory.
      */}
      <div className="absolute inset-0 bg-lavender/[0.72]" />


      <div className="container-brand relative z-10 flex h-full items-end pb-12 pt-24 sm:pb-16 lg:pb-20">
        <div className="max-w-3xl text-forest">
          <motion.h1
            className="max-w-3xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.95] tracking-[-0.04em] lowercase text-forest"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/*
              The whole sentence lives here from the first render. It used to be
              only the letters typed so far, which meant a screen reader
              announced a half-finished headline — and anything reading the page
              before the animation ended, a search engine included, saw the
              brand's opening line cut off mid-word.
              The visible half is hidden from assistive tech so it is not read twice.
            */}
            <span className="sr-only">{title}</span>
            <span aria-hidden="true">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </motion.h1>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          >
            <Link
              href={`/produtos${query}`}
              className="inline-flex h-12 items-center rounded-full bg-forest px-6 font-ui text-[0.95rem] font-medium lowercase text-ivory transition-colors hover:bg-forest/90"
            >
              {primaryLabel}
            </Link>
            <Link
              href={`/ingredientes${query}`}
              className="inline-flex h-12 items-center rounded-full border border-forest/50 px-6 font-ui text-[0.95rem] font-medium lowercase text-forest transition-colors hover:border-forest hover:bg-forest/10"
            >
              {secondaryLabel}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
