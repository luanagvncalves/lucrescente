"use client";

import { useId, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product } from "@/lib/types";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getVariantLabel } from "@/content/variant-locales";
import { getAddOns } from "@/content/product-addons";
import { DEFAULT_SCENTS, FIXED_SCENTS, HARSH_SCENT, combosFor, isScentProduct, scentValue, scentsFor } from "@/content/scent-choices";
import { BrandSelect } from "@/components/ui/brand-select";
import { AnchorButton, Button } from "@/components/ui/button";
import { ProductContact } from "./product-contact";

type Group = { id: number; sku: string; quantity: number; flavour: string; oils: [string, string] };
const copy = {
  pt: { hint: "escolhe a quantidade e as opções de cada grupo. adiciona outro grupo para combinar aromas diferentes no mesmo pedido.", group: "grupo", add: "adicionar outro grupo", remove: "remover grupo", oil: "óleo essencial", none: "sem óleo", total: "total", limit: "a quantidade total ultrapassa o stock disponível, incluindo o que já está no carrinho.", selection: "seleção atual", units: "unidades" },
  en: { hint: "choose the quantity and options for each group. add another group to combine different scents in one order.", group: "group", add: "add another group", remove: "remove group", oil: "essential oil", none: "no oil", total: "total", limit: "the total quantity exceeds available stock, including items already in your cart.", selection: "current selection", units: "units" },
  fr: { hint: "choisis la quantité et les options de chaque groupe. ajoute un groupe pour réunir plusieurs parfums dans une commande.", group: "groupe", add: "ajouter un groupe", remove: "supprimer le groupe", oil: "huile essentielle", none: "sans huile", total: "total", limit: "la quantité totale dépasse le stock disponible, y compris les articles du panier.", selection: "sélection actuelle", units: "unités" },
};
const actionClass = "min-h-[52px] w-full min-w-0 whitespace-normal !px-3 text-center !text-[0.9rem] leading-tight";

