// Dados do negócio. Altere aqui e o site inteiro actualiza.
export const site = {
  name: 'Dr. Bike',
  tagline: 'Oficina & Loja',
  // Número de WhatsApp em formato internacional, só dígitos (ex.: 244923000000)
  whatsapp: import.meta.env.VITE_WHATSAPP || '244900000000',
  phoneDisplay: import.meta.env.VITE_PHONE_DISPLAY || '+244 900 000 000',
  email: 'geral@drbike.ao',
  address: 'Estamos localizados na entrada do Kilamba, após o viaduto, ao lado da loja Pre-lex.',
  mapsUrl: 'https://maps.app.goo.gl/qv2BGjeL3HEoWwYv6',
  hours: [
    { d: 'Seg – Sex', h: '08:00 – 18:00' },
    { d: 'Sábado', h: '08:00 – 14:00' },
    { d: 'Domingo', h: 'Fechado' },
  ],
  currency: 'Kz',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}

// Números para a secção de confiança na página inicial (edita com os valores reais)
export const stats = [
  { value: '+10', label: 'anos de oficina' },
  { value: '+2000', label: 'reparações feitas' },
  { value: '48h', label: 'prazo médio' },
  { value: '100%', label: 'serviço com garantia' },
]

export const categories = [
  { id: 'bicicletas', label: 'Bicicletas', icon: 'Bike' },
  { id: 'motos', label: 'Motos elétricas', icon: 'Zap' },
  { id: 'baterias', label: 'Baterias', icon: 'BatteryCharging' },
  { id: 'cadeiras', label: 'Cadeiras de rodas', icon: 'Accessibility' },
  { id: 'pecas', label: 'Peças', icon: 'Cog' },
  { id: 'acessorios', label: 'Acessórios', icon: 'Package' },
]

export const services = [
  {
    id: 'revisao-bicicleta',
    title: 'Revisão de bicicleta',
    icon: 'Bike',
    desc: 'Afinação de travões e mudanças, lubrificação, aperto geral e verificação de segurança.',
    from: 5000,
  },
  {
    id: 'moto-eletrica',
    title: 'Motos elétricas',
    icon: 'Zap',
    desc: 'Diagnóstico de motor, controlador, display e cablagem. Reparação e substituição de componentes.',
    from: 10000,
  },
  {
    id: 'baterias',
    title: 'Baterias',
    icon: 'BatteryCharging',
    desc: 'Teste de capacidade, substituição de células, BMS e reparação de carregadores.',
    from: 8000,
  },
  {
    id: 'cadeiras-rodas',
    title: 'Cadeiras de rodas',
    icon: 'Accessibility',
    desc: 'Manutenção de cadeiras manuais e elétricas: rodas, travões, motores, baterias e estofos.',
    from: 6000,
  },
  {
    id: 'pneus',
    title: 'Pneus e câmaras',
    icon: 'CircleDot',
    desc: 'Substituição e reparação de pneus, câmaras de ar e sistemas tubeless.',
    from: 2500,
  },
  {
    id: 'montagem',
    title: 'Montagem e personalização',
    icon: 'Wrench',
    desc: 'Montagem de bicicletas novas, instalação de acessórios e upgrades.',
    from: 4000,
  },
]

export const fmtPrice = (n) =>
  `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(n || 0)} ${site.currency}`

export const waLink = (text) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
