import type { Product } from './types';
import {collectionName} from './collections';
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('nl').trim();
export function searchMatches(query: string, values: string[]) {
  const haystack = normalize(values.join(' '));
  return normalize(query).split(/\s+/).every(term => haystack.includes(term));
}
export function findProducts(products: Product[], filters: {collection?: string; color?: string; size?: string; sort?: string; query?: string}) {
  const results = products.filter(p =>
    (!filters.collection || p.category === filters.collection)
    && p.variants.some(v => (!filters.color || v.color === filters.color) && (!filters.size || v.size === filters.size))
    && searchMatches(filters.query ?? '', [p.title, p.description, collectionName(p.category), ...p.tags, ...p.colors.map(c=>c.name)]));
  if (filters.sort === 'price-asc') results.sort((a,b)=>a.price-b.price);
  if (filters.sort === 'price-desc') results.sort((a,b)=>b.price-a.price);
  if (filters.sort === 'title') results.sort((a,b)=>a.title.localeCompare(b.title,'nl'));
  return results;
}
