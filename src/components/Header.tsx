'use client';
import Link from 'next/link';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {Menu, Search, ShoppingBag, X} from 'lucide-react';
import {Brand} from './Brand';
import {CartCount} from './cart/CartProvider';

type Nav = {label:string;href:string};
export function Header({navigation,announcement}:{navigation:Nav[];announcement:string}) {
  const [open,setOpen] = useState(false);
  const path = usePathname();
  const links = navigation.map(n => <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} aria-current={path===n.href?'page':undefined}>{n.label}</Link>);
  return <>
    <a className="skip" href="#inhoud">Naar inhoud</a>
    <div className="announcement">{announcement}</div>
    <header className="site-header"><div className="wrap head-inner"><Brand/>
      <nav className="primary-nav" aria-label="Hoofdnavigatie">{links}</nav>
      <div className="head-actions"><Link className="icon-link" href="/zoeken" aria-label="Zoeken"><Search/></Link>
        <Link className="icon-link cart-icon" href="/winkelwagen" aria-label="Winkelwagen"><ShoppingBag/><CartCount/></Link>
        <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><button className="icon-link mobile-menu" aria-label="Open menu"><Menu/></button></Dialog.Trigger>
          <Dialog.Portal><Dialog.Overlay className="menu-overlay"/><Dialog.Content className="menu-panel" aria-describedby={undefined}>
            <div className="menu-heading"><Dialog.Title>Menu</Dialog.Title><Dialog.Close asChild><button className="icon-link" aria-label="Sluit menu"><X/></button></Dialog.Close></div>
            <nav aria-label="Mobiele navigatie">{links}<Link onClick={()=>setOpen(false)} href="/maatwijzer">Maatwijzer</Link></nav>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root></div></div></header>
  </>;
}
