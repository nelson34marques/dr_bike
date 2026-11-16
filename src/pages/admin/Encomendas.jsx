import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { Loading } from '../../components/Guards'
import StatusBadge, { ORDER_STATUSES, STATUS } from '../../components/StatusBadge'
import { fmtPrice } from '../../config/site'
import { listOrders, updateOrderStatus } from '../../lib/db'
import { useToast } from '../../context/ToastContext'

export default function Encomendas() {
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState('')
  const toast = useToast()
  const reload = () => listOrders().then(setList)
  useEffect(() => {
    reload()
  }, [])

  const change = async (id, status) => {
    await updateOrderStatus(id, status)
    toast('Estado actualizado')
    reload()
  }

  if (!list) return <Loading />
  const shown = filter ? list.filter((o) => o.status === filter) : list

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Encomendas <span className="text-fg-3">({list.length})</span></h2>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos os estados</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </select>
      </div>

      <ul className="mt-5 space-y-3">
        {shown.map((o) => (
          <li key={o.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-sm uppercase tracking-widest text-fg-3">#{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleString('pt-PT')}</div>
                <div className="mt-1 font-display text-xl font-bold uppercase tracking-wide">{o.customer?.name}</div>
                <div className="text-sm text-fg-2">
                  {o.customer?.phone} · {o.customer?.delivery === 'casa' ? `Entrega: ${o.customer.address}` : 'Levantamento na loja'}
                </div>
                {o.customer?.notes && <p className="mt-1 text-sm text-fg-3">Notas: {o.customer.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-display text-2xl font-extrabold text-brand">{fmtPrice(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </div>
            <ul className="mt-3 border-t border-line pt-3 text-sm text-fg-2">
              {o.items.map((i) => <li key={i.id} className="flex justify-between"><span>{i.qty}x {i.name}</span><span>{fmtPrice(i.price * i.qty)}</span></li>)}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select className="input w-auto" value={o.status} onChange={(e) => change(o.id, e.target.value)} aria-label="Estado">
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
              {o.customer?.phone && (
                <>
                  <a href={`https://wa.me/${o.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><MessageCircle size={16} /> WhatsApp</a>
                  <a href={`tel:${o.customer.phone}`} className="btn btn-ghost btn-sm"><Phone size={16} /> Ligar</a>
                </>
              )}
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="card p-8 text-center text-fg-3">Sem encomendas.</li>}
      </ul>
    </div>
  )
}
