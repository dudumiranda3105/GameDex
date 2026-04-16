import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, LibraryBig, LogIn } from 'lucide-react'
import GameCard from '../components/GameCard'
import { EmptyState, ErrorState, LoadingState } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'
import { useLibrary } from '../hooks/useLibrary'
import { gameStatusLabels, gameStatusOptions, mapLibraryItemToGame } from '../lib/gameLibrary'

function LibraryPage() {
  const { user, authReady, authEnabled, authError, signInWithGoogle } = useAuth()
  const { items, loading, error } = useLibrary()
  const [statusFilter, setStatusFilter] = useState('all')
  const [favoriteOnly, setFavoriteOnly] = useState(false)

  if (!authReady) {
    return <LoadingState message="Preparando autenticacao..." />
  }

  if (!authEnabled) {
    return <ErrorState message="Configure o Firebase web no .env para habilitar login e biblioteca." />
  }

  if (!user) {
    return (
      <section className="content-page library-page">
        <div className="hero-panel library-hero">
          <p className="hero-kicker">Colecao pessoal</p>
          <h1>Entre para salvar seus jogos</h1>
          <p>Guarde favoritos, marque o que esta jogando, o que completou e o que ainda quer jogar.</p>
          <div className="library-auth-actions">
            <button type="button" className="primary-btn auth-action-btn" onClick={signInWithGoogle}>
              <LogIn size={18} />
              Entrar com Google
            </button>
          </div>
          {authError && <p className="state-message error">{authError}</p>}
        </div>
      </section>
    )
  }

  if (loading) {
    return <LoadingState message="Carregando sua biblioteca..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const filteredItems = items.filter((item) => {
    if (favoriteOnly && !item.isFavorite) return false
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    return true
  })

  const favoriteCount = items.filter((item) => item.isFavorite).length
  const currentlyPlayingCount = items.filter((item) => item.status === 'playing').length
  const completedCount = items.filter((item) => item.status === 'completed').length

  return (
    <section className="content-page library-page">
      <motion.div
        className="hero-panel library-hero"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="hero-kicker">Minha biblioteca</p>
        <h1>{user.displayName ? `${user.displayName.split(' ')[0]}, organize seus jogos` : 'Organize seus jogos'}</h1>
        <p>Seu espaco pessoal para acompanhar progresso, favoritos e backlog.</p>

        <div className="library-stats-grid">
          <div className="section-panel library-stat-card">
            <span className="library-stat-label">Na biblioteca</span>
            <strong className="library-stat-value">{items.length}</strong>
          </div>
          <div className="section-panel library-stat-card">
            <span className="library-stat-label">Favoritos</span>
            <strong className="library-stat-value">{favoriteCount}</strong>
          </div>
          <div className="section-panel library-stat-card">
            <span className="library-stat-label">Jogando agora</span>
            <strong className="library-stat-value">{currentlyPlayingCount}</strong>
          </div>
          <div className="section-panel library-stat-card">
            <span className="library-stat-label">Completados</span>
            <strong className="library-stat-value">{completedCount}</strong>
          </div>
        </div>
      </motion.div>

      <div className="section-panel library-toolbar">
        <div className="library-toolbar-row">
          <label className="library-filter-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Todos</option>
              {gameStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={favoriteOnly ? 'secondary-btn library-toggle-btn active' : 'secondary-btn library-toggle-btn'}
            onClick={() => setFavoriteOnly((currentValue) => !currentValue)}
          >
            <Heart size={16} />
            Somente favoritos
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          message={items.length === 0
            ? 'Voce ainda nao adicionou jogos. Abra um jogo e salve na sua biblioteca.'
            : 'Nenhum jogo encontrado com os filtros atuais.'}
        />
      ) : (
        <div className="games-grid">
          {filteredItems.map((item, index) => (
            <div key={item.gameId} className="library-card-slot">
              <div className="library-card-meta">
                <span className="library-item-status">{gameStatusLabels[item.status] || 'Quero jogar'}</span>
                {item.isFavorite && (
                  <span className="library-item-favorite">
                    <Heart size={14} fill="currentColor" />
                    Favorito
                  </span>
                )}
              </div>
              <GameCard game={mapLibraryItemToGame(item)} index={index} />
              {item.notes && <p className="library-item-notes">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="section-panel library-hint-card">
        <p className="sidebar-card-title">
          <LibraryBig size={18} />
          Como usar
        </p>
        <p>Abra a tela de detalhes de qualquer jogo para marcar progresso, favoritar e deixar observacoes pessoais.</p>
      </div>
    </section>
  )
}

export default LibraryPage
