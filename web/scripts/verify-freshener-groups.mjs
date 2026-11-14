import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base=process.env.VERIFY_SITE_URL??'http://localhost:3015';
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 let submitted;
 await page.route('**/api/contact',async route=>{submitted=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:'{}'});});
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:1000});
  await page.goto(base+'/produtos/ambientador',{waitUntil:'networkidle'});
  const builder=page.locator('[data-freshener-builder]');
  const groups=[['flor','3','lavanda','palmarosa'],['coração','4','canela','laranja doce'],['círculo','1','eucalipto','limão']];
  for(let i=0;i<groups.length;i++) {
   if(i)await builder.getByRole('button',{name:'adicionar outro grupo',exact:false}).click();
   const group=builder.getByRole('region',{name:'grupo '+(i+1),exact:true});
   const [shape,qty,oil1,oil2]=groups[i];
   await group.getByLabel('formato',{exact:true}).selectOption(shape);
   await group.getByLabel('quantidade',{exact:true}).fill(qty);
   await group.getByLabel('óleo essencial 1',{exact:true}).selectOption(oil1);
   await group.getByLabel('óleo essencial 2',{exact:true}).selectOption(oil2);
   assert.equal(await group.getByLabel('óleo essencial 2',{exact:true}).locator(`option[value="${oil1}"]`).isDisabled(),true);
  }
  await builder.getByText('total · 8 unidades',{exact:true}).waitFor();
  assert.equal(await builder.getByRole('button',{expanded:true}).count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const message=new URL(await builder.locator('a[href^="https://wa.me/"]').getAttribute('href')).searchParams.get('text');
  for(const line of ['3 × flor · aroma: lavanda + palmarosa','4 × coração · aroma: canela + laranja doce','1 × círculo · aroma: eucalipto + limão']) assert.ok(message.includes(line),line);
  await builder.screenshot({path:`../verification/ambientador-grupos-${width}.png`});
  await builder.locator('button[aria-haspopup="dialog"]').click();
  const dialog=page.getByRole('dialog');
  assert.ok((await dialog.innerText()).includes('3 × flor'));
  if(width===390) {
   await dialog.locator('input[name="name"]').fill('Teste local');
   await dialog.locator('input[name="email"]').fill('teste@example.invalid');
   await dialog.locator('textarea[name="message"]').fill('Combinação de teste.');
   await dialog.locator('button[type="submit"]').click();
   await dialog.locator('form').waitFor({state:'hidden'});
   assert.ok(submitted.message.includes('1 × círculo · aroma: eucalipto + limão'));
   assert.ok(submitted.message.includes('Combinação de teste.'));
  }
  await page.keyboard.press('Escape');
  await builder.getByRole('button',{name:'remover grupo 2',exact:true}).click();
  await builder.getByText('total · 4 unidades',{exact:true}).waitFor();
 }
 await page.goto(base+'/produtos/amaciador',{waitUntil:'networkidle'});
 const select=page.getByLabel('formato',{exact:true});
 assert.equal(await select.evaluate(el=>getComputedStyle(el).appearance),'none');
 const arrow=select.locator('..').locator('svg');
 const box=await select.boundingBox(), arrowBox=await arrow.boundingBox();
 assert.ok(box.x+box.width-arrowBox.x-arrowBox.width>=15);
 for(const locale of ['en','fr']) {
  await page.goto(base+'/produtos/ambientador?idioma='+locale,{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-freshener-builder] select').count(),3);
 }
 if(process.env.VERIFY_GALLERY) {
  await page.goto(base+'/produtos/ambientador',{waitUntil:'networkidle'});
  const alt='ambientadores de cera de cor creme em forma de flor, coração e círculo, sobre tecido floral rosa e azul';
  await page.getByRole('button',{name:alt,exact:true}).click();
  await page.locator(`img[alt="${alt}"]`).first().evaluate(img=>img.decode());
 }
 console.log('Verified 3 flowers + 4 hearts + 1 circle with independent oil pairs, totals, compact groups, removal, complete WhatsApp/email payloads (email intercepted), translations and inset arrow.');
} finally {await browser.close();}

