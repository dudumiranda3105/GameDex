import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code2, Database, Globe, Layers, Rocket, Search, Sparkles, Zap } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

const fallbackApkUrl = 'https://expo.dev/artifacts/eas/q7jHjb3QR8f1bCQF1BXmLk.apk'
const apkDownloadUrl = (import.meta.env.VITE_MOBILE_APK_URL || fallbackApkUrl).trim()
const repositoryUrl = 'https://github.com/dudumiranda3105/GameDex'

const appBenefits = [
  'Acesso offline aos seus jogos favoritos',
  'Notificações de novos lançamentos',
  'Interface otimizada para mobile',
  'Sincronização com sua conta',
]

const appRequirements = [
  'Android 8+',
  'Conexão para sincronização inicial',
  'Aproximadamente 120MB de espaço livre',
]

const highlights = [
  { icon: <Database size={22} />, label: 'Jogos indexados', value: '500K+' },
  { icon: <Sparkles size={22} />, label: 'Experiência', value: 'Foco em mobile' },
  { icon: <Zap size={22} />, label: 'Atualização', value: 'Tempo real' },
]

const stackItems = [
  { name: 'React 19', desc: 'UI web com Vite 8', icon: <Code2 size={18} /> },
  { name: 'React Router', desc: 'Navegação SPA', icon: <Globe size={18} /> },
  { name: 'Firebase Auth', desc: 'Login Google e email', icon: <Layers size={18} /> },
  { name: 'RAWG API', desc: 'Dados de jogos em tempo real', icon: <Database size={18} /> },
]

const roadmapItems = [
  { title: 'Recomendações inteligentes', desc: 'Sugestões por perfil e histórico de biblioteca.', status: 'Em breve' },
  { title: 'Comparador expandido', desc: 'Comparar jogos por métricas e avaliações.', status: 'Planejado' },
  { title: 'Sync em nuvem', desc: 'Sincronização entre web e app para biblioteca e favoritos.', status: 'Concluído' },
]

function DownloadPage() {
  const hasValidApkUrl = apkDownloadUrl.includes('expo.dev') || apkDownloadUrl.includes('.apk')

  return (
    <section className="content-page download-page about-page">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="about-hero-glow" />
        <p className="about-hero-kicker">App + Projeto</p>
        <h1 className="about-hero-title">GameDex Mobile</h1>
        <p className="about-hero-desc">
          Tudo em uma só página: visão do projeto, stack técnica e download do app para levar sua biblioteca gamer no bolso.
        </p>
      </motion.div>

      <div className="about-highlights">
        {highlights.map((item, index) => (
          <motion.article
            key={item.label}
            className="about-highlight-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about-highlight-icon">{item.icon}</span>
            <div>
              <p className="about-highlight-label">{item.label}</p>
              <p className="about-highlight-value">{item.value}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
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

      <motion.div
        className="section-panel download-features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2>Recursos do app</h2>
        <p className="download-subtext">
          O app foi desenhado para consulta rápida, descoberta de jogos e organização da sua lista pessoal em qualquer lugar.
        </p>
        <ul>
          {appBenefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="section-panel download-requirements"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        <h2>Compatibilidade</h2>
        <ul>
          {appRequirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <h2 className="section-title">Objetivo</h2>
        <p className="about-body-text">
          O GameDex entrega uma experiência gamer fluida para descobrir títulos, analisar informações completas e manter uma biblioteca pessoal sincronizada entre web e mobile.
        </p>
      </motion.div>

      <motion.div
        className="section-panel about-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
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

      <motion.div
        className="download-actions section-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        <div className="download-actions-copy">
          <h2>Baixe agora</h2>
          <p className="download-subtext">
            Faça o download da versão APK ou acesse o repositório do app.
          </p>
        </div>
        {!hasValidApkUrl && (
          <p className="download-warning">
            O link do APK ainda está em modo de exemplo. Atualize a constante apkDownloadUrl com a URL gerada pelo EAS Build.
          </p>
        )}
        <div className="download-actions-cta">
          <motion.a
            href={apkDownloadUrl}
            className="primary-btn"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Baixar APK direto
          </motion.a>
          <motion.a
            href={repositoryUrl}
            className="secondary-btn"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver código no GitHub
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        className="about-cta"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.34 }}
      >
        <div className="about-cta-head">
          <Rocket size={28} className="about-cta-icon" />
          <h2>Explore agora</h2>
        </div>
        <p className="about-cta-copy">
          Pesquise jogos no catálogo web e acompanhe o app mobile em evolução no mesmo lugar.
        </p>
        <div className="about-actions">
          <Link to="/search" className="primary-btn"><Search size={16} /> Abrir busca</Link>
          <a href={repositoryUrl} target="_blank" rel="noreferrer" className="secondary-btn"><SiGithub size={15} /> Ver no GitHub</a>
        </div>
      </motion.div>
    </section>
  )
}

export default DownloadPage
