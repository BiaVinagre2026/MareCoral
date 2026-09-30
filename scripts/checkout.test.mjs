import assert from 'node:assert/strict'
import test from 'node:test'
import { interpretCheckoutResponse, isCurrentShippingQuote, shippingQuoteKey } from '../src/services/checkoutPresentation.ts'

const line = { productId: '1', color: 'Coral', size: 'M', quantity: 1 }
const key = shippingQuoteKey('24340-140', [line], 289.9)
const quote = { configured: true, amount: 0, method: 'Frete gratis', estimatedDays: null, subtotal: 289.9 }

test('cotação exige CEP, itens, quantidades e subtotal atuais', () => {
  assert.equal(isCurrentShippingQuote(quote, key, shippingQuoteKey('24340140', [line], 289.9), 289.9), true)
  for (const changed of [
    shippingQuoteKey('01001000', [line], 289.9),
    shippingQuoteKey('24340140', [{ ...line, quantity: 2 }], 579.8),
    shippingQuoteKey('24340140', [{ ...line, color: 'Rosa' }], 289.9),
    shippingQuoteKey('24340140', [{ ...line, size: 'G' }], 289.9),
    shippingQuoteKey('24340140', [line], 299.9),
  ]) assert.equal(isCurrentShippingQuote(quote, key, changed, 289.9), false)
  assert.equal(isCurrentShippingQuote({ ...quote, subtotal: 299.9 }, key, key, 289.9), false)
  assert.equal(isCurrentShippingQuote(null, key, key, 289.9), false)
})

test('Pix copia e cola prevalece sobre a URL da imagem QR', () => {
  assert.deepEqual(interpretCheckoutResponse({ order: { id: 10 }, payment: { status: 'pending', pix_qr_code: 'PIX-TESTE', checkout_url: 'https://example.com/qr.png' } }), { status: 'pix', qrCode: 'PIX-TESTE', orderId: 10 })
})

test('falha do pagamento preserva o identificador do pedido', () => {
  const result = interpretCheckoutResponse({ order: { id: 10 }, payment: { status: 'failed', pix_qr_code: 'INVALIDO', error_message: 'Recusado' } })
  assert.equal(result.status, 'payment_failed')
  assert.equal(result.orderId, 10)
  assert.equal(result.message, 'Recusado')
})

test('pedido sem frete definido não apresenta zero como tarifa confirmada', () => {
  const result = interpretCheckoutResponse({ order: { id: 10 } })
  assert.equal(result.status, 'order_created')
  assert.equal(result.shipping.configured, false)
})

test('redirecionamentos exigem HTTPS', () => {
  const response = (url) => ({ order: { id: 10 }, payment: { status: 'pending', checkout_url: url } })
  assert.equal(interpretCheckoutResponse(response('https://example.com/pay')).status, 'redirect')
  for (const invalid of ['javascript:alert(1)', 'http://example.com/pay', 'invalid']) {
    const result = interpretCheckoutResponse(response(invalid))
    assert.equal(result.status, 'payment_failed')
    assert.equal(result.orderId, 10)
  }
})
