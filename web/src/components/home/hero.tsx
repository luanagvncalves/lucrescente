"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HomeHero({
  hero,
  title,
}: {
  hero: { path: string; alt: string } | null;
  title: string;
}) {
  const [fade, setFade] = useState(1);
  const [scale, setScale] = useState(1.08);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const renderTextWithBreaks = (text: string) => {
    const words = text.split(" ");
    let line1: string[] = [];
    let line2: string[] = [];
    let line3: string[] = [];
    let currentLine = 1;
    let currentLength = 0;

    for (const word of words) {
      const wordLength = word.length;

      if (currentLine === 1) {
        if (currentLength + wordLength + line1.length > 20) {
          currentLine = 2;
          currentLength = 0;
        } else {
          line1.push(word);
          currentLength += wordLength;
        }
      }

      if (currentLine === 2) {
        if (currentLength + wordLength + line2.length > 22) {
          currentLine = 3;
          currentLength = 0;
        } else {
          line2.push(word);
          currentLength += wordLength;
        }
      }

      if (currentLine === 3) {
        line3.push(word);
      }
    }

    return { line1: line1.join(" "), line2: line2.join(" "), line3: line3.join(" ") };
  };

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
            style={{ opacity: fade, transform: `scale(${scale})`, filter: "saturate(0.9) brightness(0.75)" }}
          />
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-violet/50 via-violet/40 to-violet/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ivory/5" />

      <div className="container-brand relative z-10 flex h-full items-end pb-12 pt-24 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl text-ivory">
          <motion.h1
            className="max-w-2xl font-display text-[clamp(3.2rem,7vw,5rem)] leading-[1.1] tracking-[-0.04em] lowercase text-ivory"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {(() => {
              const { line1, line2, line3 } = renderTextWithBreaks(displayedText);
              return (
                <>
                  {line1}
                  {line2 && (
                    <>
                      <br />
                      {line2}
                    </>
                  )}
                  {line3 && (
                    <>
                      <br />
                      {line3}
                    </>
                  )}
                  {isTyping && <span className="animate-pulse">|</span>}
                </>
              );
            })()}
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
