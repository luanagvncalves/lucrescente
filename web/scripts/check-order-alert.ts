/**
 * Proves that a paid order which CANNOT be recorded still reaches a human.
 * Usage: npm run check:alert            (tests the deployed site)
 *        npm run check:alert -- --site=http://localhost:3000
 *
 * Why this exists. For two days the shop lost paid orders in silence: the
 * customer paid, Stripe reported success, `finalize_order` refused the order,
 * and nothing was written or said. The only trace was a webhook Stripe kept
 * retrying. The fix has two halves — the refusal itself, and the alert that
 * would have surfaced it in minutes. This checks the second half, which is the
 * one that cannot be verified by reading the code.
 *
 * How. It takes a real product through a real Stripe Checkout with a test card,
 * and sets that product's stock to 0 in the one second between paying and the
 * webhook arriving. `finalize_order` then refuses for a reason that has nothing
 * to do with the bug being guarded against, which is the point: any failure to
 * record a paid order must behave this way.
 *
 * Run it against the deployed site after touching anything in the checkout, the
 * webhook, or finalize_order. Test mode only — it refuses to run on live keys.
 *
 * AFTERWARDS. Stripe keeps retrying the refused delivery, and stock is put back
 * as soon as the check is done, so a later retry WILL succeed and write a real
 * order row. The script waits for that and removes it. If it gives up waiting,
 * it prints exactly what to delete — read the last lines before walking away.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";

config({ path: ".env.local" });

const SKU = process.env.CHECK_SKU ?? "deo-lav-60";
const TEST_EMAIL = "diagnostico@lucrescente.pt";
const CARD = "4242424242424242";

const site =
  process.argv.find((a) => a.startsWith("--site="))?.slice(7) ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!url || !key) throw new Error("missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
if (!stripeKey) throw new Error("missing STRIPE_SECRET_KEY");
if (!stripeKey.startsWith("sk_test_")) throw new Error("refusing to run against live Stripe keys");

const db = createClient(url, key, { auth: { persistSession: false } });

const stripeGet = async (path: string) => {
  const res = await fetch("https://api.stripe.com/v1/" + path, {
    headers: { Authorization: "Basic " + Buffer.from(stripeKey + ":").toString("base64") },
  });
  return res.json();
};

const readStock = async (): Promise<number> => {
  const { data, error } = await db.from("product_variants").select("stock").eq("sku", SKU).single();
  if (error) throw error;
  return data.stock as number;
};
const writeStock = async (stock: number) => {
  const { error } = await db.from("product_variants").update({ stock }).eq("sku", SKU);
  if (error) throw error;
};
const orderFor = async (sessionId: string) => {
  const { data } = await db.from("orders").select("id").eq("stripe_session_id", sessionId).maybeSingle();
  return data?.id ?? null;
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const startingStock = await readStock();
  if (startingStock < 1) throw new Error(`${SKU} has no stock to test with`);
  console.log(`site: ${site}\nsku:  ${SKU} (stock ${startingStock})\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  let sessionId = "";
  let failed: unknown = null;

  try {
    const res = await page.request.post(site + "/api/checkout", {
      data: { items: [{ sku: SKU, quantity: 1 }], locale: "pt" },
    });
    const { url: checkoutUrl, error } = await res.json();
    if (!checkoutUrl) throw new Error(`checkout refused: ${error ?? res.status()}`);
    sessionId = checkoutUrl.match(/cs_test_[A-Za-z0-9]+/)![0];
    console.log("session:", sessionId);

    await page.goto(checkoutUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#email", { timeout: 60_000 });
    await page.fill("#email", TEST_EMAIL);

    const manual = page.locator("text=Preencha o endereço manualmente");
    if (await manual.count()) {
      await manual.first().click();
      await page.waitForTimeout(1_200);
    }
    await page.selectOption("#shippingCountry", "PT");
    await page.fill("#shippingName", "teste aviso");
    await page.fill("#shippingAddressLine1", "rua das flores 12");
    await page.fill("#shippingPostalCode", "2400-100");
    await page.fill("#shippingLocality", "leiria");
    await page.waitForTimeout(2_500);

    // The card fields only exist once the card row is open, and the radio is
    // covered by its own label — so click where the row actually is.
    const cardRow = page.locator('[data-testid="card-accordion-item-button"]').first();
    const box = await cardRow.boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(3_000);

    await page.waitForSelector("#cardNumber", { timeout: 40_000 });
    await page.fill("#cardNumber", CARD);
    await page.fill("#cardExpiry", "1234");
    await page.fill("#cardCvc", "123");
    const billingName = page.locator("#billingName");
    if (await billingName.count()) await billingName.fill("teste aviso");

    // the whole point of the check
    await writeStock(0);
    console.log("stock set to 0, between paying and the webhook");

    await page.click(".SubmitButton");
    await page.waitForURL(/encomenda\/confirmacao/, { timeout: 120_000 });
    console.log("paid\n");
  } catch (e) {
    failed = e;
  } finally {
    await browser.close();
    await writeStock(startingStock);
    console.log(`stock restored to ${startingStock}\n`);
  }
  if (failed) throw failed;

  // Stripe leaves the event pending while it retries, which is how we know the
  // webhook answered 500 rather than swallowing the failure quietly.
  await sleep(8_000);
  const events = await stripeGet(`events?limit=20&type=checkout.session.completed`);
  const event = (events.data ?? []).find((e: { data: { object: { id: string } } }) => e.data.object.id === sessionId);
  const recorded = await orderFor(sessionId);

  const refusedAndRetrying = Boolean(event && event.pending_webhooks > 0);
  console.log(`webhook reported failure (stripe still retrying): ${refusedAndRetrying ? "yes" : "NO"}`);
  console.log(`order left unrecorded, as expected:              ${recorded ? "NO" : "yes"}`);
  console.log("\nnow check the shop's inbox for “encomenda paga NÃO registada”.");
  console.log("no email means the alert is broken and a lost order would be silent again.");

  if (!refusedAndRetrying || recorded) {
    throw new Error("the failure path did not behave as expected — see the two lines above");
  }

  // Clean up after ourselves: stock is back, so Stripe's next retry will now
  // succeed and write an order that nobody placed.
  console.log("\nwaiting for stripe to retry so the test order can be removed…");
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    await sleep(30_000);
    const id = await orderFor(sessionId);
    if (!id) continue;
    await db.from("order_items").delete().eq("order_id", id);
    await db.from("orders").delete().eq("id", id);
    await writeStock(startingStock);
    console.log(`retry landed; removed order ${id} and put ${SKU} back to ${startingStock}.`);
    return;
  }

  console.log(
    [
      "",
      "STILL PENDING — stripe had not retried within 15 minutes.",
      "when it does, it will write one test order that must be removed:",
      `  session: ${sessionId}`,
      `  email:   ${TEST_EMAIL}`,
      `  sku:     ${SKU} (its stock will drop by 1 and must be put back)`,
      "",
      "delete the order and its order_items, and add the unit back, in one go.",
    ].join("\n"),
  );
}

main().catch((e) => {
  console.error("\ncheck failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
