import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getOrderBySession } from "@/lib/orders";
import { formatPrice } from "@/lib/types";
import { Label } from "@/components/ui/typography";
import { buttonClass } from "@/components/ui/button";
import { Crescent, Pause } from "@/components/ui/motifs";
import { ContactLinks } from "@/components/contact/contact-links";
import { ClearCartOnMount } from "@/components/cart/clear-cart";

export const metadata: Metadata = { title: "encomenda recebida", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Confirmation({ searchParams }: { searchParams: Promise<{ session_id?: string; idioma?: string }> }) {
  const { session_id, idioma } = await searchParams;
  // Stripe sends the visitor back here, so the language has to ride along in
  // the return URL — otherwise the last page of the purchase is in Portuguese.
  const locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  const order = session_id ? await getOrderBySession(session_id) : null;

  if (!order) {
    return (
      <div className="container-brand section-gap">
        <div className="mx-auto max-w-xl text-center">
          <Crescent size={36} tone="var(--lavender)" className="mx-auto" />
          <h1 className="mt-6 text-h2 text-forest lowercase">{t.order.processing}</h1>
          <p className="mt-4 text-ink/80">{t.order.notFound}</p>
          <meta httpEquiv="refresh" content="4" />
          <Link href={`/${query}`} className={buttonClass("secondary", "md", "mt-8")}>
            {t.order.backHome}
          </Link>
        </div>
      </div>
    );
  }

  const addr = order.shipping_address;

  return (
    <div className="container-brand section-gap">
      <ClearCartOnMount />
      <div className="mx-auto max-w-3xl">
        <Label>{t.order.message}</Label>
        <h1 className="mt-3 text-h1 text-forest lowercase">{t.order.title}</h1>
        <p className="mt-6 text-body-lg measure">{t.order.detail}</p>
        {order.email ? <p className="mt-2 text-ink/70">{t.order.emailNote(order.email)}</p> : null}

        <Pause className="my-12" />

        <div className="grid gap-8 md:grid-cols-5">
          <section className="card-brand p-6 md:col-span-3" aria-labelledby="resumo">
            <h2 id="resumo" className="font-display text-[1.5rem] text-forest lowercase">
              {t.order.summary}
            </h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {order.items.map((i) => (
                <li key={i.sku} className="flex justify-between gap-4">
                  <span>
                    {i.quantity} × {i.product_name}
                    {i.variant_label ? ` (${i.variant_label})` : ""}
                  </span>
                  <span className="font-medium">{formatPrice(i.total_cents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-moss/15 pt-5 text-[0.95rem]">
              <div className="flex justify-between">
                <dt>{t.cart.subtotal}</dt>
                <dd>{formatPrice(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>
                  {t.order.shipping}
                  {order.shipping_option ? <span className="text-ink/60"> · {order.shipping_option}</span> : null}
                </dt>
                <dd>{formatPrice(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between font-medium text-forest">
                <dt>{t.order.total}</dt>
                <dd className="font-display text-[1.4rem]">{formatPrice(order.total_cents)}</dd>
              </div>
            </dl>
          </section>

          <aside className="space-y-6 md:col-span-2">
            <div className="card-brand p-6">
              <p className="label-brand text-moss">{t.order.reference}</p>
              <p className="mt-2 break-all font-ui text-[0.85rem] text-ink/80">{order.id}</p>
            </div>
            {addr ? (
              <div className="card-brand p-6">
                <p className="label-brand text-moss">{t.order.shippingTo}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed">
                  {order.customer_name}
                  <br />
                  {addr.line1}
                  {addr.line2 ? <><br />{addr.line2}</> : null}
                  <br />
                  {addr.postal_code} {addr.city}
                  <br />
                  {addr.country}
                </p>
              </div>
            ) : null}
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-[1.5rem] text-forest lowercase">{t.contact.title}</h2>
          <div className="mt-5">
            <ContactLinks />
          </div>
        </section>
      </div>
    </div>
  );
}
