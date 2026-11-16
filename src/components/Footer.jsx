import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { InstagramIcon, FacebookIcon } from './Social'
import { site, categories, waLink } from '../config/site'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-6 border-t border-line bg-ink-2 md:mt-24">
      <div className="container-x hidden gap-10 py-14 md:grid md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-fg-2">
            Oficina especializada em bicicletas, motos elétricas, baterias e cadeiras de rodas. Peças, acessórios e assistência técnica.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" aria-label="Instagram"><InstagramIcon /></a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" aria-label="Facebook"><FacebookIcon /></a>
            <a href={waLink('Olá! Gostaria de mais informações.')} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" aria-label="WhatsApp"><MessageCircle size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-lg">Loja</h4>
          <ul className="space-y-2 text-sm text-fg-2">
            {categories.map((c) => (
              <li key={c.id}><Link to={`/loja?categoria=${c.id}`} className="hover:text-brand">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg">Navegação</h4>
          <ul className="space-y-2 text-sm text-fg-2">
            <li><Link to="/servicos" className="hover:text-brand">Serviços</Link></li>
            <li><Link to="/marcacao" className="hover:text-brand">Marcar assistência</Link></li>
            <li><Link to="/loja" className="hover:text-brand">Todos os produtos</Link></li>
            <li><Link to="/conta" className="hover:text-brand">A minha conta</Link></li>
            <li><Link to="/contactos" className="hover:text-brand">Contactos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg">Contactos</h4>
          <ul className="space-y-3 text-sm text-fg-2">
            <li className="flex gap-2.5"><MapPin size={18} className="shrink-0 text-brand" /><span>{site.address}</span></li>
            <li className="flex gap-2.5"><Phone size={18} className="shrink-0 text-brand" /><a href={`tel:${site.whatsapp}`} className="hover:text-brand">{site.phoneDisplay}</a></li>
            <li className="flex gap-2.5"><Mail size={18} className="shrink-0 text-brand" /><a href={`mailto:${site.email}`} className="hover:text-brand">{site.email}</a></li>
            <li className="flex gap-2.5">
              <Clock size={18} className="shrink-0 text-brand" />
              <div>{site.hours.map((h) => <div key={h.d}><span className="text-fg">{h.d}:</span> {h.h}</div>)}</div>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-line md:border-t">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-4 text-xs text-fg-3 sm:flex-row md:py-5">
          <span>© {year} {site.name}. Todos os direitos reservados.</span>
          <span className="font-display uppercase tracking-widest">Oficina · Loja · Assistência</span>
        </div>
      </div>
    </footer>
  )
}
