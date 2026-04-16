import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, LibraryBig, LogIn, LogOut, Save, Trophy, UserRound } from 'lucide-react'
import { ErrorState, LoadingState } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'
import { useLibrary } from '../hooks/useLibrary'
import { useProfile } from '../hooks/useProfile'
import { gameStatusLabels } from '../lib/gameLibrary'

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

  return (
    <section className="content-page profile-page">
      <motion.div
        className="hero-panel profile-hero"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="profile-hero-head">
          <div className="profile-avatar-wrap">
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback">
                <UserRound size={28} />
              </div>
            )}
          </div>
          <div>
        <p className="hero-kicker">Perfil do usuario</p>
        <h1>{displayName || 'Sua conta GameDex'}</h1>
        <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-actions-row">
          <button type="button" className="secondary-btn auth-action-btn" onClick={signOut}>
            <LogOut size={16} />
            Sair da conta
          </button>
        </div>
      </motion.div>

      <div className="profile-grid">
        <div className="section-panel profile-card">
          <div className="profile-card-header">
            <UserRound size={18} />
            <h2 className="section-title">Conta</h2>
          </div>
          <div className="profile-info-list">
            <div className="profile-info-row">
              <span>Nome exibido</span>
              <strong>{displayName || 'Nao informado'}</strong>
            </div>
            <div className="profile-info-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="profile-info-row">
              <span>UID</span>
              <strong className="profile-uid">{user.uid}</strong>
            </div>
            <div className="profile-info-row">
              <span>Bio</span>
              <strong className="profile-bio-preview">{profile.bio || 'Sem bio definida'}</strong>
            </div>
          </div>
        </div>

        <div className="section-panel profile-card">
          <div className="profile-card-header">
            <UserRound size={18} />
            <h2 className="section-title">Editar perfil</h2>
          </div>
          <ProfileEditor
            key={`${user.uid}-${profile.updatedAt || 'profile'}`}
            initialNickname={profile.nickname || ''}
            initialBio={profile.bio || ''}
            onSave={saveProfile}
          />
        </div>

        <div className="section-panel profile-card">
          <div className="profile-card-header">
            <LibraryBig size={18} />
            <h2 className="section-title">Resumo da biblioteca</h2>
          </div>
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span>Jogos salvos</span>
              <strong>{items.length}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Favoritos</span>
              <strong>{favoriteCount}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Jogando</span>
              <strong>{playingCount}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Completados</span>
              <strong>{completedCount}</strong>
            </div>
          </div>
        </div>

        <div className="section-panel profile-card profile-card-wide">
          <div className="profile-card-header">
            <Trophy size={18} />
            <h2 className="section-title">Status mais usados</h2>
          </div>
          {statusSummary.length === 0 ? (
            <p className="profile-empty-copy">Voce ainda nao classificou nenhum jogo. Use a biblioteca para marcar progresso.</p>
          ) : (
            <div className="profile-status-list">
              {statusSummary.map(([status, count]) => (
                <div key={status} className="profile-status-row">
                  <span>{gameStatusLabels[status] || status}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-panel profile-card profile-card-wide">
          <div className="profile-card-header">
            <Heart size={18} />
            <h2 className="section-title">Atalho</h2>
          </div>
          <p className="profile-empty-copy">Acesse a aba Minha biblioteca para ver os jogos salvos, filtrar status e revisar favoritos.</p>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
