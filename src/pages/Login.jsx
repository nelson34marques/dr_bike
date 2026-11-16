import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { LogIn, UserPlus, KeyRound, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const errors = {
  'auth/invalid-credential': 'Email ou palavra-passe incorrectos.',
  'auth/user-not-found': 'Não existe conta com este email.',
  'auth/wrong-password': 'Palavra-passe incorrecta.',
  'auth/email-already-in-use': 'Já existe uma conta com este email.',
  'auth/weak-password': 'A palavra-passe deve ter pelo menos 6 caracteres.',
  'auth/popup-closed-by-user': 'Janela de login fechada.',
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.6 12.23c0-.68-.06-1.36-.19-2.02H12v3.83h5.4a4.6 4.6 0 0 1-2 3.03v2.5h3.23c1.9-1.75 2.97-4.33 2.97-7.34Z" />
      <path fill="currentColor" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.82-1.76-5.6-4.13H3.06v2.58A10 10 0 0 0 12 22Z" opacity=".8" />
      <path fill="currentColor" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96L6.4 13.9Z" opacity=".6" />
      <path fill="currentColor" d="M12 5.97c1.47 0 2.78.5 3.82 1.5l2.86-2.86A10 10 0 0 0 3.06 7.52L6.4 10.1c.78-2.37 3-4.13 5.6-4.13Z" opacity=".9" />
    </svg>
  )
}

export default function Login() {
  const { user, loginGoogle, loginEmail, registerEmail, resetPassword, isDemo } = useAuth()
  const toast = useToast()
  const loc = useLocation()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', pass: '' })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const from = loc.state?.from || '/conta'

  if (user) return <Navigate to={from} replace />

  const run = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      toast(errors[err.code] || err.message || 'Erro', 'err')
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'login') run(() => loginEmail(f.email, f.pass))
    else run(() => registerEmail(f.name, f.email, f.pass))
  }

  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <span className="eyebrow">Conta</span>
        <h1 className="mt-2 text-5xl leading-none">{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="mt-3 text-sm text-fg-2">Acompanha as tuas encomendas e marcações e comenta produtos.</p>

        {isDemo && (
          <div className="mt-5 flex gap-2 rounded-sm border border-brand/40 bg-brand/10 p-3 text-xs text-fg-2">
            <Info size={16} className="shrink-0 text-brand" />
            <span>Modo demo (Firebase não configurado). Qualquer email entra; um email que comece por <b>admin</b> abre o painel de admin.</span>
          </div>
        )}

        <button onClick={() => run(loginGoogle)} disabled={busy} className="btn btn-outline mt-6 w-full">
          <GoogleIcon /> Continuar com Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-fg-3">
          <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="label" htmlFor="name">Nome</label>
              <input id="name" className="input" required value={f.name} onChange={set('name')} />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" required type="email" value={f.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="pass">Palavra-passe</label>
            <input id="pass" className="input" required={!isDemo} type="password" minLength={6} value={f.pass} onChange={set('pass')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>
            {mode === 'login' ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Criar conta</>}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-2 text-sm text-fg-2">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('register')} className="text-left hover:text-brand">Não tens conta? <span className="text-brand">Regista-te</span></button>
              <button
                onClick={() => (f.email ? run(() => resetPassword(f.email).then(() => toast('Email de recuperação enviado'))) : toast('Escreve o teu email primeiro', 'err'))}
                className="flex items-center gap-1.5 text-left hover:text-brand"
              >
                <KeyRound size={14} /> Esqueci a palavra-passe
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-left hover:text-brand">Já tens conta? <span className="text-brand">Entrar</span></button>
          )}
          <Link to="/" className="text-fg-3 hover:text-fg">Voltar ao início</Link>
        </div>
      </div>
    </div>
  )
}
