import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const catalogPath = path.join(projectRoot, 'src', 'data', 'catalog.json')
const outputDirectory = path.join(projectRoot, 'public', 'feeds')
const siteUrl = (process.env.CATALOG_SITE_URL || 'https://marecoral.com.br').replace(/\/$/, '')
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))

const escapeCsv = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

const toCsv = (headers, rows) => [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(',')),
].join('\n') + '\n'

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase()

const variants = catalog.flatMap((product) => product.colors.flatMap((color) => product.sizes.map((size) => {
  const sku = `${product.id}-${normalize(color)}-${normalize(size)}`
  return {
    sku,
    itemGroupId: product.id,
    title: `${product.name} - ${color} - ${size}`,
    description: product.description,
    availability: product.stock > 0 ? 'in stock' : 'out of stock',
    condition: 'new',
    price: `${Number(product.price).toFixed(2)} BRL`,
    link: `${siteUrl}/produto/${product.slug}?cor=${encodeURIComponent(color)}&tamanho=${encodeURIComponent(size)}`,
    imageLink: `${siteUrl}${product.image}`,
    brand: 'Maré Coral Fitwear',
    category: 'Apparel & Accessories > Clothing > Activewear',
    color,
    size,
  }
})))

const metaRows = variants.map((variant) => ({
  id: variant.sku,
  title: variant.title,
  description: variant.description,
  availability: variant.availability,
  condition: variant.condition,
  price: variant.price,
  link: variant.link,
  image_link: variant.imageLink,
  brand: variant.brand,
  google_product_category: variant.category,
  color: variant.color,
  size: variant.size,
  item_group_id: variant.itemGroupId,
}))

const tiktokRows = variants.map((variant) => ({
  sku_id: variant.sku,
  title: variant.title,
  description: variant.description,
  availability: variant.availability,
  condition: variant.condition,
  price: variant.price,
  link: variant.link,
  image_link: variant.imageLink,
  brand: variant.brand,
  google_product_category: variant.category,
  color: variant.color,
  size: variant.size,
  item_group_id: variant.itemGroupId,
}))

await mkdir(outputDirectory, { recursive: true })
await writeFile(path.join(outputDirectory, 'meta-catalog.csv'), toCsv(Object.keys(metaRows[0]), metaRows), 'utf8')
await writeFile(path.join(outputDirectory, 'tiktok-catalog.csv'), toCsv(Object.keys(tiktokRows[0]), tiktokRows), 'utf8')

console.log(`Feeds gerados para ${catalog.length} produtos e ${variants.length} variações usando ${siteUrl}.`)
