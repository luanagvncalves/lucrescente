import type { MetadataRoute } from "next";
import { getIngredients, getProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, ingredients] = await Promise.all([getProducts(), getIngredients()]);
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/produtos`, priority: 0.9 },
    { url: `${base}/ingredientes`, priority: 0.9 },
    { url: `${base}/sobre`, priority: 0.6 },
    { url: `${base}/cuidados`, priority: 0.6 },
    { url: `${base}/perguntas-frequentes`, priority: 0.7 },
    { url: `${base}/feiras-e-mercados`, priority: 0.6 },
    ...products.map((p) => ({ url: `${base}/produtos/${p.slug}`, priority: 0.8 })),
    ...ingredients.map((i) => ({ url: `${base}/ingredientes/${i.slug}`, priority: 0.7 })),
  ];
}
