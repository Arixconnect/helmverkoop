import type { NextConfig } from 'next';
import path from 'node:path';

const pages=process.env.PAGES_EXPORT === 'true';
if(pages && (process.env.COMMERCE_MODE === 'SHOPIFY_MODE' || process.env.CMS_MODE === 'SANITY')) throw new Error('De GitHub Pages-export ondersteunt uitsluitend de lokale demo.');

const config: NextConfig = {
  ...(pages ? {output:'export',trailingSlash:true} : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  poweredByHeader: false,
  turbopack: {root: path.resolve('.')},
  images: {unoptimized:pages, remotePatterns: [
    {protocol: 'https', hostname:'cdn.shopify.com'},
    {protocol: 'https', hostname:'cdn.sanity.io', pathname:'/images/**'}
  ]},
  ...(!pages && {async headers() {
    return [{source:'/:path*',has:[{type:'cookie',key:'__prerender_bypass'}],headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'private, no-store'}]}, {source:'/:path*', headers: [
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'DENY'},
      ...(process.env.COMMERCE_MODE === 'SHOPIFY_MODE' && process.env.SITE_INDEXABLE === 'true' ? [] : [{key:'X-Robots-Tag',value:'noindex, nofollow'}])
    ]}];
  }})
};
export default config;
