import Image from "next/image";
import Link from "next/link";
import {
  candleMessageCover,
  candleMessagePhotos,
  candleMessages,
} from "@/content/candle-messages";
import type { ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { Crescent } from "@/components/ui/motifs";

const DIR = "/images/velas-com-mensagem";

/**
 * "velas com mensagens" — shown on the candles page, under the products.
 *
 * A personalised candle is not a catalogue item with a price: it is made after
 * a conversation, so this sends the visitor to the contact section rather than
 * offering a variant to add to the basket. The photographs carry the point the
 * words can only describe — every one of these was written for one person — so
 * the cover leads the section and the rest follow as a grid of past work.
 */
export function CandleMessagesSection({ locale = "pt" }: { locale?: ProductLocale }) {
  const copy = candleMessages[locale];
  // the contact section lives on the homepage, and the language has to survive the jump
  const contactHref = locale === "pt" ? "/#contacto" : `/?idioma=${locale}#contacto`;
  const rest = candleMessagePhotos.filter((p) => p !== candleMessageCover);
  const altFor = (photo: (typeof candleMessagePhotos)[number]) =>
    copy.alt(photo.message, copy.vessels[photo.vessel]);

  return (
    <section
      className="mt-16 rounded-[20px] border border-violet/25 bg-lavender/25 px-6 py-8 sm:px-10 sm:py-10"
      aria-labelledby="velas-com-mensagens"
    >
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Crescent size={22} tone="var(--violet)" />
          <Label tone="violet" className="mt-4">
            {copy.label}
          </Label>
          <h2 id="velas-com-mensagens" className="mt-3 text-h2 text-forest lowercase">
            {copy.title}
          </h2>
          {/* 4:5 rather than square: the photos are portrait, and a square crop
              took the top off the handwriting that is the point of the candle. */}
          <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[18px] border border-moss/18 bg-ivory shadow-[0_10px_24px_rgba(49,61,53,0.06)]">
            <Image
              src={`${DIR}/${candleMessageCover.file}`}
              alt={altFor(candleMessageCover)}
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="text-body-lg measure">{copy.body}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/80 measure">{copy.lead}</p>
          <Link
            href={contactHref}
            className="mt-6 inline-flex min-h-11 items-center font-ui text-[0.95rem] font-medium lowercase text-forest underline decoration-moss/50 underline-offset-4 transition-colors hover:decoration-forest"
          >
            {copy.link} →
          </Link>
        </div>
      </div>

      {/*
        The cover is already above, so this grid holds the rest. Off-screen
        heading: someone moving by heading would otherwise meet thirteen
        photographs with nothing saying what they are.
      */}
      <h3 className="sr-only">{copy.gallery}</h3>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {rest.map((photo) => (
          <li
            key={photo.file}
            className="relative aspect-square overflow-hidden rounded-[14px] border border-moss/18 bg-ivory"
          >
            <Image
              src={`${DIR}/${photo.file}`}
              alt={altFor(photo)}
              fill
              sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
