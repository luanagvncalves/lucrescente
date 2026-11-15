import { EventGallery } from "@/components/ui/event-gallery";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "eventos", alternates: { canonical: "/eventos" } };
const confirmationPhotos = ["20250526_164056", "20250526_164106", "20250526_164453", "20250526_164609", "20250526_164747"];
const giftPhotos = ["20251220_145853", "20251220_150227", "20251220_150615", "20251220_150624", "20251220_150635"];
const content = {
  pt: { title: "eventos", intro: "encomendas maiores para aniversários, batizados, crismas e lembranças. criamos os teus presentes e detalhes para celebrar em conjunto.", confirmation: "velas para um crisma", gift: "prenda de grupo", detail: "clica numa fotografia para a veres maior.", confirmationAlt: "velas em frascos de vidro com laços violeta, personalizadas para um crisma", giftAlt: "velas decoradas com flores secas, conchas e laços de várias cores, preparadas para uma prenda de grupo" },
  en: { title: "events", intro: "larger orders for birthdays, baptisms, confirmations and keepsakes. gifts and details made to celebrate together.", confirmation: "candles for a confirmation", gift: "group gift", detail: "click a photograph to view it larger.", confirmationAlt: "personalised confirmation candles in glass jars with violet ribbons", giftAlt: "candles decorated with dried flowers, shells and colourful ribbons, prepared as a group gift" },
  fr: { title: "événements", intro: "commandes en quantité pour anniversaires, baptêmes, confirmations et souvenirs. des cadeaux et des détails pour célébrer ensemble.", confirmation: "bougies pour une confirmation", gift: "cadeau de groupe", detail: "clique sur une photographie pour l’agrandir.", confirmationAlt: "bougies personnalisées pour une confirmation, en pots de verre avec rubans violets", giftAlt: "bougies décorées de fleurs séchées, coquillages et rubans colorés, préparées pour un cadeau de groupe" },
};

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const copy = content[locale];
  return <article className="container-brand py-10 md:py-12">
    <header className="max-w-3xl">
      <h1 className="text-h1 text-forest lowercase">{copy.title}</h1>
      <p className="mt-4 text-body-lg">{copy.intro}</p>
      <p className="mt-3 text-sm text-ink/70">{copy.detail}</p>
    </header>
    <section aria-labelledby="crisma" className="mt-8">
      <h2 id="crisma" className="text-h2 text-forest lowercase">{copy.confirmation}</h2>
      <EventGallery photos={confirmationPhotos} alt={copy.confirmationAlt} locale={locale} />
    </section>
    <section aria-labelledby="prenda-grupo" className="mt-8">
      <h2 id="prenda-grupo" className="text-h2 text-forest lowercase">{copy.gift}</h2>
      <EventGallery photos={giftPhotos} alt={copy.giftAlt} locale={locale} />
    </section>
  </article>;
}

