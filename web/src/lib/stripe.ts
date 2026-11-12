import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
/** Hosted production must never accept test keys or simulated payments. */
export const productionCheckout = process.env.VERCEL_ENV === "production" ||
  (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview");
export const stripeEnabled = /^(sk|rk)_(live|test)_/.test(secretKey) &&
  (!productionCheckout || /^(sk|rk)_live_/.test(secretKey));
export const mockEnabled = !secretKey && process.env.CHECKOUT_MOCK === "true" &&
  process.env.NODE_ENV !== "production" && !process.env.VERCEL_ENV && !process.env.VERCEL;

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!stripeEnabled) throw new Error("Stripe payments are not configured for this environment");
  if (!client) client = new Stripe(secretKey);
  return client;
}

/** Call only with a session retrieved from Stripe or a verified webhook. */
export function isPaidCheckoutSession(session: Pick<Stripe.Checkout.Session,
  "mode" | "status" | "payment_status" | "payment_intent" | "livemode"
>): boolean {
  return session.mode === "payment" && session.status === "complete" &&
    session.payment_status === "paid" && Boolean(session.payment_intent) &&
    (!productionCheckout || session.livemode === true);
}
