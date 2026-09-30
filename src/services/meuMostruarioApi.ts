import type { Product } from '../data/products.ts'
import launchPolicy from '../data/launch-policy.json'
import { assertMareCoralTenant, MARE_CORAL_TENANT_SLUG } from './tenantIsolation.ts'

type ApiImage = {
  urls?: Record<string, string | null>
  alt_text?: string | null
  is_cover?: boolean
  position?: number
}

type ApiVariant = {
  id?: number
  size?: string | null
  size_group?: string | null
  color?: string | null
  color_hex?: string | null
  stock_qty?: number | null
  price_override?: string | number | null
  image_url?: string | null
}

type ApiProduct = {
  id: number
  slug: string
  name: string
  sku?: string | null
  description?: string | null
  price_retail?: string | number | null
  tags?: string[]
  category?: { name?: string | null } | null
  collection?: { name?: string | null } | null
  cover_image?: ApiImage | null
  colors?: Array<{ name?: string | null; hex?: string | null }>
  sizes?: string[]
  fabric_composition?: string | null
  care_instructions?: string | null
  size_guide?: unknown
  images?: ApiImage[]
  variants?: ApiVariant[]
}

type CatalogLinkResponse = {
  catalog_link: {
    allow_order: boolean
    allow_payment: boolean
    items: Array<{ id: number; product_id?: number | null }>
  }
}

type ProductsResponse = {
  products: ApiProduct[]
}

type TenantConfigResponse = {
  tenant: { slug: string }
}

export type StorefrontConnection = {
  products: Product[]
  allowOrder: boolean
  allowPayment: boolean
}

const apiBaseUrl = (import.meta.env.VITE_MOSTRUARIO_API_URL || '/api/v1').replace(/\/$/, '')
const configuredTenantSlug = (import.meta.env.VITE_MOSTRUARIO_TENANT || MARE_CORAL_TENANT_SLUG).trim()
assertMareCoralTenant(configuredTenantSlug)
export const tenantSlug = MARE_CORAL_TENANT_SLUG
export const catalogToken = (import.meta.env.VITE_MOSTRUARIO_CATALOG_TOKEN || '').trim()
const apiTimeoutMs = 12_000

