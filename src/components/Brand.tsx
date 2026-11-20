import Link from 'next/link';

export function Brand() {
  return <Link href="/" className="brand" aria-label="Fatbikehelm Nederland, naar de homepage">
    <svg viewBox="0 0 52 42" aria-hidden="true" className="brand-mark" fill="currentColor"><path d="M12 4h35l-4 8H21l-3 6h17l-4 8H14l-6 12H0L12 4Z"/><path d="M38 18h9l-9 20h-9z"/></svg>
    <span>Fatbikehelm<span className="brand-country">Nederland</span></span>
  </Link>;
}
