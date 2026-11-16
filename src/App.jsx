import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import { RequireAuth, RequireAdmin, Loading } from './components/Guards'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Loja from './pages/Loja'
import Produto from './pages/Produto'
import Marcacao from './pages/Marcacao'
import Contactos from './pages/Contactos'
import Carrinho from './pages/Carrinho'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Conta from './pages/Conta'
import NotFound from './pages/NotFound'

// Painel de admin carregado só quando é necessário
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Produtos = lazy(() => import('./pages/admin/Produtos'))
const Encomendas = lazy(() => import('./pages/admin/Encomendas'))
const Marcacoes = lazy(() => import('./pages/admin/Marcacoes'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<Shell />}>
                <Route path="/" element={<Home />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/loja" element={<Loja />} />
                <Route path="/produto/:id" element={<Produto />} />
                <Route path="/marcacao" element={<Marcacao />} />
                <Route path="/contactos" element={<Contactos />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/conta" element={<RequireAuth><Conta /></RequireAuth>} />
                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<Dashboard />} />
                  <Route path="produtos" element={<Produtos />} />
                  <Route path="encomendas" element={<Encomendas />} />
                  <Route path="marcacoes" element={<Marcacoes />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
