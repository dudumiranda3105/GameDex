import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserRound, Gamepad2 } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'

const baseNavItems = [
  { to: '/', label: 'Home' },
  { to: '/library', label: 'Biblioteca' },
  { to: '/search', label: 'Busca' },
  { to: '/app', label: 'App' },
]

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, authEnabled } = useAuth()
  const { displayName, photoURL } = useProfile()
  const navItems = baseNavItems

  return (
    <div className="app-shell">
      <motion.header
        className="topbar"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 85, damping: 16 }}
      >
        <div className="topbar-inner">
          <NavLink to="/" className="topbar-brand-row" aria-label="GameDex Home">
            <span className="brand-icon"><Gamepad2 size={20} /></span>
            <span className="brand">GameDex</span>
          </NavLink>

          <nav className="topbar-nav" aria-label="Menu principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'topbar-nav-link active' : 'topbar-nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-account-area">
            {authEnabled && user ? (
                <motion.button
                  type="button"
                  className="topbar-avatar-link"
                  title="Ir para o perfil"
                  onClick={() => navigate('/profile')}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {photoURL ? (
                    <img src={photoURL} alt={displayName || 'Perfil'} className="topbar-avatar" />
                  ) : (
                    <span className="topbar-avatar-fallback">
                      <UserRound size={16} />
                    </span>
                  )}
                </motion.button>
            ) : authEnabled ? (
              <button type="button" className="primary-btn topbar-auth-btn" onClick={() => navigate('/login')}>
                <LogIn size={16} />
                Login
              </button>
            ) : (
              <div className="topbar-account-chip muted">
                <span>Login desativado</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="shell-layout">
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-brand-area">
              <div className="footer-brand-row">
                <span className="brand-icon"><Gamepad2 size={18} /></span>
                <span className="footer-brand">GameDex</span>
              </div>
              <p className="footer-description">Seu catálogo gamer com visual moderno e dados atualizados da comunidade.</p>
            </div>

            <div className="footer-nav-col">
              <p className="footer-heading">Navegação</p>
              <div className="footer-links">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className="footer-link">{item.label}</NavLink>
                ))}
              </div>
            </div>

            <div className="footer-nav-col">
              <p className="footer-heading">Dados</p>
              <p className="footer-api">
                Informações por{' '}
                <a href="https://rawg.io" target="_blank" rel="noreferrer">RAWG API</a>
              </p>
              <span className="footer-status-badge">● Atualizado em tempo real</span>
            </div>

            <div className="footer-nav-col">
              <p className="footer-heading">Open Source</p>
              <a
                href="https://github.com/dudumiranda3105/GameDex"
                target="_blank"
                rel="noreferrer"
                className="footer-gh-link"
              >
                <SiGithub size={16} />
                Ver no GitHub
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© {new Date().getFullYear()} GameDex — Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
