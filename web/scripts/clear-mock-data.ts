import assert from "node:assert/strict";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });
assert.ok(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const mockOrders = await db.from("orders").select("id").like("stripe_session_id", "mock_%");
  assert.ifError(mockOrders.error);
  if (mockOrders.data?.length) {
    const removed = await db.from("orders").delete().in("id", mockOrders.data.map((o) => o.id));
    assert.ifError(removed.error);
  }
  const sessions = await db.from("mock_checkout_sessions").delete().like("id", "mock_%");
  assert.ifError(sessions.error);
  console.log({ mockOrdersRemoved: mockOrders.data?.length ?? 0, mockSessionsCleared: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
