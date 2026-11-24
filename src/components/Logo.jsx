import { Link } from 'react-router-dom'
import { site } from '../config/site'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`} aria-label={site.name}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-brand sm:h-9 sm:w-9">
        <svg viewBox="0 0 64 64" width="24" height="24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <path d="M14 44 L24 24 L32 36 L40 24 L50 44" fill="none" stroke="var(--color-on-brand)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="truncate font-display text-xl font-extrabold uppercase leading-none tracking-wide sm:text-2xl">
        Dr.<span className="text-brand">Bike</span>
      </span>
    </Link>
  )
}


