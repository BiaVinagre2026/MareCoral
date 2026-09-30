import type { CartLine } from '../context/CartContext.tsx'
import { getProductVariant, type Product } from '../data/products.ts'
import { catalogToken, postToStorefront } from './meuMostruarioApi.ts'
import { interpretCheckoutResponse, type CheckoutResult, type ShippingQuote, type BackendCheckoutResponse } from './checkoutPresentation.ts'
export type { ShippingQuote } from './checkoutPresentation.ts'

export type CheckoutPayload = {
  customer: {
    name: string
    email: string
    phone: string
    document: string
  }
  shippingAddress: {
    postalCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
  lines: CartLine[]
  products: Product[]
}

export const checkoutEnabled = import.meta.env.VITE_CHECKOUT_ENABLED === 'true' && Boolean(catalogToken)

function checkoutItems(payload: Pick<CheckoutPayload, 'lines' | 'products'>) {
  return payload.lines.map((line) => {
    const product = payload.products.find((candidate) => candidate.id === line.productId)
    const variant = product && getProductVariant(product, line.color, line.size)
    if (!product?.backendProductId || !product.catalogItemId || !variant?.id) {
      throw new Error('Atualize a página: a disponibilidade de uma das peças mudou.')
    }
    return {
      product_id: product.backendProductId,
      catalog_item_id: product.catalogItemId,
      variant_id: variant.id,
      qty: line.quantity,
    }
  })
}

type QuoteResponse = {
  quote: {
    configured: boolean
    amount: string | number
    method: string
    estimated_days: number | null
    subtotal: string | number
  }
}

export async function quoteShipping(payload: Pick<CheckoutPayload, 'lines' | 'products'> & { postalCode: string }): Promise<ShippingQuote> {
  if (!checkoutEnabled) throw new Error('A conexão de pedidos ainda não está habilitada.')
  const body = await postToStorefront<QuoteResponse>(
    `/mare_coral/storefront/${encodeURIComponent(catalogToken)}/shipping_quote`,
    { postal_code: payload.postalCode, order: { items: checkoutItems(payload) } },
  )
  return {
    configured: body.quote.configured,
    amount: Number(body.quote.amount || 0),
    method: body.quote.method,
    estimatedDays: body.quote.estimated_days,
    subtotal: Number(body.quote.subtotal || 0),
  }
}

export async function createCheckoutSession(payload: CheckoutPayload): Promise<CheckoutResult> {
  if (!checkoutEnabled) return { status: 'configuration_required' }

  const items = checkoutItems(payload)

  // Preço, desconto e total não são enviados pelo navegador. O backend é a
  // fonte de verdade e monta o snapshot financeiro do pedido.
  const body = await postToStorefront<BackendCheckoutResponse>(
    `/mare_coral/storefront/${encodeURIComponent(catalogToken)}/orders`,
    {
      order: {
        buyer_name: payload.customer.name,
        buyer_email: payload.customer.email,
        buyer_phone: payload.customer.phone,
        buyer_document: payload.customer.document,
        payment_method: 'pix',
        shipping_address: {
          postal_code: payload.shippingAddress.postalCode,
          street: payload.shippingAddress.street,
          number: payload.shippingAddress.number,
          complement: payload.shippingAddress.complement,
          neighborhood: payload.shippingAddress.neighborhood,
          city: payload.shippingAddress.city,
          state: payload.shippingAddress.state,
        },
        items,
      },
    },
  )

  return interpretCheckoutResponse(body)
}
