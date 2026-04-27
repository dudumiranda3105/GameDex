import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { fetchTrendingGames } from '../services/rawgApi'
import GameItem, { InlineButton } from '../components/GameItem'
import { useAuth } from '../context/AuthContext'
import { fetchLibrary, upsertLibrary } from '../services/backendApi'
import { mapGameToLibraryPayload } from '../lib/gameLibrary'
import { colors } from '../theme'

function SkeletonCard() {
  const anim = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }, [anim])
  return (
    <Animated.View style={[sk.card, { opacity: anim }]}>
      <View style={sk.cover} />
      <View style={sk.line1} />
      <View style={sk.line2} />
    </Animated.View>
  )
}

const sk = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cover: { width: '100%', height: 190, backgroundColor: colors.surfaceAlt },
  line1: { margin: 14, height: 16, borderRadius: 8, backgroundColor: colors.border, width: '65%' },
  line2: { marginHorizontal: 14, marginBottom: 14, height: 12, borderRadius: 8, backgroundColor: colors.border, width: '40%' },
})

export default function HomeScreen({ navigation }) {
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
    <LinearGradient
      colors={['rgba(124,58,237,0.22)', 'rgba(124,58,237,0.06)', 'transparent']}
      style={styles.header}
    >
      <Text style={styles.badge}>✦ DESTAQUES</Text>
      <Text style={styles.title}>Jogos em alta</Text>
      <Text style={styles.subtitle}>Descubra títulos populares e abra os detalhes com um toque.</Text>
    </LinearGradient>
  ), [])

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={loading ? Array(6).fill(null) : games}
      keyExtractor={(item, index) => item ? String(item.id) : String(index)}
      ListHeaderComponent={header}
      refreshing={false}
      onRefresh={() => {
        setLoading(true)
        fetchTrendingGames().then(setGames).finally(() => setLoading(false))
      }}
      renderItem={({ item }) => {
        if (!item) return <SkeletonCard />
        const current = libraryMap[String(item.id)]
        return (
          <GameItem
            game={item}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id, initialGame: item })}
            rightContent={(
              <InlineButton
                label={current?.isFavorite ? '★ Remover favorito' : '☆ Favoritar'}
                onPress={() => addOrToggleFavorite(item)}
                secondary={current?.isFavorite}
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
    backgroundColor: colors.bg,
  },
  header: {
    marginBottom: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: 16,
  },
  badge: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: {
    color: colors.textMain,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 14,
  },
})
