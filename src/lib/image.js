// Compressão de imagens no browser. Sem Firebase Storage: as fotos ficam no Firestore
// como data URLs (JPEG base64). Por isso têm de ser pequenas.
//
//  - thumb: 480 px, usada nos cartões da loja (fica dentro do documento do produto)
//  - full : 1100 px, usada na página do produto (fica em images/{id}, carregada à parte)

const THUMB = { maxSize: 480, quality: 0.72 }
const FULL = { maxSize: 1100, quality: 0.8 }

async function toCanvas(file, maxSize) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#1b1b1e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  return canvas
}

export async function compressToDataUrl(file, { maxSize, quality }) {
  if (!file.type.startsWith('image/')) throw new Error('O ficheiro não é uma imagem.')
  const canvas = await toCanvas(file, maxSize)
  return canvas.toDataURL('image/jpeg', quality)
}

// Devolve { thumb, full } em data URL
export async function makeImagePair(file) {
  const [thumb, full] = await Promise.all([compressToDataUrl(file, THUMB), compressToDataUrl(file, FULL)])
  return { thumb, full }
}

// Tamanho aproximado em bytes de uma data URL base64
export const dataUrlBytes = (s) => (s?.startsWith('data:') ? Math.round((s.length - s.indexOf(',') - 1) * 0.75) : 0)

export const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:')

// Id determinístico a partir do conteúdo da miniatura (FNV-1a 32 bits, duas passagens)
export function imageId(str) {
  let h1 = 0x811c9dc5
  let h2 = 0x01000193
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0
    h2 = Math.imul(h2 ^ c, 0x811c9dc5) >>> 0
  }
  return `img_${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`
}
