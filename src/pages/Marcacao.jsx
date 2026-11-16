import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarCheck, MessageCircle, CheckCircle2, Clock, Phone } from 'lucide-react'
import { categories, services, site, waLink } from '../config/site'
import { createAppointment } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const today = () => new Date().toISOString().slice(0, 10)

export default function Marcacao() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const toast = useToast()
  const [done, setDone] = useState(null)
  const [sending, setSending] = useState(false)
  const [f, setF] = useState({
    name: user?.displayName || '',
    phone: '',
    vehicle: '',
    service: params.get('servico') || '',
    date: '',
    period: 'manha',
    notes: '',
    pickup: false,
  })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const message = (id) => {
    const s = services.find((x) => x.id === f.service)?.title || f.service
    const v = categories.find((x) => x.id === f.vehicle)?.label || f.vehicle
    return [
      `Olá Dr. Bike! Quero marcar assistência.`,
      `Nome: ${f.name}`,
      `Telefone: ${f.phone}`,
      `Veículo: ${v}`,
      `Serviço: ${s}`,
      `Data: ${f.date} (${f.period === 'manha' ? 'manhã' : 'tarde'})`,
      f.pickup ? 'Pretendo recolha ao domicílio.' : 'Levo o veículo à oficina.',
      f.notes ? `Notas: ${f.notes}` : '',
      id ? `Ref.: ${id}` : '',
    ].filter(Boolean).join('\n')
  }

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const id = await createAppointment({ ...f, uid: user?.uid || null, email: user?.email || null })
      setDone(id)
      toast('Marcação registada')
    } catch (err) {
      toast(err.message || 'Erro ao registar', 'err')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="container-x max-w-2xl py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-brand" />
        <h1 className="mt-6 text-5xl">Marcação recebida</h1>
        <p className="mt-4 text-fg-2">
          Vamos confirmar a data por telefone ou WhatsApp. Para acelerar, envia-nos já a marcação pelo WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink(message(done))} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg"><MessageCircle size={20} /> Enviar por WhatsApp</a>
          <Link to="/" className="btn btn-outline btn-lg">Voltar ao início</Link>
        </div>
        <p className="mt-8 font-display text-sm uppercase tracking-widest text-fg-3">Referência: {done}</p>
      </div>
    )
  }

  return (
    <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_360px]">
      <div>
        <span className="eyebrow">Oficina</span>
        <h1 className="mt-2 text-5xl leading-none sm:text-6xl">Marcar assistência</h1>
        <p className="mt-3 max-w-xl text-fg-2">Preenche os dados e confirmamos a tua marcação. Sem compromisso: o orçamento é sempre apresentado antes da reparação.</p>

        <form onSubmit={submit} className="card mt-8 grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" className="input" required value={f.name} onChange={set('name')} placeholder="O teu nome" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Telefone / WhatsApp</label>
            <input id="phone" className="input" required type="tel" value={f.phone} onChange={set('phone')} placeholder="9xx xxx xxx" />
          </div>
          <div>
            <label className="label" htmlFor="vehicle">Tipo de veículo</label>
            <select id="vehicle" className="input appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%238a8a85%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]" required value={f.vehicle} onChange={set('vehicle')}>
              <option value="">Seleccionar</option>
              {categories.filter((c) => !['pecas', 'acessorios'].includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="service">Serviço</label>
            <select id="service" className="input appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%238a8a85%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]" required value={f.service} onChange={set('service')}>
              <option value="">Seleccionar</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              <option value="outro">Outro / não sei</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="date">Data pretendida</label>
            <input id="date" className="input" required type="date" min={today()} value={f.date} onChange={set('date')} />
          </div>
          <div>
            <span className="label">Período</span>
            <div className="grid grid-cols-2 gap-2">
              {[['manha', 'Manhã'], ['tarde', 'Tarde']].map(([v, l]) => (
                <button type="button" key={v} onClick={() => setF((x) => ({ ...x, period: v }))} className={`btn ${f.period === v ? 'btn-primary' : 'btn-outline'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Descreve o problema</label>
            <textarea id="notes" className="input min-h-28 resize-none" value={f.notes} onChange={set('notes')} placeholder="Ex.: a bateria não carrega até ao fim; travão traseiro a raspar" />
          </div>
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input type="checkbox" checked={f.pickup} onChange={set('pickup')} className="h-4 w-4 accent-brand" />
            Quero recolha ao domicílio (custo confirmado por WhatsApp)
          </label>
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button className="btn btn-primary btn-lg w-full justify-center sm:flex-1" disabled={sending}><CalendarCheck size={20} /> Confirmar marcação</button>
            <a href={waLink(message())} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg w-full justify-center sm:flex-1"><MessageCircle size={20} /> Enviar só por WhatsApp</a>
          </div>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <Clock size={24} className="text-brand" />
          <h3 className="mt-3 text-xl">Horário</h3>
          <ul className="mt-2 space-y-1 text-sm text-fg-2">
            {site.hours.map((h) => <li key={h.d}><span className="text-fg">{h.d}</span> · {h.h}</li>)}
          </ul>
        </div>
        <div className="card p-6">
          <Phone size={24} className="text-brand" />
          <h3 className="mt-3 text-xl">Urgente?</h3>
          <p className="mt-2 text-sm text-fg-2">Liga directamente ou envia mensagem no WhatsApp.</p>
          <a href={`tel:${site.whatsapp}`} className="mt-3 inline-block font-display text-lg font-bold text-brand">{site.phoneDisplay}</a>
        </div>
      </aside>
    </div>
  )
}
