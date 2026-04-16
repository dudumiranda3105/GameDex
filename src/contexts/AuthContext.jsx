import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
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
      setAuthError('Nao foi possivel entrar com Google.')
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
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
