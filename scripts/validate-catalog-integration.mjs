import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readLocalEnvironment() {
  const environmentPath = resolve(process.cwd(), '.env')
  if (!existsSync(environmentPath)) return {}

  return Object.fromEntries(readFileSync(environmentPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith('#') && line.includes('='))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    }))
}

const localEnvironment = readLocalEnvironment()
const backendUrl = (process.env.MOSTRUARIO_BACKEND_URL || localEnvironment.MOSTRUARIO_BACKEND_URL || 'http://127.0.0.1:8000')
  .replace('host.docker.internal', '127.0.0.1')
  .replace(/\/$/, '')
const tenant = process.env.VITE_MOSTRUARIO_TENANT || localEnvironment.VITE_MOSTRUARIO_TENANT || 'mare-coral'
const catalogToken = process.env.VITE_MOSTRUARIO_CATALOG_TOKEN || localEnvironment.VITE_MOSTRUARIO_CATALOG_TOKEN || ''

async function get(path) {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: { Accept: 'application/json', 'X-Tenant-ID': tenant },
  })
  if (!response.ok) throw new Error(`${path} respondeu ${response.status}`)
  return response.json()
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(catalogToken, 'Configure VITE_MOSTRUARIO_CATALOG_TOKEN para validar a vitrine varejista.')
const [list, catalogResponse] = await Promise.all([
  get('/api/v1/products?per_page=100'),
  get(`/api/v1/catalog_links/${encodeURIComponent(catalogToken)}`),
])
const link = catalogResponse.catalog_link
const summariesById = new Map((list.products || []).map((product) => [product.id, product]))
const selectedIds = [...new Set((link.items || []).map((item) => item.product_id).filter(Boolean))]
const summaries = selectedIds.map((id) => summariesById.get(id)).filter(Boolean)
assert(summaries.length === selectedIds.length, 'A vitrine contém produto ausente ou não publicado no backend.')
assert(summaries.length >= 5 && summaries.length <= 10, `O primeiro drop deve ter de 5 a 10 produtos; recebeu ${summaries.length}.`)

const products = await Promise.all(summaries.map(async (summary) => {
  const response = await get(`/api/v1/products/${encodeURIComponent(summary.slug)}`)
  return response.product
}))

for (const product of products) {
  assert(product.status === 'published', `${product.name}: status precisa ser published.`)
  assert(Number(product.price_retail) > 0, `${product.name}: preço de varejo ausente.`)
  assert(product.description?.trim(), `${product.name}: descrição ausente.`)
  assert(product.cover_image?.urls?.regular || product.cover_image?.urls?.original, `${product.name}: foto de capa ausente.`)
  assert(product.variants?.length, `${product.name}: variantes ausentes.`)
  for (const variant of product.variants) {
    assert(variant.color?.trim(), `${product.name}: variante sem cor.`)
    assert((variant.size || variant.size_group)?.trim(), `${product.name}: variante sem tamanho.`)
    assert(Number.isInteger(variant.stock_qty) && variant.stock_qty >= 0, `${product.name}: estoque inválido.`)
  }
}

assert(link.allow_order, 'O link configurado precisa aceitar pedidos.')

const totals = products.reduce((result, product) => ({
  variants: result.variants + product.variants.length,
  stock: result.stock + product.variants.reduce((sum, variant) => sum + variant.stock_qty, 0),
  images: result.images + product.images.length,
}), { variants: 0, stock: 0, images: 0 })

console.log(`Catálogo ${tenant} validado: ${products.length} produtos, ${totals.variants} variantes, ${totals.stock} unidades e ${totals.images} imagens.`)
console.log('Link de pedidos: configurado e consistente.')
