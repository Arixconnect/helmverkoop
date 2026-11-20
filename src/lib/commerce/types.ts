export type Color = { name: string; hex: string };
export type ProductImage = { src: string; alt: string };
export type Variant = { id: string; color: string; size: string; price: number; available: boolean; image?: ProductImage };
export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** All monetary values are integer euro cents. */
  price: number;
  compareAtPrice: number | null;
  currency: 'EUR';
  images: ProductImage[];
  variants: Variant[];
  sizes: string[];
  colors: Color[];
  features: string[];
  category: string;
  tags: string[];
  supplierId: string | null;
  supplierSku: string | null;
  supplierCountry: string | null;
  supplierVerified: boolean;
  complianceStatus: 'pending' | 'verified';
  complianceDocuments: string[];
  shippingEstimate: string | null;
  inventoryStatus: 'demo' | 'available' | 'unavailable';
  isDemo: boolean;
  verifiedForSale: boolean;
  seoTitle: string;
  seoDescription: string;
};

export interface Supplier {
  id: string;
  name: string;
  country: string;
  warehouseCountry: string | null;
  averageDeliveryDays: number | null;
  purchasePriceCents: number | null;
  shippingCostCents: number | null;
  returnsProcedure: string | null;
  productDocuments: string[];
  conformityDocuments: string[];
  importerResponsibility: string | null;
  hasApi: boolean | null;
  lastVerifiedAt: string | null;
}
export const money = (cents: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);
