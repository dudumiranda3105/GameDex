import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { fetchTrendingGames } from '../services/rawgApi'
import GameItem, { InlineButton } from '../components/GameItem'
import { useAuth } from '../context/AuthContext'
import { fetchLibrary, upsertLibrary } from '../services/backendApi'
import { mapGameToLibraryPayload } from '../lib/gameLibrary'

export default function HomeScreen() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [libraryMap, setLibraryMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true)
        const data = await fetchTrendingGames()
        setGames(data)
      } catch (error) {
        console.error(error)
        Alert.alert('Erro', 'Nao foi possivel carregar os jogos em alta.')
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [])

  const syncLibrary = useCallback(async () => {
    if (!user) {
      setLibraryMap({})
      return
    }

    const idToken = await user.getIdToken()
    const items = await fetchLibrary(idToken)
    const nextMap = items.reduce((acc, item) => {
      acc[String(item.gameId)] = item
      return acc
    }, {})
    setLibraryMap(nextMap)
  }, [user])

  useEffect(() => {
    syncLibrary().catch((error) => console.error(error))
  }, [syncLibrary])

  const addOrToggleFavorite = async (game) => {
    if (!user) {
      Alert.alert('Login necessario', 'Entre na aba Perfil para salvar jogos.')
      return
    }

    try {
      const current = libraryMap[String(game.id)]
      const idToken = await user.getIdToken()
      await upsertLibrary(idToken, mapGameToLibraryPayload(game, {
        isFavorite: !current?.isFavorite,
        status: current?.status || 'want_to_play',
        notes: current?.notes || '',
      }))
      await syncLibrary()
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Nao foi possivel salvar favorito.')
    }
  }

  const header = useMemo(() => (
    <View style={styles.header}>
      <Text style={styles.title}>Trending Games</Text>
      <Text style={styles.subtitle}>Versao mobile do GameDex com login e biblioteca.</Text>
    </View>
  ), [])

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={games}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={header}
      refreshing={loading}
      onRefresh={() => {
        setLoading(true)
        fetchTrendingGames().then(setGames).finally(() => setLoading(false))
      }}
      renderItem={({ item }) => {
        const current = libraryMap[String(item.id)]
        return (
          <GameItem
            game={item}
            rightContent={(
              <InlineButton
                label={current?.isFavorite ? 'Remover favorito' : 'Favoritar'}
                onPress={() => addOrToggleFavorite(item)}
              />
            )}
          />
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#070a12',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#f4f7ff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#93a0ba',
    marginTop: 4,
  },
})
