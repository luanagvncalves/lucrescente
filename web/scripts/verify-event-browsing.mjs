import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base=process.env.VERIFY_SITE_URL??'http://localhost:3000';
const browser=await chromium.launch();
async function newPage(options) { const page=await browser.newPage(options); await page.route('**/_next/image?**',route=>{const path=new URL(route.request().url()).searchParams.get('url');return route.continue({url:new URL(path,base).href});}); return page; }
try {
 for(const width of [320,390,1440]) {
  const page=await newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.setDefaultNavigationTimeout(90000);
  await page.goto(`${base}/eventos`,{waitUntil:'networkidle'});
  const cards=page.locator('[data-event-cards] a');assert.equal(await cards.count(),2);
  for(const overlay of await page.locator('[data-event-overlay]').all()) assert((await overlay.evaluate(el=>getComputedStyle(el).backgroundColor)).match(/0\.5|50%/));
  assert(await cards.first().innerText()==='crisma');
  await page.locator('article').screenshot({path:`../verification/event-cards-${width}.png`});
  for(const slug of ['crisma','prenda-de-grupo']) {
   await page.goto(`${base}/eventos/${slug}`,{waitUntil:'networkidle'});
   const gallery=page.locator('[data-event-gallery]');assert.equal(await gallery.locator('ul button').count(),5);
   assert.equal(await gallery.locator('[data-event-count]').innerText(),'1 / 5');
   await gallery.getByRole('button',{name:'próxima fotografia',exact:true}).click();assert.equal(await gallery.locator('[data-event-count]').innerText(),'2 / 5');
   await gallery.locator('ul button').last().click();assert.equal(await gallery.locator('[data-event-count]').innerText(),'5 / 5');
   assert(await page.getByRole('heading',{level:1}).innerText());
   assert.equal(await page.locator('article a[href*="wa.me"]').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.locator('article').screenshot({path:`../verification/event-${slug}-${width}.png`});
  }
  for(const slug of ['amaciador','ambientador','batom-hidratante-sem-cor']) {
   await page.goto(`${base}/produtos/${slug}`,{waitUntil:'networkidle'});
   const add=page.getByRole('button',{name:'adicionar ao carrinho',exact:true});
   if(await add.count()===0) { assert.equal(await page.locator('article a[href*="wa.me"], main a[href*="wa.me"]').count()>0,true); continue; }
   await add.click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('lucrescente.cart.v1')||'[]').length>0);
   assert.equal(await page.locator('[aria-modal="true"]').count(),0,slug);
   assert.equal(page.url(),`${base}/produtos/${slug}`);
   assert.equal(await page.evaluate(()=>document.body.style.overflow),'',slug);
  }
  await page.close();console.log(`Verified ${width}px: event cards, both carousels, details, and available add-to-cart forms stay on page`);
 }
 for(const lang of ['en','fr']) {
  const page=await browser.newPage();await page.goto(`${base}/eventos?idioma=${lang}`,{waitUntil:'networkidle'});assert((await page.locator('[data-event-cards] a').first().getAttribute('href')).endsWith(`?idioma=${lang}`));await page.locator('[data-event-cards] a').first().click();assert((await page.locator('article>a').getAttribute('href')).endsWith(`?idioma=${lang}`));await page.close();
 }
}finally{await browser.close();}
