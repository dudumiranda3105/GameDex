import axios from 'axios'
import { ENV, requireEnv } from '../config/env'

const api = axios.create({
  baseURL: requireEnv('EXPO_PUBLIC_API_BASE_URL', ENV.API_BASE_URL),
})

// Adicionar interceptor para melhor tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro da API (400, 401, 500, etc)
      console.error(`API Error ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('No response from API:', error.request)
    } else {
      // Erro ao configurar a requisição
      console.error('Request error:', error.message)
    }
    return Promise.reject(error)
  }
)

function authHeaders(idToken) {
  if (!idToken) {
    console.warn('No idToken provided for API request')
  }
  return { Authorization: `Bearer ${idToken}` }
}

export async function fetchLibrary(idToken) {
  if (!idToken) throw new Error('idToken is required')
  
  const response = await api.get('/library', { headers: authHeaders(idToken) })
  return response.data.items || []
}

export async function upsertLibrary(idToken, payload) {
  if (!idToken) throw new Error('idToken is required')
  if (!payload.gameId) throw new Error('gameId is required in payload')
  
  const response = await api.post('/library', payload, { headers: authHeaders(idToken) })
  return response.data
}

export async function deleteLibraryEntry(idToken, gameId) {
  if (!idToken) throw new Error('idToken is required')
  if (!gameId) throw new Error('gameId is required')
  
  const response = await api.delete('/library', {
    headers: authHeaders(idToken),
    params: { gameId },
  })

  return response.data
}

export async function fetchProfile(idToken) {
  if (!idToken) throw new Error('idToken is required')
  
  const response = await api.get('/profile', { headers: authHeaders(idToken) })
  return response.data.profile || null
}

export async function updateProfile(idToken, payload) {
  if (!idToken) throw new Error('idToken is required')
  
  const response = await api.post('/profile', payload, { headers: authHeaders(idToken) })
  return response.data.profile || null
}
