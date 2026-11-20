'use client';
import {useState} from 'react';
import Image from '@/components/SiteImage';
import Link from 'next/link';
import {Minus,Plus,ShoppingBag,Trash2} from 'lucide-react';
import {money,type Product} from '@/lib/commerce/types';
import {quantityLimit,resolveCart} from '@/lib/commerce/cart';
import {useCart} from './CartProvider';

export function CartView({products,demo}:{products:Product[];demo:boolean}) {
  const {lines,set}=useCart();
  const {items,subtotal}=resolveCart(lines,products);
  const [pending,setPending]=useState(false);
  const [error,setError]=useState('');
  async function checkout(){
    setPending(true);setError('');
    try {
      const response=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lines)});
      const body=await response.json();
      if (!response.ok || typeof body.checkoutUrl!=='string') throw new Error();
      window.location.assign(body.checkoutUrl);
    } catch {setPending(false);setError('Checkout kon niet openen. Vernieuw je winkelmand en probeer opnieuw.');}
  }
  const notice=demo&&<p className="demo-note">Dit is een demonstratiewebshop. Bestellen is nog niet mogelijk.</p>;
  if (!items.length) return <div className="commerce-empty empty-cart"><ShoppingBag size={36} strokeWidth={1.3}/><h2>Je winkelmand is leeg.</h2><p>Ontdek de collectie en kies de helm die bij je past.</p><Link href="/fatbike-helmen" className="commerce-button">Ontdek onze helmen</Link>{notice}</div>;
  return <div className="cart-columns"><div className="cart-lines">{items.map(({item,quantity,variantId})=>{
    if (!item) return <div key={variantId} className="cart-line missing"><p>Dit artikel staat niet meer in de catalogus.</p><button onClick={()=>set(variantId,0)} className="text-action">Verwijderen</button></div>;
    const {product,variant}=item;
    const photo=variant.image??product.images[0];
    return <article className="cart-line" key={variantId}>
      <Link href={'/fatbike-helmen/'+product.slug} className="cart-photo"><Image src={photo.src} alt={photo.alt} fill sizes="110px"/></Link>
      <div className="cart-info"><h2><Link href={'/fatbike-helmen/'+product.slug}>{product.title}</Link></h2><p>{variant.color} · Maat {variant.size}</p><p>{money(variant.price)} per stuk</p>
        <div className="quantity-control" role="group" aria-label={'Aantal '+product.title}><button onClick={()=>set(variantId,quantity-1)} disabled={quantity<=1} aria-label={'Aantal verlagen voor '+product.title}><Minus size={14}/></button><span aria-live="polite">{quantity}</span><button disabled={quantity>=quantityLimit} onClick={()=>set(variantId,quantity+1)} aria-label={'Aantal verhogen voor '+product.title}><Plus size={14}/></button></div>
      </div>
      <div className="line-total"><strong>{money(variant.price*quantity)}</strong><button aria-label={product.title+' verwijderen'} onClick={()=>set(variantId,0)}><Trash2 size={17}/></button></div>
    </article>;
  })}</div><aside className="cart-summary"><h2>Overzicht</h2><p className="sub-total"><span>Subtotaal</span><strong>{money(subtotal)}</strong></p>{notice}
    {!demo&&<><button className="commerce-button" onClick={checkout} disabled={pending||items.some(line=>!line.item?.variant.available)}>{pending?'Checkout openen…':'Naar checkout'}</button><p role="status">{error}</p></>}
    <Link href="/fatbike-helmen" className="text-action">Verder winkelen</Link></aside></div>;
}
