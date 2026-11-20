import assert from 'node:assert/strict';
import test from 'node:test';
import {addVariant,readCart,resolveCart,setQuantity} from '../src/lib/commerce/cart';
import {demoProducts} from '../src/lib/commerce/demo';
import {findProducts} from '../src/lib/commerce/filter';

test('catalogus bevat zes concepten en alleen demoprijzen',()=>{
  assert.equal(demoProducts.length,6);
  for (const p of demoProducts) {
    assert.equal(p.isDemo,true);
    assert.equal(p.verifiedForSale,false);
    assert.equal(p.inventoryStatus,'demo');
    assert.equal(p.supplierId,null);
    assert.ok(p.price>=4000 && p.price<=8000);
    assert.ok(p.variants.length>=3);
  }
});
test('verschillende maten en kleuren blijven apart en bedragen gebruiken centen',()=>{
  const [p,q]=demoProducts;
  const a=p.variants[0], b=p.variants[1], c=p.variants.find(v=>v.color!==a.color)!;
  let cart=addVariant([],a.id);
  cart=addVariant(cart,a.id); cart=addVariant(cart,b.id); cart=addVariant(cart,c.id);
  cart=addVariant(cart,q.variants[0].id);
  assert.equal(cart.length,4);
  assert.equal(resolveCart(cart,demoProducts).subtotal,4*4995+5495);
  cart=setQuantity(cart,a.id,0);
  assert.equal(resolveCart(cart,demoProducts).subtotal,2*4995+5495);
  assert.deepEqual(readCart(JSON.stringify(cart)),cart);
});
test('ongeldige browseropslag en onbekende varianten houden geen bedrag vast',()=>{
  assert.deepEqual(readCart('{onjuist'),[]);
  assert.deepEqual(readCart('[{"quantity":-1,"variantId":"demo"}]'),[]);
  assert.deepEqual(setQuantity([],'a',100),[]);
  assert.equal(addVariant([{variantId:'a',quantity:99}],'a')[0].quantity,99);
  assert.equal(resolveCart([{variantId:'vervallen',quantity:1}],demoProducts).subtotal,0);
});
test('filters combineren maat, kleur en stijl zonder bronvolgorde te veranderen',()=>{
  const result=findProducts(demoProducts,{collection:'urban-minimal',color:'Stone Grey',size:'M'});
  assert.equal(result.length,1);
  assert.equal(result[0].slug,'urban-one');
  assert.equal(findProducts(demoProducts,{sort:'price-desc'})[0].slug,'signature-one');
  assert.equal(findProducts(demoProducts,{query:'city beige'})[0].slug,'city-flow');
  assert.equal(demoProducts[0].slug,'urban-one');
});
