import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.tsx'
import { useCatalog } from '../context/CatalogContext.tsx'
import { formatPrice, getColorImage, getOptionPrice, getOptionStock } from '../data/products.ts'

function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart()
  const { products } = useCatalog()

  return (
    <div className={`cart-layer ${isOpen ? 'cart-layer--open' : ''}`} aria-hidden={!isOpen}>
      <button className="cart-layer__backdrop" type="button" onClick={closeCart} aria-label="Fechar sacola" />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Sacola de compras">
        <header>
          <div><ShoppingBag size={20} /><strong>Sua sacola</strong></div>
          <button type="button" onClick={closeCart} aria-label="Fechar sacola"><X /></button>
        </header>
        {lines.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={34} />
            <h2>A sacola está leve.</h2>
            <p>Escolha uma peça do primeiro drop para sentir essa maré.</p>
            <button type="button" onClick={closeCart}>Continuar comprando</button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => {
                const product = products.find((candidate) => candidate.id === line.productId)
                if (!product) return null
                const identity = { productId: line.productId, color: line.color, size: line.size }
                const available = getOptionStock(product, line.color, line.size)
                const unitPrice = getOptionPrice(product, line.color, line.size)
                const image = getColorImage(product, line.color) || product.image
                return (
                  <article className="cart-line" key={`${line.productId}-${line.color}-${line.size}`}>
                    <img src={image} alt="" style={{ objectPosition: product.imagePosition }} />
                    <div className="cart-line__copy">
                      <strong>{product.name}</strong>
                      <span>{line.color} · {line.size}</span>
                      <b>{formatPrice(unitPrice * line.quantity)}</b>
                      <small>{available} {available === 1 ? 'unidade disponível' : 'unidades disponíveis'}</small>
                      <div className="quantity-control">
                        <button type="button" onClick={() => updateQuantity(identity, line.quantity - 1)} aria-label="Diminuir quantidade"><Minus size={14} /></button>
                        <span>{line.quantity}</span>
                        <button type="button" disabled={line.quantity >= available} onClick={() => updateQuantity(identity, line.quantity + 1)} aria-label="Aumentar quantidade"><Plus size={14} /></button>
                      </div>
                    </div>
                    <button className="cart-line__remove" type="button" onClick={() => removeItem(identity)} aria-label={`Remover ${product.name}`}><Trash2 size={17} /></button>
                  </article>
                )
              })}
            </div>
            <footer className="cart-summary">
              <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>Frete calculado no checkout. Postagem em até 2 dias úteis.</p>
              <Link className="button button--primary" to="/checkout" onClick={closeCart}>Ir para o checkout</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
