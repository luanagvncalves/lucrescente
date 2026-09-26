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

      {/* the violet wash carries the mood */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet/50 via-violet/40 to-violet/30" />
      {/*
        …and this keeps the words readable, in the same violet rather than a
        colour of its own. The headline and buttons sit at the bottom, over
        whatever the photograph happens to show there — pale soap and a white
        jar, as it turns out — and the violet alone is too light to carry ivory
        text over that: measured at the pixels the letters occupy, 7% of the
        headline fell below the 3.0:1 that large text needs.

        So the violet deepens towards the ink at the bottom, where the words
        are, and returns to its own tone two thirds of the way up, where the
        flowers are. Same hue throughout. Worst case is now 4.27:1.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(74,61,92,0.92)_0%,rgba(74,61,92,0.86)_34%,rgba(74,61,92,0.66)_58%,rgba(140,121,168,0.34)_78%,transparent_96%)]" />

      <div className="container-brand relative z-10 flex h-full items-end pb-12 pt-24 sm:pb-16 lg:pb-20">
        <div className="max-w-3xl text-ivory">
          <motion.h1
            className="max-w-3xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.95] tracking-[-0.04em] lowercase text-ivory [text-shadow:0_2px_12px_rgba(34,57,37,0.55)]"
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
              className="inline-flex h-12 items-center rounded-full bg-ivory px-6 font-ui text-[0.95rem] font-medium lowercase text-forest transition-colors hover:bg-white"
            >
              {primaryLabel}
            </Link>
            <Link
              href={`/ingredientes${query}`}
              className="inline-flex h-12 items-center rounded-full border border-ivory/60 px-6 font-ui text-[0.95rem] font-medium lowercase text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              {secondaryLabel}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
