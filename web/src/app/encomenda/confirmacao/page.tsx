import { stripe, stripeEnabled, isPaidCheckoutSession } from "@/lib/stripe";
import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getOrderBySession } from "@/lib/orders";
import { getProducts } from "@/lib/catalog";
import { ProductImage } from "@/components/ui/product-image";
import { getVariantLabel } from "@/content/variant-locales";
import { labelHasPopularScent } from "@/content/scent-choices";
import { formatPrice } from "@/lib/types";
import { Label } from "@/components/ui/typography";
import { buttonClass } from "@/components/ui/button";
import { Crescent } from "@/components/ui/motifs";
import { OrderWelcome } from "@/components/cart/order-welcome";
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
  let paymentVerified = false; if (stripeEnabled && session_id?.startsWith("cs_")) { try { paymentVerified = isPaidCheckoutSession(await stripe().checkout.sessions.retrieve(session_id)); } catch { console.error("[confirmation] payment could not be verified"); } } const recorded = paymentVerified && session_id ? await getOrderBySession(session_id) : null; const order = recorded && (recorded.status === "paid" || recorded.status === "fulfilled") ? recorded : null;

  if (!order) {
    return (
      <div className="container-brand section-gap">
        <div className="mx-auto max-w-xl text-center">
          <Crescent size={36} tone="var(--lavender)" className="mx-auto" />
          <h1 className="mt-6 text-h2 text-forest lowercase">{paymentVerified ? t.order.processing : ({ pt: "o pagamento ainda não está confirmado.", en: "payment has not been confirmed.", fr: "le paiement n’est pas encore confirmé." }[locale])}</h1>
          <p className="mt-4 text-ink/80">{t.order.notFound}</p>
          {paymentVerified ? <meta httpEquiv="refresh" content="4" /> : null}
          <Link href={`/${query}`} className={buttonClass("secondary", "md", "mt-8")}>
            {t.order.backHome}
          </Link>
        </div>
      </div>
    );
  }

  const addr = order.shipping_address;
  // Photos are optional: a catalogue outage must not hide a paid order.
  const products = await getProducts().catch(() => []);

  return (
    <div className="container-brand py-10 md:py-14">
      <ClearCartOnMount />
      <OrderWelcome title={t.order.title} label={t.order.viewSummary} />
      <div className="mx-auto max-w-6xl">
        <Label>{t.order.message}</Label>
        <h1 id="order-summary-title" tabIndex={-1} className="mt-3 text-h1 text-forest lowercase">{t.order.summary}</h1>
        <p className="mt-6 text-body-lg measure">
          {t.order.detail}{" "}
          {order.email ? <>{t.order.emailNote(order.email)}{" "}</> : null}
          {t.order.help}
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-5">
          <section className="card-brand p-6 md:col-span-3" aria-labelledby="resumo">
            <h2 id="resumo" className="font-display text-[1.5rem] text-forest lowercase">
              {t.order.summary}
            </h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {order.items.map((i, index) => {
                const product = products.find((p) => p.variants.some((v) => v.sku === i.sku));
                const photo = product?.images.find((image) => image.is_primary) ?? product?.images[0];
                return (
                <li key={`${i.sku}-${index}`} className="flex items-center gap-4">
                  <div className="w-20 shrink-0 sm:w-24">
                    <ProductImage image={photo} ratio="square" sizes="96px" fallbackLabel={i.product_name} locale={locale} />
                  </div>
                  <span className="min-w-0 flex-1">
                    {i.quantity} × {i.product_name}
                    {/* Orders placed now store the label already translated, so
                        this changes nothing for them. Orders placed before that
                        stored Portuguese, and this catches those. */}
                    {i.variant_label ? ` (${getVariantLabel(i.variant_label, locale)})` : ""}
                    {labelHasPopularScent(i.variant_label) ? <span aria-hidden="true" className="ml-1 text-[0.8em] text-clay">★</span> : null}
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(i.total_cents)}</span>
                </li>
                );
              })}
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

        <div className="mt-10">
          <Link href={`/${query}`} className={buttonClass("primary", "lg")}>
            {t.order.backHome}
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-[1.5rem] text-forest lowercase">{t.contact.title}</h2>
          <div className="mt-5">
            <ContactLinks locale={locale} />
          </div>
        </section>
      </div>
    </div>
  );
}
