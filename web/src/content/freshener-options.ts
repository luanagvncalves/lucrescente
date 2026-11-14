import type { ProductLocale } from "./product-locales";
import { getScentLabel, sanitiseScent, scentValue } from "./scent-choices";

export const FRESHENER_SHAPES = [
  { value: "coração", label: { pt: "coração", en: "heart", fr: "cœur" } },
  { value: "flor", label: { pt: "flor", en: "flower", fr: "fleur" } },
  { value: "círculo", label: { pt: "círculo", en: "circle", fr: "cercle" } },
] as const;
export type FreshenerShape = typeof FRESHENER_SHAPES[number]["value"];
export function freshenerShapeLabel(value: string, locale: ProductLocale): string | null {
  return FRESHENER_SHAPES.find((shape) => shape.value === value)?.label[locale] ?? null;
}
/** Same shape and oils always identify the same cart line, regardless of oil order. */
export function freshenerOption(shape: FreshenerShape, oils: string[]): string {
  return [shape, scentValue([...oils].sort())].filter(Boolean).join(" · ");
}
/** Validate both shape and up to two oils before retaining a packing instruction. */
export function sanitiseFreshenerOption(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Preserve carts created before shapes were offered.
  if (value.startsWith("aroma: ")) return sanitiseScent(value, "ambientador");
  const [shape, scent, ...extra] = value.split(" · ");
  if (!FRESHENER_SHAPES.some((s) => s.value === shape) || extra.length) return null;
  if (!scent) return shape;
  const checked = sanitiseScent(scent, "ambientador");
  if (!checked) return null;
  return freshenerOption(shape as FreshenerShape, checked.slice("aroma: ".length).split(" + "));
}
export function freshenerOptionLabel(value: string, locale: ProductLocale): string {
  return value.split(" · ").map((part) => freshenerShapeLabel(part, locale) ?? getScentLabel(part, locale)).join(" · ");
}
