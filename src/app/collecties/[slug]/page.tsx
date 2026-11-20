import {notFound} from 'next/navigation';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {Catalog} from '@/components/product/Catalog';
import {collections} from '@/lib/commerce/collections';
import {getProducts} from '@/lib/commerce';
import {pageMeta} from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return collections.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props) {
  const {slug}=await params;
  const c=collections.find(item=>item.slug===slug);
  if (!c) notFound();
  return pageMeta(c.title,c.description,'/collecties/'+slug,{image:c.image});
}
export default async function Collection({params}:Props) {
  const {slug}=await params;
  const c=collections.find(item=>item.slug===slug);
  if (!c) notFound();
  const products=(await getProducts()).filter(p=>p.category===slug);
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Collecties',href:'/collecties'},{name:c.title,href:'/collecties/'+slug}]}/>
    <div className="commerce-intro"><h1>{c.title}.</h1><p>{c.description}</p></div><Catalog products={products} fixedCollection/></div>;
}
