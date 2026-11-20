import type { Product } from './types';

const concepts = [
  ['urban-one', 'Urban One Helmet', 4995, 'Matte Black', '#292a28', 'urban-minimal', 'Een afgerond silhouet in matzwart. Het ingetogen ontwerp past bij denim, een wollen jas of je dagelijkse overshirt.'],
  ['city-flow', 'City Flow Helmet', 5495, 'Sand Beige', '#c7b99e', 'everyday-essentials', 'Zandbeige geeft dit stadsmodel een zachte uitstraling. De warme tint sluit aan bij crème, olijfgroen en andere rustige kleuren.'],
  ['streetline', 'Streetline Helmet', 5995, 'Midnight Grey', '#55595d', 'urban-minimal', 'Een donkergrijs concept met grafische lijnen. Ontworpen als subtiel accent bij een monochrome outfit.'],
  ['metro-air', 'Metro Air Helmet', 6495, 'Pearl White', '#e9e6de', 'everyday-essentials', 'Een lichte pareltint voor een frisse stadslook. Het heldere ontwerp combineert met zowel donkere als lichte kleding.'],
  ['urban-edge', 'Urban Edge Helmet', 6995, 'Graphite', '#494a45', 'premium-street', 'Grafiet en een krachtig silhouet geven dit concept een uitgesproken karakter. Draag het bij een technisch jack of ruime hoodie.'],
  ['signature-one', 'Signature One Helmet', 7995, 'Matte Black', '#292a28', 'premium-street', 'Een matzwart ontwerp voor een sobere streetwearlook. De vorm speelt de hoofdrol, met kleur en details op de achtergrond.'],
] as const;
export const demoProducts: Product[] = concepts.map(([slug, title, price, color, hex, category, description]) => {
  const colors = slug === 'urban-one' ? [{name: color, hex}, {name:'Stone Grey',hex:'#aca99e'}] : [{name: color, hex}];
  const sizes = ['S', 'M', 'L'];
  const images = [{src: '/images/' + slug + '.webp', alt: 'Conceptbeeld van ' + title + ' in ' + color}];
  if (slug === 'urban-one') images.push({src:'/images/urban-one-stone.webp',alt:'Conceptbeeld van Urban One Helmet in Stone Grey'});
  return {
    id: 'demo-' + slug, slug, title, description, price, compareAtPrice: null, currency: 'EUR',
    images, colors, sizes,
    variants: colors.flatMap(({name}, colorIndex) => sizes.map(size => ({
      id: ['demo', slug, name, size].join('/'), color: name, size, price, available: true, image: images[colorIndex],
    }))),
    category, tags: ['fietshelm', 'fatbikehelm', color], features: ['Kleurconcept ' + color, 'Ontwerp voor een urban kledingstijl'],
    supplierId: null, supplierSku: null, supplierCountry: null, supplierVerified: false,
    complianceStatus: 'pending', complianceDocuments: [], shippingEstimate: null, inventoryStatus: 'demo',
    isDemo: true, verifiedForSale: false, seoTitle: title + ' • ' + color, seoDescription: description,
  };
});
