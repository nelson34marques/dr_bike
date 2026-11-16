import { ImageIcon } from 'lucide-react'

// Espaço reservado para imagem. Mostra a imagem se existir; caso contrário um frame neutro.
export default function ImageSlot({ src, alt = '', className = '', label = 'Imagem', iconSize = 28 }) {
  if (src) {
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />
  }
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-3 text-fg-3 ${className}`}>
      <ImageIcon size={iconSize} strokeWidth={1.5} aria-hidden="true" />
      <span className="font-display text-xs font-semibold uppercase tracking-widest">{label}</span>
    </div>
  )
}


