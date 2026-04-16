export const gameStatusOptions = [
  { value: 'want_to_play', label: 'Quero jogar' },
  { value: 'playing', label: 'Jogando' },
  { value: 'completed', label: 'Completado' },
  { value: 'paused', label: 'Pausado' },
  { value: 'dropped', label: 'Abandonado' },
]

export const gameStatusLabels = gameStatusOptions.reduce((accumulator, option) => {
  accumulator[option.value] = option.label
  return accumulator
}, {})

function extractPlatforms(game) {
  if (Array.isArray(game.platforms) && game.platforms.length > 0) {
    return game.platforms
      .map((platform) => platform.platform?.name || platform.name)
      .filter(Boolean)
  }

  if (Array.isArray(game.parent_platforms) && game.parent_platforms.length > 0) {
    return game.parent_platforms
      .map((platform) => platform.platform?.name || platform.name)
      .filter(Boolean)
  }

  return []
}

export function mapGameToLibraryPayload(game, overrides = {}) {
  return {
    gameId: game.id,
    title: game.name,
    coverUrl: game.background_image || null,
    rating: game.rating || null,
    released: game.released || null,
    platforms: extractPlatforms(game),
    genres: Array.isArray(game.genres) ? game.genres.map((genre) => genre.name) : [],
    isFavorite: Boolean(overrides.isFavorite),
    status: overrides.status || 'want_to_play',
    notes: overrides.notes || '',
  }
}

export function mapLibraryItemToGame(item) {
  return {
    id: item.gameId,
    name: item.title,
    background_image: item.coverUrl,
    rating: item.rating,
    released: item.released,
    genres: Array.isArray(item.genres) ? item.genres.map((genre, index) => ({ id: `${item.gameId}-${index}`, name: genre })) : [],
    parent_platforms: Array.isArray(item.platforms)
      ? item.platforms.map((platform, index) => ({ platform: { id: `${item.gameId}-platform-${index}`, name: platform } }))
      : [],
  }
}
