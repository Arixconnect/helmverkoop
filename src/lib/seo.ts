import type { Metadata } from 'next';

export const brand = 'Fatbikehelm Nederland';
export const baseUrl = new URL(process.env.SITE_URL || 'http://localhost:4317');
export const canIndex = process.env.COMMERCE_MODE === 'SHOPIFY_MODE' && process.env.SITE_INDEXABLE === 'true';
export function absolute(path: string) { return new URL(path.startsWith('/') ? (process.env.NEXT_PUBLIC_BASE_PATH || '') + path : path, baseUrl).toString(); }
export function pageMeta(title: string, description: string, path: string, options: {noindex?: boolean; image?: string} = {}): Metadata {
  const index = canIndex && !options.noindex;
  const images = [{url: absolute(options.image || '/images/hero.webp'), alt: options.image ? title : 'Fatbikehelm Nederland – urban cycling conceptbeeld'}];
  return {title, description, alternates:{canonical:absolute(path)}, robots:{index, follow:index},
    openGraph:{type:'website', locale:'nl_NL', siteName:brand, title, description, url:absolute(path), images},
    twitter:{card:'summary_large_image',title,description,images:images.map(i=>i.url)}};
}
