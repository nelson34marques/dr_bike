import { Zap } from 'lucide-react'

// Faixa de texto em movimento contínuo (estilo motorsport).
export default function Ticker({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`ticker overflow-hidden border-y border-on-brand bg-brand text-on-brand ${className}`} aria-hidden="true">
      <div className="ticker-track flex w-max items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-5 px-5 py-3 font-display text-lg font-extrabold uppercase tracking-widest">
            {t}
            <Zap size={16} className="fill-on-brand" />
          </span>
        ))}
      </div>
    </div>
  )
}


