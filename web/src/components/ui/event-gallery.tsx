"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductLocale } from "@/content/product-locales";

export function EventGallery({ photos, alt, locale }: { photos: string[]; alt: string; locale: ProductLocale }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const labels = {
    pt: { close: "fechar galeria", prev: "fotografia anterior", next: "próxima fotografia", open: "ampliar fotografia" },
    en: { close: "close gallery", prev: "previous photograph", next: "next photograph", open: "enlarge photograph" },
    fr: { close: "fermer la galerie", prev: "photo précédente", next: "photo suivante", open: "agrandir la photo" },
  }[locale];
  const opened = index !== null;
  useEffect(() => {
    if (!opened) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const panel = dialog.current;
    panel?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      panel?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [opened]);
  const move = (step: number) => setIndex(current => current === null ? null : (current + step + photos.length) % photos.length);
  return <>
    <div className="mt-4 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {photos.map((photo, i) => <button key={photo} type="button" onClick={() => setIndex(i)} aria-label={`${labels.open} ${i + 1}`} className="frame-brand block aspect-[3/4] overflow-hidden bg-paper transition-opacity hover:opacity-85 focus-visible:outline-offset-4">
        <Image src={`/images/eventos/${photo}.jpg`} alt={`${alt} · ${i + 1}`} width={240} height={320} sizes="(min-width:1024px) 180px, (min-width:640px) 200px, 45vw" className="h-full w-full object-contain" />
      </button>)}
    </div>
    <dialog ref={dialog} aria-label={alt} onCancel={() => setIndex(null)} onClick={event => { if (event.target === event.currentTarget) setIndex(null); }} onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }} className="event-lightbox fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-violet/50 p-0 text-white outline-none backdrop:bg-transparent">
      {index !== null ? <>
        <button type="button" autoFocus onClick={() => setIndex(null)} aria-label={labels.close} className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-forest/80 text-3xl">×</button>
        <button type="button" onClick={() => move(-1)} aria-label={labels.prev} className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-3xl sm:left-5">‹</button>
        <div className="pointer-events-none absolute inset-x-3 bottom-16 top-16 sm:inset-x-20">
          <Image src={`/images/eventos/${photos[index]}.jpg`} alt={`${alt} · ${index + 1}`} fill sizes="100vw" className="object-contain" priority />
        </div>
        <button type="button" onClick={() => move(1)} aria-label={labels.next} className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-3xl sm:right-5">›</button>
        <p aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-5 text-center">{index + 1} / {photos.length}</p>
      </> : null}
    </dialog>
  </>;
}
