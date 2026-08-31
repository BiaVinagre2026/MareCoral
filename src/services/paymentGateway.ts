import type { CartLine } from '../context/CartContext.tsx'
import { getProductVariant, type Product } from '../data/products.ts'
import { catalogToken, postToStorefront } from './meuMostruarioApi.ts'

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

type CheckoutResult =
  | { status: 'configuration_required' }
  | { status: 'redirect'; checkoutUrl: string }
  | { status: 'pix'; qrCode: string; orderId: number }
  | { status: 'payment_failed'; orderId: number; message: string; shipping: ShippingQuote }
  | { status: 'order_created'; orderId: number; shipping: ShippingQuote }

export type ShippingQuote = {
  configured: boolean
  amount: number
  method: string
  estimatedDays: number | null
  subtotal: number
}

type BackendCheckoutResponse = {
  order: {
    id: number
    shipping_amount?: string | number | null
    shipping_method?: string | null
    shipping_estimated_days?: number | null
    items_subtotal?: string | number | null
  }
  payment?: {
    status: string
    checkout_url?: string | null
    pix_qr_code?: string | null
    error_message?: string | null
  } | null
}

export const checkoutEnabled = import.meta.env.VITE_CHECKOUT_ENABLED === 'true' && Boolean(catalogToken)

function shippingFromOrder(order: BackendCheckoutResponse['order']): ShippingQuote {
  return {
    configured: order.shipping_method !== 'Frete a combinar',
    amount: Number(order.shipping_amount || 0),
    method: order.shipping_method || 'Frete a combinar',
    estimatedDays: order.shipping_estimated_days ?? null,
    subtotal: Number(order.items_subtotal || 0),
  }
}

function checkoutItems(payload: Pick<CheckoutPayload, 'lines' | 'products'>) {
  return payload.lines.map((line) => {
    const product = payload.products.find((candidate) => candidate.id === line.productId)
    const variant = product && getProductVariant(product, line.color, line.size)
    if (!product?.backendProductId || !product.catalogItemId || !variant?.id) {
      throw new Error('Atualize a página: há uma peça fora de sincronia com o catálogo.')
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

  if (body.payment?.status === 'failed') {
    return {
      status: 'payment_failed',
      orderId: body.order.id,
      message: body.payment.error_message || `O pedido ${body.order.id} foi salvo, mas o gateway não abriu a cobrança.`,
      shipping: shippingFromOrder(body.order),
    }
  }
  if (body.payment?.checkout_url) return { status: 'redirect', checkoutUrl: body.payment.checkout_url }
  if (body.payment?.pix_qr_code) return { status: 'pix', qrCode: body.payment.pix_qr_code, orderId: body.order.id }
  return {
    status: 'order_created',
    orderId: body.order.id,
    shipping: shippingFromOrder(body.order),
  }
}
