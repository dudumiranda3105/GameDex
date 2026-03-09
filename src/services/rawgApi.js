import axios from 'axios'

const API_BASE_URL = 'https://api.rawg.io/api'
const API_KEY = import.meta.env.VITE_RAWG_API_KEY

if (!API_KEY) {
  console.warn('VITE_RAWG_API_KEY não definida. Crie um arquivo .env com sua chave da RAWG.')
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

const defaultParams = {
  key: API_KEY,
  page_size: 12,
}

export async function fetchGames(params = {}) {
  const response = await api.get('/games', {
    params: {
      ...defaultParams,
      ...params,
    },
  })

  return response.data.results || []
}

export async function fetchGenres() {
  const response = await api.get('/genres', {
    params: {
      key: API_KEY,
      page_size: 40,
    },
  })

  return response.data.results || []
}

export async function fetchPlatforms() {
  const response = await api.get('/platforms/lists/parents', {
    params: {
      key: API_KEY,
    },
  })

  return response.data.results || []
}

export async function fetchGameDetails(id) {
  const response = await api.get(`/games/${id}`, {
    params: { key: API_KEY },
  })

  return response.data
}

export async function fetchGameScreenshots(id) {
  const response = await api.get(`/games/${id}/screenshots`, {
    params: { key: API_KEY },
  })

  return response.data.results || []
}

export function getImageUrl(url) {
  if (!url) return 'https://placehold.co/600x400?text=Sem+Imagem'
  return url
}
