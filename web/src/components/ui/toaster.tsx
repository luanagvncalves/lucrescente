"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { Crescent } from "./motifs";

/** Calm toasts (bottom-left). Fed by useCart().notify. */
export function Toaster() {
  const { toasts, dismissToast } = useCart();
  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed bottom-4 left-4 z-[70] flex w-[min(92vw,22rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.24 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-[0.92rem] shadow-[var(--shadow-soft)] ${
              t.tone === "warn" ? "border-clay/40 bg-paper text-ink" : "border-moss/25 bg-forest text-ivory"
            }`}
          >
            <Crescent size={14} tone={t.tone === "warn" ? "var(--clay)" : "var(--lavender)"} className="mt-1 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full opacity-70 hover:opacity-100"
              aria-label="fechar aviso"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
