import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ErrorState, SkeletonGameDetails } from '../components/FeedbackState'
import { fetchGameDetails, fetchGameScreenshots, getImageUrl } from '../services/rawgApi'

function GameDetailsPage() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true)
        const [details, images] = await Promise.all([
          fetchGameDetails(id),
          fetchGameScreenshots(id),
        ])

        setGame(details)
        setScreenshots(images)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadGameData()
  }, [id])

  if (loading) return <SkeletonGameDetails />
  if (error || !game) return <ErrorState message="Não foi possível carregar os detalhes deste jogo." />

  const quickStats = [
    { label: 'Nota', value: game.rating ? game.rating.toFixed(1) : 'N/A' },
    { label: 'Metacritic', value: game.metacritic || 'N/A' },
    { label: 'Tempo médio', value: game.playtime ? `${game.playtime}h` : 'N/A' },
    { label: 'Avaliações', value: game.ratings_count || 'N/A' },
  ]

  const infoRows = [
    { label: 'Desenvolvedor', value: game.developers?.map((developer) => developer.name).join(', ') || 'N/A' },
    { label: 'Publicadora', value: game.publishers?.map((publisher) => publisher.name).join(', ') || 'N/A' },
    { label: 'Classificação', value: game.esrb_rating?.name || 'N/A' },
    { label: 'Atualizado', value: game.updated?.slice(0, 10) || 'N/A' },
  ]

  const genres = game.genres?.map((genre) => genre.name) || []
  const platforms = game.platforms?.map((platform) => platform.platform.name) || []

  return (
    <article className="details-page">
      <motion.div
        className="details-hero"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={getImageUrl(game.background_image)} alt={game.name} className="details-cover" />
      </motion.div>

      <motion.div
        className="details-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1>{game.name}</h1>
        {game.rating > 0 && (
          <motion.span
            className="details-rating"
            style={{
              background: game.rating >= 4 ? '#4ade80' : game.rating >= 3 ? '#facc15' : '#f87171',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
          >
            Nota {game.rating.toFixed(1)}
          </motion.span>
        )}
      </motion.div>

      <motion.p
        className="details-subtitle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
      >
        {game.released ? `Lançamento: ${game.released}` : 'Data de lançamento não informada'}
      </motion.p>

      <motion.div
        className="details-stats-grid"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22 }}
      >
        {quickStats.map((item) => (
          <div key={item.label} className="details-stat-card section-panel">
            <p className="details-stat-label">{item.label}</p>
            <p className="details-stat-value">{item.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="details-actions"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
      >
        {game.website && (
          <a href={game.website} target="_blank" rel="noreferrer" className="primary-btn">
            Site oficial
          </a>
        )}
        {game.reddit_url && (
          <a href={game.reddit_url} target="_blank" rel="noreferrer" className="secondary-btn">
            Comunidade
          </a>
        )}
      </motion.div>

      <div className="details-content-grid">
        <motion.div
          className="section-panel details-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
        >
          <h2 className="section-title">Sobre o jogo</h2>
          <div dangerouslySetInnerHTML={{ __html: game.description || 'Sem descrição disponível.' }} />
        </motion.div>

        <motion.div
          className="details-list section-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="section-title">Informações</h2>

          {infoRows.map((row) => (
            <div key={row.label} className="details-row">
              <span className="details-label">{row.label}</span>
              <span className="details-value">{row.value}</span>
            </div>
          ))}

          <div className="details-row">
            <span className="details-label">Gêneros</span>
            <div className="details-tags-wrap">
              {genres.length > 0
                ? genres.map((genre) => (
                  <span key={genre} className="details-tag">{genre}</span>
                ))
                : <span className="details-value">N/A</span>}
            </div>
          </div>

          <div className="details-row">
            <span className="details-label">Plataformas</span>
            <div className="details-tags-wrap">
              {platforms.length > 0
                ? platforms.map((platform) => (
                  <span key={platform} className="details-tag">{platform}</span>
                ))
                : <span className="details-value">N/A</span>}
            </div>
          </div>
        </motion.div>
      </div>

      {screenshots.length > 0 && (
        <motion.section
          className="game-section section-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="section-title">Screenshots</h2>
          <div className="screenshots-grid">
            {screenshots.slice(0, 6).map((screenshot, index) => (
              <motion.img
                key={screenshot.id}
                src={getImageUrl(screenshot.image)}
                alt={`Screenshot de ${game.name}`}
                className="screenshot-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </motion.section>
      )}
    </article>
  )
}

export default GameDetailsPage
