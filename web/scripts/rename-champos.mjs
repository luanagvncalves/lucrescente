import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

const supabase = createClient(url, key);

const renames = [
  { slug: "champo-secos", name: "Champô Sólido para Cabelos Secos" },
  { slug: "champo-oleosos", name: "Champô Sólido para Cabelos Oleosos" },
  { slug: "champo-queda", name: "Champô Sólido Anti-Queda de Cabelo" },
];

for (const { slug, name } of renames) {
  const { data, error } = await supabase.from("products").update({ name }).eq("slug", slug).select("slug, name");
  if (error) {
    console.error(`FAILED ${slug}:`, error.message);
  } else if (!data || data.length === 0) {
    console.error(`NOT FOUND: ${slug}`);
  } else {
    console.log(`OK: ${data[0].slug} -> "${data[0].name}"`);
  }
}
