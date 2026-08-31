import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LegalPage from './pages/LegalPage.tsx'
import ProductPage from './pages/ProductPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import CartDrawer from './components/CartDrawer.tsx'
import CartProvider from './context/CartContext.tsx'
import CatalogProvider from './context/CatalogContext.tsx'

function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/politica-de-privacidade" element={<LegalPage type="privacy" />} />
          <Route path="/trocas-e-devolucoes" element={<LegalPage type="exchanges" />} />
        </Routes>
        <CartDrawer />
      </CartProvider>
    </CatalogProvider>
  )
}

export default App
