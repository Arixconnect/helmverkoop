import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "@/components/SiteImage";
import {getArticle,getArticles,getCategories} from "@/lib/cms";
import {getProducts} from "@/lib/commerce";
import {pageMeta,absolute} from "@/lib/seo";
import {JsonLd} from "@/components/JsonLd";
import {dateLabel,EditorialShell,SourceList} from "@/components/content/Editorial";
type Props = {params:Promise<{slug:string}>};
async function article({params}:Props) {
  const {slug} = await params;
  const result = await getArticle(slug);
  if (!result) notFound();
  return result;
}
export async function generateMetadata(props:Props) {
  const a = await article(props);
  const meta = pageMeta(a.seoTitle,a.seoDescription,a.canonicalUrl || "/kenniscentrum/"+a.slug,{noindex:a.noindex,image:a.coverImage});
  return {...meta,openGraph:{...meta.openGraph,type:"article" as const,publishedTime:a.publishedAt,modifiedTime:a.updatedAt,authors:[a.author.name]}};
}
export default async function ArticlePage(props:Props) {
  const a = await article(props);
  const [categories,articles,products] = await Promise.all([getCategories(),getArticles(),a.relatedProducts.length?getProducts():Promise.resolve([])]);
  const category = categories.find(c=>c.slug===a.category);
  const related = articles.filter(other=>other.slug!==a.slug && a.relatedArticles.includes(other.slug));
  const relatedProducts = products.filter(p=>a.relatedProducts.includes(p.slug));
  const path = "/kenniscentrum/"+a.slug;
  const pillar = a.category==="helmplicht"?{label:"Overzicht van de helmplicht per voertuig",href:"/helmplicht-fatbike"}:{label:"Open de maatwijzer",href:"/maatwijzer"};
  return <EditorialShell trail={[{name:"Kenniscentrum",href:"/kenniscentrum"},...(category?[{name:category.name,href:"/kenniscentrum/categorie/"+category.slug}]:[]),{name:a.title,href:path}]}>
    <article>
      <header className="ed-article-head"><div className="ed-meta">{category?.name ?? "Artikel"}</div><h1>{a.title}</h1><p className="ed-lead">{a.excerpt}</p><div className="ed-byline">{a.author.name}<span>Gepubliceerd op <time dateTime={a.publishedAt}>{dateLabel(a.publishedAt)}</time></span></div></header>
      <figure className="ed-wide-image"><Image src={a.coverImage} alt={a.coverAlt} fill sizes="(max-width: 1280px) 95vw, 1200px" priority/></figure>
      <div className="ed-reading"><div className="ed-prose">{a.body.map((block,i)=>{
        const Tag = block.style==="normal"?"p":block.style;
        return <Tag key={i}>{block.children.map((span,j)=>{
          const text = span.marks.includes("strong")?<strong>{span.text}</strong>:span.text;
          return span.marks.includes("em")?<em key={j}>{text}</em>:<span key={j}>{text}</span>;
        })}</Tag>;
      })}<SourceList sources={a.sources}/><section className="ed-verification"><h2>Over dit artikel</h2><p>{a.author.biography}</p>{a.author.credentials && <p>{a.author.credentials}</p>}<p>Bijgewerkt op {dateLabel(a.updatedAt)}. Bronnen gecontroleerd op {dateLabel(a.reviewedAt)}.</p></section></div>
      <aside className="ed-related"><h2>Verder lezen</h2><Link href={pillar.href}>{pillar.label}</Link>{related.map(r=><Link key={r.slug} href={"/kenniscentrum/"+r.slug}>{r.title}</Link>)}{relatedProducts.map(p=><Link key={p.slug} href={"/fatbike-helmen/"+p.slug}>{p.title}</Link>)}</aside></div>
    </article>
    <JsonLd data={{"@context":"https://schema.org","@type":"Article",headline:a.title,description:a.excerpt,image:absolute(a.coverImage),inLanguage:"nl-NL",articleSection:category?.name,datePublished:a.publishedAt,dateModified:a.updatedAt,author:{"@type":"Organization",name:a.author.name},citation:a.sources.map(s=>s.href),mainEntityOfPage:a.canonicalUrl||absolute(path)}}/>
  </EditorialShell>;
}

export async function generateStaticParams() {
  return process.env.CMS_MODE === "SANITY" ? [] : (await getArticles()).map(({slug})=>({slug}));
}
