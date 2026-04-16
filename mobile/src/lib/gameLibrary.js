export const statusLabels = {
  want_to_play: 'Quero jogar',
  playing: 'Jogando',
  completed: 'Completado',
  paused: 'Pausado',
  dropped: 'Abandonado',
}

export const orderedStatuses = ['want_to_play', 'playing', 'completed', 'paused', 'dropped']

export function nextStatus(currentStatus) {
  const currentIndex = orderedStatuses.indexOf(currentStatus)
  if (currentIndex < 0 || currentIndex === orderedStatuses.length - 1) {
    return orderedStatuses[0]
  }

  return orderedStatuses[currentIndex + 1]
}

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
