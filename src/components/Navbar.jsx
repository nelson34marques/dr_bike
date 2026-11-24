import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut, Shield, CalendarCheck, Sun, Moon } from 'lucide-react'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/servicos', label: 'Serviços' },
  { to: '/loja', label: 'Loja' },
  { to: '/marcacao', label: 'Marcação' },
  { to: '/contactos', label: 'Contactos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const close = () => setOpen(false)

  const cls = ({ isActive }) =>
    `font-display text-base font-semibold uppercase tracking-wider transition-colors ${
      isActive ? 'text-brand' : 'text-fg-2 hover:text-fg'
    }`

    
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="h-1 stripe" />
      <div className="container-x grid h-[68px] grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6 lg:gap-10">
        <Logo className="min-w-0" />

        <nav className="hidden items-center justify-center gap-8 lg:flex" aria-label="Principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={cls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="col-start-3 flex items-center gap-0.5 sm:gap-2">
          <button onClick={toggle} className="btn btn-ghost btn-sm px-2 sm:px-3" title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'} aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAdmin && (
            <Link to="/admin" className="btn btn-ghost btn-sm hidden sm:inline-flex" title="Painel de admin">
              <Shield size={18} /> Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/conta" className="btn btn-ghost btn-sm px-2 sm:px-3" title="A minha conta">
                <User size={18} />
                <span className="hidden sm:inline">Conta</span>
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm hidden sm:inline-flex" title="Sair" aria-label="Sair">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm px-2 sm:px-3">
              <User size={18} />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
          <Link to="/carrinho" className="btn btn-ghost btn-sm relative px-2 sm:px-3" title="Carrinho" aria-label="Carrinho">
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 font-display text-xs font-bold text-on-brand">
                {count}
              </span>
            )}
          </Link>
          <span className="mx-1 hidden h-6 w-px bg-line-2 md:block" aria-hidden="true" />
          <Link to="/marcacao" className="btn btn-primary btn-sm hidden md:inline-flex">
            <CalendarCheck size={18} /> Marcar
          </Link>
          <button className="btn btn-ghost btn-sm px-2 sm:px-3 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-ink-2 lg:hidden" aria-label="Principal (móvel)">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={close} className={({ isActive }) => `${cls({ isActive })} border-b border-line py-3.5`}>
                {l.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" onClick={close} className={({ isActive }) => `${cls({ isActive })} border-b border-line py-3.5`}>
                Painel de admin
              </NavLink>
            )}
            {user && (
              <button onClick={() => { close(); logout() }} className="py-3.5 text-left font-display font-semibold uppercase tracking-wider text-fg-2">
                Sair
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
