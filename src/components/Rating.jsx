import { useState } from 'react'
import { Star } from 'lucide-react'

const LABELS = { 1: 'Mau', 2: 'Fraco', 3: 'Razoável', 4: 'Bom', 5: 'Excelente' }

export function Stars({ value = 0, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-brand text-brand' : 'text-line-2'} />
      ))}
    </span>
  )
}

export function StarPicker({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="flex items-center gap-2">
      <div className="flex" role="radiogroup" aria-label="Classificação" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`${n} estrelas`}
          >
            <Star size={size} className={`transition-colors ${n <= shown ? 'fill-brand text-brand' : 'text-line-2'}`} />
          </button>
        ))}
      </div>
      <span className="font-display text-xs font-bold uppercase tracking-wider text-fg-2">{LABELS[shown]}</span>
    </div>
  )
}
