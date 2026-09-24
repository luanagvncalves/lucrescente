import type { Metadata } from "next";
import { getDictionary, t } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { SectionHeader, H1 } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: t.fairs.title,
  description: t.fairs.metaDescription,
  alternates: { canonical: "/feiras-e-mercados" },
};

export default async function FairsAndMarketsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const d = getDictionary(locale);

  return (
    <div className="container-brand pt-10 pb-16 md:pt-16">
      <header className="max-w-3xl">
        <SectionHeader as={H1} label="lucrescente" title={d.fairs.title} />
        <p className="mt-6 text-body-lg measure">{d.fairs.intro}</p>
      </header>

      <div className="mt-12 rounded-3xl bg-moss/10 p-8 md:p-12">
        <p className="text-body-lg measure text-ink/80">{d.fairs.comingSoon}</p>
      </div>
    </div>
  );
}
