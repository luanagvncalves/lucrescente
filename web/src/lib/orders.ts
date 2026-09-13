import { supabaseAdmin } from "@/lib/supabase";

export type OrderLineInput = {
  sku: string;
  quantity: number;
  unit_price_cents: number;
  product_name: string;
  variant_label: string | null;
};

export type FinalizeInput = {
  sessionId: string;
  paymentIntent: string | null;
  email: string | null;
  customerName: string | null;
  shippingAddress: Record<string, unknown> | null;
  shippingOption: string | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  items: OrderLineInput[];
};

/** Writes the order and decrements stock atomically via the `finalize_order` SQL function. Idempotent. */
export async function finalizeOrder(input: FinalizeInput) {
  const db = supabaseAdmin();
  const { data, error } = await db.rpc("finalize_order", {
    p_session_id: input.sessionId,
    p_payment_intent: input.paymentIntent,
    p_email: input.email,
    p_customer_name: input.customerName,
    p_shipping_address: input.shippingAddress,
    p_shipping_option: input.shippingOption,
    p_subtotal_cents: input.subtotalCents,
    p_shipping_cents: input.shippingCents,
    p_total_cents: input.totalCents,
    p_items: input.items,
  });
  if (error) throw error;
  return data as { order_id: string; duplicate: boolean; shortfall?: { sku: string; requested: number; available: number }[] };
}

export type OrderView = {
  id: string;
  stripe_session_id: string;
  email: string | null;
  customer_name: string | null;
  shipping_address: { line1?: string; line2?: string; postal_code?: string; city?: string; country?: string } | null;
  shipping_option: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  created_at: string;
  items: { sku: string; product_name: string; variant_label: string | null; quantity: number; unit_price_cents: number; total_cents: number }[];
};

export async function getOrderBySession(sessionId: string): Promise<OrderView | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select("id, stripe_session_id, email, customer_name, shipping_address, shipping_option, subtotal_cents, shipping_cents, total_cents, created_at, items:order_items ( sku, product_name, variant_label, quantity, unit_price_cents, total_cents )")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as OrderView) ?? null;
}
