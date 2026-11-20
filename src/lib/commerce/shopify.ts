import 'server-only';
import { z } from 'zod';
import type { Product } from './types';
import type { CartLine } from './cart';
import { collections } from './collections';

const review = z.object({
  verifiedForSale: z.literal(true), supplierVerified: z.literal(true), complianceStatus: z.literal('verified'),
  intendedUse: z.literal('conventional-e-bike-nl'), reviewedAt: z.string().datetime({ offset: true }),
  supplierId: z.string().min(1), supplierCountry: z.string().length(2),
  complianceDocuments: z.array(z.string().url().startsWith('https://')).min(1),
  category: z.string().refine(s => collections.some(c => c.slug === s)), shippingEstimate: z.string().min(1),
});
const image = z.object({url: z.string().url().startsWith('https://cdn.shopify.com/'), altText: z.string().nullable()});
const node = z.object({
  id: z.string().startsWith('gid://shopify/Product/'), handle: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1), description: z.string(), tags: z.array(z.string()),
  images: z.object({ nodes: z.array(image).min(1) }),
  review: z.object({ value: z.string() }),
  variants: z.object({pageInfo: z.object({hasNextPage:z.literal(false)}), nodes: z.array(z.object({
    id: z.string().startsWith('gid://shopify/ProductVariant/'), availableForSale: z.boolean(), sku: z.string().nullable(),
    price: z.object({amount:z.string().regex(/^\d{1,6}(\.\d{1,2})?$/),currencyCode:z.literal('EUR')}),
    selectedOptions: z.array(z.object({ name:z.string(), value:z.string().min(1) })).length(2),
    image: image.nullable(),
  })).min(1)}),
});

function parseProduct(input: unknown): Product | null {
  const parsed = node.safeParse(input);
  if (!parsed.success) return null;
  const p = parsed.data;
  let dossier: unknown;
  try { dossier = JSON.parse(p.review.value); } catch { return null; }
  const result = review.safeParse(dossier);
  if (!result.success || Date.parse(result.data.reviewedAt) > Date.now()) return null;
  const dossierData = result.data;
  const variants = p.variants.nodes.flatMap(v => {
    const size = v.selectedOptions.find(o => ['maat','size'].includes(o.name.toLowerCase()))?.value;
    const color = v.selectedOptions.find(o => ['kleur','color','colour'].includes(o.name.toLowerCase()))?.value;
    if (!size || !color) return [];
    return [{id:v.id,size,color,price:Math.round(Number(v.price.amount)*100),available:v.availableForSale,
      image: v.image ? {src:v.image.url,alt:v.image.altText || p.title + ' in ' + color} : undefined}];
  });
  if (variants.length !== p.variants.nodes.length) return null;
  return {
    id:p.id,slug:p.handle,title:p.title,description:p.description,price:Math.min(...variants.map(v=>v.price)),
    compareAtPrice:null,currency:'EUR',images:p.images.nodes.map(i=>({src:i.url,alt:i.altText || p.title})),
    sizes:[...new Set(variants.map(v=>v.size))],colors:[...new Set(variants.map(v=>v.color))].map(name=>({name,hex:''})),
    variants,features:[],category:dossierData.category,tags:p.tags,supplierId:dossierData.supplierId,
    supplierSku:p.variants.nodes.length===1 ? p.variants.nodes[0].sku : null,supplierCountry:dossierData.supplierCountry,
    supplierVerified:true,complianceStatus:'verified',complianceDocuments:dossierData.complianceDocuments,
    shippingEstimate:dossierData.shippingEstimate,inventoryStatus:variants.some(v=>v.available)?'available':'unavailable',
    isDemo:false,verifiedForSale:true,seoTitle:p.title,seoDescription:p.description.slice(0,160),
  };
}

function connection() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN ?? '';
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-10';
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain) || !token || !/^20\d{2}-(01|04|07|10)$/.test(version)) {
    throw new Error('Controleer de Shopify-configuratie op de server.');
  }
  return {domain,token,version};
}
async function request<T>(query: string, variables: Record<string, unknown>, schema: z.ZodType<T>): Promise<T> {
  const {domain,token,version} = connection();
  const res = await fetch('https://' + domain + '/api/' + version + '/graphql.json', {
    method:'POST',cache:'no-store',signal:AbortSignal.timeout(12_000),
    headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':token},
    body:JSON.stringify({query,variables}),
  });
  if (!res.ok) throw new Error('De verbinding met de productcatalogus is onderbroken.');
  const payload = z.object({data:schema,errors:z.array(z.unknown()).optional()}).safeParse(await res.json());
  if (!payload.success || payload.data.errors?.length) throw new Error('De catalogus gaf een onvolledig antwoord.');
  return payload.data.data;
}

const catalogQuery = `query Catalog($after: String) @inContext(country: NL, language: NL) {
  products(first: 24, after: $after) {
    pageInfo {hasNextPage endCursor}
    nodes {id handle title description tags images(first: 16) {nodes {url altText}}
      review: metafield(namespace: "compliance", key: "sales_review") {value}
      variants(first: 250) {pageInfo {hasNextPage} nodes {id sku availableForSale price {amount currencyCode}
        selectedOptions {name value} image {url altText}}}
    }
  }
}`;
const catalogPage = z.object({products:z.object({nodes:z.array(z.unknown()),pageInfo:z.object({hasNextPage:z.boolean(),endCursor:z.string().nullable()})})});
export async function getShopifyProducts(): Promise<Product[]> {
  const products: Product[] = [];
  const cursors = new Set<string>();
  let after: string | null = null;
  for (;;) {
    const page: z.infer<typeof catalogPage> = await request(catalogQuery, {after}, catalogPage);
    for (const row of page.products.nodes) {
      const product = parseProduct(row);
      if (product) products.push(product);
    }
    if (!page.products.pageInfo.hasNextPage) return products;
    after = page.products.pageInfo.endCursor;
    if (!after || cursors.has(after)) throw new Error('De catalogus kon niet volledig worden geladen.');
    cursors.add(after);
  }
}

const cartQuery = `mutation CreateCart($input: CartInput!) @inContext(country: NL, language: NL) {
  cartCreate(input:$input) {cart {checkoutUrl totalQuantity} userErrors {message} warnings {message}}
}`;
const cartResult = z.object({cartCreate:z.object({
  cart:z.object({checkoutUrl:z.string().url(),totalQuantity:z.number().int()}).nullable(),
  userErrors:z.array(z.unknown()),warnings:z.array(z.unknown()),
})});
export async function createShopifyCheckout(lines: CartLine[]) {
  const products = await getShopifyProducts();
  const allowed = new Set(products.filter(p=>p.verifiedForSale && !p.isDemo).flatMap(p=>p.variants.filter(v=>v.available).map(v=>v.id)));
  if (!lines.length || lines.some(line=>!allowed.has(line.variantId))) throw new Error('Een variant is niet beschikbaar.');
  const result = await request(cartQuery,{input:{buyerIdentity:{countryCode:'NL'},lines:lines.map(line=>({merchandiseId:line.variantId,quantity:line.quantity}))}},cartResult);
  const {cart,userErrors,warnings} = result.cartCreate;
  if (!cart || userErrors.length || warnings.length || cart.totalQuantity !== lines.reduce((n,l)=>n+l.quantity,0)) {
    throw new Error('De winkelmand is gewijzigd. Controleer de productkeuze.');
  }
  const url = new URL(cart.checkoutUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || ![connection().domain,process.env.SHOPIFY_CHECKOUT_HOST].includes(url.hostname)) {
    throw new Error('Controleer het checkoutdomein.');
  }
  return url.toString();
}
