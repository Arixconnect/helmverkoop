import type { Product, Variant } from './types';
export interface CartLine { variantId: string; quantity: number }
export const quantityLimit = 99;

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object' || !('variantId' in value) || !('quantity' in value)) return false;
  return typeof value.variantId === 'string' && value.variantId.length > 0 && value.variantId.length <= 256
    && typeof value.quantity === 'number' && Number.isSafeInteger(value.quantity) && value.quantity > 0 && value.quantity <= quantityLimit;
}

export function readCart(raw: string | null): CartLine[] {
  if (!raw || raw.length > 100_000) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const unique = new Map<string, CartLine>();
    for (const entry of data.slice(0, 250)) {
      if (isCartLine(entry)) unique.set(entry.variantId, { variantId: entry.variantId, quantity: entry.quantity });
    }
    return [...unique.values()];
  } catch { return []; }
}

export function setQuantity(lines: CartLine[], variantId: string, quantity: number): CartLine[] {
  if (quantity === 0) return lines.filter(line => line.variantId !== variantId);
  if (!isCartLine({ variantId, quantity })) return lines;
  if (lines.some(line => line.variantId === variantId)) return lines.map(line => line.variantId === variantId ? {variantId, quantity} : line);
  return lines.length < 250 ? [...lines, {variantId, quantity}] : lines;
}

export function addVariant(lines: CartLine[], variantId: string) {
  const previous = lines.find(line => line.variantId === variantId)?.quantity ?? 0;
  return setQuantity(lines, variantId, Math.min(previous + 1, quantityLimit));
}

export function resolveCart(lines: CartLine[], products: Product[]) {
  const byId = new Map<string, {product: Product; variant: Variant}>();
  for (const product of products) {
    for (const variant of product.variants) byId.set(variant.id, {product, variant});
  }
  const items = lines.map(line => ({...line, item: byId.get(line.variantId)}));
  const subtotal = items.reduce((sum, line) => sum + (line.item?.variant.price ?? 0) * line.quantity, 0);
  return {items, subtotal};
}
