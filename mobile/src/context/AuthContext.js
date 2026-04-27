import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '../lib/firebase'

const AuthContext = createContext(null)

function toFirebaseMessage(error, fallbackMessage) {
  const code = error?.code || ''

  if (code === 'auth/invalid-email') return 'Email invalido.'
  if (code === 'auth/missing-password') return 'Informe sua senha.'
  if (code === 'auth/missing-email') return 'Informe seu email.'
  if (code === 'auth/invalid-credential') return 'Email ou senha incorretos.'
  if (code === 'auth/user-not-found') return 'Conta nao encontrada.'
  if (code === 'auth/wrong-password') return 'Senha incorreta.'
  if (code === 'auth/email-already-in-use') return 'Este email ja esta em uso.'
  if (code === 'auth/weak-password') return 'Senha fraca. Use pelo menos 6 caracteres.'
  if (code === 'auth/operation-not-allowed') return 'Metodo desativado no Firebase. Ative Email/Senha e Google em Authentication > Sign-in method.'
  if (code === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  if (code === 'auth/network-request-failed') return 'Falha de rede. Tente novamente.'
  if (code === 'auth/popup-closed-by-user') return 'Login com Google cancelado.'

  return fallbackMessage
}

export function AuthProvider({ children }) {
  const firebaseEnabled = isFirebaseConfigured()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!firebaseEnabled)
  const [error, setError] = useState('')
  const auth = firebaseEnabled ? getFirebaseAuth() : null

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setReady(true)
      setError('Firebase nao configurado neste APK. Defina EXPO_PUBLIC_FIREBASE_* no EAS Build.')
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setReady(true)
    })

    return unsubscribe
  }, [auth, firebaseEnabled])

  async function login(email, password) {
    if (!firebaseEnabled || !auth) {
      setError('Login indisponivel: Firebase nao configurado neste build.')
      return
    }

    if (!email?.trim() || !password) {
      setError('Informe email e senha para entrar.')
      return
    }

    try {
      setError('')
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (loginError) {
      console.error(loginError)
      setError(toFirebaseMessage(loginError, 'Nao foi possivel entrar. Verifique email e senha.'))
      throw loginError
    }
  }

  async function register(email, password, nickname) {
    if (!firebaseEnabled || !auth) {
      setError('Cadastro indisponivel: Firebase nao configurado neste build.')
      return
    }

    if (!email?.trim() || !password) {
      setError('Informe email e senha para criar a conta.')
      return
    }

    try {
      setError('')
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (nickname?.trim()) {
        await updateProfile(credential.user, { displayName: nickname.trim() })
      }
    } catch (registerError) {
      console.error(registerError)
      setError(toFirebaseMessage(registerError, 'Nao foi possivel criar a conta.'))
      throw registerError
    }
  }

  async function loginWithGoogleIdToken(idToken) {
    if (!firebaseEnabled || !auth) {
      setError('Login com Google indisponivel: Firebase nao configurado neste build.')
      return
    }

    if (!idToken) {
      setError('Nao foi possivel validar sua conta Google.')
      return
    }

    try {
      setError('')
      const credential = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(auth, credential)
    } catch (googleError) {
      console.error(googleError)
      setError(toFirebaseMessage(googleError, 'Falha no login com Google.'))
      throw googleError
    }
  }

  async function logout() {
    if (!firebaseEnabled || !auth) return

    await signOut(auth)
  }

  const value = useMemo(() => ({
    user,
    ready,
    error,
    login,
    register,
    logout,
    loginWithGoogleIdToken,
  }), [user, ready, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
