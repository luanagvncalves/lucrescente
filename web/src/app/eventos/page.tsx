import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { eventOrders, eventPageCopy } from "@/data/events";

export const metadata: Metadata = { title: "eventos", alternates: { canonical: "/eventos" } };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const copy = eventPageCopy[locale];
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  return <article className="container-brand py-10 md:py-12">
    <header className="max-w-3xl">
      <h1 className="text-h1 text-forest lowercase">{copy.title}</h1>
      <p className="mt-4 text-body-lg">{copy.intro}</p>
      <p className="mt-3 text-sm text-ink/70">{copy.detail}</p>
    </header>
    <ul className="mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:gap-6" data-event-cards>
      {eventOrders.map(event => <li key={event.slug} className="min-w-0">
        <Link href={`/eventos/${event.slug}${query}`} className="group block focus-visible:outline-offset-4">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-moss/18 bg-ivory">
            <Image src={`/images/eventos/${event.photos[0]}.jpg`} alt={event.copy[locale].alt} fill sizes="(min-width:768px) 320px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 flex items-center justify-center bg-violet/50 px-3 text-center" data-event-overlay>
              <h2 data-wrap-heading className="font-display text-[1.35rem] leading-tight text-ivory lowercase [text-shadow:0_1px_3px_rgba(34,57,37,0.45)] sm:text-[1.5rem]">{event.copy[locale].title}</h2>
            </div>
          </div>
        </Link>
      </li>)}
    </ul>
  </article>;
}
