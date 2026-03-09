import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '../services/rawgApi'

function GameCard({ game, index = 0 }) {
  const ratingColor = game.rating >= 4 ? '#4ade80' : game.rating >= 3 ? '#facc15' : '#f87171'
  const releasedYear = game.released?.slice(0, 4) || 'Sem data'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
    >
        <Link to={`/game/${game.id}`} className="game-card-link">
        <div className="game-cover-wrapper">
          <img src={getImageUrl(game.background_image)} alt={game.name} className="game-cover" />
          <div className="game-cover-overlay" />
          <span className="card-hover-indicator">Ver detalhes</span>
          {game.rating > 0 && (
            <motion.span
              className="rating-badge"
              style={{ background: ratingColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.22 + index * 0.04, type: 'spring', stiffness: 280, damping: 18 }}
            >
              {game.rating.toFixed(1)}
            </motion.span>
          )}
        </div>
        <div className="game-content">
          <h3 className="game-title">{game.name}</h3>
          <div className="game-meta">
            {game.genres?.slice(0, 2).map((genre) => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>
          <p className="game-platforms">
            {game.parent_platforms?.map((p) => p.platform.name).join(' • ') || 'Multiplataforma'}
          </p>
          <div className="game-footer-row">
            <span>{releasedYear}</span>
            <span className="game-link-text">Abrir</span>
          </div>
        </div>
        </Link>
    </motion.div>
  )
}

export default GameCard
