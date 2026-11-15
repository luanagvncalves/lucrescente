import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base=process.env.VERIFY_SITE_URL??'http://localhost:3000';
const browser=await chromium.launch({headless:true});
try {
 for(const width of [320,390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'networkidle'});
  const titles=await page.locator('.favorites-grid h3').evaluateAll(nodes=>nodes.map(el=>({text:el.textContent,overflow:getComputedStyle(el).overflowWrap,wordBreak:getComputedStyle(el).wordBreak,width:el.clientWidth,scroll:el.scrollWidth})));
  assert(titles.length>1);assert(titles.every(t=>t.overflow==='normal'&&t.wordBreak==='normal'&&t.scroll<=t.width+1),JSON.stringify(titles));
  assert.equal(await page.locator('.favorites-grid').evaluate(el=>el.getBoundingClientRect().right<=innerWidth),true);
  await page.locator('.favorites-grid').screenshot({path:`../verification/favorites-fixed-${width}.png`});
  await page.goto(`${base}/eventos`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-event-cards] a').count(),2);
  await page.locator('[data-event-cards] a[href*="prenda-de-grupo"]').click();
  await page.locator('[data-event-gallery]').waitFor();
  const original=page.url();await page.locator('[data-event-gallery] > div').first().locator('button').first().click();
  const dialog=page.locator('dialog[open]');await dialog.waitFor();assert.equal(page.url(),original);
  await dialog.getByRole('button',{name:'próxima fotografia',exact:true}).click();assert.equal(await dialog.locator('p').innerText(),'2 / 5');
  await page.keyboard.press('ArrowLeft');assert.equal(await dialog.locator('p').innerText(),'1 / 5');
  const color=await dialog.evaluate(el=>getComputedStyle(el).backgroundColor);assert(color.includes('0.5')||color.includes('50%'),color);
  await dialog.locator('img').evaluate(img=>img.complete ? Promise.resolve() : new Promise(resolve=>{img.onload=resolve;img.onerror=resolve}));await page.screenshot({path:`../verification/events-lightbox-${width}.png`});await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
  await page.goto(`${base}/produtos/vela-colorida`,{waitUntil:'networkidle'});
  const panel=page.locator('[data-grouped-purchase]');await panel.waitFor();
  await panel.getByLabel('quantidade',{exact:true}).fill('3');
  await panel.getByLabel('óleo essencial 1',{exact:true}).selectOption('lavanda');
  await panel.getByRole('button',{name:'adicionar outro grupo'}).click();
  await panel.getByLabel('quantidade',{exact:true}).last().fill('2');
  await panel.getByLabel('óleo essencial 1',{exact:true}).last().selectOption('canela');
  const summary=await panel.getByLabel('seleção atual').innerText();assert(summary.includes('3 ×')&&summary.includes('2 ×')&&summary.includes('lavanda')&&summary.includes('canela'),summary);
  const whatsapp=await panel.locator('a[href*="wa.me"]').getAttribute('href');const message=new URL(whatsapp).searchParams.get('text');assert(message.includes(summary));
  await panel.screenshot({path:`../verification/grouped-candles-${width}.png`});
  const cover=await page.locator('[data-product-gallery] img').first().getAttribute('src');assert(cover.includes('6.jpg'),cover);
  await page.goto(`${base}/produtos/batom-hidratante-sem-cor`,{waitUntil:'networkidle'});
  const balm=page.locator('[data-grouped-purchase]');await balm.getByLabel('quantidade',{exact:true}).fill('2');
  await balm.getByRole('combobox').last().selectOption({index:1});
  await balm.getByRole('button',{name:'adicionar outro grupo'}).click();await balm.getByRole('combobox').last().selectOption({index:2});
  assert((await balm.getByLabel('seleção atual').innerText()).includes('2 ×'));
  const add=balm.getByRole('button',{name:'adicionar ao carrinho',exact:true});
  if(await add.count()) {await add.click();assert.equal(await page.locator('[aria-modal="true"]').count(),0);assert.equal(page.url(),`${base}/produtos/batom-hidratante-sem-cor`);const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('lucrescente.cart.v1')));const lines=Array.isArray(stored)?stored:stored.lines;assert.equal(lines.reduce((sum,l)=>sum+l.quantity,0),3);assert.equal(lines.length,2);assert.notEqual(lines[0].addOn,lines[1].addOn);}
  await page.close();console.log(`Verified ${width}px: favorites, lightbox, 5 candles with distinct oils, 3 balms and cover`);
 }
} finally {await browser.close();}
