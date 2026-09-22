import type { Metadata } from "next";
import Image from "next/image";
import { galleryCopy, galleryGroups, galleryPhoto } from "@/data/galeria";
import Link from "next/link";
import archive from "@/data/archive.json";
import { Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: galleryCopy.pt.label,
  description: galleryCopy.pt.intro,
  alternates: { canonical: "/galeria" },
};

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const lang = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const copy = galleryCopy[lang];
  return (
    <article className="container-brand pt-10 md:pt-16">
      <header className="max-w-3xl">
        <Label>{copy.label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{copy.title}</h1>
        <p className="mt-6 text-body-lg measure">{copy.intro}</p>
      </header>
      <nav aria-label="arquivo" className="mt-8 flex flex-wrap gap-3">
        {Object.entries(archive as Record<string, number>).reverse().map(([ano, n]) => (
          <Link key={ano} href={`/galeria/${ano}${lang === "pt" ? "" : `?idioma=${lang}`}`} className="inline-flex min-h-11 items-center rounded-full border border-moss/30 px-5 font-ui text-forest hover:bg-paper">
            {ano} · {n}
          </Link>
        ))}
      </nav>
      {galleryGroups.map((group) => (
        <section key={group.id} aria-labelledby={group.id} className="mt-14">
          <h2 id={group.id} className="text-h2 text-forest lowercase">
            {group.title[lang]}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.photos.map((n) => (
              <li key={n} className="relative aspect-[3/4] overflow-hidden rounded-[18px] border border-moss/18 bg-ivory">
                <Image src={galleryPhoto(n)} alt={group.alt[lang]} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
