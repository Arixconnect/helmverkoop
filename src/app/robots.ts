import type {MetadataRoute} from 'next';
import {absolute,canIndex} from '@/lib/seo';
export default function robots():MetadataRoute.Robots {
  return {rules:{userAgent:'*',...(canIndex?{allow:'/',disallow:['/api/','/zoeken','/winkelwagen']}:{disallow:'/'})},sitemap:absolute('/sitemap.xml')};
}

export const dynamic = "force-static";
