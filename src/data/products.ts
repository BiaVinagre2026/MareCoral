import catalog from './catalog.json'

export type ProductVariantOption = {
  id?: number
  color: string
  colorHex?: string
  size: string
  stock: number
  image?: string
  price?: number
}

export type Product = {
  id: string
  backendProductId?: number
  catalogItemId?: number
  slug: string
  name: string
  category: string
  sport: string
  description: string
  price: number
  compareAtPrice?: number
  image: string
  imagePosition?: string
  images?: string[]
  imagesByColor?: Record<string, string[]>
  imageLabels?: Record<string, string>
  colors: string[]
  colorHexByName?: Record<string, string>
  sizes: string[]
  stock: number
  stockByOption?: Record<string, number>
  variants?: ProductVariantOption[]
  featured?: boolean
  badge?: string
  fabric: string
  fit: string
  careInstructions?: string
}

// Catálogo demonstrativo para validar a experiência da loja.
// Custos e margens nunca ficam no front-end público.
export const demoProducts = catalog as Product[]

export const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(price)

export const productOptionKey = (color: string, size: string) => `${color}::${size}`

export function getProductVariant(product: Product, color: string, size: string) {
  return product.variants?.find((variant) => variant.color === color && variant.size === size)
}

export function getOptionStock(product: Product, color: string, size: string) {
  const variant = getProductVariant(product, color, size)
  if (product.variants?.length) return variant?.stock ?? 0

  const keyedStock = product.stockByOption?.[productOptionKey(color, size)]
  return typeof keyedStock === 'number' ? keyedStock : product.stock
}

export function getOptionPrice(product: Product, color: string, size: string) {
  return getProductVariant(product, color, size)?.price ?? product.price
}

export function getColorImage(product: Product, color: string) {
  return product.variants?.find((variant) => variant.color === color && variant.image)?.image
}

export function colorHasStock(product: Product, color: string) {
  return product.sizes.some((size) => getOptionStock(product, color, size) > 0)
}

export function getFirstAvailableOption(product: Product) {
  const variant = product.variants?.find((candidate) => candidate.stock > 0)
  if (variant) return { color: variant.color, size: variant.size }

  for (const color of product.colors) {
    const size = product.sizes.find((candidate) => getOptionStock(product, color, candidate) > 0)
    if (size) return { color, size }
  }

  return { color: product.colors[0] ?? '', size: product.sizes[0] ?? '' }
}
