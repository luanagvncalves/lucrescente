import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eventOrders, eventPageCopy } from "@/data/events";
import { EventGallery } from "@/components/ui/event-gallery";
import { ProductContact } from "@/components/product/product-contact";
import { AnchorButton } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ idioma?: string }> };
export function generateStaticParams() { return eventOrders.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const event = eventOrders.find(order => order.slug === slug);
  if (!event) return {};
  return { title: event.copy[locale].title, description: event.copy[locale].intro, alternates: { canonical: `/eventos/${slug}` } };
}

export default async function EventOrderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const event = eventOrders.find(order => order.slug === slug);
  if (!event) notFound();
  const copy = event.copy[locale], page = eventPageCopy[locale], t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  return <article className="container-brand py-10 md:py-12">
    <Link href={`/eventos${query}`} className="inline-flex min-h-11 items-center text-moss hover:underline underline-offset-4">← {page.back}</Link>
    <div className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(0,min(50%,60vh))_minmax(0,1fr)]" data-event-order>
      <EventGallery photos={[...event.photos]} alt={copy.alt} locale={locale} />
      <div className="min-w-0 md:pt-3">
        <p className="label-brand text-moss">{page.title}</p>
        <h1 className="mt-4 text-h1 text-forest lowercase">{copy.title}</h1>
        <p className="mt-5 text-body-lg measure">{copy.intro}</p>
        <p className="mt-6 text-body-lg measure">{copy.description}</p>
        <section className="mt-8 border-t border-moss/25 pt-6">
          <h2 data-wrap-heading className="text-h3 text-forest lowercase">{page.plan}</h2>
          <p className="mt-4 text-body-lg measure">{copy.details}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AnchorButton href={`${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(copy.title))}`} target="_blank" rel="noreferrer">{t.products.talkToUs}</AnchorButton>
            <ProductContact productName={copy.title} locale={locale} className="min-h-11" />
          </div>
        </section>
      </div>
    </div>
  </article>;
}
