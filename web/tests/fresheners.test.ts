import test from 'node:test';
import assert from 'node:assert/strict';
import { freshenerOption, sanitiseFreshenerOption, freshenerOptionLabel } from '../src/content/freshener-options';
import { sanitiseAddOn, getAddOnLabel } from '../src/content/product-addons';
import { getVariantLabel } from '../src/content/variant-locales';

test('freshener shape and oils survive checkout validation and translate together',()=>{
 const groups = [
  {shape:'flor',quantity:3,oils:['lavanda','palmarosa']},
  {shape:'coração',quantity:4,oils:['canela','laranja doce']},
  {shape:'círculo',quantity:1,oils:['limão','eucalipto']},
 ] as const;
 const values = groups.map(g=>freshenerOption(g.shape,[...g.oils]));
 assert.equal(new Set(values).size,3);
 for(const value of values) assert.equal(sanitiseAddOn('ambientador',value),value);
 assert.equal(freshenerOption('flor',['lavanda','palmarosa']),freshenerOption('flor',['palmarosa','lavanda']));
 assert.equal(getAddOnLabel('ambientador',values[0],'en'),'flower · scent: lavender + palmarosa');
 assert.equal(getVariantLabel(values[1],'fr'),'cœur · parfum: cannelle + orange douce');
 assert.equal(freshenerOptionLabel('círculo','en'),'circle');
 assert.equal(sanitiseFreshenerOption('aroma: lavanda'),'aroma: lavanda');
});
test('freshener orders reject unknown shapes, repeated or more than two oils',()=>{
 for(const value of ['triângulo','flor · aroma: lavanda + lavanda','coração · aroma: lavanda + limão + canela','círculo · aroma: inexistente','flor · aroma: lavanda · extra']) assert.equal(sanitiseFreshenerOption(value),null,value);
 assert.equal(sanitiseAddOn('vela-decorada','flor · aroma: lavanda'),null);
});
