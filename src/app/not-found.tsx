import Link from 'next/link';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Pagina niet gevonden','Deze pagina bestaat niet.','/',{noindex:true});
export default function NotFound(){return <div className="wrap service-page"><p className="eyebrow">404</p><h1>Deze pagina bestaat niet.</h1><p>Ga naar de collectie of zoek op een productnaam of onderwerp.</p><div className="actions"><Link className="button" href="/fatbike-helmen">Bekijk de helmen</Link><Link className="underlink" href="/zoeken">Zoeken</Link></div></div>}
