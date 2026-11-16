import { MessageCircle } from 'lucide-react'
import { waLink } from '../config/site'

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink('Olá Dr. Bike! Gostaria de falar convosco.')}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-brand text-ink transition-colors hover:bg-brand-2 md:h-auto md:w-auto md:gap-2 md:rounded-sm md:px-4 md:py-3"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden font-display font-bold uppercase tracking-wider md:inline">WhatsApp</span>
    </a>
  )
}


