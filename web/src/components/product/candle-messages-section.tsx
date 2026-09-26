import Link from "next/link";
import { candleMessages } from "@/content/candle-messages";
import type { ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { Crescent } from "@/components/ui/motifs";

/**
 * "velas com mensagens" — shown on the candles page, under the products.
 *
 * A personalised candle is not a catalogue item with a price: it is made after
 * a conversation, so this sends the visitor to the contact section rather than
 * offering a variant to add to the basket.
 */
export function CandleMessagesSection({ locale = "pt" }: { locale?: ProductLocale }) {
  const copy = candleMessages[locale];
  // the contact section lives on the homepage, and the language has to survive the jump
  const contactHref = locale === "pt" ? "/#contacto" : `/?idioma=${locale}#contacto`;

  return (
    <section className="mt-16 rounded-[20px] border border-violet/25 bg-lavender/25 px-6 py-8 sm:px-10 sm:py-10" aria-labelledby="velas-com-mensagens">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Crescent size={22} tone="var(--violet)" />
          <Label tone="violet" className="mt-4">
            {copy.label}
          </Label>
          <h2 id="velas-com-mensagens" className="mt-3 text-h2 text-forest lowercase">
            {copy.title}
          </h2>
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
    </section>
  );
}
