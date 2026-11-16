import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, MessageCircle } from 'lucide-react'
import Icon from '../components/Icon'
import SectionHead from '../components/SectionHead'
import { services, fmtPrice, waLink } from '../config/site'

export default function Servicos() {
  return (
    <div className="container-x py-10 sm:py-16">
      <SectionHead
        eyebrow="Oficina"
        title="Serviços e assistência"
        text="Todos os serviços incluem diagnóstico e orçamento antes de qualquer intervenção. Os preços indicados são valores mínimos de mão-de-obra."
        action={<Link to="/marcacao" className="btn btn-primary"><CalendarCheck size={18} /> Marcar agora</Link>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-ink-3 text-brand sm:h-14 sm:w-14"><Icon name={s.icon} size={26} /></span>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-fg-2">{s.desc}</p>
              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-fg-3">Desde <span className="font-display text-lg font-bold text-fg sm:text-xl">{fmtPrice(s.from)}</span></span>
                <div className="flex gap-2">
                  <a href={waLink(`Olá! Queria um orçamento para: ${s.title}.`)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm flex-1 justify-center sm:flex-none"><MessageCircle size={16} /> Orçamento</a>
                  <Link to={`/marcacao?servico=${s.id}`} className="btn btn-outline btn-sm flex-1 justify-center sm:flex-none">Marcar <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
