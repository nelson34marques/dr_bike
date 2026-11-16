import { Bike, Zap, BatteryCharging, Accessibility, Cog, Package, CircleDot, Wrench, Circle } from 'lucide-react'

// Ícones referenciados por nome em src/config/site.js (categorias e serviços).
// Para usar outro ícone, importa-o aqui e adiciona-o ao mapa.
const icons = { Bike, Zap, BatteryCharging, Accessibility, Cog, Package, CircleDot, Wrench }

export default function Icon({ name, size = 20, className = '' }) {
  const C = icons[name] || Circle
  return <C size={size} className={className} aria-hidden="true" />
}
