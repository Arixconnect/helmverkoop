import Image from '@/components/SiteImage';
import Link from 'next/link';
import {BookOpen, Ruler, Layers2} from 'lucide-react';
import {getArticles,getFaqs,getHomepage} from '@/lib/cms';
import {getProducts} from '@/lib/commerce';
import {ProductGrid} from '@/components/product/ProductCard';
import {FaqAccordion} from '@/components/ui/accordion';
import {StylesGrid} from '@/components/StylesGrid';
import {pageMeta} from '@/lib/seo';

export const metadata=pageMeta('Fatbikehelmen voor de stad','Ontdek zes concepthelmen, vergelijk urban stijlen en vind helder advies over helmmaat, pasvorm en fatbikeregels.','/');
const styles = [
  {title:'Urban Minimal',slug:'urban-minimal',image:'/images/closeup.webp',alt:'Close-up van een helm in het straatbeeld'},
  {title:'Everyday Essentials',slug:'everyday-essentials',image:'/images/lifestyle.webp',alt:'Urban fietsoutfit voor een dagelijkse rit'},
  {title:'Premium Street',slug:'premium-street',image:'/images/urban.webp',alt:'Fatbike in een Nederlandse straat'}
];
function featured<T extends {slug:string}>(all:T[],slugs:string[],limit:number) {
  const order = [...new Set([...slugs, ...all.map(x=>x.slug)])];
  return order.flatMap(slug=>all.filter(x=>x.slug===slug)).slice(0,limit);
}
const guideLinks=[
  {href:'/collecties',icon:Layers2,title:'Drie collecties',text:'Ontdek jouw stijl'},
  {href:'/maatwijzer',icon:Ruler,title:'Persoonlijk maatadvies',text:'Meet je hoofdomtrek'},
  {href:'/kenniscentrum',icon:BookOpen,title:'Kenniscentrum',text:'Alles over je helm'}
];

export default async function Home() {
  const [home,products,articles,faqs]=await Promise.all([getHomepage(),getProducts(),getArticles(),getFaqs()]);
  const [first,...rest]=home.heroHeadline.split(/(?<=\.)\s+/);
  return <>
    <section className="hero"><Image className="hero-photo" src={home.heroImage} alt="Conceptbeeld van de merkambassadeur met helm op een fatbike in de stad" fill sizes="100vw" preload/>
      <div className="wrap hero-inner"><div className="hero-copy">
        <p className="eyebrow hero-label"><i aria-hidden/> Urban cycling collectie</p>
        <h1>{first}{rest.length>0 && <em>{rest.join(' ')}</em>}</h1>
        <p className="hero-description">{home.heroDescription}</p>
        <div className="actions"><Link className="button hero-primary" href={home.heroCta.href}>{home.heroCta.label}</Link><Link className="button hero-second" href="/helmplicht-fatbike">Meer over de helmplicht</Link></div>
      </div></div>
      <span className="image-credit">AI-conceptbeeld</span>
    </section>
    <div className="guide-band"><div className="wrap guide-inner">{guideLinks.map(({href,icon:Icon,title,text})=><Link key={href} href={href}><Icon aria-hidden/><strong>{title}</strong><span>{text}</span></Link>)}</div></div>
    <section className="wrap home-section" aria-labelledby="featured"><div className="section-heading"><div><p className="eyebrow"><i aria-hidden/> Geselecteerde demohelmen</p><h2 id="featured">Vind jouw helm.</h2></div><Link className="underlink" href="/fatbike-helmen">Bekijk alle helmen</Link></div>
    <ProductGrid products={featured(products,home.featuredProducts,4)}/></section>
    <section className="story wrap"><div className="story-photo"><Image src="/images/lifestyle.webp" alt="Conceptfotografie van de merkambassadeur en haar fatbike" fill sizes="(max-width:700px) 100vw, 54vw"/></div>
      <div className="story-copy"><p className="eyebrow"><i aria-hidden/> Ons verhaal</p><h2>Bescherming die bij jouw stijl past.</h2><p>Van de eerste rit naar school tot de laatste kilometers naar huis. Een helm mag net zo vanzelfsprekend voelen als je favoriete jas. Daarom brengen we vorm, pasvorm en helder advies samen.</p><Link className="underlink" href="/over-ons">Over Fatbikehelm Nederland</Link></div></section>
    <section className="wrap home-section"><div className="section-heading"><div><p className="eyebrow"><i aria-hidden/> Collecties</p><h2>Shop op stijl.</h2></div></div><StylesGrid items={featured(styles,home.featuredCategories,3)}/></section>
    <section className="size-banner"><div className="wrap split-callout"><Ruler size={40} strokeWidth={1.35}/><div><h2>Welke helm past bij jou?</h2><p>Pak een meetlint en vind het vertrekpunt voor een goede pasvorm.</p></div><Link className="button" href="/maatwijzer">Open de maatwijzer</Link></div></section>
    <section className="wrap home-section"><div className="section-heading"><div><p className="eyebrow"><i aria-hidden/> Kenniscentrum</p><h2>Alles over veilig fatbiken.</h2></div><Link className="underlink" href="/kenniscentrum">Alle artikelen</Link></div>
      <div className="article-tiles">{featured(articles,home.featuredArticles,3).map(a=><Link key={a.slug} href={'/kenniscentrum/'+a.slug}>
        <div className="article-image"><Image src={a.coverImage} alt="" fill sizes="(max-width:650px) 94vw, 32vw"/></div><h3>{a.title}</h3><p>{a.excerpt}</p></Link>)}</div></section>
    <section className="law-band"><div className="wrap split-callout"><div><p className="eyebrow">Regels in Nederland</p><h2>Hoe zit het met de helmplicht?</h2><p>Lees welke regels bij jouw voertuig horen en welke plannen nog in behandeling zijn.</p></div><Link className="button light" href="/helmplicht-fatbike">Bekijk de actuele regels</Link></div></section>
    {home.contentSections.map(section=><section className="wrap home-section" key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
    <section className="wrap faq-home home-section"><div><p className="eyebrow"><i aria-hidden/> Klantenservice</p><h2>Veelgestelde vragen.</h2><Link className="underlink" href="/veelgestelde-vragen">Bekijk alle vragen</Link></div><FaqAccordion items={faqs.slice(0,5)}/></section>
  </>;
}
