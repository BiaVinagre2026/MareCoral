import { ArrowLeft, ChevronRight, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import StoreHeader from '../components/StoreHeader.tsx'
import { useCart } from '../context/CartContext.tsx'
import { useCatalog } from '../context/CatalogContext.tsx'
import {
  colorHasStock,
  formatPrice,
  getColorImage,
  getFirstAvailableOption,
  getOptionPrice,
  getOptionStock,
} from '../data/products.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

function ProductPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { products, getProductBySlug, status } = useCatalog()
  const product = getProductBySlug(slug)
  const { addItem } = useCart()
  const requestedColor = searchParams.get('cor')
  const requestedSize = searchParams.get('tamanho')
  const [colorChoice, setColorChoice] = useState('')
  const [sizeChoice, setSizeChoice] = useState('')
  const [imageChoice, setImageChoice] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const firstAvailable = product ? getFirstAvailableOption(product) : { color: '', size: '' }
  const colorCandidate = colorChoice || requestedColor || ''
  const selectedColor = product?.colors.includes(colorCandidate) && colorHasStock(product, colorCandidate)
    ? colorCandidate
    : firstAvailable.color
  const sizeCandidate = sizeChoice || requestedSize || ''
  const firstSizeForColor = product?.sizes.find((size) => getOptionStock(product, selectedColor, size) > 0) ?? firstAvailable.size
  const selectedSize = product?.sizes.includes(sizeCandidate) && getOptionStock(product, selectedColor, sizeCandidate) > 0
    ? sizeCandidate
    : firstSizeForColor
  const selectedStock = product ? getOptionStock(product, selectedColor, selectedSize) : 0
  const selectedPrice = product ? getOptionPrice(product, selectedColor, selectedSize) : 0
  const selectedColorImage = product ? getColorImage(product, selectedColor) : undefined
  const gallery = product?.imagesByColor?.[selectedColor]?.length
    ? product.imagesByColor[selectedColor]
    : product?.images?.length
      ? product.images
      : product
        ? [product.image]
        : []
  const activeImage = gallery.includes(imageChoice)
    ? imageChoice
    : selectedColorImage || gallery[0] || product?.image || ''
  const related = products.filter((candidate) => candidate.id !== product?.id).slice(0, 3)
  usePageMeta({
    title: product ? `${product.name} | Maré Coral Fitwear` : 'Produto não encontrado | Maré Coral',
    description: product?.description ?? 'Conheça o primeiro drop da Maré Coral Fitwear.',
    image: product?.image,
  })

  if (!product && status === 'loading') {
    return <div className="store-page"><StoreHeader /><main className="not-found"><h1>Carregando a peça…</h1></main></div>
  }

  if (!product) {
    return (
      <div className="store-page"><StoreHeader /><main className="not-found"><h1>Essa peça mudou de maré.</h1><Link to="/">Voltar para a loja</Link></main></div>
    )
  }

  const labels = ['Frente', 'Costas', 'Detalhe']
  const media = labels.map((label, index) => ({
    label: product.imageLabels?.[gallery[index]] || label,
    image: gallery[index] || null,
    position: index === 0 ? product.imagePosition : undefined,
  }))

  return (
    <div className="store-page">
      <StoreHeader />
      <main className="product-page">
        <nav className="breadcrumbs" aria-label="Navegação estrutural">
          <Link to="/"><ArrowLeft size={15} /> Loja</Link><ChevronRight size={14} /><span>{product.category}</span><ChevronRight size={14} /><strong>{product.name}</strong>
        </nav>

        <section className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img src={activeImage} alt={`Coral apresentando ${product.name}`} style={{ objectPosition: activeImage === product.image ? product.imagePosition : '15% 44%' }} />
              <span>Foto cadastrada para {selectedColor}</span>
            </div>
            <div className="product-gallery__thumbs">
              {media.map((item) => item.image ? (
                <button className={activeImage === item.image ? 'is-active' : ''} type="button" key={item.label} onClick={() => setImageChoice(item.image!)}>
                  <img src={item.image} alt="" style={{ objectPosition: item.position }} /><span>{item.label}</span>
                </button>
              ) : (
                <div className="product-gallery__pending" key={item.label}><span>{item.label}</span><small>Foto pendente</small></div>
              ))}
            </div>
          </div>

          <div className="product-buybox">
            <p className="eyebrow"><Sparkles size={17} /> {product.sport} · {product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-buybox__description">{product.description}</p>
            <div className="product-buybox__price"><strong>{formatPrice(selectedPrice)}</strong><span>Pagamento conforme disponibilidade no checkout</span></div>

            <fieldset className="option-picker">
              <legend>Cor: <strong>{selectedColor}</strong></legend>
              <div>{product.colors.map((color) => {
                const available = colorHasStock(product, color)
                return <button className={selectedColor === color ? 'is-selected' : ''} disabled={!available} type="button" key={color} onClick={() => { setColorChoice(color); setSizeChoice(''); setImageChoice('') }}><i className="color-dot" style={{ backgroundColor: product.colorHexByName?.[color] }} />{color}</button>
              })}</div>
            </fieldset>
            <fieldset className="option-picker option-picker--sizes">
              <legend>Tamanho: <strong>{selectedSize}</strong> <button type="button" aria-expanded={showSizeGuide} aria-controls="size-guide" onClick={() => setShowSizeGuide(!showSizeGuide)}>Guia de medidas</button></legend>
              <div>{product.sizes.map((size) => {
                const available = getOptionStock(product, selectedColor, size)
                return <button className={selectedSize === size ? 'is-selected' : ''} disabled={available <= 0} type="button" key={size} onClick={() => setSizeChoice(size)}>{size}</button>
              })}</div>
            </fieldset>

            {showSizeGuide && <div id="size-guide" className="checkout-notice" role="status"><p>As medidas desta peça ainda precisam ser confirmadas. Não escolha o tamanho com base apenas nas imagens da Coral; consulte o atendimento antes da compra.</p></div>}

            <p className={`product-stock ${selectedStock > 0 ? 'product-stock--available' : 'product-stock--sold-out'}`}>
              {selectedStock > 0 ? `${selectedStock} ${selectedStock === 1 ? 'unidade disponível' : 'unidades disponíveis'} nesta combinação` : 'Combinação esgotada'}
            </p>

            <button className="button button--primary product-buybox__add" disabled={selectedStock <= 0} type="button" onClick={() => addItem({ productId: product.id, color: selectedColor, size: selectedSize })}>
              <ShoppingBag size={19} /> {selectedStock > 0 ? 'Adicionar à sacola' : 'Produto esgotado'}
            </button>

            <ul className="product-assurances">
              <li><PackageCheck /><span><strong>Postagem rápida</strong>Em até 2 dias úteis</span></li>
              <li><Truck /><span><strong>Todo o Brasil</strong>Frete calculado no checkout</span></li>
              <li><ShieldCheck /><span><strong>Compra segura</strong>Seus dados protegidos</span></li>
            </ul>

            <div className="product-specs">
              <details open><summary>Detalhes da peça</summary><p>{product.fit}. {product.fabric}.</p></details>
              <details><summary>Cuidados</summary><p>{product.careInstructions || 'Lavar à mão ou em ciclo delicado, com cores semelhantes. Não usar alvejante nem secadora.'}</p></details>
              <details><summary>Trocas e devoluções</summary><p>Direito de arrependimento em até 7 dias corridos após o recebimento. Política completa disponível no rodapé.</p></details>
            </div>
          </div>
        </section>

        <section className="related-products">
          <p className="eyebrow">Continue nessa maré</p>
          <h2>Combine com o seu movimento.</h2>
          <div>{related.map((item) => <Link to={`/produto/${item.slug}`} key={item.id}><img src={item.image} alt="" style={{ objectPosition: item.imagePosition }} /><span>{item.name}</span><strong>{formatPrice(item.price)}</strong></Link>)}</div>
        </section>
      </main>
    </div>
  )
}

export default ProductPage
