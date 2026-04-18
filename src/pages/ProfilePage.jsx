import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Heart, LibraryBig, LogIn, LogOut, Mail, Pen, Save, Star, Trophy, UserRound } from 'lucide-react'
import { ErrorState, LoadingState } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'
import { useLibrary } from '../hooks/useLibrary'
import { useProfile } from '../hooks/useProfile'
import { gameStatusLabels } from '../lib/gameLibrary'

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

function ProfileEditor({ initialNickname, initialBio, onSave }) {
  const [nickname, setNickname] = useState(initialNickname)
  const [bio, setBio] = useState(initialBio)
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      await onSave({ nickname, bio })
      setFeedback('Perfil atualizado com sucesso.')
    } catch {
      setFeedback('Nao foi possivel salvar o perfil.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="profile-edit-form" onSubmit={handleSubmit}>
      <label className="profile-edit-field">
        <span>Nickname</span>
        <input
          type="text"
          maxLength="40"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Como quer aparecer no GameDex"
        />
      </label>

      <label className="profile-edit-field">
        <span>Bio</span>
        <textarea
          rows="4"
          maxLength="240"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Conte rapido quais generos voce curte ou o que esta jogando agora"
        />
      </label>

      <div className="profile-actions-row">
        <button type="submit" className="primary-btn auth-action-btn" disabled={saving}>
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar perfil'}
        </button>
      </div>

      {feedback && (
        <p className={feedback.includes('sucesso') ? 'state-message success' : 'state-message error'}>
          {feedback}
        </p>
      )}
    </form>
  )
}

function ProfilePage() {
  const { user, authReady, authEnabled, authError, signInWithGoogle, signOut } = useAuth()
  const { items, loading, error } = useLibrary()
  const { profile, loading: profileLoading, error: profileError, saveProfile, displayName, photoURL } = useProfile()

  if (!authReady) {
    return <LoadingState message="Preparando perfil..." />
  }

  if (!authEnabled) {
    return <ErrorState message="Configure o Firebase web no .env para habilitar o perfil do usuario." />
  }

  if (!user) {
    return (
      <section className="content-page profile-page">
        <div className="hero-panel profile-hero">
          <p className="hero-kicker">Perfil do usuario</p>
          <h1>Entre para acessar seu perfil</h1>
          <p>Veja seus dados, acompanhe estatisticas da biblioteca e gerencie sua conta em um lugar proprio.</p>
          <div className="profile-actions-row">
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

  if (loading || profileLoading) {
    return <LoadingState message="Carregando dados do perfil..." />
  }

  if (error || profileError) {
    return <ErrorState message={error || profileError} />
  }

  const favoriteCount = items.filter((item) => item.isFavorite).length
  const completedCount = items.filter((item) => item.status === 'completed').length
  const playingCount = items.filter((item) => item.status === 'playing').length

  const statusSummary = Object.entries(
    items.reduce((accumulator, item) => {
      accumulator[item.status] = (accumulator[item.status] || 0) + 1
      return accumulator
    }, {}),
  ).sort((leftEntry, rightEntry) => rightEntry[1] - leftEntry[1])

  const maxStatusCount = statusSummary.length > 0 ? statusSummary[0][1] : 1

  const statCards = [
    { icon: <LibraryBig size={20} />, label: 'Jogos salvos', value: items.length, accent: 'var(--color-primary)' },
    { icon: <Heart size={20} />, label: 'Favoritos', value: favoriteCount, accent: '#ec4899' },
    { icon: <Gamepad2 size={20} />, label: 'Jogando', value: playingCount, accent: '#22d3ee' },
    { icon: <Trophy size={20} />, label: 'Completados', value: completedCount, accent: '#4ade80' },
  ]

  return (
    <section className="content-page profile-page">
      {/* Hero banner */}
      <motion.div
        className="profile-hero-banner"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-hero-glow" />
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback">
                <UserRound size={32} />
              </div>
            )}
            <span className="profile-avatar-ring" />
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-display-name">{displayName || 'Sua conta GameDex'}</h1>
            <p className="profile-email-line">
              <Mail size={14} />
              {user.email}
            </p>
            {profile.bio && <p className="profile-bio-text">{profile.bio}</p>}
          </div>
        </div>
        <div className="profile-hero-actions">
          <button type="button" className="secondary-btn auth-action-btn" onClick={signOut}>
            <LogOut size={16} />
            Sair da conta
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="profile-stats-row">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="profile-stat-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ '--stat-accent': stat.accent }}
          >
            <span className="profile-stat-icon">{stat.icon}</span>
            <div>
              <span className="profile-stat-label">{stat.label}</span>
              <strong className="profile-stat-value">{stat.value}</strong>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content grid */}
      <div className="profile-grid">
        {/* Edit profile */}
        <motion.div className="section-panel profile-card profile-card-wide" custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <div className="profile-card-header">
            <Pen size={18} />
            <h2 className="section-title">Editar perfil</h2>
          </div>
          <ProfileEditor
            key={`${user.uid}-${profile.updatedAt || 'profile'}`}
            initialNickname={profile.nickname || ''}
            initialBio={profile.bio || ''}
            onSave={saveProfile}
          />
        </motion.div>

        {/* Status chart */}
        <motion.div className="section-panel profile-card profile-card-wide" custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <div className="profile-card-header">
            <Trophy size={18} />
            <h2 className="section-title">Progresso por status</h2>
          </div>
          {statusSummary.length === 0 ? (
            <p className="profile-empty-copy">Você ainda não classificou nenhum jogo. Use a biblioteca para marcar progresso.</p>
          ) : (
            <div className="profile-status-bars">
              {statusSummary.map(([status, count]) => (
                <div key={status} className="profile-status-bar-row">
                  <span className="profile-status-bar-label">{gameStatusLabels[status] || status}</span>
                  <div className="profile-status-bar-track">
                    <motion.div
                      className="profile-status-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxStatusCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="profile-status-bar-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick link */}
        <motion.div className="section-panel profile-card profile-card-wide" custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <div className="profile-card-header">
            <Star size={18} />
            <h2 className="section-title">Acesso rápido</h2>
          </div>
          <div className="profile-quick-links">
            <Link to="/library" className="profile-quick-link">
              <LibraryBig size={18} />
              <div>
                <strong>Minha Biblioteca</strong>
                <span>Veja jogos salvos, filtre status e revise favoritos</span>
              </div>
            </Link>
            <Link to="/search" className="profile-quick-link">
              <Gamepad2 size={18} />
              <div>
                <strong>Buscar jogos</strong>
                <span>Descubra novos títulos e adicione à sua coleção</span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProfilePage
