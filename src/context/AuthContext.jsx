import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile, sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, googleProvider, isDemo, adminEmails } from '../lib/firebase'
import { ensureUserDoc } from '../lib/db'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('cliente')
  const [loading, setLoading] = useState(!isDemo)

  useEffect(() => {
    if (isDemo) return
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const byEmail = adminEmails.includes((u.email || '').toLowerCase())
        let role = byEmail ? 'admin' : 'cliente'
        try {
          const profile = await ensureUserDoc(u, { asAdmin: byEmail })
          if (profile.role === 'admin') role = 'admin'
        } catch (err) {
          console.warn('Não foi possível ler/criar o perfil do utilizador:', err.message)
        }
        setRole(role)
      } else {
        setRole('cliente')
      }
      setLoading(false)
    })
  }, []) 

  // Em modo demo simulamos um login local para testar a UI.
  const demoLogin = (asAdmin) => {
    setUser({
      uid: 'demo',
      email: asAdmin ? 'admin@demo' : 'cliente@demo',
      displayName: asAdmin ? 'Admin Demo' : 'Cliente Demo',
    })
    setRole(asAdmin ? 'admin' : 'cliente')
  }

  const value = {
    user,
    role,
    loading,
    isDemo,
    isAdmin: role === 'admin',
    loginGoogle: () => (isDemo ? demoLogin(false) : signInWithPopup(auth, googleProvider)),
    loginEmail: (email, pass) =>
      isDemo ? demoLogin(email.startsWith('admin')) : signInWithEmailAndPassword(auth, email, pass),
    registerEmail: async (name, email, pass) => {
      if (isDemo) return demoLogin(false)
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      await updateProfile(cred.user, { displayName: name })
      await ensureUserDoc({ ...cred.user, displayName: name }, { asAdmin: adminEmails.includes((email || '').toLowerCase()) })
    },
    resetPassword: (email) => (isDemo ? Promise.resolve() : sendPasswordResetEmail(auth, email)),
    logout: () => {
      if (isDemo) {
        setUser(null)
        setRole('cliente')
        return Promise.resolve()
      }
      return signOut(auth)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)