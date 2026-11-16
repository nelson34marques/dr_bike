// Camada de dados. Com Firebase usa Firestore/Storage; em modo demo usa memória.
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query,
  serverTimestamp, setDoc, updateDoc, where, limit,
} from 'firebase/firestore'
import { writeBatch } from 'firebase/firestore'
import { db, isDemo } from './firebase'
import { seedProducts, seedReviews } from '../data/seed'
import { makeImagePair, imageId, isDataUrl, dataUrlBytes } from './image'

// ---------- memória (demo) ----------
const mem = {
  products: seedProducts.map((p) => ({ ...p })),
  reviews: Object.fromEntries(Object.entries(seedReviews).map(([k, v]) => [k, v.map((r) => ({ ...r }))])),
  orders: [],
  appointments: [],
  images: {}, // id -> full data URL
}

export const MAX_IMAGES = 5
const MAX_DOC_BYTES = 900 * 1024 // margem abaixo do limite de 1 MiB do Firestore
const uid = () => Math.random().toString(36).slice(2, 10)
const toMillis = (v) => (v?.toMillis ? v.toMillis() : typeof v === 'number' ? v : Date.now())
const norm = (d) => {
  const data = d.data()
  return { id: d.id, ...data, createdAt: toMillis(data.createdAt) }
}

// ---------- produtos ----------
export async function listProducts() {
  if (isDemo) return [...mem.products]
  const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
  return snap.docs.map(norm)
}

export async function getProduct(id) {
  if (isDemo) return mem.products.find((p) => p.id === id) || null
  const d = await getDoc(doc(db, 'products', id))
  return d.exists() ? norm(d) : null
}

// data.images: lista de strings (http URL ou data URL da miniatura)
// data.fullImages: { [thumbDataUrl]: fullDataUrl } para as fotos novas desta edição
export async function saveProduct(data, id) {
  const images = (data.images || []).slice(0, MAX_IMAGES)
  const payload = {
    name: data.name.trim(),
    category: data.category,
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    featured: !!data.featured,
    description: data.description?.trim() || '',
    images,
  }
  const bytes = images.reduce((n, s) => n + dataUrlBytes(s), 0) + payload.description.length
  if (bytes > MAX_DOC_BYTES) throw new Error('As fotos deste produto ocupam demasiado espaço. Remove uma ou usa fotos mais pequenas.')

  const fulls = data.fullImages || {}
  const newThumbs = images.filter(isDataUrl)

  if (isDemo) {
    for (const t of newThumbs) if (fulls[t]) mem.images[imageId(t)] = fulls[t]
    if (id) {
      const i = mem.products.findIndex((p) => p.id === id)
      mem.products[i] = { ...mem.products[i], ...payload }
      return id
    }
    const nid = uid()
    mem.products.unshift({ id: nid, createdAt: Date.now(), ...payload })
    return nid
  }

  // Fotos antigas que foram removidas -> apagar a versão grande
  let removed = []
  if (id) {
    const before = await getDoc(doc(db, 'products', id))
    const old = (before.data()?.images || []).filter(isDataUrl)
    removed = old.filter((t) => !images.includes(t))
  }

  const batch = writeBatch(db)
  let ref
  if (id) {
    ref = doc(db, 'products', id)
    batch.update(ref, { ...payload, updatedAt: serverTimestamp() })
  } else {
    ref = doc(collection(db, 'products'))
    batch.set(ref, { ...payload, createdAt: serverTimestamp() })
  }
  for (const t of newThumbs) {
    if (fulls[t]) batch.set(doc(db, 'images', imageId(t)), { full: fulls[t], productId: ref.id, createdAt: serverTimestamp() })
  }
  for (const t of removed) batch.delete(doc(db, 'images', imageId(t)))
  await batch.commit()
  return ref.id
}

// Versões grandes das fotos de um produto (cai para a miniatura se não existir)
export async function getProductImages(product) {
  const list = product?.images || []
  return Promise.all(
    list.map(async (src) => {
      if (!isDataUrl(src)) return src
      const id = imageId(src)
      if (isDemo) return mem.images[id] || src
      try {
        const d = await getDoc(doc(db, 'images', id))
        return d.exists() ? d.data().full : src
      } catch {
        return src
      }
    }),
  )
}

export async function deleteProduct(id) {
  if (isDemo) {
    mem.products = mem.products.filter((p) => p.id !== id)
    return
  }
  const before = await getDoc(doc(db, 'products', id))
  const batch = writeBatch(db)
  for (const t of (before.data()?.images || []).filter(isDataUrl)) batch.delete(doc(db, 'images', imageId(t)))
  batch.delete(doc(db, 'products', id))
  await batch.commit()
}

