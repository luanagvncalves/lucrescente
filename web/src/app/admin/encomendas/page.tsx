import type { Metadata } from "next";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/types";
import { Label, H1 } from "@/components/ui/typography";
import { markShipped } from "./actions";

/**
 * The packing list: every order, newest first, with everything needed to fill
 * it without opening the database.
 *
 * Behind the password wall in src/middleware.ts, and noindex on top of that.
 * Both matter — this page shows customers' names, addresses and emails.
 *
 * Variant labels are printed exactly as stored, never re-translated. The label
 * holds the customer's actual choices — the format, their own container, the
 * dose they typed, which oil they picked — in the language they bought in, and
 * that is what has to reach the person packing the parcel.
 */
export const metadata: Metadata = { title: "encomendas", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const when = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Lisbon",
});

export default async function Encomendas() {
  const orders = await getAllOrders();
  const total = orders.reduce((a, o) => a + o.total_cents, 0);

  return (
    <div className="container-brand section-gap">
      <div className="mx-auto max-w-4xl">
        <Label>área reservada</Label>
        <H1 className="mt-3">encomendas</H1>
        <p className="mt-4 text-ink/70">
          {orders.length === 0
            ? "ainda não há encomendas."
            : `${orders.length} ${orders.length === 1 ? "encomenda" : "encomendas"} · ${formatPrice(total)} no total`}
        </p>

        <div className="mt-10 space-y-6">
          {orders.map((o) => {
            const a = o.shipping_address;
            return (
              <article key={o.id} className="card-brand p-6">
                <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-display text-[1.4rem] text-forest lowercase">
                    {o.customer_name || "sem nome"}
                  </h2>
                  <p className="font-display text-[1.3rem] text-forest">{formatPrice(o.total_cents)}</p>
                </header>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <p className="text-[0.9rem] text-ink/60">{when.format(new Date(o.created_at))}</p>
                  {o.status === "fulfilled" ? (
                    <p className="text-[0.85rem] font-medium text-moss">enviada ✓</p>
                  ) : (
                    <form action={markShipped.bind(null, o.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-moss/30 px-3 py-1 text-[0.8rem] text-moss transition hover:bg-moss/10"
                      >
                        marcar como enviada
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-5 grid gap-6 sm:grid-cols-5">
                  <section className="sm:col-span-3">
                    <p className="label-brand text-moss">a preparar</p>
                    <ul className="mt-3 space-y-2 text-[0.95rem]">
                      {o.items.map((i) => (
                        <li key={`${o.id}-${i.sku}-${i.variant_label ?? ""}`} className="flex justify-between gap-4">
                          <span>
                            <span className="font-medium">{i.quantity} ×</span> {i.product_name}
                            {i.variant_label ? <span className="text-ink/70"> · {i.variant_label}</span> : null}
                          </span>
                          <span className="whitespace-nowrap text-ink/70">{formatPrice(i.total_cents)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[0.9rem] text-ink/70">
                      envio: {o.shipping_option || "não indicado"} · {formatPrice(o.shipping_cents)}
                    </p>
                  </section>

                  <section className="sm:col-span-2">
                    <p className="label-brand text-moss">enviar para</p>
                    {a ? (
                      <p className="mt-3 text-[0.95rem] leading-relaxed">
                        {a.line1}
                        {a.line2 ? <><br />{a.line2}</> : null}
                        <br />
                        {a.postal_code} {a.city}
                        <br />
                        {a.country}
                      </p>
                    ) : (
                      <p className="mt-3 text-[0.95rem] text-ink/60">sem morada</p>
                    )}
                    {o.email ? (
                      <p className="mt-3 break-all text-[0.9rem]">
                        <a href={`mailto:${o.email}`} className="text-moss underline underline-offset-2">
                          {o.email}
                        </a>
                      </p>
                    ) : null}
                  </section>
                </div>

                <p className="mt-5 break-all border-t border-moss/15 pt-4 font-ui text-[0.75rem] text-ink/50">
                  {o.id} · {o.stripe_session_id}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
