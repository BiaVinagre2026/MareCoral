import { Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.tsx'
import BrandMark from './BrandMark.tsx'

function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, openCart } = useCart()

  return (
    <>
      <div className="announcement">
        <span>Envio para todo o Brasil</span>
        <span className="announcement__dot" aria-hidden="true" />
        <strong>Postagem em até 2 dias úteis</strong>
      </div>
      <header className="site-header store-header">
        <Link className="brand-link" to="/" aria-label="Maré Coral — início"><BrandMark /></Link>
        <nav id="store-navigation" className={`desktop-nav ${menuOpen ? 'desktop-nav--open' : ''}`} aria-label="Navegação da loja">
          <Link to="/#loja" onClick={() => setMenuOpen(false)}>Loja</Link>
          <Link to="/#colecoes" onClick={() => setMenuOpen(false)}>Modalidades</Link>
          <Link to="/#coral" onClick={() => setMenuOpen(false)}>Coral</Link>
        </nav>
        <div className="store-header__actions">
          <button className="nav-cta nav-cart" type="button" onClick={openCart} aria-label={`Abrir sacola com ${itemCount} itens`}>
            <ShoppingBag size={17} /> <span>{itemCount}</span>
          </button>
          <button className="menu-button" type="button" aria-controls="store-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  )
}

export default StoreHeader
