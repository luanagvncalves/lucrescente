"use client";

import { useLocaleAfterMount } from "@/lib/use-locale";
import { Button } from "@/components/ui/button";
import { Crescent } from "@/components/ui/motifs";
import { ContactLinks } from "@/components/contact/contact-links";

/** Prerendered as /500, so the language has to come from the browser — see useLocaleAfterMount. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t, locale } = useLocaleAfterMount();
  return (
    <div className="container-brand section-gap">
      <div className="mx-auto max-w-xl text-center">
        <Crescent size={36} tone="var(--clay)" className="mx-auto" />
        <h1 className="mt-6 text-h1 text-forest lowercase">{t.errors.genericTitle}</h1>
        <p className="mt-4 text-body-lg">{t.errors.genericText}</p>
        <Button className="mt-8" onClick={reset}>
          {t.errors.retry}
        </Button>
        <div className="mt-10 flex justify-center">
          <ContactLinks locale={locale} />
        </div>
      </div>
    </div>
  );
}
