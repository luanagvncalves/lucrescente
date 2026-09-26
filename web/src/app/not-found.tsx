"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useLocale } from "@/lib/use-locale";
import { buttonClass } from "@/components/ui/button";
import { Crescent } from "@/components/ui/motifs";

/** `useLocale` reads the query string, which Next requires a boundary for. */
export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundBody />
    </Suspense>
  );
}

function NotFoundBody() {
  const { t, query } = useLocale();
  return (
    <div className="container-brand section-gap">
      <div className="mx-auto max-w-xl text-center">
        <Crescent size={36} tone="var(--lavender)" className="mx-auto" />
        <h1 className="mt-6 text-h1 text-forest lowercase">{t.errors.notFoundTitle}</h1>
        <p className="mt-4 text-body-lg">{t.errors.notFoundText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/produtos${query}`} className={buttonClass("primary")}>
            {t.nav.products}
          </Link>
          <Link href={`/ingredientes${query}`} className={buttonClass("secondary")}>
            {t.nav.ingredients}
          </Link>
        </div>
      </div>
    </div>
  );
}
