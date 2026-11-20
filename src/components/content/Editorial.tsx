import Link from "next/link";
import Image from "@/components/SiteImage";
import type {ReactNode} from "react";
import { ChevronDown } from "lucide-react";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {getArticles, getCategories} from "@/lib/cms";
import type {Article, Faq} from "@/lib/cms/types";
import "@/styles/editorial.css";

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("nl-NL",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Amsterdam"}).format(new Date(value));
}

export function EditorialShell({trail, children}:{trail:{name:string;href:string}[];children:ReactNode}) {
  return <div className="ed wrap"><Breadcrumbs items={trail}/>{children}</div>;
}

export function SourceList({sources}:{sources:Article["sources"]}) {
  return <aside className="ed-sources" aria-label="Geraadpleegde bronnen"><h2>Bronnen</h2><ul>{sources.map(s=><li key={s.href}><a href={s.href}>{s.label}</a></li>)}</ul></aside>;
}

export function FaqList({items}:{items:Faq[]}) {
  return <div className="ed-faq">{items.map(f=><details key={f.question}><summary>{f.question}<ChevronDown aria-hidden size={19}/></summary><p>{f.answer}</p></details>)}</div>;
}

function ArticleCard({article,category}:{article:Article;category:string}) {
  return <article className="ed-card"><Link href={'/kenniscentrum/'+article.slug}>
    <div className="ed-photo"><Image src={article.coverImage} alt={article.coverAlt} fill sizes="(max-width: 670px) 92vw, (max-width:1000px) 46vw, 31vw"/></div>
    <div className="ed-meta">{category}<span aria-hidden>·</span><time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time></div>
    <h2>{article.title}</h2><p>{article.excerpt}</p>
  </Link></article>;
}

export async function Journal({active}:{active?:string}) {
  const [articles,categories] = await Promise.all([getArticles(),getCategories()]);
  const selected = categories.find(c=>c.slug===active);
  const root = {name:"Kenniscentrum",href:"/kenniscentrum"};
  const list = active?articles.filter(a=>a.category===active):articles;
  const trail = selected?[root,{name:selected.name,href:"/kenniscentrum/categorie/"+selected.slug}]:[root];
  return <EditorialShell trail={trail}>
    <header className="ed-index-head"><h1>{selected?.name ?? "Kenniscentrum"}</h1><p>{selected?.description ?? "Wat je wilt weten voordat je opstapt. Lees over helmkeuze, pasvorm en de regels voor jouw rit."}</p></header>
    <nav aria-label="Artikelen per categorie" className="ed-nav"><Link href={root.href} aria-current={!active?"page":undefined}>Alle artikelen</Link>
      {categories.map(c=><Link key={c.slug} href={'/kenniscentrum/categorie/'+c.slug} aria-current={active===c.slug?"page":undefined}>{c.name}</Link>)}
    </nav>
    {list.length ? <div className="ed-grid">{list.map(a=><ArticleCard key={a.slug} article={a} category={categories.find(c=>c.slug===a.category)?.name ?? "Artikel"}/>)}</div> :
      <div className="ed-empty"><h2>Hier verschijnen de eerste artikelen over {selected?.name.toLowerCase() ?? "dit onderwerp"}.</h2><Link href={root.href}>Bekijk alle artikelen</Link></div>}
  </EditorialShell>;
}
