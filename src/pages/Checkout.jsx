import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { MessageCircle, CheckCircle2, Store, Truck } from 'lucide-react'
import { fmtPrice, waLink } from '../config/site'
import { createOrder } from '../lib/db'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Checkout() {
  const cart = useCart()
  const { user } = useAuth()
  const toast = useToast()
  const [done, setDone] = useState(null)
  const [sending, setSending] = useState(false)
  const [f, setF] = useState({ name: user?.displayName || '', phone: '', delivery: 'loja', address: '', notes: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  if (cart.items.length === 0 && !done) return <Navigate to="/carrinho" replace />

  const buildMessage = (id, items, total) =>
    [
      `Olá Dr. Bike! Quero confirmar a encomenda ${id ? `#${id}` : ''}.`,
      ...items.map((i) => `• ${i.qty}x ${i.name} — ${fmtPrice(i.price * i.qty)}`),
      `Total: ${fmtPrice(total)}`,
      `Nome: ${f.name}`,
      `Telefone: ${f.phone}`,
      f.delivery === 'loja' ? 'Levantamento na loja.' : `Entrega em: ${f.address}`,
      f.notes ? `Notas: ${f.notes}` : '',
    ].filter(Boolean).join('\n')

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const snapshot = { items: cart.items.map(({ id, name, price, qty }) => ({ id, name, price, qty })), total: cart.total }
      const id = await createOrder({
        ...snapshot,
        uid: user?.uid || null,
        email: user?.email || null,
        customer: { name: f.name, phone: f.phone, delivery: f.delivery, address: f.address, notes: f.notes },
      })
      setDone({ id, ...snapshot })
      cart.clear()
      toast('Encomenda registada')
    } catch (err) {
      toast(err.message || 'Erro ao registar encomenda', 'err')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="container-x max-w-2xl py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-brand" />
        <h1 className="mt-6 text-5xl">Encomenda recebida</h1>
        <p className="mt-4 text-fg-2">Confirmamos a disponibilidade e o pagamento por WhatsApp. Envia-nos já o resumo para acelerar.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink(buildMessage(done.id, done.items, done.total))} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg"><MessageCircle size={20} /> Confirmar por WhatsApp</a>
          <Link to="/loja" className="btn btn-outline btn-lg">Voltar à loja</Link>
        </div>
        <p className="mt-8 font-display text-sm uppercase tracking-widest text-fg-3">Referência: {done.id}</p>
      </div>
    )
  }

  return (
    <div className="container-x py-12">
      <span className="eyebrow">Loja</span>
      <h1 className="mt-2 text-5xl leading-none">Finalizar encomenda</h1>
      {!user && (
        <p className="mt-3 text-sm text-fg-2">
          <Link to="/login" state={{ from: '/checkout' }} className="text-brand underline-offset-4 hover:underline">Entra na tua conta</Link> para acompanhar as tuas encomendas. Também podes continuar sem conta.
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="card grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" className="input" required value={f.name} onChange={set('name')} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Telefone / WhatsApp</label>
            <input id="phone" className="input" required type="tel" value={f.phone} onChange={set('phone')} placeholder="9xx xxx xxx" />
          </div>
          <div className="sm:col-span-2">
            <span className="label">Entrega</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ['loja', Store, 'Levantar na loja', 'Sem custo'],
                ['casa', Truck, 'Entrega ao domicílio', 'Custo a confirmar'],
              ].map(([v, I, t, d]) => (
                <button type="button" key={v} onClick={() => setF((x) => ({ ...x, delivery: v }))} className={`flex items-center gap-3 rounded-sm border p-4 text-left transition-colors ${f.delivery === v ? 'border-brand bg-ink-3' : 'border-line-2 hover:border-fg-3'}`}>
                  <I size={22} className={f.delivery === v ? 'text-brand' : 'text-fg-2'} />
                  <span>
                    <span className="block font-display font-bold uppercase tracking-wider">{t}</span>
                    <span className="block text-xs text-fg-3">{d}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {f.delivery === 'casa' && (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Morada de entrega</label>
              <input id="address" className="input" required value={f.address} onChange={set('address')} placeholder="Rua, bairro, município" />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Notas (opcional)</label>
            <textarea id="notes" className="input min-h-24" value={f.notes} onChange={set('notes')} />
          </div>
          <div className="sm:col-span-2">
            <button className="btn btn-primary btn-lg w-full sm:w-auto" disabled={sending}>Confirmar encomenda</button>
            <p className="mt-3 text-xs text-fg-3">O pagamento é combinado por WhatsApp (transferência, Multicaixa Express ou na loja).</p>
          </div>
        </form>

        <aside className="card h-fit p-6">
          <h2 className="text-2xl">Resumo</h2>
          <ul className="mt-4 divide-y divide-line text-sm">
            {cart.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 py-2">
                <span className="text-fg-2">{i.qty}x {i.name}</span>
                <span className="shrink-0 font-display font-bold">{fmtPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <span className="font-display font-bold uppercase tracking-wider">Total</span>
            <span className="font-display text-3xl font-extrabold text-brand">{fmtPrice(cart.total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
