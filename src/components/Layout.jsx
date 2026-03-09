import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Home' },
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
            <p>Use a página de busca para filtrar por gênero, plataforma e popularidade.</p>
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
