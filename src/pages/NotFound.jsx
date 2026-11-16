import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <Compass size={48} className="mx-auto text-fg-3" strokeWidth={1.5} />
      <h1 className="mt-5 text-5xl">Página não encontrada</h1>
      <Link to="/" className="btn btn-primary mt-6">Voltar ao início</Link>
    </div>
  )
}
