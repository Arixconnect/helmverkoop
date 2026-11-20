export const collections = [
  { slug: 'urban-minimal', title: 'Urban Minimal', description: 'Strakke lijnen, rustige kleuren en een compact silhouet. Voor wie het graag eenvoudig houdt.', image: '/images/closeup.webp' },
  { slug: 'everyday-essentials', title: 'Everyday Essentials', description: 'Lichte tinten voor je dagelijkse rit. Van het eerste college tot de laatste afspraak in de stad.', image: '/images/urban.webp' },
  { slug: 'premium-street', title: 'Premium Street', description: 'Donkere tonen en markante vormen. Een collectie die aansluit bij de lagen en texturen van je streetwear.', image: '/images/lifestyle.webp' },
];
export const collectionName = (slug: string) => collections.find(c => c.slug === slug)?.title ?? slug;
