import { getFirebaseServices } from './_lib/firebaseAdmin.js'
import { handlePreflight, parseJsonBody, requireAuth, setCors } from './_lib/http.js'

function userProfileRef(db, uid) {
  return db.collection('users').doc(uid)
}

function normalizeProfile(body, decodedToken) {
  const nickname = typeof body.nickname === 'string' ? body.nickname.trim().slice(0, 40) : ''
  const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 240) : ''

  return {
    nickname,
    bio,
    displayName: body.displayName || decodedToken.name || '',
    email: body.email || decodedToken.email || '',
    photoURL: body.photoURL || decodedToken.picture || '',
    updatedAt: new Date().toISOString(),
  }
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return

  setCors(res)

  try {
    const decodedToken = await requireAuth(req)
    const { db } = getFirebaseServices()
    const profileRef = userProfileRef(db, decodedToken.uid)

    if (req.method === 'GET') {
      const snapshot = await profileRef.get()
      const profile = snapshot.exists ? snapshot.data() : {}

      return res.status(200).json({
        profile: {
          nickname: profile.nickname || '',
          bio: profile.bio || '',
          displayName: profile.displayName || decodedToken.name || '',
          email: profile.email || decodedToken.email || '',
          photoURL: profile.photoURL || decodedToken.picture || '',
          updatedAt: profile.updatedAt || null,
        },
      })
    }

    if (req.method === 'POST') {
      const body = parseJsonBody(req)
      const nextProfile = normalizeProfile(body, decodedToken)

      await profileRef.set(nextProfile, { merge: true })
      return res.status(200).json({ profile: nextProfile })
    }

    return res.status(405).json({ error: 'Metodo nao permitido.' })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      error: error.message || 'Erro interno do servidor.',
    })
  }
}
