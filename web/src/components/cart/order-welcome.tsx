"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spiral } from "@/components/ui/motifs";

/** Native modal keeps keyboard focus inside until the summary is revealed. */
export function OrderWelcome({ title, label }: { title: string; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    const restoreScroll = () => { document.body.style.overflow = previousOverflow; };
    element.addEventListener("close", restoreScroll);
    return () => {
      element.removeEventListener("close", restoreScroll);
      element.close();
      restoreScroll();
    };
  }, []);

  function revealSummary() {
    dialog.current?.close();
    document.getElementById("order-summary-title")?.focus({ preventScroll: true });
  }

  return (
    <dialog ref={dialog} className="order-welcome m-auto w-[calc(100%_-_2rem)] max-w-4xl rounded-[var(--radius-card)] border-0 bg-paper p-7 text-center text-forest shadow-[var(--shadow-soft)] sm:p-12" aria-labelledby="order-welcome-title" onCancel={revealSummary}>
      <Spiral size={64} strokeWidth={1.3} className="order-spiral mx-auto text-violet" />
      <h2 id="order-welcome-title" className="mt-6 text-h1 lowercase">{title}</h2>
      <Button className="mt-8" onClick={revealSummary}>{label}</Button>
    </dialog>
  );
}
