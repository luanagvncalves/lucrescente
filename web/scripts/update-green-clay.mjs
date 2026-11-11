import { readFileSync, writeFileSync } from 'node:fs';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
config({path:'.env.local',quiet:true});
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
async function checked(query){const {data,error}=await query;if(error)throw error;return data;}
const product=await checked(db.from('products').select('id,slug,why_it_works,product_ingredients(ingredient_id,sort_order,ingredients(slug))').eq('slug','champo-oleosos').single());
const before=await checked(db.from('ingredients').select('*').in('slug',['argila-branca','argila-verde']));
const backup='../backups/argila-verde-before-2026-11-11.json';
if(!requireExists(backup))writeFileSync(backup,JSON.stringify({product,ingredients:before},null,2));
function requireExists(p){try{readFileSync(p);return true;}catch{return false;}}
const green=JSON.parse(readFileSync('src/data/ingredients.json','utf8')).find(i=>i.slug==='argila-verde');
const row=await checked(db.from('ingredients').upsert(green,{onConflict:'slug'}).select('id,slug').single());
const white=product.product_ingredients.find(i=>i.ingredients.slug==='argila-branca');
if(white)await checked(db.from('product_ingredients').update({ingredient_id:row.id}).eq('product_id',product.id).eq('ingredient_id',white.ingredient_id).select());
await checked(db.from('products').update({why_it_works:product.why_it_works.replace('argila branca','argila verde')}).eq('id',product.id).select('slug'));
const verified=await checked(db.from('products').select('slug,why_it_works,product_ingredients(ingredients(slug))').eq('id',product.id).single());
if(!verified.why_it_works.includes('argila verde')||!verified.product_ingredients.some(i=>i.ingredients.slug==='argila-verde')||verified.product_ingredients.some(i=>i.ingredients.slug==='argila-branca'))throw Error('Verification failed');
console.log('Verified green clay description and oily shampoo ingredient link; backup saved.');
