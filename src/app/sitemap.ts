import type {MetadataRoute} from 'next';
import {absolute} from '@/lib/seo';
import {getProducts} from '@/lib/commerce';
import {collections} from '@/lib/commerce/collections';
import {getArticles,getCategories} from '@/lib/cms';
import {servicePages} from '@/data/service';

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const [products, articles, categories] = await Promise.all([getProducts(),getArticles(),getCategories()]);
  const routes=['/','/fatbike-helmen','/collecties','/maatwijzer','/kenniscentrum','/helmplicht-fatbike','/veelgestelde-vragen',
    ...Object.keys(servicePages).map(slug=>'/'+slug),...products.map(x=>'/fatbike-helmen/'+x.slug),
    ...collections.map(x=>'/collecties/'+x.slug),...categories.filter(c=>articles.some(a=>a.category===c.slug)).map(x=>'/kenniscentrum/categorie/'+x.slug)];
  return [...routes.map(path=>({url:absolute(path)})), ...articles.filter(a=>!a.noindex && (!a.canonicalUrl || a.canonicalUrl===absolute('/kenniscentrum/'+a.slug))).map(a=>({url:absolute('/kenniscentrum/'+a.slug),lastModified:a.updatedAt}))];
}

export const dynamic = "force-static";
