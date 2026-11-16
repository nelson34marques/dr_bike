import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react'
import ImageSlot from '../components/ImageSlot'
import { fmtPrice } from '../config/site'
import { useCart } from '../context/CartContext'

export default function Carrinho() {
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="container-x py-16 text-center sm:py-24">
        <ShoppingCart size={48} className="mx-auto text-fg-3" strokeWidth={1.5} />
        <h1 className="mt-5 text-3xl sm:text-4xl">O carrinho está vazio</h1>
        <Link to="/loja" className="btn btn-primary mt-6">Ir para a loja <ArrowRight size={18} /></Link>
      </div>
    )
  }

  return (
    <div className="container-x py-8 sm:py-12">
      <span className="eyebrow">Loja</span>
      <h1 className="mt-2 text-4xl leading-none sm:text-5xl">Carrinho</h1>

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {cart.items.map((i) => (
            <li key={i.id} className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link to={`/produto/${i.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-line sm:h-24 sm:w-24">
                <ImageSlot src={i.image} alt={i.name} label="" iconSize={22} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/produto/${i.id}`} className="line-clamp-2 font-display text-base font-bold uppercase leading-tight tracking-wide hover:text-brand sm:text-lg">{i.name}</Link>
                <span className="mt-1 text-sm text-fg-2">{fmtPrice(i.price)} / un.</span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center rounded-sm border border-line-2">
                    <button className="px-2.5 py-2 text-fg-2 hover:text-fg" onClick={() => cart.setQty(i.id, i.qty - 1)} aria-label="Menos"><Minus size={14} /></button>
                    <span className="w-8 text-center font-display font-bold">{i.qty}</span>
                    <button className="px-2.5 py-2 text-fg-2 hover:text-fg" onClick={() => cart.setQty(i.id, Math.min(i.stock || 99, i.qty + 1))} aria-label="Mais"><Plus size={14} /></button>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-display text-lg font-bold text-brand sm:text-xl">{fmtPrice(i.price * i.qty)}</span>
                    <button className="text-fg-3 hover:text-bad" onClick={() => cart.remove(i.id)} aria-label="Remover"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card h-fit p-5 sm:p-6">
          <h2 className="text-2xl">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm text-fg-2">
            <div className="flex justify-between"><dt>Artigos</dt><dd>{cart.count}</dd></div>
            <div className="flex justify-between"><dt>Entrega</dt><dd>A combinar</dd></div>
          </dl>
          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <span className="font-display font-bold uppercase tracking-wider">Total</span>
            <span className="font-display text-2xl font-extrabold text-brand sm:text-3xl">{fmtPrice(cart.total)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-lg mt-6 w-full justify-center">Finalizar encomenda <ArrowRight size={18} /></Link>
          <Link to="/loja" className="btn btn-ghost mt-2 w-full justify-center">Continuar a comprar</Link>
        </aside>
      </div>
    </div>
  )
}
