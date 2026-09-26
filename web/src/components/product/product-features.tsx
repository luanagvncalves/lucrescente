export type Feature = { label: string };

/**
 * The extra claims on a product page ("sem alumínio", "sem álcool",
 * "personalizável"), each in its own circle.
 *
 * Circles, not rounded rectangles, and the brand's green rather than the violet
 * — the violet was already carrying the candle note further down the same page,
 * so two different kinds of information looked like one.
 *
 * A circle only holds so much text, and the longest of these labels is "não é
 * antitranspirante", so the type is small and hyphenation is on: without it the
 * browser has no legal break inside "antitranspirante" and the word spills out
 * of the circle. Hyphenation needs `<html lang>` to be set, which `LocaleRuntime`
 * does for the language actually being shown.
 */
export function ProductFeatures({ features }: { features: Feature[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-3">
      {features.map((feature) => (
        <li key={feature.label}>
          <div className="flex size-[7.5rem] items-center justify-center rounded-full border border-moss/30 bg-moss/15 px-4 text-center font-ui text-[0.78rem] font-medium leading-[1.3] text-forest hyphens-auto break-words">
            {feature.label}
          </div>
        </li>
      ))}
    </ul>
  );
}
