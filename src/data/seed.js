// Dados de exemplo usados em modo demo (sem Firebase) e para semear a loja.
export const seedProducts = [
  { id: 'p1', name: 'Bicicleta urbana 28" Alumínio', category: 'bicicletas', price: 185000, stock: 4, featured: true, images: [], description: 'Quadro em alumínio, 7 velocidades Shimano, travões V-brake, guarda-lamas e porta-bagagens incluídos.' },
  { id: 'p2', name: 'Bicicleta BTT 29" Suspensão', category: 'bicicletas', price: 240000, stock: 2, featured: true, images: [], description: 'Suspensão dianteira 100 mm, travões de disco hidráulicos, 21 velocidades.' },
  { id: 'p3', name: 'Moto elétrica City 1500W', category: 'motos', price: 890000, stock: 1, featured: true, images: [], description: 'Motor 1500 W, bateria 60V 20Ah, autonomia até 60 km, display LCD, luzes LED.' },
  { id: 'p4', name: 'Bateria Li-ion 48V 13Ah', category: 'baterias', price: 165000, stock: 6, featured: true, images: [], description: 'Células 18650 de alta densidade, BMS integrado, carregador incluído. Compatível com a maioria das e-bikes.' },
  { id: 'p5', name: 'Bateria Li-ion 60V 20Ah', category: 'baterias', price: 290000, stock: 3, featured: false, images: [], description: 'Para motos elétricas. BMS de 60A, caixa em ABS reforçado.' },
  { id: 'p6', name: 'Cadeira de rodas manual dobrável', category: 'cadeiras', price: 120000, stock: 3, featured: true, images: [], description: 'Estrutura em aço, apoios de braço rebatíveis, travões de estacionamento, dobrável para transporte.' },
  { id: 'p7', name: 'Cadeira de rodas elétrica', category: 'cadeiras', price: 650000, stock: 1, featured: true, images: [], description: 'Dois motores 250 W, bateria 24V 12Ah, joystick, autonomia até 20 km.' },
  { id: 'p8', name: 'Kit travões de disco hidráulicos', category: 'pecas', price: 38000, stock: 10, featured: false, images: [], description: 'Par dianteiro + traseiro, discos 160 mm, pastilhas em resina.' },
  { id: 'p9', name: 'Controlador 48V/60V 30A', category: 'pecas', price: 32000, stock: 8, featured: false, images: [], description: 'Controlador sinusoidal para motores brushless até 1500 W.' },
  { id: 'p10', name: 'Pneu 26x1.95 anti-furo', category: 'pecas', price: 7500, stock: 20, featured: false, images: [], description: 'Camada de protecção anti-furo, piso misto cidade/terra.' },
  { id: 'p11', name: 'Capacete urbano com luz traseira', category: 'acessorios', price: 18000, stock: 12, featured: true, images: [], description: 'Certificado CE, luz LED traseira recarregável, tamanhos M/L.' },
  { id: 'p12', name: 'Cadeado em U + cabo', category: 'acessorios', price: 9500, stock: 15, featured: false, images: [], description: 'Aço temperado 13 mm, inclui cabo de 1,2 m e suporte para quadro.' },
  { id: 'p13', name: 'Luzes LED dianteira + traseira USB', category: 'acessorios', price: 6500, stock: 25, featured: false, images: [], description: 'Recarregáveis por USB, 4 modos, resistentes à água.' },
  { id: 'p14', name: 'Carregador 48V 2A', category: 'baterias', price: 14000, stock: 9, featured: false, images: [], description: 'Carregador inteligente com corte automático. Ficha XLR / DC.' },
]

export const seedReviews = {
  p1: [
    { id: 'r1', name: 'Carlos M.', rating: 5, text: 'Bicicleta leve e bem montada. Entrega rápida e afinação perfeita.', createdAt: Date.now() - 86400000 * 12 },
    { id: 'r2', name: 'Ana P.', rating: 4, text: 'Boa relação qualidade/preço. O selim podia ser mais confortável.', createdAt: Date.now() - 86400000 * 30 },
  ],
  p4: [
    { id: 'r3', name: 'Joaquim S.', rating: 5, text: 'Substituí a bateria antiga e ganhei 20 km de autonomia. Recomendo.', createdAt: Date.now() - 86400000 * 5 },
  ],
}
