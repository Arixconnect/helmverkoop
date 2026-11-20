import {Suspense} from 'react';
import {getProducts} from '@/lib/commerce';
import {getArticles} from '@/lib/cms';
import {pageMeta} from '@/lib/seo';
import {SearchResults} from '@/components/product/SearchResults';

export const metadata=pageMeta('Zoeken','Zoek naar helmen, kleuren, maten en artikelen over veilig fatbiken.','/zoeken',{noindex:true});
export default async function SearchPage() {
  const [products,articles]=await Promise.all([getProducts(),getArticles()]);
  return <Suspense fallback={<div className="wrap commerce-page"><h1>Zoeken.</h1></div>}><SearchResults products={products} articles={articles.map(({slug,title,excerpt,category})=>({slug,title,excerpt,category}))}/></Suspense>;
}
