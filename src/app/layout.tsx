import type {Metadata} from 'next';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/inter/wght.css';
import '@/styles/globals.css';
import '@/styles/commerce.css';
import {isDemoMode} from '@/lib/commerce';
import {getSettings} from '@/lib/cms';
import {baseUrl,brand,canIndex} from '@/lib/seo';
import {CartProvider} from '@/components/cart/CartProvider';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {JsonLd} from '@/components/JsonLd';

export const metadata: Metadata = {metadataBase:baseUrl,title:{default:brand,template:'%s | '+brand},robots:{index:canIndex,follow:canIndex},
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION || undefined}};
export default async function Layout({children}:{children:React.ReactNode}) {
  const settings = await getSettings();
  return <html lang="nl-NL"><body><CartProvider mode={isDemoMode() ? "demo" : "shopify"}><Header announcement={settings.announcement} navigation={settings.navigation}/>
    <main id="inhoud" tabIndex={-1}>{children}</main><Footer socialLinks={settings.socialLinks} footer={settings.footer}/></CartProvider>
    <JsonLd data={{'@context':'https://schema.org','@type':'Organization',name:brand,url:baseUrl.href}}/>
  </body></html>;
}
