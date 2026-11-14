"use client";
import { useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { formatPrice, variantAvailability, type Product } from "@/lib/types";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { FRESHENER_SHAPES, freshenerOption, freshenerOptionLabel, type FreshenerShape } from "@/content/freshener-options";
import { HARSH_SCENT, combosFor, scentsFor } from "@/content/scent-choices";
import { BrandSelect } from "@/components/ui/brand-select";
import { AnchorButton, Button } from "@/components/ui/button";
import { ProductContact } from "./product-contact";

type Group = { id: number; shape: FreshenerShape; quantity: number; oils: [string, string] };
const copy = {
 pt: { hint: "combina formatos e aromas. cada grupo pode ter até dois óleos essenciais.", group: "grupo", add: "adicionar outro grupo", remove: "remover grupo", edit: "editar", oil: "óleo essencial", none: "sem óleo", total: "total", units: "unidades", limit: "a quantidade escolhida ultrapassa o stock disponível.", request: "feito por encomenda. envia-nos a tua combinação.", noScent: "sem aroma", popular: "combinações populares" },
 en: { hint: "mix shapes and scents. each group can have up to two essential oils.", group: "group", add: "add another group", remove: "remove group", edit: "edit", oil: "essential oil", none: "no oil", total: "total", units: "units", limit: "the selected quantity exceeds available stock.", request: "made to order. send us your combination.", noScent: "unscented", popular: "popular combinations" },
 fr: { hint: "associe formes et parfums. chaque groupe peut contenir jusqu’à deux huiles essentielles.", group: "groupe", add: "ajouter un autre groupe", remove: "supprimer le groupe", edit: "modifier", oil: "huile essentielle", none: "sans huile", total: "total", units: "unités", limit: "la quantité choisie dépasse le stock disponible.", request: "sur commande. envoie-nous ta combinaison.", noScent: "sans parfum", popular: "associations populaires" },
};
const actionClass = "h-[52px] w-full min-w-0 whitespace-normal break-words !px-3 text-center !text-[0.9rem] leading-tight";
export function AirFreshenerPanel({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
 const t = getDictionary(locale), c = copy[locale], cart = useCart();
 const nextId = useRef(2);
 const [groups, setGroups] = useState<Group[]>([{id:1,shape:"coração",quantity:1,oils:["",""]}]);
 const [activeId, setActiveId] = useState<number | null>(1);
 const variant = product.variants.find((v) => variantAvailability(v).kind === "available") ?? product.variants[0];
 const avail = variantAvailability(variant);
 const name = getProductCopy(product.slug,locale,{name:product.name}).name;
 const total = groups.reduce((sum,g) => sum + g.quantity,0);
 const summary = groups.map(g => `${g.quantity} × ${freshenerOptionLabel(freshenerOption(g.shape,g.oils.filter(Boolean)),locale)}`).join("\n");
 const oils = scentsFor(product.slug).sort((a,b)=>a.label[locale].localeCompare(b.label[locale],locale));
 function update(id:number, patch:Partial<Group>) {setGroups(current=>current.map(g=>g.id===id?{...g,...patch}:g));}
 function addGroup() {const id=nextId.current++;setGroups(current=>[...current,{id,shape:"coração",quantity:1,oils:["",""]}]);setActiveId(id);}
 function add() {
  if(avail.kind!=="available" || total>avail.stock) return;
  for(const group of groups) {
   const option=freshenerOption(group.shape,group.oils.filter(Boolean));
   cart.add({sku:variant.sku,productSlug:product.slug,productName:name,variantLabel:option,unitPriceCents:avail.price_cents,quantity:group.quantity,maxStock:avail.stock,addOn:option,image:product.images[0]??null,isCandle:false});
  }
  cart.notify(`${name} · ${t.products.added}`);cart.open();
 }
 return <div className="card-brand freshener-purchase-panel p-5 sm:p-6" data-freshener-builder>
  <p className="mb-5 text-[0.9rem] leading-relaxed text-ink/75">{c.hint}</p>
  <div className="freshener-groups grid items-start gap-3">
   {groups.map((g,index)=><section key={g.id} aria-label={`${c.group} ${index+1}`} className="rounded-2xl border border-moss/30 bg-paper/45 p-4">
    <div className="flex items-start gap-2">
     <button type="button" aria-expanded={activeId===g.id} aria-controls={`freshener-group-${g.id}`} onClick={()=>setActiveId(activeId===g.id?null:g.id)} className="min-h-11 min-w-0 flex-1 text-left text-forest">
      <span className="label-brand block text-moss">{c.group} {index+1}</span>
      <span className="mt-1 block font-ui text-[0.95rem]">{g.quantity} × {FRESHENER_SHAPES.find(s=>s.value===g.shape)!.label[locale]}</span>
      {activeId!==g.id?<span className="mt-1 block text-[0.82rem] leading-relaxed text-ink/65">{g.oils.filter(Boolean).map(o=>oils.find(s=>s.value===o)?.label[locale]).join(" + ")||c.noScent} · {c.edit}</span>:null}
     </button>
     {groups.length>1?<button type="button" aria-label={`${c.remove} ${index+1}`} onClick={()=>{setGroups(current=>current.filter(x=>x.id!==g.id));if(activeId===g.id)setActiveId(null);}} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-moss hover:bg-forest/5 hover:text-forest"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 5 10 10M15 5 5 15" /></svg></button>:null}
    </div>
    <div id={`freshener-group-${g.id}`} hidden={activeId!==g.id}>
     <div className="mt-4 grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3">
      <div><label htmlFor={`shape-${g.id}`} className="label-brand mb-2 block text-moss">{t.products.variant}</label><BrandSelect id={`shape-${g.id}`} value={g.shape} onChange={e=>update(g.id,{shape:e.target.value as FreshenerShape})}>{FRESHENER_SHAPES.map(s=><option key={s.value} value={s.value}>{s.label[locale]}</option>)}</BrandSelect></div>
      <div><label htmlFor={`qty-${g.id}`} className="label-brand mb-2 block text-moss">{t.products.quantity}</label><input id={`qty-${g.id}`} type="number" min={1} max={50} value={g.quantity} onChange={e=>update(g.id,{quantity:Math.max(1,Math.min(50,Number(e.target.value)||1))})} className="h-12 w-full rounded-2xl border border-moss/40 bg-paper px-3 text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-violet" /></div>
     </div>
     <div className="freshener-oils mt-4 grid gap-3">{([0,1] as const).map(i=><div key={i}><label htmlFor={`oil-${g.id}-${i}`} className="label-brand mb-2 block text-moss">{c.oil} {i+1}</label><BrandSelect id={`oil-${g.id}-${i}`} value={g.oils[i]} onChange={e=>{const selected:[string,string]=[...g.oils];selected[i]=e.target.value;update(g.id,{oils:selected});}}><option value="">{c.none}</option>{oils.map(s=><option key={s.value} value={s.value} disabled={g.oils[1-i]===s.value}>{s.label[locale]}</option>)}</BrandSelect></div>)}</div>
     <p className="label-brand mb-2 mt-4 text-moss">{c.popular}</p>
     <div className="flex flex-wrap gap-2">{combosFor(product.slug).map(combo=><button key={combo.join('+')} type="button" aria-pressed={combo.every(o=>g.oils.includes(o))} onClick={()=>update(g.id,{oils:[combo[0],combo[1]]})} className="min-h-9 rounded-full border border-moss/35 px-3 py-2 text-left text-[0.8rem] text-forest transition-colors hover:bg-forest/5 aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-white">{combo.map(o=>oils.find(s=>s.value===o)?.label[locale]).join(' + ')}</button>)}</div>
     {g.oils.includes(HARSH_SCENT)?<p className="mt-3 text-[0.82rem] leading-relaxed text-ink/75">{t.products.scentHarsh}</p>:null}
    </div>
   </section>)}
  </div>
  {groups.length<12?<button type="button" onClick={addGroup} className="mt-3 min-h-11 w-full rounded-2xl border border-dashed border-moss/45 px-4 py-3 font-ui text-[0.9rem] text-forest transition-colors hover:bg-forest/5">+ {c.add}</button>:null}
  <div className="my-5 border-t border-moss/25 pt-4" aria-live="polite"><div className="flex items-baseline justify-between gap-3"><span className="text-sm text-moss">{c.total} · {total} {c.units}</span>{variant.price_cents!==null?<span className="font-display text-[1.7rem] text-forest">{formatPrice(variant.price_cents*total)}</span>:null}</div></div>
  {avail.kind!=="available"?<p className="mb-4 text-[0.88rem] leading-relaxed text-ink/75">{c.request}</p>:total>avail.stock?<p role="alert" className="mb-4 text-sm text-clay">{c.limit}</p>:null}
  <div className="grid grid-cols-2 gap-3" data-product-actions>
   {avail.kind==="available"?<Button size="lg" className={actionClass} disabled={total>avail.stock} onClick={add}>{t.products.addToCart}</Button>:<AnchorButton href={`${t.brand.whatsapp}?text=${encodeURIComponent(t.products.orderMessage(name)+"\n"+summary)}`} target="_blank" rel="noreferrer" size="lg" className={actionClass}>{t.products.talkToUs}</AnchorButton>}
   <ProductContact productName={name} orderDetails={summary} locale={locale} className={actionClass} />
  </div>
 </div>;
}
