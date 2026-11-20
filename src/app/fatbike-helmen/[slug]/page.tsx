import {notFound} from 'next/navigation';
import Link from 'next/link';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {JsonLd} from '@/components/JsonLd';
import {ProductDetail} from '@/components/product/ProductDetail';
import {ProductGrid} from '@/components/product/ProductCard';
import {getProduct,getProducts} from '@/lib/commerce';
import {getArticles} from '@/lib/cms';
import {absolute,pageMeta} from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props) {
  const {slug}=await params;
  const p=await getProduct(slug);
  if (!p) notFound();
  return pageMeta(p.seoTitle,p.seoDescription,'/fatbike-helmen/'+slug,{noindex:p.isDemo,image:p.images[0].src});
}
export default async function Detail({params}:Props) {
  const {slug}=await params;
  const [products,articles]=await Promise.all([getProducts(),getArticles()]);
  const p=products.find(item=>item.slug===slug);
  if (!p) notFound();
  const related=products.filter(item=>item.id!==p.id).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,4);
  const reading=articles.filter(a=>a.relatedProducts.includes(slug)||a.category==='helm-kiezen').slice(0,2);
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Shop helmen',href:'/fatbike-helmen'},{name:p.title,href:'/fatbike-helmen/'+slug}]}/>
    <ProductDetail key={p.id} product={p}/>
    {p.verifiedForSale&&!p.isDemo&&<JsonLd data={{'@context':'https://schema.org','@type':'Product',name:p.title,description:p.description,image:p.images.map(i=>absolute(i.src)),url:absolute('/fatbike-helmen/'+slug)}}/>}
    <section className="detail-help"><div><h2>Vragen over deze helm</h2>
      <details><summary>Welke maat kies ik?</summary><p>Meet je hoofdomtrek en gebruik de maattabel van het specifieke model. {p.isDemo?'De lettermaten in deze preview zijn bedoeld om de maatkeuze te proberen. ':''}<Link href="/maatwijzer">Bekijk de maatwijzer.</Link></p></details>
      <details><summary>{p.isDemo?'Kan ik dit model bestellen?':'Hoe gaat de verzending?'}</summary><p>{p.isDemo?'Je kunt het model in de demo-winkelmand bewaren. Aankopen en leveringen zijn nog niet mogelijk.':p.shippingEstimate}</p></details>
    </div>{reading.length>0&&<aside><h2>Lees verder</h2>{reading.map(a=><Link href={'/kenniscentrum/'+a.slug} key={a.slug}>{a.title}</Link>)}</aside>}</section>
    {related.length>0&&<section className="commerce-section"><h2>Meer helmen voor de stad.</h2><ProductGrid products={related}/></section>}
  </div>;
}

export async function generateStaticParams() {
  return process.env.COMMERCE_MODE === "SHOPIFY_MODE" ? [] : (await getProducts()).map(({slug})=>({slug}));
}
