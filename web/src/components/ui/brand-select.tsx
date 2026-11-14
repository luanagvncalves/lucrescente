import type { SelectHTMLAttributes } from "react";

/** Native keyboard-friendly select, with a consistent inset chevron. */
export function BrandSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <div className="relative min-w-0">
    <select {...props} className={`h-12 w-full appearance-none rounded-2xl border border-moss/40 bg-paper py-2 pl-4 pr-11 font-ui text-[0.95rem] text-forest focus:border-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-violet ${className}`} />
    <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 7.5 5 5 5-5" /></svg>
  </div>;
}
