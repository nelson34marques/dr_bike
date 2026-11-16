import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Package, CalendarCheck, Shield, MessageCircle } from 'lucide-react'
import { Loading } from '../components/Guards'
import StatusBadge from '../components/StatusBadge'
import { fmtPrice, services, categories, waLink } from '../config/site'
import { listOrders, listAppointments } from '../lib/db'
import { useAuth } from '../context/AuthContext'

export default function Conta() {
  const { user, isAdmin, logout } = useAuth()
  const [orders, setOrders] = useState(null)
  const [appts, setAppts] = useState(null)

  useEffect(() => {
    listOrders(user.uid).then(setOrders).catch(() => setOrders([]))
    listAppointments(user.uid).then(setAppts).catch(() => setAppts([]))
  }, [user.uid])

  return (
    <div className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">A minha conta</span>
          <h1 className="mt-2 text-5xl leading-none">Olá, {user.displayName || user.email}</h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && <Link to="/admin" className="btn btn-primary"><Shield size={18} /> Painel de admin</Link>}
          <button onClick={logout} className="btn btn-outline"><LogOut size={18} /> Sair</button>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="flex items-center gap-2 text-2xl"><Package size={22} className="text-brand" /> Encomendas</h2>
          {!orders ? <Loading /> : orders.length === 0 ? (
            <p className="card mt-4 p-6 text-sm text-fg-2">Ainda não tens encomendas. <Link to="/loja" className="text-brand">Ver loja</Link></p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-sm uppercase tracking-widest text-fg-3">#{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleDateString('pt-PT')}</div>
                      <div className="mt-1 font-display text-2xl font-extrabold text-brand">{fmtPrice(o.total)}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-fg-2">
                    {o.items.map((i) => <li key={i.id}>{i.qty}x {i.name}</li>)}
                  </ul>
                  <a href={waLink(`Olá! Queria saber o estado da encomenda #${o.id.slice(0, 8)}.`)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm mt-3 -ml-3 text-brand"><MessageCircle size={16} /> Falar sobre esta encomenda</a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl"><CalendarCheck size={22} className="text-brand" /> Marcações</h2>
          {!appts ? <Loading /> : appts.length === 0 ? (
            <p className="card mt-4 p-6 text-sm text-fg-2">Sem marcações. <Link to="/marcacao" className="text-brand">Marcar assistência</Link></p>
          ) : (
            <ul className="mt-4 space-y-3">
              {appts.map((a) => (
                <li key={a.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-xl font-bold uppercase tracking-wide">{services.find((s) => s.id === a.service)?.title || a.service}</div>
                      <div className="mt-1 text-sm text-fg-2">
                        {categories.find((c) => c.id === a.vehicle)?.label || a.vehicle} · {a.date} ({a.period === 'manha' ? 'manhã' : 'tarde'})
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  {a.notes && <p className="mt-3 text-sm text-fg-2">{a.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
