import { getFirebaseServices } from './firebaseAdmin.js'

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res)
    res.status(204).end()
    return true
  }

  return false
}

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7)
}

export async function requireAuth(req) {
  const token = getBearerToken(req)
  if (!token) {
    const error = new Error('Token nao enviado no header Authorization: Bearer <token>.')
    error.statusCode = 401
    throw error
  }

  const { auth } = getFirebaseServices()

  try {
    return await auth.verifyIdToken(token)
  } catch {
    const error = new Error('Token invalido ou expirado.')
    error.statusCode = 401
    throw error
  }
}

export function parseJsonBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }

  return req.body
}
