'use client';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {Search} from 'lucide-react';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {ProductGrid} from '@/components/product/ProductCard';
import {findProducts,searchMatches} from '@/lib/commerce/filter';
import type {Product} from '@/lib/commerce/types';
import type {Article} from '@/lib/cms/types';

export function SearchResults({products,articles}:{products:Product[];articles:Pick<Article,'slug'|'title'|'excerpt'|'category'>[]}) {
  const q=(useSearchParams().get('q') || '').trim().slice(0,160);
  const matches=q?findProducts(products,{query:q}):[];
  const reading=q?articles.filter(a=>searchMatches(q,[a.title,a.excerpt,a.category])):[];
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Zoeken',href:'/zoeken'}]}/>
    <div className="commerce-intro"><h1>Zoeken.</h1><p>Zoek op een model, kleur of onderwerp uit het kenniscentrum.</p></div>
    <form className="shop-search" role="search" action={(process.env.NEXT_PUBLIC_BASE_PATH || "")+"/zoeken/"} method="get"><label htmlFor="store-query">Zoekterm</label><div><input type="search" name="q" id="store-query" placeholder="Bijvoorbeeld matzwart of helmmaat" maxLength={160} defaultValue={q}/><button className="commerce-button"><Search size={17}/> Zoek</button></div></form>
    {q && <p className="search-count" role="status">{matches.length+reading.length} resultaten voor ‘{q}’</p>}
    {matches.length>0&&<section className="commerce-section"><h2>Helmen</h2><ProductGrid products={matches}/></section>}
    {reading.length>0&&<section className="commerce-section"><h2>Artikelen</h2><div className="search-articles">{reading.map(a=><Link key={a.slug} href={'/kenniscentrum/'+a.slug}><h3>{a.title}</h3><p>{a.excerpt}</p></Link>)}</div></section>}
    {q&&!matches.length&&!reading.length&&<div className="commerce-empty"><h2>Geen resultaten gevonden</h2><p>Probeer een kortere zoekterm of bekijk alle modellen.</p><Link href="/fatbike-helmen" className="text-action">Bekijk alle helmen</Link></div>}
  </div>;
}