export function GroupedPurchasePanel({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const t = getDictionary(locale), c = copy[locale], cart = useCart();
  const prefix = useId(), nextId = useRef(2);
  const initial = product.variants.find(v => variantAvailability(v).kind === "available") ?? product.variants[0];
  const freshGroup = (id: number): Group => ({ id, sku: initial.sku, quantity: 1, flavour: "", oils: [DEFAULT_SCENTS[product.slug]?.[0] ?? "", DEFAULT_SCENTS[product.slug]?.[1] ?? ""] });
  const [groups, setGroups] = useState<Group[]>([freshGroup(1)]);
  const [activeId, setActiveId] = useState<number | null>(1);
  const name = getProductCopy(product.slug, locale, { name: product.name }).name;
  const scented = isScentProduct(product.slug), addOns = getAddOns(product.slug);
  const oils = [...scentsFor(product.slug)].sort((a,b) => a.label[locale].localeCompare(b.label[locale],locale));
  const option = (g: Group) => scented ? scentValue([...(FIXED_SCENTS[product.slug] ?? []), ...g.oils.filter(Boolean)]) : g.flavour;
  const variant = (g: Group) => product.variants.find(v => v.sku === g.sku)!;
  const label = (g: Group) => [variant(g).label, option(g)].filter(Boolean).join(" · ");
  const summary = groups.map(g => `${g.quantity} × ${name}${label(g) ? ` (${getVariantLabel(label(g),locale)})` : ""}`).join("\n");
  const total = groups.reduce((sum,g) => sum + g.quantity,0);
  const available = groups.every(g => variantAvailability(variant(g)).kind === "available");
  const exceedsStock = available && groups.some(g => {
    const wanted = groups.filter(row => row.sku === g.sku).reduce((sum,row) => sum + row.quantity,0);
    const existing = cart.lines.filter(row => row.sku === g.sku).reduce((sum,row) => sum + row.quantity,0);
    return wanted + existing > variant(g).stock;
  });
  const priced = groups.every(g => variant(g).price_cents !== null);
  const price = groups.reduce((sum,g) => sum + (variant(g).price_cents ?? 0) * g.quantity,0);
  function update(id: number, patch: Partial<Group>) { setGroups(current => current.map(g => g.id === id ? { ...g, ...patch } : g)); }
  function addGroup() { const id = nextId.current++; setGroups(current => [...current, freshGroup(id)]); setActiveId(id); }
  function add() {
    if (!available || exceedsStock) return;
    for (const g of groups) {
      const v = variant(g);
      cart.add({ sku: v.sku, productSlug: product.slug, productName: name, variantLabel: label(g) || null, unitPriceCents: v.price_cents!, quantity: g.quantity, maxStock: v.stock, addOn: option(g) || null, image: product.images[0] ?? null, isCandle: product.is_candle });
    }
    cart.notify(`${name} · ${t.products.added}`);
  }
  return <div className="card-brand product-purchase-panel p-5 sm:p-6" data-grouped-purchase>
    <p className="mb-5 text-[0.9rem] leading-relaxed text-ink/75">{c.hint}</p>
    <div className="grid gap-3">
      {groups.map((g,index) => <section key={g.id} aria-label={`${c.group} ${index+1}`} className="min-w-0 rounded-2xl border border-moss/30 bg-paper/45 p-4">
        <div className="flex items-start gap-2">
          <button type="button" aria-expanded={activeId === g.id} aria-controls={`${prefix}-${g.id}`} onClick={() => setActiveId(activeId === g.id ? null : g.id)} className="min-h-11 min-w-0 flex-1 text-left text-forest">
            <span className="label-brand block text-moss">{c.group} {index+1}</span>
            <span className="mt-1 block text-sm leading-relaxed">{g.quantity} × {getVariantLabel(label(g),locale) || name}</span>
          </button>
          {groups.length > 1 ? <button type="button" aria-label={`${c.remove} ${index+1}`} onClick={() => { setGroups(current => current.filter(row => row.id !== g.id)); if(activeId === g.id) setActiveId(null); }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-moss hover:bg-forest/5">×</button> : null}
        </div>
        <div id={`${prefix}-${g.id}`} hidden={activeId !== g.id}>
          <div className={`mt-4 grid gap-3 ${product.variants.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {product.variants.length > 1 ? <div><label htmlFor={`${prefix}-variant-${g.id}`} className="label-brand mb-2 block text-moss">{t.products.variant}</label><BrandSelect id={`${prefix}-variant-${g.id}`} value={g.sku} onChange={event => update(g.id,{sku:event.target.value})}>{product.variants.map(v => <option key={v.sku} value={v.sku}>{getVariantLabel(v.label,locale)}</option>)}</BrandSelect></div> : null}
            <div><label htmlFor={`${prefix}-quantity-${g.id}`} className="label-brand mb-2 block text-moss">{t.products.quantity}</label><input id={`${prefix}-quantity-${g.id}`} type="number" min={1} max={50} value={g.quantity} onChange={event => update(g.id,{quantity:Math.max(1,Math.min(50,Math.trunc(Number(event.target.value)) || 1))})} className="h-12 w-full rounded-2xl border border-moss/40 bg-paper px-3 text-forest focus-visible:outline-violet" /></div>
          </div>
          {addOns.length ? <div className="mt-4"><label htmlFor={`${prefix}-flavour-${g.id}`} className="label-brand mb-2 block text-moss">{t.products.flavourLabel}</label><BrandSelect id={`${prefix}-flavour-${g.id}`} value={g.flavour} onChange={event => update(g.id,{flavour:event.target.value})}><option value="">{t.products.flavourNone}</option>{addOns.map(a => <option key={a.value} value={a.value}>{a.label[locale]}</option>)}</BrandSelect></div> : null}
          {scented ? <>
            <p className="mt-4 text-sm text-ink/70">{t.products.scentHint}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">{([0,1] as const).map(i => <div key={i}><label htmlFor={`${prefix}-oil-${g.id}-${i}`} className="label-brand mb-2 block text-moss">{c.oil} {i+1}</label><BrandSelect id={`${prefix}-oil-${g.id}-${i}`} value={g.oils[i]} onChange={event => { const picked: [string,string] = [...g.oils]; picked[i] = event.target.value; update(g.id,{oils:picked}); }}><option value="">{c.none}</option>{oils.map(o => <option key={o.value} value={o.value} disabled={g.oils[1-i] === o.value}>{o.label[locale]}</option>)}</BrandSelect></div>)}</div>
            <p className="label-brand mb-2 mt-4 text-moss">{t.products.scentCombosLabel}</p>
            <div className="flex flex-wrap gap-2">{combosFor(product.slug).map(combo => <button key={combo.join("+")} type="button" aria-pressed={combo.every(o => g.oils.includes(o))} onClick={() => update(g.id,{oils:[combo[0],combo[1]]})} className="min-h-11 rounded-full border border-moss/40 px-3 py-2 text-left text-sm text-forest aria-pressed:bg-forest aria-pressed:text-white">{combo.map(o => oils.find(s => s.value === o)?.label[locale]).join(" + ")}</button>)}</div>
            {g.oils.includes(HARSH_SCENT) ? <p className="mt-3 text-sm text-ink/75">{t.products.scentHarsh}</p> : null}
          </> : null}
        </div>
      </section>)}
    </div>
    <button type="button" onClick={addGroup} className="mt-3 min-h-11 w-full rounded-2xl border border-dashed border-moss/45 px-4 py-3 text-sm text-forest">+ {c.add}</button>
    <div className="my-5 border-t border-moss/25 pt-4" aria-live="polite">
      <p className="text-sm text-moss">{c.total} · {total} {c.units}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-forest" aria-label={c.selection}>{summary}</p>
      <p className="mt-3 font-display text-[1.75rem] text-forest">{priced ? formatPrice(price) : t.products.onRequest}</p>
    </div>
    {exceedsStock ? <p role="alert" className="mb-4 text-sm text-clay">{c.limit}</p> : null}
    <div className="grid grid-cols-2 gap-3" data-product-actions>
      {available ? <Button size="lg" className={actionClass} onClick={add} disabled={exceedsStock}>{t.products.addToCart}</Button> : <AnchorButton href={`${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(name)+"\n"+summary)}`} target="_blank" rel="noreferrer" size="lg" className={actionClass}>{t.products.talkToUs}</AnchorButton>}
      <ProductContact productName={name} orderDetails={summary} locale={locale} className={actionClass} />
    </div>
  </div>;
}
