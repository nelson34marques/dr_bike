export const STATUS = {
  pendente: { label: 'Pendente', cls: 'border-warn/50 text-warn' },
  confirmado: { label: 'Confirmado', cls: 'border-brand/60 text-brand' },
  em_curso: { label: 'Em curso', cls: 'border-brand/60 text-brand' },
  pronto: { label: 'Pronto', cls: 'border-ok/50 text-ok' },
  entregue: { label: 'Entregue', cls: 'border-ok/50 text-ok' },
  concluido: { label: 'Concluído', cls: 'border-ok/50 text-ok' },
  cancelado: { label: 'Cancelado', cls: 'border-bad/50 text-bad' },
}

export const ORDER_STATUSES = ['pendente', 'confirmado', 'pronto', 'entregue', 'cancelado']
export const APPT_STATUSES = ['pendente', 'confirmado', 'em_curso', 'concluido', 'cancelado']

export default function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, cls: 'border-line-2 text-fg-2' }
  return <span className={`tag shrink-0 ${s.cls}`}>{s.label}</span>
}
