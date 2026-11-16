import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
const KEY = 'drbike.cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const api = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add: (p, qty = 1) =>
        setItems((cur) => {
          const i = cur.findIndex((x) => x.id === p.id)
          if (i >= 0) return cur.map((x, k) => (k === i ? { ...x, qty: Math.min(x.qty + qty, p.stock ?? 99) } : x))
          return [...cur, { id: p.id, name: p.name, price: p.price, image: p.images?.[0] || null, stock: p.stock, qty }]
        }),
      setQty: (id, qty) => setItems((cur) => cur.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
      remove: (id) => setItems((cur) => cur.filter((x) => x.id !== id)),
      clear: () => setItems([]),
    }),
    [items],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
