import { useEffect, useState } from 'react'
import { ProfileContext } from './profile-context'
import { fetchProfile, updateProfile } from '../services/backendApi'
import { useAuth } from '../hooks/useAuth'

function buildFallbackProfile(user) {
  if (!user) {
    return {
      nickname: '',
      bio: '',
      displayName: '',
      email: '',
      photoURL: '',
      updatedAt: null,
    }
  }

  return {
    nickname: '',
    bio: '',
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    updatedAt: null,
  }
}

export function ProfileProvider({ children }) {
  const { user, authReady } = useAuth()
  const [profile, setProfile] = useState(buildFallbackProfile(null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authReady) return

    if (!user) {
      setProfile(buildFallbackProfile(null))
      setError('')
      return
    }

    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')
        const idToken = await user.getIdToken()
        const remoteProfile = await fetchProfile(idToken)
        setProfile({
          ...buildFallbackProfile(user),
          ...remoteProfile,
        })
      } catch (loadError) {
        console.error(loadError)
        setProfile(buildFallbackProfile(user))
        setError('Nao foi possivel carregar o perfil do usuario.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [authReady, user])

  async function saveProfile(updates) {
    if (!user) {
      throw new Error('Usuario nao autenticado.')
    }

    try {
      setError('')
      const idToken = await user.getIdToken()
      const nextProfile = await updateProfile(idToken, {
        ...updates,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      })

      setProfile((currentProfile) => ({
        ...currentProfile,
        ...nextProfile,
      }))

      return nextProfile
    } catch (saveError) {
      console.error(saveError)
      setError('Nao foi possivel salvar o perfil.')
      throw saveError
    }
  }

  const displayName = profile.nickname || profile.displayName || user?.displayName || user?.email || 'Usuario'
  const photoURL = profile.photoURL || user?.photoURL || ''

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        saveProfile,
        displayName,
        photoURL,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
