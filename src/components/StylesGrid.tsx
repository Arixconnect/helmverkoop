'use client';
import {motion,useReducedMotion} from 'motion/react';
import Link from 'next/link';
import Image from '@/components/SiteImage';
export type StyleTile = {title:string;slug:string;image:string;alt:string};
export function StylesGrid({items}:{items:StyleTile[]}) {
  const reduce = useReducedMotion();
  return <div className="styles-grid">{items.map(tile=><Link href={'/collecties/'+tile.slug} key={tile.slug}>
    <motion.div className="style-image" whileHover={reduce ? undefined : {scale:1.025}} transition={{duration:0.25}}>
      <Image src={tile.image} alt={tile.alt} fill sizes="(max-width: 650px) 94vw, 32vw"/>
    </motion.div><span>{tile.title}</span>
  </Link>)}</div>;
}
