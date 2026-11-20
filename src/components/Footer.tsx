import Link from 'next/link';
import {Brand} from './Brand';
const groups = [
  {name:'Shop', links:[['Alle helmen','/fatbike-helmen'],['Collecties','/collecties'],['Maatwijzer','/maatwijzer']]},
  {name:'Ontdek', links:[['Kenniscentrum','/kenniscentrum'],['Helmplicht','/helmplicht-fatbike'],['Over ons','/over-ons']]},
  {name:'Service', links:[['Veelgestelde vragen','/veelgestelde-vragen'],['Verzending','/verzending'],['Retourneren','/retourneren'],['Contact','/contact']]}
];
export function Footer({socialLinks=[],footer=[]}:{socialLinks?: {label:string;href:string}[];footer?:{label:string;href:string}[]}) {
  return <footer className="site-footer"><div className="wrap">
    <div className="foot-main"><div><Brand/><p>Fietshelmen voor de nieuwe<br/>generatie fatbikers.</p></div>
    {groups.map(g=><div key={g.name}><h2>{g.name}</h2>{g.links.map(([label,url])=><Link key={url} href={url}>{label}</Link>)}</div>)}
    <div><h2>Social media</h2>{socialLinks.length?socialLinks.map(l=><a key={l.href} href={l.href}>{l.label}</a>):<p>Kanalen volgen bij de lancering.</p>}</div></div>
    {footer.length>0 && <nav aria-label="Aanvullende footerlinks" className="actions">{footer.map(l=><Link key={l.href} href={l.href}>{l.label}</Link>)}</nav>}
    <div className="foot-base"><span>© Fatbikehelm Nederland · Preview</span><div><Link href="/privacybeleid">Privacy</Link><Link href="/cookiebeleid">Cookies</Link><Link href="/algemene-voorwaarden">Voorwaarden</Link></div></div>
  </div></footer>;
}
