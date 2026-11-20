'use client';
import Link from 'next/link';
export default function ErrorView({reset}:{reset:()=>void}) {
  return <section className="wrap service-page"><h1>De pagina kon niet laden.</h1><p>Probeer de pagina opnieuw te openen.</p><div className="actions"><button className="button" onClick={reset}>Opnieuw proberen</button><Link className="underlink" href="/">Naar de homepage</Link></div></section>;
}
