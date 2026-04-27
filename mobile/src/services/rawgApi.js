import axios from 'axios'
import { ENV, requireEnv } from '../config/env'

const api = axios.create({
  baseURL: 'https://api.rawg.io/api',
  timeout: 10000, // 10 segundos
})

const API_KEY = requireEnv('EXPO_PUBLIC_RAWG_API_KEY', ENV.RAWG_API_KEY)

// Adicionar interceptor para melhor tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`RAWG API Error ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      console.error('No response from RAWG API:', error.request)
    } else {
      console.error('RAWG Request error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Validar que a chave de API está configurada
if (!API_KEY) {
  console.warn('⚠️ RAWG API Key não está configurado. Defina EXPO_PUBLIC_RAWG_API_KEY nas variáveis de ambiente.')
}

export async function fetchGames(params = {}) {
  if (!API_KEY) {
    throw new Error('RAWG API Key não está configurado')
  }

  const response = await api.get('/games', {
    params: {
      key: API_KEY,
      page_size: 20,
      ...params,
    },
  })

  return response.data.results || []
}

export async function fetchTrendingGames() {
  return fetchGames({ ordering: '-added' })
}

export async function searchGames(query) {
  if (!query || query.trim().length === 0) {
    return []
  }

  return fetchGames({ search: query, page_size: 30 })
}

export async function fetchGameDetails(gameId) {
  if (!API_KEY) {
    throw new Error('RAWG API Key não está configurado')
  }

  if (!gameId) {
    throw new Error('gameId is required')
  }

  const response = await api.get(`/games/${gameId}`, {
    params: { key: API_KEY },
  })

  return response.data || null
}