function apiOrigin() {
  if (!/^https?:\/\//i.test(apiBaseUrl)) return ''
  return new URL(apiBaseUrl).origin
}

function resolveAssetUrl(value?: string | null) {
  if (!value) return ''
  if (/^(https?:|data:|blob:)/i.test(value)) return value
  if ((value.startsWith('/uploads/') || value.startsWith('/rails/')) && apiOrigin()) {
    return `${apiOrigin()}${value}`
  }
  return value.startsWith('/') ? value : `/${value}`
}

function preferredImage(image?: ApiImage | null) {
  const urls = image?.urls
  return resolveAssetUrl(urls?.regular || urls?.original || urls?.card || urls?.thumb)
}

function displayText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function inferSport(product: ApiProduct) {
  const source = [product.collection?.name, product.name, ...(product.tags || [])].join(' ').toLowerCase()
  if (source.includes('beach') || source.includes('areia')) return 'Beach tennis'
  if (source.includes('corrida') || source.includes('run')) return 'Corrida'
  if (source.includes('cross') || source.includes('box')) return 'Crossfit'
  return 'Academia'
}

function stockKey(color: string, size: string) {
  return `${color}::${size}`
}

function mapProduct(product: ApiProduct, catalogItemId?: number): Product {
  const variants = product.variants || []
  const colors = Array.from(new Set([
    ...variants.map((variant) => variant.color?.trim()).filter(Boolean),
    ...(product.colors || []).map((color) => color.name?.trim()).filter(Boolean),
  ])) as string[]
  const sizes = Array.from(new Set([
    ...variants.map((variant) => variant.size?.trim() || variant.size_group?.trim()).filter(Boolean),
    ...(product.sizes || []),
  ])) as string[]
  const colorHexByName = variants.reduce<Record<string, string>>((colorsByName, variant) => {
    const color = variant.color?.trim()
    const colorHex = variant.color_hex?.trim()
    if (color && colorHex) colorsByName[color] = colorHex
    return colorsByName
  }, {})
  ;(product.colors || []).forEach((color) => {
    const name = color.name?.trim()
    const hex = color.hex?.trim()
    if (name && hex && !colorHexByName[name]) colorHexByName[name] = hex
  })
  const stockByOption = variants.reduce<Record<string, number>>((stock, variant) => {
    const color = variant.color?.trim()
    const size = variant.size?.trim() || variant.size_group?.trim()
    if (color && size) stock[stockKey(color, size)] = (stock[stockKey(color, size)] || 0) + (variant.stock_qty || 0)
    return stock
  }, {})
  const storefrontVariants = variants.flatMap((variant) => {
    const color = variant.color?.trim()
    const size = variant.size?.trim() || variant.size_group?.trim()
    if (!color || !size) return []
    const override = Number(variant.price_override)
    return [{
      id: variant.id,
      color,
      colorHex: variant.color_hex?.trim() || undefined,
      size,
      stock: variant.stock_qty || 0,
      image: resolveAssetUrl(variant.image_url),
      price: Number.isFinite(override) && override > 0 ? override : undefined,
    }]
  })
  const imageEntries = (product.images || [])
    .filter((image) => (image.position || 0) < 90 && !/tecido/i.test(image.alt_text || preferredImage(image)))
    .slice()
    .sort((left, right) => (left.position || 0) - (right.position || 0))
    .map((image) => ({ image, url: preferredImage(image) }))
    .filter((entry): entry is { image: ApiImage; url: string } => Boolean(entry.url))
  const productGallery = imageEntries.map((entry) => entry.url)
  const imageLabels: Record<string, string> = {}
  const imagesByColor: Record<string, string[]> = {}
  // Legacy images without a color prefix belong to the first product color.
  imageEntries.forEach(({ image, url }) => {
    const rawLabel = image.alt_text?.trim() || ''
    const color = colors.find((candidate) => rawLabel.toLocaleLowerCase('pt-BR').startsWith(`${candidate.toLocaleLowerCase('pt-BR')} · `))
      || colors[0]
    const label = color && rawLabel.toLocaleLowerCase('pt-BR').startsWith(`${color.toLocaleLowerCase('pt-BR')} · `)
      ? rawLabel.slice(`${color} · `.length).trim()
      : rawLabel
    if (label) imageLabels[url] = label
    if (color) {
      const colorGallery = (imagesByColor[color] ||= [])
      if (!colorGallery.includes(url) && colorGallery.length < launchPolicy.photosPerColor) colorGallery.push(url)
    }
  })
  const variantGallery = storefrontVariants.map((variant) => variant.image).filter(Boolean) as string[]
  const gallery = Array.from(new Set([...productGallery, ...variantGallery]))
  const cover = preferredImage(product.cover_image) || gallery[0] || '/images/coral-avatar.jpeg'
  const price = Number(product.price_retail || 0)

  return {
    id: String(product.id),
    backendProductId: product.id,
    catalogItemId,
    slug: product.slug,
    name: product.name,
    category: product.category?.name || 'Fitwear',
    sport: inferSport(product),
    description: product.description || 'Peça Maré Coral criada para acompanhar seus movimentos.',
    price: Number.isFinite(price) ? price : 0,
    image: cover,
    images: gallery.length ? gallery : [cover],
    imagesByColor,
    imageLabels,
    colors: colors.length ? colors : ['Coral'],
    colorHexByName,
    sizes: sizes.length ? sizes : ['P', 'M', 'G'],
    stock: variants.reduce((total, variant) => total + (variant.stock_qty || 0), 0),
    stockByOption,
    variants: storefrontVariants,
    fabric: displayText(product.fabric_composition, 'Composição a confirmar'),
    fit: displayText(product.size_guide, 'Medidas a confirmar'),
    careInstructions: displayText(product.care_instructions, '') || undefined,
    badge: product.tags?.includes('Primeiro drop') ? 'Primeiro drop' : undefined,
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), apiTimeoutMs)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
        'X-Tenant-ID': tenantSlug,
      },
      signal: controller.signal,
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string; errors?: string[] } | null
      throw new Error(body?.errors?.join(', ') || body?.error || `Backend indisponível (${response.status})`)
    }
    // O limite também cobre a leitura do corpo, não apenas os cabeçalhos.
    return await response.json() as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('O backend demorou para responder. Tente atualizar a loja.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function loadStorefront(): Promise<StorefrontConnection> {
  const tenantConfig = await apiFetch<TenantConfigResponse>('/tenant/config')
  assertMareCoralTenant(tenantConfig.tenant.slug)

  if (!catalogToken) {
    throw new Error('A vitrine da Maré Coral ainda não está ligada ao catálogo varejista.')
  }

  const [list, catalogResponse] = await Promise.all([
    apiFetch<ProductsResponse>('/products?per_page=100'),
    apiFetch<CatalogLinkResponse>(`/catalog_links/${encodeURIComponent(catalogToken)}`),
  ])
  const allowOrder = catalogResponse.catalog_link.allow_order
  const allowPayment = catalogResponse.catalog_link.allow_payment
  const catalogItems = new Map<number, number>()
  catalogResponse.catalog_link.items.forEach((item) => {
    if (item.product_id && !catalogItems.has(item.product_id)) catalogItems.set(item.product_id, item.id)
  })
  const productsById = new Map(list.products.map((product) => [product.id, product]))
  const storefrontProducts = Array.from(catalogItems.keys())
    .map((productId) => productsById.get(productId))
    .filter((product): product is ApiProduct => Boolean(product))
  const details: ApiProduct[] = []

  // O backend usa três threads no ambiente local. Lotes de três evitam que oito
  // páginas de produto disputem a mesma conexão e deixem a vitrine carregando.
  for (let index = 0; index < storefrontProducts.length; index += 3) {
    const batch = storefrontProducts.slice(index, index + 3)
    const batchDetails = await Promise.all(batch.map(async (product) => {
      // Um resumo sem variantes não equivale a estoque zerado. Se o detalhe
      // falhar, oferecer nova tentativa em vez de esvaziar a sacola aparente.
      const response = await apiFetch<{ product: ApiProduct }>(`/products/${encodeURIComponent(product.slug)}`)
      return response.product
    }))
    details.push(...batchDetails)
  }

  return {
    products: details.map((product) => mapProduct(product, catalogItems.get(product.id))),
    allowOrder,
    allowPayment,
  }
}

export async function postToStorefront<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantSlug,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string; errors?: string[] } | null
    throw new Error(body?.errors?.join(', ') || body?.error || 'Não foi possível registrar o pedido.')
  }

  return response.json() as Promise<T>
}
