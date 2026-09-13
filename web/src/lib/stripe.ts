import Stripe from "stripe";

/**
 * Stripe client. When STRIPE_SECRET_KEY is empty and CHECKOUT_MOCK=true, the checkout
 * route uses a local mock (see /api/checkout and /checkout/mock) so the full order flow
 * can be exercised before the client hands over test keys.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
export const mockEnabled = !stripeEnabled && process.env.CHECKOUT_MOCK === "true";

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}
