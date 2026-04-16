import { getFirebaseServices } from './_lib/firebaseAdmin.js'
import { handlePreflight, parseJsonBody, requireAuth, setCors } from './_lib/http.js'

function userFavoritesCollection(db, uid) {
  return db.collection('users').doc(uid).collection('library')
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return

  setCors(res)

  try {
    const decodedToken = await requireAuth(req)
    const { db } = getFirebaseServices()
    const favoritesRef = userFavoritesCollection(db, decodedToken.uid)

    if (req.method === 'GET') {
      const snapshot = await favoritesRef.orderBy('savedAt', 'desc').get()
      const favorites = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.isFavorite)

      return res.status(200).json({ favorites })
    }

    if (req.method === 'POST') {
      const body = parseJsonBody(req)
      const { gameId, title, coverUrl, rating, released, platforms } = body

      if (!gameId || !title) {
        return res.status(400).json({ error: 'Campos obrigatorios: gameId e title.' })
      }

      const docId = String(gameId)
      await favoritesRef.doc(docId).set(
        {
          gameId,
          title,
          coverUrl: coverUrl || null,
          rating: rating || null,
          released: released || null,
          platforms: Array.isArray(platforms) ? platforms : [],
          status: body.status || 'want_to_play',
          genres: Array.isArray(body.genres) ? body.genres : [],
          notes: body.notes || '',
          isFavorite: true,
          savedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

      await favoritesRef.doc(String(gameId)).set(
        {
          isFavorite: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
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
