import axios from 'axios'
import { ENV, requireEnv } from '../config/env'

const api = axios.create({
  baseURL: 'https://api.rawg.io/api',
})

const API_KEY = requireEnv('EXPO_PUBLIC_RAWG_API_KEY', ENV.RAWG_API_KEY)

export async function fetchGames(params = {}) {
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
  return fetchGames({ search: query, page_size: 30 })
}

export async function fetchGameDetails(gameId) {
  const response = await api.get(`/games/${gameId}`, {
    params: { key: API_KEY },
  })

  return response.data || null
}
