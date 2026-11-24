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
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
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

        <button
          onClick={() => run(loginGoogle)}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-[#dadce0] bg-white px-4 py-3 font-medium text-[#3c4043] transition hover:bg-[#f7f8f8] focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
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
