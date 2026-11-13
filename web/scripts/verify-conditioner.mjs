import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base=process.env.VERIFY_SITE_URL ?? 'http://localhost:3013';
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:1000});
  await page.goto(base+'/produtos/amaciador',{waitUntil:'networkidle'});
  const select=page.getByLabel('formato',{exact:true});
  assert.deepEqual(await select.locator('option').allTextContents(),['mandala','coração','oval']);
  assert.equal(await select.inputValue(),'mandala');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await select.selectOption('oval');
  await page.screenshot({path:`../verification/amaciador-formato-${width}.png`,fullPage:true});
 }
 for(const shape of ['mandala','coração','oval']) {
  await page.getByLabel('formato',{exact:true}).selectOption(shape);
  await page.getByRole('button',{name:'adicionar ao carrinho',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
 }
 const lines=await page.evaluate(()=>JSON.parse(localStorage.getItem('lucrescente.cart.v1')));
 const items=Array.isArray(lines)?lines:lines.lines;
 assert.equal(items.length,3);
 assert.deepEqual(items.map(x=>x.addOn),['mandala','coração','oval']);
 assert.deepEqual(items.map(x=>x.variantLabel),['mandala','coração','oval']);
 assert.ok(items.every(x=>x.unitPriceCents===1500));
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('lucrescente.cart.v1')).length),3);
 // Check the gallery when the photo has been registered after deployment.
 if(process.env.VERIFY_GALLERY) {
  const button=page.getByRole('button',{name:'três amaciadores sólidos ovais de cor creme sobre tecido floral rosa e azul',exact:true});
  await button.click();
  const image=page.locator('img[alt="três amaciadores sólidos ovais de cor creme sobre tecido floral rosa e azul"]').first();
  await image.evaluate(img=>img.decode());
  assert.ok(await image.evaluate(img=>img.naturalWidth>0));
  await page.screenshot({path:'../verification/amaciador-oval-live.png',fullPage:true});
 }
 for(const [locale,label,options] of [['en','format',['mandala','heart','oval']],['fr','format',['mandala','cœur','ovale']]]) {
  await page.goto(base+'/produtos/amaciador?idioma='+locale,{waitUntil:'networkidle'});
  assert.deepEqual(await page.getByLabel(label,{exact:true}).locator('option').allTextContents(),options);
 }
 console.log('Verified shape dropdown on desktop/mobile, three distinct persisted cart lines at €15, and translations.');
} finally { await browser.close(); }
