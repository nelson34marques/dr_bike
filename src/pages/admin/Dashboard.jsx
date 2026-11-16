import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, CalendarCheck, AlertTriangle, ArrowRight } from 'lucide-react'
import { Loading } from '../../components/Guards'
import StatusBadge from '../../components/StatusBadge'
import { fmtPrice, services } from '../../config/site'
import { listProducts, listOrders, listAppointments } from '../../lib/db'

export default function Dashboard() {
  const [d, setD] = useState(null)
  useEffect(() => {
    Promise.all([listProducts(), listOrders(), listAppointments()]).then(([products, orders, appts]) => setD({ products, orders, appts }))
  }, [])
  if (!d) return <Loading />

  const low = d.products.filter((p) => (p.stock ?? 0) <= 2)
  const pendingOrders = d.orders.filter((o) => o.status === 'pendente')
  const pendingAppts = d.appts.filter((a) => a.status === 'pendente')
  const revenue = d.orders.filter((o) => ['entregue', 'pronto', 'confirmado'].includes(o.status)).reduce((n, o) => n + o.total, 0)

  const stats = [
    { icon: Package, label: 'Produtos', value: d.products.length, to: '/admin/produtos' },
    { icon: ShoppingBag, label: 'Encomendas pendentes', value: pendingOrders.length, to: '/admin/encomendas' },
    { icon: CalendarCheck, label: 'Marcações pendentes', value: pendingAppts.length, to: '/admin/marcacoes' },
    { icon: AlertTriangle, label: 'Stock baixo', value: low.length, to: '/admin/produtos' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: I, label, value, to }) => (
          <Link key={label} to={to} className="card p-5 transition-colors hover:border-brand">
            <I size={22} className="text-brand" />
            <div className="mt-3 font-display text-4xl font-extrabold">{value}</div>
            <div className="text-sm text-fg-2">{label}</div>
          </Link>
        ))}
      </div>

      <div className="card p-5">
        <span className="text-sm text-fg-2">Vendas confirmadas</span>
        <div className="font-display text-4xl font-extrabold text-brand">{fmtPrice(revenue)}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Últimas encomendas</h2>
            <Link to="/admin/encomendas" className="text-sm text-brand">Ver todas <ArrowRight size={14} className="inline" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-line text-sm">
            {d.orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-fg-2">{o.customer?.name} · {fmtPrice(o.total)}</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
            {d.orders.length === 0 && <li className="py-2 text-fg-3">Sem encomendas.</li>}
          </ul>
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Próximas marcações</h2>
            <Link to="/admin/marcacoes" className="text-sm text-brand">Ver todas <ArrowRight size={14} className="inline" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-line text-sm">
            {d.appts.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-fg-2">{a.date} · {a.name} · {services.find((s) => s.id === a.service)?.title || a.service}</span>
                <StatusBadge status={a.status} />
              </li>
            ))}
            {d.appts.length === 0 && <li className="py-2 text-fg-3">Sem marcações.</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}
