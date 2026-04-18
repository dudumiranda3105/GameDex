import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code2, Database, Gamepad2, Globe, Layers, Rocket, Search, Sparkles, Zap } from 'lucide-react'

const highlights = [
  { icon: <Database size={22} />, label: 'Jogos indexados', value: '500K+' },
  { icon: <Gamepad2 size={22} />, label: 'Plataformas', value: '20+' },
  { icon: <Zap size={22} />, label: 'Atualização', value: 'Tempo real' },
]

const stackItems = [
  { name: 'React 19', desc: 'Biblioteca de UI com Vite 8', icon: <Code2 size={18} /> },
  { name: 'React Router', desc: 'Navegação SPA completa', icon: <Globe size={18} /> },
  { name: 'Framer Motion', desc: 'Animações fluidas e transições', icon: <Sparkles size={18} /> },
  { name: 'Firebase Auth', desc: 'Login com Google e email/senha', icon: <Layers size={18} /> },
  { name: 'RAWG API', desc: 'Dados de 500mil+ jogos', icon: <Database size={18} /> },
  { name: 'Lucide Icons', desc: 'Ícones consistentes e leves', icon: <Zap size={18} /> },
]

const roadmapItems = [
  { title: 'Recomendações inteligentes', desc: 'Sugestões personalizadas baseadas em favoritos, gênero e histórico de busca.', status: 'Em breve' },
  { title: 'Comparador expandido', desc: 'Compare desempenho, datas e avaliações da comunidade entre jogos.', status: 'Planejado' },
  { title: 'Sync em nuvem', desc: 'Backup automático de favoritos e listas com autenticação.', status: 'Concluído' },
]

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

function AboutPage() {
  return (
    <section className="content-page about-page">
      {/* Hero */}
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="about-hero-glow" />
        <p className="about-hero-kicker">Sobre o projeto</p>
        <h1 className="about-hero-title">GameDex</h1>
        <p className="about-hero-desc">
          Uma plataforma moderna para explorar o universo dos games — informações detalhadas, biblioteca pessoal e visual feito para gamers.
        </p>
      </motion.div>

      {/* Highlight cards */}
      <div className="about-highlights">
        {highlights.map((item, i) => (
          <motion.article
            key={item.label}
            className="about-highlight-card"
            custom={i}
            variants={cardAnim}
            initial="hidden"
            animate="visible"
          >
            <span className="about-highlight-icon">{item.icon}</span>
            <div>
              <p className="about-highlight-label">{item.label}</p>
              <p className="about-highlight-value">{item.value}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Stack */}
      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <h2 className="section-title">Stack Tecnológica</h2>
        <div className="about-stack-grid">
          {stackItems.map((item) => (
            <div key={item.name} className="about-stack-item">
              <span className="about-stack-icon">{item.icon}</span>
              <div>
                <strong>{item.name}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Objective */}
      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.26 }}
      >
        <h2 className="section-title">Objetivo</h2>
        <p className="about-body-text">
          Criar uma experiência fluida para gamers descobrirem novos títulos, visualizarem avaliações, screenshots e informações completas de milhares de jogos de todas as plataformas — tudo com uma interface que respeita quem joga.
        </p>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.34 }}
      >
        <h2 className="section-title">Roadmap</h2>
        <div className="about-roadmap">
          {roadmapItems.map((item) => (
            <div key={item.title} className="about-roadmap-item">
              <div className="about-roadmap-head">
                <h3>{item.title}</h3>
                <span className={'about-roadmap-badge' + (item.status === 'Concluído' ? ' done' : '')}>{item.status}</span>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="about-cta"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.42 }}
      >
        <Rocket size={28} className="about-cta-icon" />
        <h2>Explore agora</h2>
        <p>Descubra jogos no catálogo ou baixe o app mobile.</p>
        <div className="about-actions">
          <Link to="/search" className="primary-btn"><Search size={16} /> Abrir busca</Link>
          <Link to="/download" className="secondary-btn">Baixar app</Link>
        </div>
      </motion.div>
    </section>
  )
}

export default AboutPage
