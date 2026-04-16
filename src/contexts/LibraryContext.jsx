import { useEffect, useState } from 'react'
import { LibraryContext } from './library-context'
import { deleteLibraryEntry, fetchLibrary, upsertLibraryEntry } from '../services/backendApi'
import { mapGameToLibraryPayload } from '../lib/gameLibrary'
import { useAuth } from '../hooks/useAuth'

export function LibraryProvider({ children }) {
  const { user, authReady } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authReady) return

    if (!user) {
      setItems([])
      setError('')
      return
    }

    const loadLibrary = async () => {
      try {
        setLoading(true)
        setError('')
        const idToken = await user.getIdToken()
        const nextItems = await fetchLibrary(idToken)
        setItems(nextItems)
      } catch (loadError) {
        console.error(loadError)
        setError('Nao foi possivel carregar sua biblioteca.')
      } finally {
        setLoading(false)
      }
    }

    loadLibrary()
  }, [authReady, user])

  async function saveGameEntry(game, overrides = {}) {
    if (!user) {
      throw new Error('Usuario nao autenticado.')
    }

    const existingEntry = items.find((item) => String(item.gameId) === String(game.id))
    const payload = mapGameToLibraryPayload(game, {
      isFavorite: overrides.isFavorite ?? existingEntry?.isFavorite ?? false,
      status: overrides.status ?? existingEntry?.status ?? 'want_to_play',
      notes: overrides.notes ?? existingEntry?.notes ?? '',
    })

    try {
      setError('')
      const idToken = await user.getIdToken()
      await upsertLibraryEntry(idToken, payload)
      setItems((currentItems) => {
        const nextItem = {
          ...existingEntry,
          ...payload,
          savedAt: existingEntry?.savedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const remainingItems = currentItems.filter((item) => String(item.gameId) !== String(game.id))
        return [nextItem, ...remainingItems].sort((itemA, itemB) => (
          new Date(itemB.updatedAt).getTime() - new Date(itemA.updatedAt).getTime()
        ))
      })
    } catch (saveError) {
      console.error(saveError)
      setError('Nao foi possivel salvar este jogo na sua biblioteca.')
      throw saveError
    }
  }

  async function toggleFavorite(game) {
    const existingEntry = items.find((item) => String(item.gameId) === String(game.id))

    await saveGameEntry(game, {
      isFavorite: !existingEntry?.isFavorite,
      status: existingEntry?.status || 'want_to_play',
      notes: existingEntry?.notes || '',
    })
  }

  async function removeGameEntry(gameId) {
    if (!user) {
      throw new Error('Usuario nao autenticado.')
    }

    try {
      setError('')
      const idToken = await user.getIdToken()
      await deleteLibraryEntry(idToken, gameId)
      setItems((currentItems) => currentItems.filter((item) => String(item.gameId) !== String(gameId)))
    } catch (removeError) {
      console.error(removeError)
      setError('Nao foi possivel remover este jogo da biblioteca.')
      throw removeError
    }
  }

  function getEntry(gameId) {
    return items.find((item) => String(item.gameId) === String(gameId)) || null
  }

  return (
    <LibraryContext.Provider
      value={{
        items,
        loading,
        error,
        saveGameEntry,
        toggleFavorite,
        removeGameEntry,
        getEntry,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
