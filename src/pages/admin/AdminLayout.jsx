import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, CalendarCheck, ArrowLeft, Info } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const tabs = [
  { to: '/admin', label: 'Resumo', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/encomendas', label: 'Encomendas', icon: ShoppingBag },
  { to: '/admin/marcacoes', label: 'Marcações', icon: CalendarCheck },
]

export default function AdminLayout() {
  const { isDemo } = useAuth()
  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Painel</span>
          <h1 className="mt-2 text-5xl leading-none">Administração</h1>
        </div>
        <Link to="/" className="btn btn-ghost btn-sm"><ArrowLeft size={16} /> Ver site</Link>
      </div>

      {isDemo && (
        <div className="mt-5 flex gap-2 rounded-sm border border-brand/40 bg-brand/10 p-3 text-xs text-fg-2">
          <Info size={16} className="shrink-0 text-brand" />
          <span>Modo demo: as alterações ficam só em memória e perdem-se ao recarregar a página. Configura o Firebase no ficheiro .env para persistir.</span>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" aria-label="Admin">
          <div className="flex gap-1 lg:flex-col">
            {tabs.map(({ to, label, icon: I, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 whitespace-nowrap rounded-sm px-3.5 py-2.5 font-display font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? 'bg-brand text-on-brand' : 'text-fg-2 hover:bg-ink-3 hover:text-fg'
                  }`
                }
              >
                <I size={18} /> {label}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
