import { motion } from 'framer-motion'

const highlights = [
  { label: 'Jogos indexados', value: '500K+' },
  { label: 'Plataformas', value: '20+' },
  { label: 'Atualização', value: 'Tempo real' },
]

const stackItems = [
  'React 19 com Vite',
  'React Router DOM',
  'Tailwind CSS',
  'Framer Motion',
  'Axios para requisições HTTP',
  'RAWG Video Games Database API',
]

function AboutPage() {
  return (
    <section className="content-page about-page">
      <motion.div
        className="title-block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Sobre o Projeto</h1>
        <p>
          O GameDex Web é uma plataforma moderna para explorar o universo dos games, trazendo informações detalhadas diretamente da API RAWG.
        </p>
      </motion.div>

      <motion.div
        className="about-highlights"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {highlights.map((item) => (
          <article key={item.label} className="section-panel about-highlight-card">
            <p className="about-highlight-label">{item.label}</p>
            <p className="about-highlight-value">{item.value}</p>
          </article>
        ))}
      </motion.div>

      <motion.div
        className="section-panel"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2>Stack Tecnológica</h2>
        <ul>
          {stackItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="section-panel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2>Objetivo do Projeto</h2>
        <p>
          Criar uma experiência fluida para gamers descobrirem novos títulos, visualizarem avaliações, screenshots e informações completas de milhares de jogos de todas as plataformas.
        </p>
      </motion.div>

      <motion.div
        className="section-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>Próximos passos</h2>
        <div className="about-roadmap">
          <div className="about-roadmap-item">
            <h3>Recomendações inteligentes</h3>
            <p>Sugestões personalizadas baseadas em favoritos, gênero e histórico de busca.</p>
          </div>
          <div className="about-roadmap-item">
            <h3>Mais comparações</h3>
            <p>Comparador expandido com desempenho, data de lançamento e avaliações da comunidade.</p>
          </div>
          <div className="about-roadmap-item">
            <h3>Sincronização em nuvem</h3>
            <p>Salvar listas de favoritos e “quero jogar” com autenticação e backup automático.</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default AboutPage
