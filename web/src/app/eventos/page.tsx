import Image from "next/image";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "eventos", alternates: { canonical: "/eventos" } };
const photos = ["20250526_164056","20250526_164106","20250526_164453","20250526_164609","20250526_164747"];
export default async function EventsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
 const { idioma } = await searchParams;
 const title = idioma === "en" ? "events" : idioma === "fr" ? "événements" : "eventos";
 const intro = idioma === "en" ? "lucrescente moments and creations." : idioma === "fr" ? "moments et créations lucrescente." : "momentos e criações lucrescente.";
 return <article className="container-brand py-10 md:py-16"><header className="max-w-3xl"><h1 className="text-h1 text-forest lowercase">{title}</h1><p className="mt-4 text-body-lg">{intro}</p></header><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo,index)=><figure key={photo} className="frame-brand overflow-hidden"><Image src={`/images/eventos/${photo}.jpg`} alt={`lucrescente · ${title} · ${index+1}`} width={1200} height={1600} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-auto w-full" priority={index===0}/></figure>)}</div></article>;
}
