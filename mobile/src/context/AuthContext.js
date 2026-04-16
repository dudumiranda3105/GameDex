import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const auth = getFirebaseAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setReady(true)
    })

    return unsubscribe
  }, [auth])

  async function login(email, password) {
    try {
      setError('')
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (loginError) {
      console.error(loginError)
      setError('Nao foi possivel entrar. Verifique email e senha.')
      throw loginError
    }
  }

  async function register(email, password, nickname) {
    try {
      setError('')
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (nickname?.trim()) {
        await updateProfile(credential.user, { displayName: nickname.trim() })
      }
    } catch (registerError) {
      console.error(registerError)
      setError('Nao foi possivel criar a conta.')
      throw registerError
    }
  }

  async function logout() {
    await signOut(auth)
  }

  const value = useMemo(() => ({ user, ready, error, login, register, logout }), [user, ready, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
