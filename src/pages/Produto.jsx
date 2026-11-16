import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Minus, Plus, MessageCircle, Package, Trash2 } from 'lucide-react'
import ImageSlot from '../components/ImageSlot'
import { Loading } from '../components/Guards'
import { Stars, StarPicker } from '../components/Rating'
import { categories, fmtPrice, waLink } from '../config/site'
import { getProduct, getProductImages, listReviews, addReview, deleteReview } from '../lib/db'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Produto() {
  const { id } = useParams()
  const [p, setP] = useState(undefined)
  const [gallery, setGallery] = useState([]) // versões grandes das fotos
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ rating: 5, text: '' })
  const [sending, setSending] = useState(false)
  const cart = useCart()
  const { user, isAdmin } = useAuth()
  const toast = useToast()

  useEffect(() => {
    getProduct(id).then((prod) => {
      setP(prod)
      setGallery(prod?.images || [])
      setImg(0)
      setQty(1)
      if (prod) getProductImages(prod).then(setGallery)
    })
    listReviews(id).then(setReviews)
  }, [id])

  if (p === undefined) return <Loading />
  if (p === null) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl">Produto não encontrado</h1>
        <Link to="/loja" className="btn btn-outline mt-6"><ArrowLeft size={18} /> Voltar à loja</Link>
      </div>
    )
  }

  const cat = categories.find((c) => c.id === p.category)
  const out = (p.stock ?? 0) <= 0
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0

  const submitReview = async (e) => {
    e.preventDefault()
    if (!form.text.trim()) return
    setSending(true)
    try {
      await addReview(id, { uid: user.uid, name: user.displayName || user.email.split('@')[0], ...form })
      setForm({ rating: 5, text: '' })
      setReviews(await listReviews(id))
      toast('Comentário publicado')
    } catch (err) {
      toast(err.message || 'Erro ao publicar', 'err')
    } finally {
      setSending(false)
    }
  }

  const removeReview = async (rid) => {
    await deleteReview(id, rid)
    setReviews(await listReviews(id))
  }

  return (
    <div className="container-x py-10">
      <Link to="/loja" className="inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-brand"><ArrowLeft size={16} /> Loja</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-md border border-line bg-ink-2">
            <ImageSlot src={gallery[img] || p.images?.[img]} alt={p.name} label="Imagem do produto" iconSize={44} />
          </div>
          {p.images?.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} className={`aspect-square overflow-hidden rounded-sm border ${i === img ? 'border-brand' : 'border-line'}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <span className="eyebrow">{cat?.label}</span>
            <div className="shrink-0 flex flex-col items-end text-right">
              <Stars value={avg} />
              <span className="mt-1 text-xs text-fg-3">{reviews.length ? `${avg.toFixed(1)} · ${reviews.length} comentário${reviews.length > 1 ? 's' : ''}` : 'Sem comentários'}</span>
            </div>
          </div>
          <h1 className="mt-2 text-2xl leading-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-6 font-display text-4xl font-extrabold text-brand">{fmtPrice(p.price)}</div>
          <p className="mt-2 flex items-center gap-2 text-sm text-fg-2">
            <Package size={16} className={out ? 'text-bad' : 'text-ok'} />
            {out ? 'Esgotado — contacta-nos para encomendar' : `${p.stock} em stock`}
          </p>
          <p className="mt-6 text-fg-2">{p.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border border-line-2">
              <button className="px-3 py-2.5 text-fg-2 hover:text-fg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"><Minus size={16} /></button>
              <span className="w-10 text-center font-display text-lg font-bold">{qty}</span>
              <button className="px-3 py-2.5 text-fg-2 hover:text-fg" onClick={() => setQty((q) => Math.min(p.stock || 99, q + 1))} aria-label="Mais"><Plus size={16} /></button>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary px-4 py-2.5"
                disabled={out}
                onClick={() => {
                  cart.add(p, qty)
                  toast(`${p.name} adicionado ao carrinho`)
                }}
              >
                <ShoppingCart size={18} /> Adicionar
              </button>
              <a href={waLink(`Olá! Tenho interesse no produto: ${p.name} (${fmtPrice(p.price)}).`)} target="_blank" rel="noreferrer" className="btn btn-outline px-4 py-2.5">
                <MessageCircle size={18} /> Perguntar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* comentários */}
      <section className="mt-10 border-t border-line pt-8 sm:mt-16 sm:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <span className="eyebrow">Opiniões</span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold leading-none text-brand">{avg.toFixed(1)}</span>
              <div>
                <Stars value={avg} size={18} />
                <div className="mt-1 text-xs text-fg-3">{reviews.length} comentário{reviews.length > 1 ? 's' : ''}</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          {user ? (
            <form onSubmit={submitReview} className="card p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[200px_1fr] lg:items-start">
                <div>
                  <span className="label">Classificação</span>
                  <StarPicker value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
                  <p className="mt-2 text-xs text-fg-3 sm:text-sm">A comentar como <span className="text-fg">{user.displayName || user.email.split('@')[0]}</span></p>
                </div>
                <div className="flex flex-col">
                  <textarea
                    id="rev"
                    className="input min-h-24 flex-1 resize-y"
                    required
                    maxLength={1000}
                    value={form.text}
                    onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                    placeholder="Conta a tua experiência com este produto"
                    aria-label="Comentário"
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-fg-3">{form.text.length}/1000</span>
                    <button className="btn btn-primary btn-sm" disabled={sending || !form.text.trim()}>Publicar</button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
              <p className="text-sm text-fg-2">Precisas de entrar na tua conta para comentar.</p>
              <Link to="/login" state={{ from: `/produto/${id}` }} className="btn btn-outline btn-sm">Entrar para comentar</Link>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="mt-8 text-sm text-fg-3">Ainda não há comentários. Sê o primeiro.</p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-lg font-bold uppercase tracking-wide">{r.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-fg-3">
                      <Stars value={r.rating} size={14} />
                      <span>{new Date(r.createdAt).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                  {(isAdmin || (user && user.uid === r.uid)) && (
                    <button onClick={() => removeReview(r.id)} className="btn btn-ghost btn-sm text-fg-3 hover:text-bad" aria-label="Eliminar comentário"><Trash2 size={16} /></button>
                  )}
                </div>
                <p className="mt-3 text-sm text-fg-2">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
