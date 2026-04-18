import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { ArrowLeft, LibraryBig, ShieldCheck, Sparkles } from 'lucide-react'
import { LoadingState } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth() || {}
  const {
    authReady = false,
    authEnabled = false,
    authError = '',
    clearAuthError = () => {},
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = auth
  const [mode, setMode] = useState('login')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function handleSwitchMode(nextMode) {
    setMode(nextMode)
    setFormError('')
    clearAuthError()
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!authEnabled) {
      return
    }

    if (!email.trim() || !password) {
      setFormError('Preencha email e senha para continuar.')
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setFormError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setFormError('')
    clearAuthError()
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        await signUpWithEmail({ email, password, displayName })
      } else {
        await signInWithEmail(email, password)
      }
    } catch {
      // Error message handled in AuthContext/authError.
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!authReady) {
    return <LoadingState message="Preparando autenticacao..." />
  }

  return (
    <section className="content-page login-page">
      <div className="section-panel login-card">
        <div className="login-visual-glow" />
        <div className="login-visual-glow secondary" />

        <div className="login-card-top">
          <button
            type="button"
            className="login-back-link"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
        </div>

        <p className="hero-kicker">Acesso</p>
        <h1>Faça login no GameDex</h1>
        <p className="login-copy">
          Conecte com Google para sincronizar sua biblioteca, favoritos e perfil entre web e mobile.
        </p>

        <div className="login-highlights">
          <span>
            <LibraryBig size={16} />
            Biblioteca na nuvem
          </span>
          <span>
            <Sparkles size={16} />
            Preferencias sincronizadas
          </span>
          <span>
            <ShieldCheck size={16} />
            Login seguro com Google e Email
          </span>
        </div>

        <div className="login-actions">
          <div className="login-mode-toggle" role="tablist" aria-label="Modo de autenticacao">
            <button
              type="button"
              className={mode === 'login' ? 'login-mode-btn active' : 'login-mode-btn'}
              onClick={() => handleSwitchMode('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'login-mode-btn active' : 'login-mode-btn'}
              onClick={() => handleSwitchMode('signup')}
            >
              Criar conta
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="login-field" htmlFor="displayName">
                <span>Nome de exibicao</span>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Como voce quer aparecer no app"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="login-field" htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="login-field" htmlFor="password">
              <span>Senha</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === 'signup' ? 'Minimo 6 caracteres' : 'Sua senha'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
            </label>

            <button
              type="submit"
              className="primary-btn login-submit-btn"
              disabled={isSubmitting || !authEnabled || !signInWithEmail || !signUpWithEmail}
            >
              {isSubmitting ? 'Aguarde...' : mode === 'signup' ? 'Criar conta' : 'Entrar com email'}
            </button>
          </form>

          {(formError || authError) && <p className="state-message error">{formError || authError}</p>}

          <div className="login-divider" aria-hidden="true">
            <span>ou</span>
          </div>

          {authEnabled ? (
            <button
              type="button"
              className="login-social-btn"
              disabled={!signInWithGoogle}
              onClick={signInWithGoogle}
            >
              <span className="login-social-icon" aria-hidden="true">
                <FcGoogle size={20} />
              </span>
              <span>Conectar com Google</span>
            </button>
          ) : (
            <p className="state-message error">
              Firebase web nao configurado. Defina as variaveis VITE_FIREBASE_* para liberar login.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default LoginPage
