/**
 * Read-only verification of the Supabase state (counts, last orders, stock of a few SKUs),
 * plus an idempotency probe of finalize_order (replaying an existing session id must not change stock).
 * Usage: npm run verify
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

async function main() {
  const count = async (t: string) => (await db.from(t).select("*", { count: "exact", head: true })).count;
  console.log("counts", {
    products: await count("products"),
    variants: await count("product_variants"),
    ingredients: await count("ingredients"),
    orders: await count("orders"),
  });

  const { data: orders } = await db
    .from("orders")
    .select("id, stripe_session_id, email, total_cents, shipping_option, created_at, order_items ( sku, quantity, unit_price_cents )")
    .order("created_at", { ascending: false })
    .limit(3);
  console.log("last orders", JSON.stringify(orders, null, 1));

  const skus = ["champo-secos", "vela-citronela", "sabonete-grande"];
  const before = (await db.from("product_variants").select("sku, stock, price_cents").in("sku", skus)).data;
  console.log("stock", before);

  if (orders?.[0]) {
    const { data, error } = await db.rpc("finalize_order", {
      p_session_id: orders[0].stripe_session_id,
      p_payment_intent: null,
      p_email: null,
      p_customer_name: null,
      p_shipping_address: null,
      p_shipping_option: null,
      p_subtotal_cents: 0,
      p_shipping_cents: 0,
      p_total_cents: 0,
      p_items: [{ sku: "champo-secos", quantity: 9, unit_price_cents: 1200, product_name: "replay", variant_label: null }],
    });
    console.log("replay same session ->", data, error ?? "");
    const after = (await db.from("product_variants").select("sku, stock").eq("sku", "champo-secos")).data;
    console.log("stock after replay", after);
  }
}
main();
