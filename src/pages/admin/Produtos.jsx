import { useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Star, Database, ImagePlus, Link as LinkIcon } from 'lucide-react'
import ImageSlot from '../../components/ImageSlot'
import { Loading } from '../../components/Guards'
import { categories, fmtPrice } from '../../config/site'
import { listProducts, saveProduct, deleteProduct, prepareProductImage, seedStore, MAX_IMAGES } from '../../lib/db'
import { dataUrlBytes } from '../../lib/image'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

const empty = { name: '', category: 'pecas', price: '', stock: '', featured: false, description: '', images: [], fullImages: {} }
const fmtKb = (b) => `${Math.round(b / 1024)} KB`

export default function Produtos() {
  const [list, setList] = useState(null)
  const [editing, setEditing] = useState(null) // null | {id?, ...form}
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const fileRef = useRef()
  const toast = useToast()
  const { isDemo } = useAuth()

  const reload = () => listProducts().then(setList)
  useEffect(() => {
    reload()
  }, [])

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await saveProduct(editing, editing.id)
      toast(editing.id ? 'Produto actualizado' : 'Produto criado')
      setEditing(null)
      reload()
    } catch (err) {
      const denied = /permission|insufficient/i.test(err.message || '')
      toast(denied ? 'Sem permissão: publica as regras do Firestore (firestore.rules) e confirma o email em VITE_ADMIN_EMAILS.' : err.message || 'Erro ao guardar', 'err')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (p) => {
    if (!confirm(`Eliminar "${p.name}"?`)) return
    await deleteProduct(p.id)
    toast('Produto eliminado')
    reload()
  }

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const room = MAX_IMAGES - (editing.images?.length || 0)
    if (room <= 0) {
      toast(`Máximo de ${MAX_IMAGES} fotos por produto`, 'err')
      e.target.value = ''
      return
    }
    setBusy(true)
    try {
      const pairs = []
      for (const f of files.slice(0, room)) pairs.push(await prepareProductImage(f))
      setEditing((x) => ({
        ...x,
        images: [...(x.images || []), ...pairs.map((p) => p.thumb)],
        fullImages: { ...(x.fullImages || {}), ...Object.fromEntries(pairs.map((p) => [p.thumb, p.full])) },
      }))
      if (files.length > room) toast(`Só foram adicionadas ${room} fotos (máximo ${MAX_IMAGES})`, 'err')
    } catch (err) {
      toast(err.message || 'Erro ao processar a imagem', 'err')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const removeImage = (i) =>
    setEditing((x) => {
      const src = x.images[i]
      const fullImages = { ...(x.fullImages || {}) }
      delete fullImages[src]
      return { ...x, images: x.images.filter((_, k) => k !== i), fullImages }
    })

  const addUrl = () => {
    const u = imgUrl.trim()
    if (!/^https?:\/\//i.test(u)) return toast('Cola um link que comece por http(s)://', 'err')
    if ((editing.images?.length || 0) >= MAX_IMAGES) return toast(`Máximo de ${MAX_IMAGES} fotos por produto`, 'err')
    setEditing((x) => ({ ...x, images: [...(x.images || []), u] }))
    setImgUrl('')
  }

  const usedBytes = (editing?.images || []).reduce((n, s) => n + dataUrlBytes(s), 0)

  const seed = async () => {
    setBusy(true)
    const n = await seedStore()
    setBusy(false)
    toast(n ? `${n} produtos de exemplo adicionados` : 'A loja já tem produtos')
    reload()
  }

  if (!list) return <Loading />
  const shown = filter ? list.filter((p) => p.category === filter) : list

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Produtos <span className="text-fg-3">({list.length})</span></h2>
        <div className="flex gap-2">
          {list.length === 0 && !isDemo && (
            <button onClick={seed} className="btn btn-outline btn-sm" disabled={busy}><Database size={16} /> Carregar exemplos</button>
          )}
          <button onClick={() => setEditing({ ...empty })} className="btn btn-primary btn-sm"><Plus size={16} /> Novo produto</button>
        </div>
      </div>

      <div className="-mx-4 mt-5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-2">
          <button onClick={() => setFilter('')} className={`btn btn-sm whitespace-nowrap ${!filter ? 'btn-primary' : 'btn-outline'}`}>Todos</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} className={`btn btn-sm whitespace-nowrap ${filter === c.id ? 'btn-primary' : 'btn-outline'}`}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="font-display uppercase tracking-wider text-fg-3">
            <tr className="border-b border-line text-left">
              <th className="p-3 font-semibold">Produto</th>
              <th className="p-3 font-semibold">Categoria</th>
              <th className="p-3 font-semibold">Preço</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((p) => (
              <tr key={p.id} className="hover:bg-ink-3/50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-line"><ImageSlot src={p.images?.[0]} label="" iconSize={16} /></div>
                    <div>
                      <div className="font-display text-base font-bold uppercase tracking-wide">{p.name}</div>
                      {p.featured && <span className="inline-flex items-center gap-1 text-xs text-brand"><Star size={12} className="fill-brand" /> Destaque</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-fg-2">{categories.find((c) => c.id === p.category)?.label}</td>
                <td className="p-3 font-display font-bold">{fmtPrice(p.price)}</td>
                <td className={`p-3 ${(p.stock ?? 0) <= 2 ? 'text-warn' : 'text-fg-2'}`}>{p.stock}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing({ ...empty, ...p })} className="btn btn-ghost btn-sm" aria-label="Editar"><Pencil size={16} /></button>
                    <button onClick={() => remove(p)} className="btn btn-ghost btn-sm text-fg-3 hover:text-bad" aria-label="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-fg-3">Sem produtos.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-4" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form onSubmit={save} className="card max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none p-6 sm:rounded-b-md">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl">{editing.id ? 'Editar produto' : 'Novo produto'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost btn-sm" aria-label="Fechar"><X size={18} /></button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="pname">Nome</label>
                <input id="pname" className="input" required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="pcat">Categoria</label>
                <select id="pcat" className="input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="pprice">Preço</label>
                  <input id="pprice" className="input" required type="number" min="0" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="pstock">Stock</label>
                  <input id="pstock" className="input" required type="number" min="0" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="pdesc">Descrição</label>
                <textarea id="pdesc" className="input min-h-28" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-3 text-sm sm:col-span-2">
                <input type="checkbox" className="h-4 w-4 accent-brand" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Mostrar em destaque na página inicial
              </label>

              <div className="sm:col-span-2">
                <span className="label">Imagens</span>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {(editing.images || []).map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-sm border border-line">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-sm bg-ink text-fg hover:text-bad" aria-label="Remover imagem"><X size={14} /></button>
                    </div>
                  ))}
                  {(editing.images?.length || 0) < MAX_IMAGES && (
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line-2 text-fg-3 hover:border-brand hover:text-brand">
                      {busy ? <Upload size={20} className="animate-pulse" /> : <ImagePlus size={20} />}
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{busy ? 'A comprimir' : 'Adicionar'}</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
                <div className="mt-3 flex gap-2">
                  <label className="relative flex-1">
                    <LinkIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
                    <input
                      className="input pl-9"
                      placeholder="Ou cola o link de uma imagem (https://...)"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                    />
                  </label>
                  <button type="button" onClick={addUrl} className="btn btn-outline btn-sm">Adicionar</button>
                </div>
                <p className="mt-2 text-xs text-fg-3">
                  Até {MAX_IMAGES} fotos. São comprimidas no browser e guardadas no Firestore (sem Storage).
                  {usedBytes > 0 && <> Miniaturas: {fmtKb(usedBytes)}.</>}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost">Cancelar</button>
              <button className="btn btn-primary" disabled={busy}>Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
