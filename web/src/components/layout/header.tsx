"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { Crescent } from "@/components/ui/motifs";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count, open, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const idioma = searchParams.get("idioma");
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const links = [
    { href: "/produtos", label: t.nav.products },
    { href: "/ingredientes", label: t.nav.ingredients },
    { href: "/sobre", label: t.nav.about },
    { href: "/feiras-e-mercados", label: t.nav.fairs },
  ];

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
      >
        {t.nav.skipToContent}
      </a>
      {/* blur lives on the bar, not on <header>: backdrop-filter would make the header the containing block for the fixed mobile menu */}
      <div className="relative z-10 border-b border-moss/15 bg-ivory/92 backdrop-blur-sm">
      <div className="container-brand flex h-[72px] items-center justify-between gap-6">
        <Link href={`/${query}`} className="flex items-center gap-3" aria-label={t.nav.homeLink}>
          <Image src="/brand/logo.png" alt="" width={44} height={44} className="rounded-full" priority />
          <span className="font-display text-[1.7rem] leading-none text-forest">lucrescente</span>
        </Link>

        <nav aria-label="principal" className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={`${l.href}${query}`}
                aria-current={active ? "page" : undefined}
                className={`flex h-11 items-center font-ui text-[0.95rem] font-medium lowercase transition-colors hover:text-forest ${active ? "text-forest underline decoration-moss/60 underline-offset-8" : "text-ink/80"}`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="ml-4 flex gap-2 border-l border-moss/15 pl-8">
            <LanguageButton locale="pt" isMobile={false} />
            <LanguageButton locale="en" isMobile={false} />
            <LanguageButton locale="fr" isMobile={false} />
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={open}
            className="relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-ui text-[0.95rem] font-medium lowercase text-forest hover:bg-forest/5"
            aria-label={`${t.nav.cart}, ${t.cart.itemsCount(count)}`}
          >
            <BasketIcon />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[0.7rem] font-medium text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-forest/5 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 h-px w-5 bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col bg-forest text-ivory md:hidden on-dark"
          >
            <nav aria-label="principal (móvel)" className="container-brand flex flex-1 flex-col justify-center gap-2">
              {[{ href: "/", label: t.nav.home }, ...links].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link href={`${l.href}${query}`} className="block py-3 font-display text-[2.4rem] leading-tight lowercase text-ivory">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container-brand flex flex-col gap-6 pb-10">
              <div className="flex gap-2">
                <LanguageButton locale="pt" isMobile={true} />
                <LanguageButton locale="en" isMobile={true} />
                <LanguageButton locale="fr" isMobile={true} />
              </div>
              <div className="flex items-center justify-between text-ivory/70">
                <span className="label-brand">{t.brand.tagline}</span>
                <Crescent size={18} tone="var(--lavender)" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function BasketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h16l-1.2 9.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 9V7.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LanguageButton({ locale, isMobile }: { locale: "pt" | "en" | "fr"; isMobile: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLocale = searchParams.get("idioma") ?? "pt";
  const isActive = currentLocale === locale;

  const params = new URLSearchParams(searchParams);
  if (locale === "pt") {
    params.delete("idioma");
  } else {
    params.set("idioma", locale);
  }
  const href = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`min-h-11 rounded-full border px-4 py-2 font-ui text-[0.9rem] font-medium uppercase transition-colors ${
          isActive
            ? "border-ivory bg-ivory text-forest"
            : "border-ivory/40 bg-transparent text-ivory hover:border-ivory hover:bg-ivory/10"
        }`}
      >
        {locale}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex h-11 items-center font-ui text-[0.95rem] font-medium lowercase transition-colors ${
        isActive ? "text-forest underline decoration-moss/60 underline-offset-8" : "text-ink/80 hover:text-forest"
      }`}
    >
      {locale}
    </Link>
  );
}
