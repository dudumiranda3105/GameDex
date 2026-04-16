import { handlePreflight, setCors } from './_lib/http.js'

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return

  setCors(res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo nao permitido.' })
  }

  return res.status(200).json({
    ok: true,
    service: 'gamedex-api',
    timestamp: new Date().toISOString(),
  })
}
