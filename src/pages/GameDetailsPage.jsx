import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, LogIn, Save, Trash2, BookmarkPlus, X, CheckCircle, ChevronDown } from 'lucide-react'
import { ErrorState, SkeletonGameDetails } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'
import { useLibrary } from '../hooks/useLibrary'
import { gameStatusOptions } from '../lib/gameLibrary'
import { fetchGameDetails, fetchGameScreenshots, getImageUrl } from '../services/rawgApi'

function GameDetailsPage() {
  const { id } = useParams()
  const { user, authEnabled, signInWithGoogle } = useAuth()
  const { getEntry, saveGameEntry, removeGameEntry, error: libraryError } = useLibrary()
  const [game, setGame] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('want_to_play')
  const [notes, setNotes] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState('')
  const [showLibraryPopup, setShowLibraryPopup] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  const libraryEntry = getEntry(id)

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

  useEffect(() => {
    setSelectedStatus(libraryEntry?.status || 'want_to_play')
    setNotes(libraryEntry?.notes || '')
    setIsFavorite(Boolean(libraryEntry?.isFavorite))
  }, [libraryEntry, id])

  const handleOpenLibraryPopup = async () => {
    if (!authEnabled || !user) {
      await signInWithGoogle()
      return
    }
    setSaveFeedback('')
    setStatusDropdownOpen(false)
    setShowLibraryPopup(true)
  }

  const handleSaveLibraryEntry = async () => {
    if (!user) {
      await signInWithGoogle()
      return
    }

    try {
      await saveGameEntry(game, {
        status: selectedStatus,
        notes,
        isFavorite,
      })
      setSaveFeedback('Biblioteca atualizada com sucesso.')
      setTimeout(() => setShowLibraryPopup(false), 1200)
    } catch (saveError) {
      console.error(saveError)
      setSaveFeedback('Nao foi possivel salvar suas alteracoes.')
    }
  }

  const handleRemoveLibraryEntry = async () => {
    try {
      await removeGameEntry(id)
      setSaveFeedback('Jogo removido da biblioteca.')
      setSelectedStatus('want_to_play')
      setNotes('')
      setIsFavorite(false)
      setTimeout(() => setShowLibraryPopup(false), 1200)
    } catch (removeError) {
      console.error(removeError)
      setSaveFeedback('Nao foi possivel remover este jogo.')
    }
  }

  useEffect(() => {
    if (showLibraryPopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showLibraryPopup])

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
  const genresLabel = genres.length > 0 ? genres.slice(0, 3).join(' • ') : 'Sem genero definido'

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

      <motion.p
        className="details-subheadline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        {genresLabel}
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
        <button
          type="button"
          className={libraryEntry ? 'library-popup-btn library-popup-btn--saved' : 'library-popup-btn'}
          onClick={handleOpenLibraryPopup}
        >
          {libraryEntry ? <CheckCircle size={18} /> : <BookmarkPlus size={18} />}
          {libraryEntry ? 'Na minha biblioteca' : 'Adicionar à biblioteca'}
        </button>
        {game.website && (
          <a href={game.website} target="_blank" rel="noreferrer" className="secondary-btn">
            Site oficial
          </a>
        )}
        {game.reddit_url && (
          <a href={game.reddit_url} target="_blank" rel="noreferrer" className="secondary-btn">
            Comunidade
          </a>
        )}
      </motion.div>

      <AnimatePresence>
        {showLibraryPopup && (
          <motion.div
            className="library-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setShowLibraryPopup(false)}
          >
            <motion.div
              className="library-popup"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="library-popup-header">
                <div>
                  <h3 className="library-popup-title">Minha Biblioteca</h3>
                  <p className="library-popup-subtitle">{game.name}</p>
                </div>
                <button
                  type="button"
                  className="library-popup-close"
                  onClick={() => setShowLibraryPopup(false)}
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="library-popup-body">
                <div className="library-popup-field">
                  <span>Status</span>
                  <div className="custom-select-wrapper">
                    <button
                      type="button"
                      className={statusDropdownOpen ? 'custom-select-trigger open' : 'custom-select-trigger'}
                      onClick={() => setStatusDropdownOpen((v) => !v)}
                    >
                      {gameStatusOptions.find((o) => o.value === selectedStatus)?.label}
                      <ChevronDown size={16} className="custom-select-chevron" />
                    </button>
                    <AnimatePresence>
                      {statusDropdownOpen && (
                        <motion.ul
                          className="custom-select-list"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                        >
                          {gameStatusOptions.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                className={opt.value === selectedStatus ? 'custom-select-option active' : 'custom-select-option'}
                                onClick={() => { setSelectedStatus(opt.value); setStatusDropdownOpen(false) }}
                              >
                                {opt.label}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <label className="library-popup-favorite">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                  />
                  <span>
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                    Marcar como favorito
                  </span>
                </label>

                <label className="library-popup-field">
                  <span>Observações</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: campanha quase no fim, quero testar DLC, coop com amigos..."
                    rows="3"
                  />
                </label>
              </div>

              <div className="library-popup-actions">
                <button type="button" className="primary-btn" onClick={handleSaveLibraryEntry}>
                  <Save size={16} />
                  {libraryEntry ? 'Atualizar' : 'Salvar'}
                </button>
                {libraryEntry && (
                  <button type="button" className="secondary-btn" onClick={handleRemoveLibraryEntry}>
                    <Trash2 size={16} />
                    Remover
                  </button>
                )}
              </div>

              {(saveFeedback || libraryError) && (
                <p className={saveFeedback?.includes('sucesso') || saveFeedback?.includes('Sincronizado') ? 'library-popup-feedback success' : 'library-popup-feedback error'}>
                  {saveFeedback || libraryError}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
