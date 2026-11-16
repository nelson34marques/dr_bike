import { useEffect, useState } from 'react'
import { MessageCircle, Phone, Truck } from 'lucide-react'
import { Loading } from '../../components/Guards'
import StatusBadge, { APPT_STATUSES, STATUS } from '../../components/StatusBadge'
import { services, categories } from '../../config/site'
import { listAppointments, updateAppointmentStatus } from '../../lib/db'
import { useToast } from '../../context/ToastContext'

export default function Marcacoes() {
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState('')
  const toast = useToast()
  const reload = () => listAppointments().then(setList)
  useEffect(() => {
    reload()
  }, [])

  const change = async (id, status) => {
    await updateAppointmentStatus(id, status)
    toast('Estado actualizado')
    reload()
  }

  if (!list) return <Loading />
  const shown = (filter ? list.filter((a) => a.status === filter) : list).slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Marcações <span className="text-fg-3">({list.length})</span></h2>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos os estados</option>
          {APPT_STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </select>
      </div>

      <ul className="mt-5 space-y-3">
        {shown.map((a) => (
          <li key={a.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-sm uppercase tracking-widest text-brand">{a.date} · {a.period === 'manha' ? 'Manhã' : 'Tarde'}</div>
                <div className="mt-1 font-display text-xl font-bold uppercase tracking-wide">{a.name}</div>
                <div className="text-sm text-fg-2">
                  {services.find((s) => s.id === a.service)?.title || a.service} · {categories.find((c) => c.id === a.vehicle)?.label || a.vehicle}
                </div>
                {a.pickup && <span className="mt-1 inline-flex items-center gap-1 text-xs text-warn"><Truck size={14} /> Recolha ao domicílio</span>}
                {a.notes && <p className="mt-2 text-sm text-fg-3">{a.notes}</p>}
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select className="input w-auto" value={a.status} onChange={(e) => change(a.id, e.target.value)} aria-label="Estado">
                {APPT_STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
              {a.phone && (
                <>
                  <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><MessageCircle size={16} /> WhatsApp</a>
                  <a href={`tel:${a.phone}`} className="btn btn-ghost btn-sm"><Phone size={16} /> Ligar</a>
                </>
              )}
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="card p-8 text-center text-fg-3">Sem marcações.</li>}
      </ul>
    </div>
  )
}
