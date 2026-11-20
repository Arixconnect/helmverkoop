import 'server-only';
import {cache} from 'react';
import {demoProducts} from './demo';
import {getShopifyProducts} from './shopify';

export function isDemoMode() {
  return process.env.COMMERCE_MODE !== 'SHOPIFY_MODE';
}
export const getProducts = cache(async () => isDemoMode() ? demoProducts : getShopifyProducts());
export async function getProduct(slug: string) {
  return (await getProducts()).find(p=>p.slug===slug);
}
