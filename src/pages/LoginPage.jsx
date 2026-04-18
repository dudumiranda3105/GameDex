import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { ArrowLeft, LibraryBig, ShieldCheck, Sparkles } from 'lucide-react'
import { LoadingState } from '../components/FeedbackState'
import { useAuth } from '../hooks/useAuth'

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32 } },
}

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
      <motion.div
        className="section-panel login-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
      >
        <div className="login-visual-glow" />
        <div className="login-visual-glow secondary" />

        <motion.div className="login-card-top" variants={itemVariants}>
          <button
            type="button"
            className="login-back-link"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
        </motion.div>

        <motion.p className="hero-kicker" variants={itemVariants}>Acesso</motion.p>
        <motion.h1 variants={itemVariants}>Faça login no GameDex</motion.h1>
        <motion.p className="login-copy" variants={itemVariants}>
          Conecte com Google para sincronizar sua biblioteca, favoritos e perfil entre web e mobile.
        </motion.p>

        <motion.div className="login-highlights" variants={itemVariants}>
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
        </motion.div>

        <motion.div className="login-actions" variants={itemVariants} layout>
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

          <motion.form className="login-form" onSubmit={handleSubmit} layout>
            {mode === 'signup' && (
              <motion.label
                className="login-field"
                htmlFor="displayName"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                transition={{ duration: 0.22 }}
              >
                <span>Nome de exibicao</span>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Como voce quer aparecer no app"
                  autoComplete="name"
                />
              </motion.label>
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
          </motion.form>

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
        </motion.div>
      </motion.div>
    </section>
  )
}

export default LoginPage
