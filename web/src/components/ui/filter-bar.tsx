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
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncEdges, options]);

  function nudge(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
  }

  const chip = (isActive: boolean) =>
    `inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 font-ui text-[0.9rem] font-medium lowercase transition-colors ${
      isActive ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
    }`;

  const arrowBase =
    "absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-moss/40 bg-ivory text-forest shadow-[var(--shadow-soft)] transition-colors hover:border-forest";
  const fadeBase = "pointer-events-none absolute top-0 z-[5] h-full w-16 from-ivory via-ivory/90 to-transparent";

  return (
    <nav aria-label={ariaLabel} className="relative min-w-0 lg:flex-1">
      {edges.left ? (
        <>
          <div aria-hidden="true" className={`${fadeBase} left-0 bg-gradient-to-r`} />
          <button type="button" aria-label={labels.previous} className={`${arrowBase} left-0`} onClick={() => nudge(-1)}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        onScroll={syncEdges}
        className={`flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${edges.left ? "pl-11" : ""} ${edges.right ? "pr-11" : ""}`}
      >
        {options.map((o) => (
          <button key={o.key} type="button" className={chip(activeKey === o.key)} aria-pressed={activeKey === o.key} onClick={() => onSelect(o.key)}>
            {o.label}
            {o.count === undefined ? null : <span className="opacity-60">{o.count}</span>}
          </button>
        ))}
      </div>

      {edges.right ? (
        <>
          <div aria-hidden="true" className={`${fadeBase} right-0 bg-gradient-to-l`} />
          <button type="button" aria-label={labels.next} className={`${arrowBase} right-0`} onClick={() => nudge(1)}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}
    </nav>
  );
}
