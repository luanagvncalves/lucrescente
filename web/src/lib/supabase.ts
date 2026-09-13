import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("Supabase env missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/** Public, read-only client (RLS: catalogue tables are readable, orders are not). */
export const supabasePublic = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Server-only client with the service role. Never import from client components. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  return createClient(url!, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
