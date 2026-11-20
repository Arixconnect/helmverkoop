import Link from "next/link";
import {getFaqs} from "@/lib/cms";
import {EditorialShell,FaqList} from "@/components/content/Editorial";
import {pageMeta} from "@/lib/seo";
export const metadata = pageMeta("Veelgestelde vragen","Antwoorden over de previewwebshop, helmplicht, het kiezen van een maat en onderhoud van je fietshelm.","/veelgestelde-vragen");
export default async function Questions() {
  const items = await getFaqs();
  return <EditorialShell trail={[{name:"Veelgestelde vragen",href:"/veelgestelde-vragen"}]}>
    <header className="ed-index-head"><h1>Veelgestelde vragen</h1><p>Over je helm, je rit en deze previewwebshop.</p></header>
    <div className="ed-reading"><div>{items.length ? <FaqList items={items}/> : <p>De redactie heeft nog geen vragen gepubliceerd.</p>}</div><aside className="ed-related"><h2>Meer informatie</h2><Link href="/maatwijzer">Maatwijzer</Link><Link href="/helmplicht-fatbike">Helmplicht in Nederland</Link><Link href="/contact">Contact</Link></aside></div>
  </EditorialShell>;
}
