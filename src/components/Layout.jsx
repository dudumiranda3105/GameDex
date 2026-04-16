import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'

const baseNavItems = [
  { to: '/', label: 'Home' },
  { to: '/library', label: 'Minha biblioteca' },
  { to: '/search', label: 'Busca' },
  { to: '/download', label: 'App' },
  { to: '/about', label: 'Sobre' },
]

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

function Layout() {
  const location = useLocation()
  const { user, authEnabled, signInWithGoogle, signOut } = useAuth()
  const { displayName, photoURL } = useProfile()
  const navItems = user
    ? [baseNavItems[0], { to: '/profile', label: 'Perfil' }, ...baseNavItems.slice(1)]
    : baseNavItems

  return (
    <div className="app-shell">
      <motion.header
        className="topbar"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 85, damping: 16 }}
      >
        <div className="topbar-inner">
          <div>
            <div className="brand">GameDex</div>
            <p className="brand-subtitle">Descubra e explore jogos com dados em tempo real</p>
          </div>

          <div className="topbar-account-area">
            {authEnabled && user ? (
              <>
                <div className="topbar-account-chip">
                  {photoURL ? (
                    <img src={photoURL} alt={displayName} className="topbar-avatar" />
                  ) : (
                    <span className="topbar-avatar-fallback">
                      <UserRound size={16} />
                    </span>
                  )}
                  <span>{displayName}</span>
                </div>
                <button type="button" className="secondary-btn topbar-auth-btn" onClick={signOut}>
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            ) : authEnabled ? (
              <button type="button" className="primary-btn topbar-auth-btn" onClick={signInWithGoogle}>
                <LogIn size={16} />
                Entrar
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
        <aside className="sidebar section-panel">
          <p className="sidebar-title">Menu</p>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-card">
            <p className="sidebar-card-title">Dica rápida</p>
            <p>Use a aba Perfil para ver os dados da conta e a aba Minha biblioteca para acompanhar progresso e favoritos.</p>
          </div>
        </aside>

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

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">GameDex Web</p>
              <p className="footer-description">Seu catálogo gamer com visual moderno e dados atualizados da comunidade.</p>
            </div>

            <div>
              <p className="footer-heading">Navegação</p>
              <div className="footer-links">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className="footer-link">{item.label}</NavLink>
                ))}
              </div>
            </div>

            <div>
              <p className="footer-heading">Dados</p>
              <p className="footer-api">
                Informações fornecidas por <a href="https://rawg.io" target="_blank" rel="noreferrer">RAWG API</a>
              </p>
              <p className="footer-status">Atualizado em tempo real</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© 2026 GameDex. Todos os direitos reservados.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Layout
