'use client';
import {createContext,useContext,useMemo,useSyncExternalStore,type ReactNode} from 'react';
import {addVariant,readCart,setQuantity,type CartLine} from '@/lib/commerce/cart';

function createCartStore(mode: string) {
  const key = 'fbhn-' + mode + '-cart-v1';
  let fallback = '[]';
  const listeners = new Set<()=>void>();
  function read() {
    try { return window.localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  }
  function update(change: (lines: CartLine[])=>CartLine[]) {
    fallback = JSON.stringify(change(readCart(read())));
    try { window.localStorage.setItem(key, fallback); } catch { /* Session memory remains available. */ }
    listeners.forEach(listener=>listener());
  }
  return {
    read,
    subscribe(listener: ()=>void) {
      const storage = (event:StorageEvent) => {
        if (event.key === key || event.key === null) {fallback='[]';listener();}
      };
      listeners.add(listener);
      window.addEventListener('storage',storage);
      return () => {listeners.delete(listener);window.removeEventListener('storage',storage);};
    },
    add: (id:string)=>update(lines=>addVariant(lines,id)),
    set: (id:string,quantity:number)=>update(lines=>setQuantity(lines,id,quantity)),
  };
}
const CartContext = createContext<ReturnType<typeof createCartStore> | null>(null);
export function CartProvider({mode='demo',children}:{mode?:'demo'|'shopify';children:ReactNode}) {
  const store=useMemo(()=>createCartStore(mode),[mode]);
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}
export function useCart() {
  const store=useContext(CartContext);
  if (!store) throw new Error('Winkelmandcontext ontbreekt.');
  const raw=useSyncExternalStore(store.subscribe,store.read,()=> '[]');
  return {lines:useMemo(()=>readCart(raw),[raw]),add:store.add,set:store.set};
}
export function CartCount() {
  const {lines}=useCart();
  const count=lines.reduce((sum,l)=>sum+l.quantity,0);
  return count ? <span className="cart-count" aria-label={count+' artikelen'}>{count}</span> : null;
}
