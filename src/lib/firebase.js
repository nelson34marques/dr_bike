import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const env = import.meta.env

// Modo demo: sem chaves Firebase o site corre com dados de exemplo em memória.
export const isDemo = !env.VITE_FIREBASE_API_KEY

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = isDemo ? null : initializeApp(config)
export const auth = isDemo ? null : getAuth(app)
export const db = isDemo ? null : getFirestore(app)
export const googleProvider = isDemo ? null : new GoogleAuthProvider()

// Nota: não usamos Firebase Storage (plano gratuito). As imagens ficam no Firestore (ver lib/image.js).

// Analytics só em produção e só onde o browser suporta (evita erros em dev / bloqueadores)
if (!isDemo && config.measurementId && import.meta.env.PROD) {
  isSupported().then((ok) => ok && getAnalytics(app)).catch(() => {})
}

export const adminEmails = (env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)
