'use client';
import {useState} from 'react';
import Image from '@/components/SiteImage';
import Link from 'next/link';
import {Check,Plus,Ruler,Search,ShoppingBag} from 'lucide-react';
import {money,type Product} from '@/lib/commerce/types';
import {useCart} from '@/components/cart/CartProvider';
import {collectionName} from '@/lib/commerce/collections';

export function ProductDetail({product}:{product:Product}) {
  const [color,setColor]=useState(product.colors[0].name);
  const [size,setSize]=useState('');
  const [zoom,setZoom]=useState(false);
  const [photo,setPhoto]=useState(0);
  const [error,setError]=useState(false);
  const [added,setAdded]=useState(false);
  const {add,lines}=useCart();
  const variant=product.variants.find(v=>v.color===color && v.size===size);
  const capped=variant && (lines.find(l=>l.variantId===variant.id)?.quantity??0)>=99;
  const img=product.images[photo] ?? product.images[0];

  function chooseColor(name: string) {
    const v=product.variants.find(item=>item.color===name);
    const index=product.images.findIndex(p=>p.src===v?.image?.src);
    setColor(name);setPhoto(Math.max(0,index));setZoom(false);setAdded(false);setError(false);
    if (!product.variants.some(item=>item.color===name && item.size===size && item.available)) setSize('');
  }
  function addToCart() {
    if (!variant?.available) {setError(true);return;}
    if (!capped) {add(variant.id);setAdded(true);setError(false);}
  }
  return <div className="detail-layout">
    <div>
      <button className={'gallery-main'+(zoom?' zoomed':'')} aria-label={zoom?'Toon volledig beeld':'Vergroot productbeeld'} aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>
        <Image src={img.src} alt={img.alt} fill sizes="(max-width: 760px) 93vw, 55vw" priority />
        <span className="gallery-zoom"><Search size={18}/></span>
      </button>
      <div className="gallery-strip" aria-label="Productbeelden">
        {product.images.map((p,i)=><button key={p.src} aria-label={'Toon '+p.alt} aria-pressed={photo===i&&!zoom} onClick={()=>{setPhoto(i);setZoom(false);}}>
          <Image src={p.src} alt="" fill sizes="70px" /></button>)}
        <button className="zoom-thumb" aria-label="Toon uitvergroot detail" aria-pressed={zoom} onClick={()=>setZoom(true)}><Image src={img.src} alt="" fill sizes="140px"/><Search size={13}/></button>
      </div>
    </div>
    <div className="detail-purchase">
      <Link className="collection-label" href={'/collecties/'+product.category}>{collectionName(product.category)}</Link>
      <h1>{product.title}</h1>
      <p className="detail-price">{money(variant?.price ?? product.price)} {product.isDemo&&<small>Demoprijs</small>}</p>
      <p className="detail-description">{product.description}</p>
      <fieldset className="variant-set"><legend>Kleur <span>· {color}</span></legend><div className="variant-options">
        {product.colors.map(c=><button key={c.name} type="button" aria-pressed={color===c.name} aria-label={c.name} onClick={()=>chooseColor(c.name)} className="color-chip">{c.hex&&<i style={{backgroundColor:c.hex}}/>}{c.name}</button>)}
      </div></fieldset>
      <fieldset className="variant-set"><legend>Maat</legend><div className="variant-options">
        {product.sizes.map(s=><button key={s} type="button" disabled={!product.variants.some(v=>v.color===color&&v.size===s&&v.available)} aria-pressed={size===s} onClick={()=>{setSize(s);setAdded(false);setError(false);}} className="size-chip">{s}</button>)}
      </div></fieldset>
      <Link className="size-help" href="/maatwijzer"><Ruler size={16}/> Hulp bij je helmmaat</Link>
      <button className="commerce-button add-button" onClick={addToCart} disabled={Boolean(capped)||product.inventoryStatus==='unavailable'}><ShoppingBag size={18}/>{capped?'Maximumaantal bereikt':product.inventoryStatus==='unavailable'?'Tijdelijk niet beschikbaar':'Toevoegen aan winkelmand'}</button>
      <div role="status">{error && <p className="variant-alert">Kies eerst je maat.</p>}{added && <p className="added-message"><Check size={16}/> Toegevoegd. <Link href="/winkelwagen">Bekijk winkelmand</Link></p>}</div>
      {product.isDemo && <p className="demo-note">Dit is een demonstratiewebshop. Bestellen is nog niet mogelijk.</p>}
      <div className="detail-facts">
        <details><summary>Specificaties <Plus size={17}/></summary><ul>{product.features.map(f=><li key={f}>{f}</li>)}<li>Maten {product.sizes.join(', ')}</li>{product.isDemo && <li>Gewicht, materiaal en maatbereik worden vóór verkoop bevestigd.</li>}</ul></details>
        <details><summary>Veiligheidsdocumentatie <Plus size={17}/></summary>{product.isDemo?<p>Voor dit fictieve ontwerp zijn geen veiligheidsdocumenten beoordeeld. De productbeelden zijn conceptbeelden.</p>:<ul>{product.complianceDocuments.map((url,i)=><li key={url}><a href={url}>Document {i+1}</a></li>)}</ul>}</details>
        <details><summary>Verzending <Plus size={17}/></summary><p>{product.shippingEstimate ?? 'Voor demonstratieartikelen zijn verzending en levering niet beschikbaar.'} <Link href="/verzending">Meer over verzending</Link></p></details>
      </div>
    </div>
  </div>;
}
