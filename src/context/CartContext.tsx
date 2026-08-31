/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getOptionPrice, getOptionStock } from '../data/products.ts'
import { useCatalog } from './CatalogContext.tsx'

export type CartLine = {
  productId: string
  color: string
  size: string
  quantity: number
}

type AddItemInput = Omit<CartLine, 'quantity'> & { quantity?: number }

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  isOpen: boolean
  addItem: (item: AddItemInput) => void
  updateQuantity: (item: Omit<CartLine, 'quantity'>, quantity: number) => void
  removeItem: (item: Omit<CartLine, 'quantity'>) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'mare-coral-cart-v2'

const lineKey = (line: Omit<CartLine, 'quantity'>) => `${line.productId}:${line.color}:${line.size}`

function CartProvider({ children }: { children: ReactNode }) {
  const { products, status } = useCatalog()
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) as CartLine[] : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(lines))
  }, [lines])

  const visibleLines = status === 'loading'
    ? lines
    : lines.flatMap((line) => {
      const product = products.find((candidate) => candidate.id === line.productId)
      if (!product) return []
      const available = getOptionStock(product, line.color, line.size)
      return available > 0 ? [{ ...line, quantity: Math.min(line.quantity, available) }] : []
    })

  const addItem = (item: AddItemInput) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    if (!product) return
    const available = getOptionStock(product, item.color, item.size)
    if (available <= 0) return
    const quantity = item.quantity ?? 1
    setLines((current) => {
      const key = lineKey(item)
      const existing = current.find((line) => lineKey(line) === key)
      if (existing) {
        return current.map((line) => lineKey(line) === key
          ? { ...line, quantity: Math.min(line.quantity + quantity, available) }
          : line)
      }
      return [...current, { ...item, quantity: Math.min(quantity, available) }]
    })
    setIsOpen(true)
  }

  const removeItem = (item: Omit<CartLine, 'quantity'>) => {
    const key = lineKey(item)
    setLines((current) => current.filter((line) => lineKey(line) !== key))
  }

  const updateQuantity = (item: Omit<CartLine, 'quantity'>, quantity: number) => {
    if (quantity <= 0) {
      removeItem(item)
      return
    }
    const product = products.find((candidate) => candidate.id === item.productId)
    if (!product) return
    const available = getOptionStock(product, item.color, item.size)
    if (available <= 0) {
      removeItem(item)
      return
    }
    const key = lineKey(item)
    setLines((current) => current.map((line) => lineKey(line) === key
      ? { ...line, quantity: Math.min(quantity, available) }
      : line))
  }

  const value: CartContextValue = {
    lines: visibleLines,
    itemCount: visibleLines.reduce((total, line) => total + line.quantity, 0),
    subtotal: visibleLines.reduce((total, line) => {
      const product = products.find((candidate) => candidate.id === line.productId)
      return total + (product ? getOptionPrice(product, line.color, line.size) : 0) * line.quantity
    }, 0),
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: () => setLines([]),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart precisa ser usado dentro de CartProvider')
  return context
}

export default CartProvider
