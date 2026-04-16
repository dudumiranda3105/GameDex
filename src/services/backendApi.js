import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

function authHeaders(idToken) {
  return {
    Authorization: `Bearer ${idToken}`,
  }
}

export async function fetchFavorites(idToken) {
  const response = await api.get('/favorites', {
    headers: authHeaders(idToken),
  })

  return response.data.favorites || []
}

export async function saveFavorite(idToken, favoritePayload) {
  const response = await api.post('/favorites', favoritePayload, {
    headers: authHeaders(idToken),
  })

  return response.data
}

export async function removeFavorite(idToken, gameId) {
  const response = await api.delete('/favorites', {
    headers: authHeaders(idToken),
    params: { gameId },
  })

  return response.data
}

export async function checkApiHealth() {
  const response = await api.get('/health')
  return response.data
}

export async function fetchLibrary(idToken) {
  const response = await api.get('/library', {
    headers: authHeaders(idToken),
  })

  return response.data.items || []
}

export async function upsertLibraryEntry(idToken, payload) {
  const response = await api.post('/library', payload, {
    headers: authHeaders(idToken),
  })

  return response.data
}

export async function deleteLibraryEntry(idToken, gameId) {
  const response = await api.delete('/library', {
    headers: authHeaders(idToken),
    params: { gameId },
  })

  return response.data
}

export async function fetchProfile(idToken) {
  const response = await api.get('/profile', {
    headers: authHeaders(idToken),
  })

  return response.data.profile || null
}

export async function updateProfile(idToken, payload) {
  const response = await api.post('/profile', payload, {
    headers: authHeaders(idToken),
  })

  return response.data.profile || null
}

