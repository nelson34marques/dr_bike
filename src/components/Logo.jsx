import { Link } from 'react-router-dom'
import { site } from '../config/site'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label={site.name}>
      <span className="grid h-9 w-9 place-items-center rounded-sm bg-brand">
        <svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true">
          <path d="M14 44 L24 24 L32 36 L40 24 L50 44" fill="none" stroke="var(--color-on-brand)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-wide">
        Dr.<span className="text-brand">Bike</span>
      </span>
    </Link>
  )
}


