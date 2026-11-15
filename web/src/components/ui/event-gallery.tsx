"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductLocale } from "@/content/product-locales";

export function EventGallery({ photos, alt, locale }: { photos: string[]; alt: string; locale: ProductLocale }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const touchStart = useRef<number | null>(null);
  const labels = {
    pt: { close: "fechar galeria", prev: "fotografia anterior", next: "próxima fotografia", open: "ampliar fotografia" },
    en: { close: "close gallery", prev: "previous photograph", next: "next photograph", open: "enlarge photograph" },
    fr: { close: "fermer la galerie", prev: "photo précédente", next: "photo suivante", open: "agrandir la photo" },
  }[locale];
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
  const move = (step: number) => setIndex(current => (current + step + photos.length) % photos.length);
  return <div className="min-w-0" data-event-gallery>
    <div className="frame-brand group relative aspect-[3/4] w-full max-w-[60vh] bg-paper" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => {
      const start = touchStart.current; touchStart.current = null;
      if(start === null) return;
      const dx = event.changedTouches[0].clientX - start;
      if(Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
    }}>
      <button type="button" onClick={() => setOpened(true)} aria-label={`${labels.open} ${index + 1}`} className="absolute inset-0 h-full w-full rounded-[inherit]">
        <Image src={`/images/eventos/${photos[index]}.jpg`} alt={`${alt} · ${index + 1}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain" priority />
      </button>
      <button type="button" onClick={() => move(-1)} aria-label={labels.prev} className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-3xl text-white">‹</button>
      <button type="button" onClick={() => move(1)} aria-label={labels.next} className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-3xl text-white">›</button>
      <p aria-live="polite" className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm text-white" data-event-count>{index + 1} / {photos.length}</p>
    </div>
    <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label={alt}>
      {photos.map((photo, i) => <li key={photo} className="shrink-0"><button type="button" onClick={() => setIndex(i)} aria-pressed={index === i} aria-label={`${alt} · ${i + 1}`} className={`relative h-20 w-16 overflow-hidden rounded-xl border-2 ${index === i ? "border-forest" : "border-transparent hover:border-moss/50"}`}><Image src={`/images/eventos/${photo}.jpg`} alt="" fill sizes="64px" className="object-cover" /></button></li>)}
    </ul>
    <dialog ref={dialog} aria-label={alt} onCancel={() => setOpened(false)} onClick={event => { if (event.target === event.currentTarget) setOpened(false); }} onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }} className="event-lightbox fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-violet/50 p-0 text-white outline-none backdrop:bg-transparent">
      {opened ? <>
        <button type="button" autoFocus onClick={() => setOpened(false)} aria-label={labels.close} className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-forest/80 text-3xl">×</button>
        <button type="button" onClick={() => move(-1)} aria-label={labels.prev} className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-3xl sm:left-5">‹</button>
        <div className="pointer-events-none absolute inset-x-3 bottom-16 top-16 sm:inset-x-20">
          <Image src={`/images/eventos/${photos[index]}.jpg`} alt={`${alt} · ${index + 1}`} fill sizes="100vw" className="object-contain" priority />
        </div>
        <button type="button" onClick={() => move(1)} aria-label={labels.next} className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-3xl sm:right-5">›</button>
        <p aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-5 text-center">{index + 1} / {photos.length}</p>
      </> : null}
    </dialog>
  </div>;
}