// Prepara uma foto para o produto: devolve { thumb, full } em data URL.
// Nada é enviado aqui; a gravação acontece em saveProduct.
export async function prepareProductImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('O ficheiro não é uma imagem.')
  return makeImagePair(file)
}

// ---------- comentários ----------
export async function listReviews(productId) {
  if (isDemo) return [...(mem.reviews[productId] || [])].sort((a, b) => b.createdAt - a.createdAt)
  const snap = await getDocs(query(collection(db, 'products', productId, 'reviews'), orderBy('createdAt', 'desc')))
  return snap.docs.map(norm)
}

export async function addReview(productId, { uid: userId, name, rating, text }) {
  const payload = { uid: userId, name, rating: Number(rating), text: text.trim() }
  if (isDemo) {
    mem.reviews[productId] = [{ id: uid(), createdAt: Date.now(), ...payload }, ...(mem.reviews[productId] || [])]
    return
  }
  await addDoc(collection(db, 'products', productId, 'reviews'), { ...payload, createdAt: serverTimestamp() })
}

export async function deleteReview(productId, reviewId) {
  if (isDemo) {
    mem.reviews[productId] = (mem.reviews[productId] || []).filter((r) => r.id !== reviewId)
    return
  }
  await deleteDoc(doc(db, 'products', productId, 'reviews', reviewId))
}

// ---------- encomendas ----------
export async function createOrder(order) {
  const payload = { ...order, status: 'pendente' }
  if (isDemo) {
    const id = uid()
    mem.orders.unshift({ id, createdAt: Date.now(), ...payload })
    return id
  }
  const r = await addDoc(collection(db, 'orders'), { ...payload, createdAt: serverTimestamp() })
  return r.id
}

export async function listOrders(userId) {
  if (isDemo) return mem.orders.filter((o) => !userId || o.uid === userId)
  const base = collection(db, 'orders')
  const q = userId
    ? query(base, where('uid', '==', userId), orderBy('createdAt', 'desc'))
    : query(base, orderBy('createdAt', 'desc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map(norm)
}

export async function updateOrderStatus(id, status) {
  if (isDemo) {
    const o = mem.orders.find((x) => x.id === id)
    if (o) o.status = status
    return
  }
  await updateDoc(doc(db, 'orders', id), { status })
}

// ---------- marcações ----------
export async function createAppointment(data) {
  const payload = { ...data, status: 'pendente' }
  if (isDemo) {
    const id = uid()
    mem.appointments.unshift({ id, createdAt: Date.now(), ...payload })
    return id
  }
  const r = await addDoc(collection(db, 'appointments'), { ...payload, createdAt: serverTimestamp() })
  return r.id
}

export async function listAppointments(userId) {
  if (isDemo) return mem.appointments.filter((a) => !userId || a.uid === userId)
  const base = collection(db, 'appointments')
  const q = userId
    ? query(base, where('uid', '==', userId), orderBy('createdAt', 'desc'))
    : query(base, orderBy('createdAt', 'desc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map(norm)
}

export async function updateAppointmentStatus(id, status) {
  if (isDemo) {
    const a = mem.appointments.find((x) => x.id === id)
    if (a) a.status = status
    return
  }
  await updateDoc(doc(db, 'appointments', id), { status })
}

// ---------- utilizadores ----------
// Cria o documento do utilizador se não existir. Emails em VITE_ADMIN_EMAILS ficam logo com role admin.
export async function ensureUserDoc(user, { asAdmin = false } = {}) {
  if (isDemo || !user) return { role: asAdmin ? 'admin' : 'cliente' }
  const r = doc(db, 'users', user.uid)
  const d = await getDoc(r)
  if (d.exists()) {
    const data = d.data()
    if (asAdmin && data.role !== 'admin') {
      await setDoc(r, { role: 'admin' }, { merge: true })
      return { ...data, role: 'admin' }
    }
    return data
  }
  const data = { email: user.email, name: user.displayName || '', role: asAdmin ? 'admin' : 'cliente', createdAt: serverTimestamp() }
  await setDoc(r, data)
  return data
}

// Semeia a loja com os produtos de exemplo (só admin, só se estiver vazia)
export async function seedStore() {
  if (isDemo) return 0
  const existing = await getDocs(query(collection(db, 'products'), limit(1)))
  if (!existing.empty) return 0
  for (const p of seedProducts) {
    const { id: _ignored, ...rest } = p
    await addDoc(collection(db, 'products'), { ...rest, createdAt: serverTimestamp() })
  }
  return seedProducts.length
}
