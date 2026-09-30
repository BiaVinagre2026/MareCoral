export type ShippingQuote = {
  configured: boolean
  amount: number
  method: string
  estimatedDays: number | null
  subtotal: number
}

export type BackendCheckoutResponse = {
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

export type CheckoutResult =
  | { status: 'configuration_required' }
  | { status: 'redirect'; checkoutUrl: string }
  | { status: 'pix'; qrCode: string; orderId: number }
  | { status: 'payment_failed'; orderId: number; message: string; shipping: ShippingQuote }
  | { status: 'order_created'; orderId: number; shipping: ShippingQuote }

export function shippingQuoteKey(postalCode: string, lines: Array<{ productId: string; color: string; size: string; quantity: number }>, subtotal: number) {
  const items = lines.map(({ productId, color, size, quantity }) => [productId, color, size, quantity]).sort()
  return JSON.stringify([postalCode.replace(/\D/g, ''), items, Math.round(subtotal * 100)])
}

export function isCurrentShippingQuote(quote: ShippingQuote | null, quotedKey: string, currentKey: string, subtotal: number) {
  return Boolean(quote && quotedKey === currentKey && Math.round(quote.subtotal * 100) === Math.round(subtotal * 100))
}

export function interpretCheckoutResponse(body: BackendCheckoutResponse): CheckoutResult {
  const shipping: ShippingQuote = {
    configured: Boolean(body.order.shipping_method && body.order.shipping_method !== 'Frete a combinar'),
    amount: Number(body.order.shipping_amount || 0),
    method: body.order.shipping_method || 'Frete a combinar',
    estimatedDays: body.order.shipping_estimated_days ?? null,
    subtotal: Number(body.order.items_subtotal || 0),
  }
  if (body.payment?.status === 'failed') {
    return {
      status: 'payment_failed', orderId: body.order.id, shipping,
      message: body.payment.error_message || `O pedido ${body.order.id} foi salvo, mas o pagamento não pôde ser iniciado.`,
    }
  }
  // O gateway também retorna a URL da imagem QR. O copia e cola tem prioridade.
  if (body.payment?.pix_qr_code) return { status: 'pix', qrCode: body.payment.pix_qr_code, orderId: body.order.id }
  if (body.payment?.checkout_url) {
    try {
      const url = new URL(body.payment.checkout_url)
      if (url.protocol === 'https:') return { status: 'redirect', checkoutUrl: url.href }
    } catch { /* Resposta inválida não pode apagar a referência do pedido criado. */ }
    return {
      status: 'payment_failed', orderId: body.order.id, shipping,
      message: `Pedido ${body.order.id} salvo. O endereço de pagamento recebido não é válido.`,
    }
  }
  return { status: 'order_created', orderId: body.order.id, shipping }
}
