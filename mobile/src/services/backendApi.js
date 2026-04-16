import axios from 'axios'
import { ENV, requireEnv } from '../config/env'

const api = axios.create({
  baseURL: requireEnv('EXPO_PUBLIC_API_BASE_URL', ENV.API_BASE_URL),
})

function authHeaders(idToken) {
  return { Authorization: `Bearer ${idToken}` }
}

export async function fetchLibrary(idToken) {
  const response = await api.get('/library', { headers: authHeaders(idToken) })
  return response.data.items || []
}

export async function upsertLibrary(idToken, payload) {
  const response = await api.post('/library', payload, { headers: authHeaders(idToken) })
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
  const response = await api.get('/profile', { headers: authHeaders(idToken) })
  return response.data.profile || null
}

export async function updateProfile(idToken, payload) {
  const response = await api.post('/profile', payload, { headers: authHeaders(idToken) })
  return response.data.profile || null
}
