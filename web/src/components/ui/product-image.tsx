import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import { getImageAlt } from "@/content/image-alt-locales";
import type { ProductLocale } from "@/content/product-locales";
import { Crescent } from "./motifs";

type Props = {
  image: { path: string; alt: string } | null | undefined;
  /** intrinsic aspect: portrait for cards/hero, square for thumbnails */
  ratio?: "portrait" | "square" | "wide";
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Text for the honest placeholder (visible), e.g. product name. */
  fallbackLabel?: string;
  rounded?: boolean;
  /** The photo description and the placeholder are read aloud, so they follow the page. */
  locale?: ProductLocale;
};

const ratios = { portrait: "aspect-[3/4]", square: "aspect-square", wide: "aspect-[16/10]" };

/**
 * Real photo with next/image, or an honest solid-color frame with the crescent motif
 * when a product has no photograph in the supplied set.
 */
export function ProductImage({ image, ratio = "portrait", sizes = "(min-width: 1024px) 33vw, 100vw", priority, className = "", fallbackLabel, rounded = true, locale = "pt" }: Props) {
  const shape = `${ratios[ratio]} ${rounded ? "rounded-[20px]" : ""} overflow-hidden`;
  const noPhoto = getDictionary(locale).products.noPhoto;
  if (!image) {
    return (
      <div
        className={`placeholder-frame relative flex items-center justify-center border border-moss/18 ${shape} ${className}`}
        role="img"
        aria-label={fallbackLabel ? `${fallbackLabel}, ${noPhoto}` : noPhoto}
      >
        <div className="flex flex-col items-center gap-3 text-clay">
          <Crescent size={40} tone="var(--violet)" />
          <span className="label-brand text-clay/80">{noPhoto}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative bg-paper ${shape} ${className}`}>
      <Image src={image.path} alt={getImageAlt(image.alt, locale)} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
