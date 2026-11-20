import {notFound} from 'next/navigation';
import Link from 'next/link';
import {servicePages} from '@/data/service';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {pageMeta} from '@/lib/seo';
import {getSettings} from '@/lib/cms';
type Props={params:Promise<{service:string}>};
const read=(key:string)=>Object.hasOwn(servicePages,key) ? servicePages[key] : notFound();
export const generateStaticParams=()=>Object.keys(servicePages).map(service=>({service}));
export const dynamicParams=false;
export async function generateMetadata({params}:Props){const {service}=await params;const content=read(service);return pageMeta(content.name,content.intro,'/'+service);}
export default async function ServicePage({params}:Props) {
  const {service}=await params;const page=read(service);const settings=await getSettings();
  return <article className="wrap service-page"><Breadcrumbs items={[{name:page.name,href:'/'+service}]}/><h1>{page.name}</h1><p>{page.intro}</p>
    {page.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    {service==='contact' && settings.contactEmail && <p><a className="underlink" href={'mailto:'+settings.contactEmail}>{settings.contactEmail}</a></p>}
    {service==='algemene-voorwaarden' && settings.legalDetails && <p>{settings.legalDetails}</p>}
    <div className="actions">{page.links.map(([label,url])=><Link key={url} className="underlink" href={url}>{label}</Link>)}</div></article>;
}
