import Link from 'next/link';
import Image from '@/components/SiteImage';
import {money,type Product} from '@/lib/commerce/types';

export function ProductCard({product}:{product:Product}) {
  const picture=product.images[0];
  return <Link className="product-card" href={'/fatbike-helmen/'+product.slug}>
    <div className="product-thumb">
      <Image src={picture.src} alt={picture.alt} fill sizes="(max-width: 700px) 46vw, (max-width: 1000px) 32vw, 24vw" />
    </div>
    <div className="pc-copy">
      <div className="pc-nameprice"><h3>{product.title}</h3><span aria-label={(product.isDemo?'Demoprijs ':'Prijs ')+money(product.price)}>{money(product.price)}</span></div>
      <div className="pc-colors">
        <span className="swatch-list" aria-hidden="true">{product.colors.filter(c=>c.hex).map(c=><i key={c.name} style={{backgroundColor:c.hex}} />)}</span>
        <span>{product.colors[0].name}{product.colors.length>1?' +'+(product.colors.length-1):''}</span>
        {product.isDemo && <small>Demo</small>}
      </div>
    </div>
  </Link>;
}
export function ProductGrid({products}:{products:Product[]}) {
  return <div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div>;
}
