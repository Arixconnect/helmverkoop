'use client';
import {useState} from 'react';
import {SlidersHorizontal} from 'lucide-react';
import type {Product} from '@/lib/commerce/types';
import {collections} from '@/lib/commerce/collections';
import {findProducts} from '@/lib/commerce/filter';
import {ProductGrid} from './ProductCard';

export function Catalog({products,fixedCollection}:{products:Product[];fixedCollection?:boolean}) {
  const [collection,setCollection]=useState('');
  const [color,setColor]=useState('');
  const [size,setSize]=useState('');
  const [sort,setSort]=useState('');
  const choices=findProducts(products,{collection,color,size,sort});
  const filtered=Boolean(collection||color||size);
  function reset() {setColor('');setSize('');setCollection('');}
  return <>
    <div className="filters">
      <span className="filter-caption"><SlidersHorizontal size={16} aria-hidden="true"/> Filters</span>
      {!fixedCollection && <label><span className="c-sr">Collectie</span><select aria-label="Collectie" value={collection} onChange={e=>setCollection(e.target.value)}><option value="">Alle stijlen</option>{collections.map(c=><option key={c.slug} value={c.slug}>{c.title}</option>)}</select></label>}
      <label><span className="c-sr">Kleur</span><select aria-label="Kleur" value={color} onChange={e=>setColor(e.target.value)}><option value="">Alle kleuren</option>{[...new Set(products.flatMap(p=>p.colors.map(c=>c.name)))].map(c=><option key={c}>{c}</option>)}</select></label>
      <label><span className="c-sr">Maat</span><select aria-label="Maat" value={size} onChange={e=>setSize(e.target.value)}><option value="">Alle maten</option>{[...new Set(products.flatMap(p=>p.sizes))].map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="sort-control"><span className="c-sr">Sorteren</span><select aria-label="Sorteren" value={sort} onChange={e=>setSort(e.target.value)}><option value="">Aanbevolen</option><option value="price-asc">Prijs laag naar hoog</option><option value="price-desc">Prijs hoog naar laag</option><option value="title">Naam A–Z</option></select></label>
    </div>
    <div className="filter-result"><span role="status">{choices.length} {choices.length===1?'helm':'helmen'}</span>{filtered && <button className="text-action" onClick={reset}>Wis filters</button>}</div>
    {choices.length ? <ProductGrid products={choices}/> : <div className="commerce-empty"><h2>Geen helmen gevonden</h2><p>{filtered?'Probeer een andere kleur, maat of stijl.':'Er staan momenteel geen modellen in deze selectie.'}</p></div>}
  </>;
}
