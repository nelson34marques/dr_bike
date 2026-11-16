import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import { Loading } from '../components/Guards'
import { categories } from '../config/site'
import { listProducts } from '../lib/db'

export default function Loja() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('recentes')
  const cat = params.get('categoria') || ''

  useEffect(() => {
    listProducts().then(setProducts)
  }, [])

  const list = useMemo(() => {
    if (!products) return []
    let r = products
    if (cat) r = r.filter((p) => p.category === cat)
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      r = r.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(t))
    }
    if (sort === 'preco-asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'preco-desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'nome') r = [...r].sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [products, cat, q, sort])

  const setCat = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('categoria', id)
    else next.delete('categoria')
    setParams(next)
  }

  return (
    <div className="container-x relative overflow-hidden py-8 sm:py-12">
      <div className="glow pointer-events-none absolute -right-20 -top-32 h-[380px] w-[380px] opacity-60" aria-hidden="true" />
      <div className="relative mb-6 sm:mb-8">
        <span className="eyebrow">Loja</span>
        <h1 className="mt-2 text-4xl leading-none sm:text-6xl">{categories.find((c) => c.id === cat)?.label || 'Todos os produtos'}</h1>
      </div>

      {/* categorias */}
      <div className="-mx-4 mb-5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mb-6 sm:px-0">
        <div className="flex gap-2 pb-1">
          <button onClick={() => setCat('')} className={`btn btn-sm whitespace-nowrap ${!cat ? 'btn-primary' : 'btn-outline'}`}>Todos</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`btn btn-sm whitespace-nowrap ${cat === c.id ? 'btn-primary' : 'btn-outline'}`}>
              <Icon name={c.icon} size={16} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* pesquisa / ordenação */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row">
        <label className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
          <input className="input pl-11" placeholder="Pesquisar produtos" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="relative sm:w-56">
          <SlidersHorizontal size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
          <select className="input appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pl-11 pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%238a8a85%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recentes">Mais recentes</option>
            <option value="preco-asc">Preço: menor</option>
            <option value="preco-desc">Preço: maior</option>
            <option value="nome">Nome</option>
          </select>
        </label>
      </div>

      {!products ? (
        <Loading />
      ) : list.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-center text-fg-2">
          <PackageSearch size={36} className="text-fg-3" />
          <p>Sem produtos para mostrar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
