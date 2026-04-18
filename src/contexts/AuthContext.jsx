import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { AuthContext } from './auth-context'
import { getFirebaseAuth, isFirebaseClientConfigured } from '../lib/firebase'

export function AuthProvider({ children }) {
  const authEnabled = isFirebaseClientConfigured()
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!authEnabled)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!authEnabled) {
      return undefined
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthReady(true)
    })

    return unsubscribe
  }, [authEnabled])

  function clearAuthError() {
    setAuthError('')
  }

  function mapFirebaseAuthError(error) {
    const code = error?.code || ''
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : ''

    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Email ou senha invalidos.'
    }

    if (code === 'auth/invalid-email') {
      return 'Formato de email invalido.'
    }

    if (code === 'auth/email-already-in-use') {
      return 'Este email ja esta cadastrado.'
    }

    if (code === 'auth/weak-password') {
      return 'Senha muito fraca. Use pelo menos 6 caracteres.'
    }

    if (code === 'auth/operation-not-allowed') {
      return 'Login por email/senha desativado no Firebase Console.'
    }

    if (code === 'auth/unauthorized-domain') {
      return `Dominio nao autorizado no Firebase Auth: ${currentHost || 'dominio atual'}. Adicione em Authentication > Settings > Authorized domains.`
    }

    if (code === 'auth/popup-blocked') {
      return 'O navegador bloqueou o popup de login. Libere popups e tente novamente.'
    }

    if (code === 'auth/popup-closed-by-user') {
      return 'O popup de login foi fechado antes da autenticacao.'
    }

    return 'Nao foi possivel autenticar agora. Tente novamente.'
  }

  async function signInWithGoogle() {
    if (!authEnabled) {
      setAuthError('Configure o Firebase web no .env antes de habilitar login.')
      return
    }

    try {
      setAuthError('')
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      await setPersistence(auth, browserLocalPersistence)
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
      setAuthError(mapFirebaseAuthError(error))
    }
  }

  async function signInWithEmail(email, password) {
    if (!authEnabled) {
      setAuthError('Configure o Firebase web no .env antes de habilitar login.')
      return
    }

    try {
      setAuthError('')
      const auth = getFirebaseAuth()
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (error) {
      console.error(error)
      setAuthError(mapFirebaseAuthError(error))
      throw error
    }
  }

  async function signUpWithEmail({ email, password, displayName }) {
    if (!authEnabled) {
      setAuthError('Configure o Firebase web no .env antes de habilitar login.')
      return
    }

    try {
      setAuthError('')
      const auth = getFirebaseAuth()
      await setPersistence(auth, browserLocalPersistence)
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)

      if (displayName?.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() })
      }
    } catch (error) {
      console.error(error)
      setAuthError(mapFirebaseAuthError(error))
      throw error
    }
  }

  async function signOut() {
    if (!authEnabled) return

    try {
      setAuthError('')
      await firebaseSignOut(getFirebaseAuth())
    } catch (error) {
      console.error(error)
      setAuthError('Nao foi possivel sair da conta.')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        authEnabled,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
