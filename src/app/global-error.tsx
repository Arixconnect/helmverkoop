'use client';
export default function GlobalError({reset}:{reset:()=>void}) {
  return <html lang="nl"><body><main><h1>De webshop is tijdelijk niet bereikbaar.</h1><p>De websitegegevens konden niet worden opgehaald.</p><button onClick={reset}>Opnieuw proberen</button></main></body></html>;
}
