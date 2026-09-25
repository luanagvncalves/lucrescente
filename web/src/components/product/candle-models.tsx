import Image from "next/image";
import type { Dictionary } from "@/content/pt";
import { Crescent } from "@/components/ui/motifs";

/**
 * Curated candle lookbook, written for the "velas" category on /produtos after
 * being moved off the homepage — but nothing imports it, so it is not currently
 * on the site. Kept because the selection is still the one the brand wants.
 */
export function CandleModels({ t }: { t: Dictionary }) {
  const candles: { src: string | null; alt: string; name: string }[] = [
    { src: "/images/products/vela-citronela/0.jpg", alt: t.home.candleAltCitronela1, name: t.home.candleCitronelaName },
    { src: "/images/products/vela-citronela/1.jpg", alt: t.home.candleAltCitronela2, name: t.home.candleFlowers },
    { src: "/images/products/vela-massagem/0.jpg", alt: t.home.candleAltMassagem, name: t.home.candleMassage },
    // No photograph yet: this pointed at /galeria/24.jpg, which never existed
    // at that path — the gallery photos lived under a year folder — and the
    // gallery has since been removed. `null` renders the brand placeholder,
    // until a photo of a message candle is supplied.
    { src: null, alt: t.home.candleMessage, name: t.home.candleMessage },
  ];
  return (
    <div className="mx-auto mb-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
      {candles.map((candle, i) => (
        <div key={candle.src ?? i} className="relative aspect-square overflow-hidden rounded-[18px] border border-moss/18 bg-ivory shadow-[0_10px_24px_rgba(49,61,53,0.06)]">
          {candle.src ? (
            <Image src={candle.src} alt={candle.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover" />
          ) : (
            <div className="placeholder-frame flex h-full items-center justify-center">
              <Crescent size={26} tone="var(--violet)" />
            </div>
          )}
          <div className={`absolute inset-x-0 bottom-0 p-3 ${candle.src ? "bg-gradient-to-t from-forest/80 via-forest/25 to-transparent text-ivory" : "text-forest"}`}>
            <p className="font-display text-[1.05rem] leading-none lowercase">{candle.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
