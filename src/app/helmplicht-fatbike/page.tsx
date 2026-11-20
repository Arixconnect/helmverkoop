import Link from "next/link";
import {getLegalUpdates} from "@/lib/cms";
import {EditorialShell,dateLabel} from "@/components/content/Editorial";
import {pageMeta} from "@/lib/seo";
export const metadata = pageMeta("Helmplicht op de fatbike in Nederland","Bekijk de Nederlandse helmregels per voertuigcategorie en volg wat er voor jongeren wordt voorgesteld, met links naar de officiële publicaties.","/helmplicht-fatbike");
export default async function Legal() {
  const updates = await getLegalUpdates();
  const rules = updates.filter(u=>u.status==="current");
  const proposals = updates.filter(u=>u.status==="proposed");
  return <EditorialShell trail={[{name:"Helmplicht",href:"/helmplicht-fatbike"}]}>
    <header className="ed-index-head"><h1>Helmplicht op de fatbike</h1><p>Welke regels gelden voor jouw rit? Zoek eerst op onder welke voertuigcategorie je fiets valt. Hieronder vind je de geldende regels en de stand van de voorstellen.</p></header>
    <div className="ed-reading"><div className="ed-prose">{[["Geldende regels",rules],["In behandeling",proposals]].map(([title,records])=>{
      const list = records as typeof updates;
      return <section className="ed-legal" key={String(title)}><h2>{String(title)}</h2>{list.length?list.map(u=><article key={u.title}><h3>{u.title}</h3><p>{u.summary}</p>{u.effectiveDate && u.status==="current" && <p>In werking sinds {dateLabel(u.effectiveDate)}.</p>}<div className="ed-source-row"><a href={u.sourceUrl}>Lees de officiële bron</a><span>Gecontroleerd op {dateLabel(u.reviewedAt)}</span></div></article>):<p>Er staan nog geen gecontroleerde updates in dit overzicht.</p>}</section>;
    })}</div><aside className="ed-related"><h2>Verder lezen</h2><Link href="/kenniscentrum/categorie/helmplicht">Artikelen over helmplicht</Link><Link href="/maatwijzer">Zo kies je een helmmaat</Link></aside></div>
  </EditorialShell>;
}
