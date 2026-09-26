"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { ContactLinks } from "@/components/contact/contact-links";

export function Footer() {
  const searchParams = useSearchParams();
  const idioma = searchParams.get("idioma");
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  return (
    <footer className="mt-24 bg-forest text-ivory on-dark">
      <div className="container-brand grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={56} height={56} className="rounded-full" />
            <span className="font-display text-[2rem] leading-none">lucrescente</span>
          </div>
          <p className="mt-6 max-w-[48ch] text-[0.95rem] leading-relaxed text-ivory/85">{t.home.shortAbout}</p>
          <p className="mt-6 text-[0.9rem] text-ivory/70">{t.footer.shipping}</p>
        </div>

        <div className="md:col-span-3">
          <p className="label-brand text-lavender">{t.footer.pagesTitle}</p>
          <ul className="mt-5 space-y-3 font-ui text-[0.95rem]">
            {[
              ["/", t.nav.home],
              ["/produtos", t.nav.products],
              ["/ingredientes", t.nav.ingredients],
              ["/sobre", t.nav.about],
              ["/perguntas-frequentes", t.faq.label],
              ["/cuidados", t.nav.care],
              ["/feiras-e-mercados", t.nav.fairs],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={`${href}${query}`} className="inline-flex min-h-11 items-center text-ivory/90 hover:text-white hover:underline underline-offset-4">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="label-brand text-lavender">{t.footer.contactsTitle}</p>
          <div className="mt-5">
            <ContactLinks tone="dark" layout="list" locale={locale} />
          </div>
          <a
            href={t.brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-[0.95rem] text-ivory/90 hover:text-white hover:underline underline-offset-4"
          >
            <InstagramIcon /> {t.brand.instagramHandle}
          </a>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-brand flex flex-col items-start justify-between gap-2 py-6 text-[0.85rem] text-ivory/70 sm:flex-row sm:items-center">
          <span>{t.footer.line}</span>
          <span>© {new Date().getFullYear()} lucrescente</span>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}
