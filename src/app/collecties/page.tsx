import {Breadcrumbs} from '@/components/Breadcrumbs';
import {StylesGrid} from '@/components/StylesGrid';
import {collections} from '@/lib/commerce/collections';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Collecties','Verken drie stijlen voor je stadsrit. Van ingetogen vormen tot sportieve streetwear.','/collecties');
export default function Collections() {
  const alts=['Close-up van een gedragen fietshelm','Fietser op een fatbike in de stad','Fietser en fatbike in een Nederlandse straat'];
  return <div className="wrap commerce-page"><Breadcrumbs items={[{name:'Collecties',href:'/collecties'}]}/>
    <div className="commerce-intro"><h1>Shop op stijl.</h1><p>Drie collecties, elk met een eigen kijk op de stadsrit.</p></div>
    <StylesGrid items={collections.map((c,i)=>({...c,alt:alts[i]}))}/></div>;
}
