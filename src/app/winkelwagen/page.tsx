import {Breadcrumbs} from '@/components/Breadcrumbs';
import {CartView} from '@/components/cart/CartView';
import {getProducts,isDemoMode} from '@/lib/commerce';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Winkelmand','Bekijk je gekozen kleuren, maten en het subtotaal van je winkelmand.','/winkelwagen',{noindex:true});
export default async function CartPage(){
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Winkelmand',href:'/winkelwagen'}]}/>
    <div className="commerce-intro"><h1>Je winkelmand.</h1></div><CartView products={await getProducts()} demo={isDemoMode()}/></div>;
}
