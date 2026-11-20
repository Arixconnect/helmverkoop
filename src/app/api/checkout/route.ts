import {NextResponse} from 'next/server';
import {isDemoMode} from '@/lib/commerce';
import {isCartLine} from '@/lib/commerce/cart';
import {createShopifyCheckout} from '@/lib/commerce/shopify';
export async function POST(request: Request) {
  if (isDemoMode()) return NextResponse.json({error:'Bestellen is nog niet mogelijk.'},{status:403});
  if (request.headers.get('origin') !== new URL(request.url).origin || !request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({error:'Ongeldig verzoek.'},{status:403});
  }
  const values: unknown = await request.json().catch(()=>null);
  if (!Array.isArray(values) || !values.length || values.length > 250 || !values.every(isCartLine) ||
      new Set(values.map(line=>line.variantId)).size !== values.length) {
    return NextResponse.json({error:'Controleer de inhoud van je winkelmand.'},{status:400});
  }
  try {
    const checkoutUrl = await createShopifyCheckout(values);
    return NextResponse.json({checkoutUrl},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'Checkout is niet beschikbaar. Vernieuw je winkelmand en probeer het opnieuw.'},{status:409});
  }
}
