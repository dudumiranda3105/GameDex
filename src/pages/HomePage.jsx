import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GameCard from '../components/GameCard'
import { ErrorState, SkeletonGameGrid } from '../components/FeedbackState'
import { fetchGames } from '../services/rawgApi'

const sectionConfigs = [
  { id: 'trending', title: 'Trending Games', params: { ordering: '-added' } },
  { id: 'topRated', title: 'Top Rated', params: { ordering: '-rating' } },
  { id: 'newReleases', title: 'Lançamentos', params: { ordering: '-released' } },
]

function HomePage() {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true)
        const results = await Promise.all(
          sectionConfigs.map((section) => fetchGames(section.params)),
        )

        const sectionData = sectionConfigs.reduce((accumulator, section, index) => {
          accumulator[section.id] = results[index]
          return accumulator
        }, {})

        setSections(sectionData)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  if (!import.meta.env.VITE_RAWG_API_KEY) {
    return <ErrorState message="Defina a VITE_RAWG_API_KEY no arquivo .env para carregar os jogos." />
  }

  if (loading) {
    return (
      <div>
        <section className="hero-panel">
          <p className="hero-kicker">Sua biblioteca gamer</p>
          <h1>Descubra jogos incríveis</h1>
          <p>Carregando os destaques para você...</p>
        </section>

        {sectionConfigs.map((section) => (
          <section key={section.id} className="game-section section-panel">
            <h2 className="section-title">{section.title}</h2>
            <SkeletonGameGrid count={6} />
          </section>
        ))}
      </div>
    )
  }
  if (error) return <ErrorState />

  return (
    <div>
      <motion.section
        className="hero-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Sua biblioteca gamer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          Descubra jogos incríveis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Explore os títulos mais populares, descubra lançamentos e encontre seu próximo jogo favorito com informações detalhadas da RAWG API.
        </motion.p>
      </motion.section>

      {sectionConfigs.map((section, sectionIndex) => (
        <motion.section
          key={section.id}
          className="game-section section-panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 + sectionIndex * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="section-title">{section.title}</h2>
          <div className="games-grid">
            {sections[section.id]?.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}

export default HomePage
