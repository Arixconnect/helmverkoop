import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {absolute} from '@/lib/seo';
import {JsonLd} from './JsonLd';

export function Breadcrumbs({items}:{items:{name:string;href:string}[]}) {
  const trail = items[0]?.href === '/' ? items : [{name:'Home',href:'/'}, ...items];
  return <nav className="crumbs" aria-label="Kruimelpad">
    <ol>{trail.map((item,i)=><li key={item.href}>{i>0 && <ChevronRight size={13} aria-hidden/>}{i===trail.length-1?<span aria-current="page">{item.name}</span>:<Link href={item.href}>{item.name}</Link>}</li>)}</ol>
    <JsonLd data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:trail.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:absolute(item.href)}))}}/>
  </nav>;
}
