import Image from "@/components/SiteImage";
import Link from "next/link";
import {EditorialShell,SourceList} from "@/components/content/Editorial";
import {sources} from "@/data/editorial";
import {pageMeta} from "@/lib/seo";
export const metadata = pageMeta("Maatwijzer voor fietshelmen","Meet je hoofdomtrek, lees de maattabel van je helm en controleer de pasvorm in drie stappen.","/maatwijzer");
const steps = [
  ["Meet je hoofdomtrek","Leg een soepel meetlint horizontaal rond je hoofd, vlak boven je oren en ongeveer twee vingers boven je wenkbrauwen. Houd het lint aansluitend. Herhaal de meting en noteer de omtrek in centimeters."],
  ["Lees de tabel van het model","Zoek je omtrek in het maatbereik van de fabrikant. Dezelfde lettermaat kan per model anders uitvallen. Overlappen twee maten, pas ze dan allebei. Voor de previewhelmen is nog geen maattabel van een fabrikant beschikbaar."],
  ["Controleer de pasvorm","Zet de helm recht, stel het verstelsysteem af en sluit de kinband volgens de handleiding. Beweeg je hoofd rustig van links naar rechts. De helm hoort stabiel te blijven en mag nergens knellen."],
];
export default function Sizing() {
  return <EditorialShell trail={[{name:"Maatwijzer",href:"/maatwijzer"}]}>
    <div className="ed-split"><header><h1>Welke helmmaat past bij jou?</h1><p className="ed-lead">Met een meetlint en een spiegel kom je een heel eind. Gebruik je hoofdomtrek als vertrekpunt en controleer de pasvorm op je hoofd.</p><Link className="ed-button" href="#meten">Begin met meten</Link></header><div className="ed-split-image"><Image src="/images/closeup.webp" alt="Conceptbeeld van een gedragen fietshelm" fill sizes="(max-width:760px) 94vw, 46vw" priority/></div></div>
    <div className="ed-reading" id="meten"><div className="ed-prose"><h2>In drie stappen naar een passende helm</h2><ol className="ed-steps">{steps.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol><SourceList sources={[sources.size,sources.choose]}/></div>
    <aside className="ed-related"><h2>Na het meten</h2><Link href="/fatbike-helmen">Bekijk de collectie</Link><Link href="/kenniscentrum/categorie/helm-kiezen">Meer over helmkeuze</Link></aside></div>
  </EditorialShell>;
}
