import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import archive from "@/data/archive.json";
import { galleryCopy } from "@/data/galeria";
import { Label } from "@/components/ui/typography";

const counts = archive as Record<string, number>;

export function generateStaticParams() {
  return Object.keys(counts).map((ano) => ({ ano }));
}

export async function generateMetadata({ params }: { params: Promise<{ ano: string }> }): Promise<Metadata> {
  const { ano } = await params;
  return { title: `${galleryCopy.pt.label} ${ano}`, alternates: { canonical: `/galeria/${ano}` } };
}

const alts = {
  pt: (ano: string, n: number) => `fotografia ${n} do arquivo lucrescente ${ano}`,
  en: (ano: string, n: number) => `photo ${n} from the lucrescente ${ano} archive`,
  fr: (ano: string, n: number) => `photo ${n} des archives lucrescente ${ano}`,
};

export default async function ArchivePage({ params, searchParams }: { params: Promise<{ ano: string }>; searchParams: Promise<{ idioma?: string }> }) {
  const { ano } = await params;
  const { idioma } = await searchParams;
  const total = counts[ano];
  if (!total) notFound();
  const lang = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const q = lang === "pt" ? "" : `?idioma=${lang}`;
  return (
    <article className="container-brand pt-10 md:pt-16">
      <header className="max-w-3xl">
        <Label>{galleryCopy[lang].label}</Label>
        <h1 className="mt-4 text-h1 text-forest lowercase">{ano}</h1>
        <p className="mt-6 text-body-lg measure">{total} fotografias</p>
        <Link href={`/galeria${q}`} className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4">
          ← {galleryCopy[lang].label}
        </Link>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n} className="relative aspect-[3/4] overflow-hidden rounded-[18px] border border-moss/18 bg-ivory">
            <Image src={`/galeria/${ano}/${String(n).padStart(3, "0")}.jpg`} alt={alts[lang](ano, n)} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </article>
  );
}
