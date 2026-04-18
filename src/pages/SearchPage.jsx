import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameCard from '../components/GameCard'
import { EmptyState, ErrorState, SkeletonGameGrid } from '../components/FeedbackState'
import { fetchGames, fetchGenres, fetchPlatforms } from '../services/rawgApi'

const quickSearches = ['Elden Ring', 'GTA', 'The Witcher', 'Hollow Knight', 'Minecraft']

const orderingOptions = [
  { value: '-relevance', label: 'Mais relevantes' },
  { value: '-rating', label: 'Melhor nota' },
  { value: '-released', label: 'Mais recentes' },
  { value: '-added', label: 'Mais populares' },
  { value: 'name', label: 'Nome (A-Z)' },
]

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [genres, setGenres] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [ordering, setOrdering] = useState('-relevance')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [genresData, platformsData] = await Promise.all([
          fetchGenres(),
          fetchPlatforms(),
        ])

        setGenres(genresData)
        setPlatforms(platformsData)
      } catch (err) {
        console.error(err)
      }
    }

    loadFilters()
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()

    if (!query.trim() && !selectedGenre && !selectedPlatform) return

    try {
      setLoading(true)
      setError(false)
      const data = await fetchGames({
        search: query.trim() || undefined,
        ordering: ordering === '-relevance' ? undefined : ordering,
        genres: selectedGenre || undefined,
        parent_platforms: selectedPlatform || undefined,
        page_size: 24,
      })
      setResults(data)
      setHasSearched(true)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilters = () => {
    setSelectedGenre('')
    setSelectedPlatform('')
    setOrdering('-relevance')
    setQuery('')
    setResults([])
    setHasSearched(false)
    setError(false)
  }

  const handleQuickSearch = async (term) => {
    setQuery(term)

    try {
      setLoading(true)
      setError(false)
      const data = await fetchGames({
        search: term,
        ordering: ordering === '-relevance' ? undefined : ordering,
        genres: selectedGenre || undefined,
        parent_platforms: selectedPlatform || undefined,
        page_size: 24,
      })
      setResults(data)
      setHasSearched(true)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="content-page">
      <motion.div
        className="title-block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Buscar jogos</h1>
        <p>Digite o nome do jogo e veja os resultados em tempo real da RAWG API.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        className="search-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex: Elden Ring, God of War, Hollow Knight"
        />
        <select
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
          aria-label="Filtrar por gênero"
        >
          <option value="">Todos os gêneros</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <select
          value={selectedPlatform}
          onChange={(event) => setSelectedPlatform(event.target.value)}
          aria-label="Filtrar por plataforma"
        >
          <option value="">Todas as plataformas</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
        <select
          value={ordering}
          onChange={(event) => setOrdering(event.target.value)}
          aria-label="Ordenar resultados"
        >
          {orderingOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Pesquisar
        </motion.button>
        <button
          type="button"
          className="secondary-btn"
          onClick={handleResetFilters}
        >
          Limpar
        </button>
      </motion.form>

      <motion.div
        className="search-helper-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
      >
        <p>Buscas rápidas:</p>
        <div className="search-helper-chips">
          {quickSearches.map((term) => (
            <button
              key={term}
              type="button"
              className="search-helper-chip"
              onClick={() => handleQuickSearch(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </motion.div>

      {loading && (
        <div className="section-panel">
          <h2 className="section-title">Buscando jogos...</h2>
          <SkeletonGameGrid count={8} />
        </div>
      )}
      {error && <ErrorState message="Falha ao buscar jogos." />}

      {!loading && !error && hasSearched && results.length === 0 && (
        <EmptyState message="Nenhum jogo encontrado para essa busca." />
      )}

      <AnimatePresence>
        {!loading && !error && results.length > 0 && (
          <motion.div
            className="section-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="section-title">Resultados ({results.length})</h2>
            <p className="search-results-meta">
              {selectedGenre || selectedPlatform
                ? 'Filtros ativos aplicados.'
                : 'Sem filtros adicionais.'}
            </p>
            <div className="games-grid">
              {results.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default SearchPage
