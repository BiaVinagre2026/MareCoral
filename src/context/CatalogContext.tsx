/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoProducts, type Product } from '../data/products.ts'
import { loadStorefront } from '../services/meuMostruarioApi.ts'

type CatalogStatus = 'loading' | 'connected' | 'demo' | 'error'

type CatalogContextValue = {
  products: Product[]
  status: CatalogStatus
  error: string
  allowOrder: boolean
  allowPayment: boolean
  getProductBySlug: (slug?: string) => Product | undefined
  reload: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)
const allowDemoCatalog = import.meta.env.VITE_ALLOW_DEMO_CATALOG !== 'false'

function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(allowDemoCatalog ? demoProducts : [])
  const [status, setStatus] = useState<CatalogStatus>('loading')
  const [error, setError] = useState('')
  const [allowOrder, setAllowOrder] = useState(false)
  const [allowPayment, setAllowPayment] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    loadStorefront()
      .then((storefront) => {
        if (!active) return
        setProducts(storefront.products)
        setError('')
        setAllowOrder(storefront.allowOrder)
        setAllowPayment(storefront.allowPayment)
        setStatus('connected')
      })
      .catch((reason: unknown) => {
        if (!active) return
        setError(reason instanceof Error ? reason.message : 'Não foi possível sincronizar o catálogo.')
        setStatus(allowDemoCatalog ? 'demo' : 'error')
      })

    return () => { active = false }
  }, [reloadKey])

  const value = useMemo<CatalogContextValue>(() => ({
    products,
    status,
    error,
    allowOrder,
    allowPayment,
    getProductBySlug: (slug?: string) => products.find((product) => product.slug === slug),
    reload: () => {
      setStatus('loading')
      setError('')
      setReloadKey((current) => current + 1)
    },
  }), [allowOrder, allowPayment, error, products, status])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog precisa ser usado dentro de CatalogProvider')
  return context
}

export default CatalogProvider
