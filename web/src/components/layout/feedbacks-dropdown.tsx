"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getTestimonialCopy, type Testimonial } from "@/data/testimonials";
import type { ProductLocale } from "@/content/product-locales";

function Stars({ count }: { count: number }) {
  return (
    <p aria-label={`${count} de 5 estrelas`} className="text-clay text-[0.75rem] tracking-wide">
      {"★".repeat(count)}
      <span className="text-clay/25">{"★".repeat(Math.max(0, 5 - count))}</span>
    </p>
  );
}

interface FeedbacksDropdownProps {
  items: Testimonial[];
  locale?: ProductLocale;
}

export function FeedbacksDropdown({ items, locale = "pt" }: FeedbacksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 items-center font-ui text-[0.95rem] font-medium lowercase transition-colors ${
          isOpen ? "text-forest" : "text-ink/80 hover:text-forest"
        }`}
      >
        {t.nav.feedback}
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto rounded-2xl bg-ivory shadow-lg border border-moss/15 z-50">
          <div className="divide-y divide-moss/15">
            {items.slice(0, 6).map((item) => {
              const copy = getTestimonialCopy(item, locale);
              return (
                <div key={item.id} className="p-4 hover:bg-ivory/50 transition-colors">
                  <Stars count={item.stars} />
                  <p className="mt-2 line-clamp-2 text-[0.9rem] leading-snug text-forest">
                    {item.verbatim === false ? copy.quote : `"${copy.quote}"`}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-ink/70 lowercase">{copy.product}</p>
                </div>
              );
            })}
          </div>
          <Link
            href="/feedbacks"
            onClick={() => setIsOpen(false)}
            className="block p-4 text-center border-t border-moss/15 text-[0.9rem] font-medium text-forest hover:bg-ivory/50 transition-colors lowercase"
          >
            ver todos os feedbacks →
          </Link>
        </div>
      )}
    </div>
  );
}
