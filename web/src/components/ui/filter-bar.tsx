"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FilterOption = { key: string; label: string; count?: number };

/** Horizontal category chips that scroll sideways, with arrows once they overflow. */
export function FilterBar({
  ariaLabel,
  options,
  activeKey,
  onSelect,
  labels,
}: {
  ariaLabel: string;
  options: FilterOption[];
  activeKey: string;
  onSelect: (key: string) => void;
  labels: { previous: string; next: string };
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 1, right: Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1 });
    const bounds = el.getBoundingClientRect();
    el.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
      const rect = button.getBoundingClientRect();
      button.style.visibility = rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 ? "visible" : "hidden";
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    const refresh = () => syncEdges();
    document.fonts.addEventListener("loadingdone", refresh);
    void document.fonts.ready.then(refresh);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", refresh);
    };
  }, [syncEdges, options]);

  function nudge(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>("button"));
    const target = direction === 1
      ? buttons.find((button) => button.getBoundingClientRect().right > bounds.right + 1)
      : buttons.reverse().find((button) => button.getBoundingClientRect().left < bounds.left - 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target) el.scrollTo({ left: el.scrollLeft + target.getBoundingClientRect().left - bounds.left, behavior: reduced ? "auto" : "smooth" });
  }

  const chip = (isActive: boolean) =>
    `inline-flex h-11 max-w-full shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 font-ui text-[0.9rem] font-medium lowercase transition-colors ${
      isActive ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
    }`;

  const arrowBase =
    "grid h-9 w-9 place-items-center rounded-full border border-moss/40 bg-ivory text-forest transition-colors hover:border-forest disabled:cursor-default disabled:opacity-40";

  return (
    <nav aria-label={ariaLabel} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 lg:flex-1">
          <button type="button" aria-label={labels.previous} disabled={!edges.left} className={arrowBase} onClick={() => nudge(-1)}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

      <div
        ref={scrollerRef}
        onScroll={syncEdges}
        className="flex min-w-0 gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {options.map((o) => (
          <button key={o.key} type="button" className={chip(activeKey === o.key)} aria-pressed={activeKey === o.key} onClick={() => onSelect(o.key)}>
            <span className="min-w-0 truncate">{o.label}</span>
            {o.count === undefined ? null : <span className="shrink-0 opacity-60">{o.count}</span>}
          </button>
        ))}
      </div>

          <button type="button" aria-label={labels.next} disabled={!edges.right} className={arrowBase} onClick={() => nudge(1)}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
    </nav>
  );
}
