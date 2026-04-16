import { getFirebaseServices } from './_lib/firebaseAdmin.js'
import { handlePreflight, parseJsonBody, requireAuth, setCors } from './_lib/http.js'

const validStatuses = new Set(['playing', 'completed', 'want_to_play', 'paused', 'dropped'])

function userLibraryCollection(db, uid) {
  return db.collection('users').doc(uid).collection('library')
}

function normalizeEntry(body) {
  const status = body.status && validStatuses.has(body.status) ? body.status : 'want_to_play'

  return {
    gameId: body.gameId,
    title: body.title,
    coverUrl: body.coverUrl || null,
    rating: body.rating || null,
    released: body.released || null,
    platforms: Array.isArray(body.platforms) ? body.platforms : [],
    genres: Array.isArray(body.genres) ? body.genres : [],
    isFavorite: Boolean(body.isFavorite),
    status,
    notes: body.notes || '',
    updatedAt: new Date().toISOString(),
  }
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return

  setCors(res)

  try {
    const decodedToken = await requireAuth(req)
    const { db } = getFirebaseServices()
    const libraryRef = userLibraryCollection(db, decodedToken.uid)

    if (req.method === 'GET') {
      const snapshot = await libraryRef.orderBy('updatedAt', 'desc').get()
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return res.status(200).json({ items })
    }

    if (req.method === 'POST') {
      const body = parseJsonBody(req)

      if (!body.gameId || !body.title) {
        return res.status(400).json({ error: 'Campos obrigatorios: gameId e title.' })
      }

      const docId = String(body.gameId)
      const docRef = libraryRef.doc(docId)
      const existingDoc = await docRef.get()
      const nextEntry = normalizeEntry(body)

      await docRef.set(
        {
          ...nextEntry,
          savedAt: existingDoc.exists ? existingDoc.data().savedAt : new Date().toISOString(),
        },
        { merge: true },
      )

      return res.status(201).json({ ok: true, id: docId })
    }

    if (req.method === 'DELETE') {
      const gameId = req.query.gameId

      if (!gameId) {
        return res.status(400).json({ error: 'Informe ?gameId=<id> na query string.' })
      }

      await libraryRef.doc(String(gameId)).delete()
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Metodo nao permitido.' })
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      error: error.message || 'Erro interno do servidor.',
    })
  }
}
