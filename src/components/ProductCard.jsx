import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import ImageSlot from './ImageSlot'
import { categories, fmtPrice } from '../config/site'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ p }) {
  const cart = useCart()
  const toast = useToast()
  const cat = categories.find((c) => c.id === p.category)
  const inCart = cart.items.some((i) => i.id === p.id)
  const out = (p.stock ?? 0) <= 0

  return (
    <article className="card card-hover group flex min-w-0 flex-col transition-colors hover:border-line-2 hover:bg-ink-3">
      <Link to={`/produto/${p.id}`} className="relative block aspect-[4/3] overflow-hidden border-b border-line">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ImageSlot src={p.images?.[0]} alt={p.name} />
        </div>
        {out && <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-fg-2">Esgotado</span>}
        {p.featured && !out && <span className="absolute left-3 top-3 rounded-sm bg-brand px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-ink">Destaque</span>}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <span className="eyebrow text-xs">{cat?.label || p.category}</span>
        <Link to={`/produto/${p.id}`} className="mt-1 line-clamp-2 font-display text-base font-bold uppercase leading-tight tracking-wide hover:text-brand sm:text-lg">
          {p.name}
        </Link>
        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-4">
          <span className="font-display text-xl font-extrabold text-brand sm:text-2xl">{fmtPrice(p.price)}</span>
          <button
            className={`btn btn-sm w-full justify-center px-2 text-xs sm:w-auto sm:px-3 sm:text-sm ${inCart ? 'btn-outline' : 'btn-primary'}`}
            disabled={out}
            onClick={() => {
              cart.add(p)
              toast(`${p.name} adicionado ao carrinho`)
            }}
            aria-label={`Adicionar ${p.name} ao carrinho`}
          >
            {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
            {inCart ? 'No carrinho' : 'Adicionar'}
          </button>
        </div>
      </div>
    </article>
  )
}
