import {Breadcrumbs} from '@/components/Breadcrumbs';
import {Catalog} from '@/components/product/Catalog';
import {getProducts,isDemoMode} from '@/lib/commerce';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Fatbikehelmen','Ontdek alle helmconcepten, vergelijk stijlen en filter op kleur of maat.','/fatbike-helmen');
export default async function Shop() {
  const products=await getProducts();
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Shop helmen',href:'/fatbike-helmen'}]}/>
    <div className="commerce-intro"><h1>Alle helmen.</h1><p>{isDemoMode()?'Zes helmconcepten voor de stad. Ontdek de kleuren, vergelijk de vormen en vind jouw stijl.':'Ontdek de kleuren, vergelijk de vormen en vind jouw stijl.'}</p></div>
    <Catalog products={products}/></div>;
}
