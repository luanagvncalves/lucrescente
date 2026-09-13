"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { Crescent } from "./motifs";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

/** In-brand modal. Replaces native alert()/confirm() everywhere. */
export function Modal({ open, onClose, title, children, primaryLabel, onPrimary, secondaryLabel, onSecondary }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-forest/55 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="card-brand w-full max-w-md p-6 shadow-[var(--shadow-soft)] outline-none sm:p-8"
          >
            <div className="flex items-start gap-3">
              <Crescent size={18} tone="var(--violet)" className="mt-1 shrink-0" />
              <h2 id="modal-title" className="font-display text-[1.6rem] leading-tight text-forest lowercase">
                {title}
              </h2>
            </div>
            {children ? <div className="mt-4 text-[0.95rem] leading-relaxed text-ink/90">{children}</div> : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {secondaryLabel ? (
                <Button variant="secondary" onClick={onSecondary ?? onClose}>
                  {secondaryLabel}
                </Button>
              ) : null}
              <Button onClick={onPrimary ?? onClose}>{primaryLabel ?? "está bem"}</Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
