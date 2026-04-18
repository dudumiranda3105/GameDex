import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, LogIn, Star, Calendar, Gamepad2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLibrary } from '../hooks/useLibrary'
import { gameStatusLabels } from '../lib/gameLibrary'
import { getImageUrl } from '../services/rawgApi'

function GameCard({ game, index = 0 }) {
  const { user, authEnabled, signInWithGoogle } = useAuth()
  const { getEntry, toggleFavorite } = useLibrary()
  const libraryEntry = getEntry(game.id)
  const ratingColor = game.rating >= 4 ? '#4ade80' : game.rating >= 3 ? '#facc15' : '#f87171'
  const releasedYear = game.released?.slice(0, 4) || 'Sem data'
  const platformNames = game.parent_platforms?.map((p) => p.platform.name) || []
  const platformPreview = platformNames.length > 3
    ? platformNames.slice(0, 3).join(' · ') + ` +${platformNames.length - 3}`
    : platformNames.join(' · ') || 'Multiplataforma'

  const handleFavoriteClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!authEnabled || !user) {
      await signInWithGoogle()
      return
    }

    try {
      await toggleFavorite(game)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <motion.div
      className="game-card-shell"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.985 }}
    >
      <button
        type="button"
        className={libraryEntry?.isFavorite ? 'quick-favorite-btn active' : 'quick-favorite-btn'}
        onClick={handleFavoriteClick}
        aria-label={libraryEntry?.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {user ? <Heart size={15} fill={libraryEntry?.isFavorite ? 'currentColor' : 'none'} /> : <LogIn size={15} />}
      </button>

      <Link to={`/game/${game.id}`} className="game-card-link">
        <div className="game-card">
          <div className="game-cover-wrapper">
            <img src={getImageUrl(game.background_image)} alt={game.name} className="game-cover" loading="lazy" />
            <div className="game-cover-overlay" />
            <div className="game-cover-shine" />

            {libraryEntry?.status && (
              <span className="game-status-chip">{gameStatusLabels[libraryEntry.status]}</span>
            )}

            {game.rating > 0 && (
              <motion.span
                className="rating-badge"
                style={{ '--rating-color': ratingColor }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.22 + index * 0.04, type: 'spring', stiffness: 280, damping: 18 }}
              >
                <Star size={12} fill="currentColor" />
                {game.rating.toFixed(1)}
              </motion.span>
            )}
          </div>

          <div className="game-content">
            <div className="game-meta">
              {game.genres?.slice(0, 2).map((genre) => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
            <h3 className="game-title">{game.name}</h3>

            <div className="game-info-row">
              <span className="game-info-item">
                <Gamepad2 size={13} />
                {platformPreview}
              </span>
            </div>

            <div className="game-footer-row">
              <span className="game-year">
                <Calendar size={12} />
                {releasedYear}
              </span>
              <span className="game-link-text">Ver mais →</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default GameCard
