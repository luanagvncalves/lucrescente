import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("missing env vars");
const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  // Find and delete the "cuidado-capilar" category
  const { data: cats } = await db.from("categories").select("id").eq("slug", "cuidado-capilar");
  if (!cats || cats.length === 0) {
    console.log("Category 'cuidado-capilar' not found");
    return;
  }
  
  const catId = cats[0].id;
  console.log("Found category ID:", catId);
  
  // Delete all products in this category
  const { error: delErr } = await db.from("products").delete().eq("category_id", catId);
  if (delErr) throw delErr;
  console.log("Deleted products in this category");
  
  // Delete the category itself
  const { error: catErr } = await db.from("categories").delete().eq("slug", "cuidado-capilar");
  if (catErr) throw catErr;
  console.log("Deleted category 'cuidado-capilar'");
}

main().catch(console.error);
