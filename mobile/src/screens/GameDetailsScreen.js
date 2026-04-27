import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { fetchGameDetails } from '../services/rawgApi'
import { useAuth } from '../context/AuthContext'
import { fetchLibrary, upsertLibrary } from '../services/backendApi'
import { mapGameToLibraryPayload } from '../lib/gameLibrary'
import { colors } from '../theme'

function ChipList({ items, accent = false }) {
  if (!Array.isArray(items) || items.length === 0) return <Text style={ch.empty}>N/A</Text>
  return (
    <View style={ch.row}>
      {items.map((chip, i) => (
        <View key={i} style={[ch.chip, accent && ch.chipAccent]}>
          <Text style={[ch.text, accent && ch.textAccent]}>{chip}</Text>
        </View>
      ))}
    </View>
  )
}

const ch = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(34,211,238,0.35)',
  },
  text: { color: colors.primaryLight, fontSize: 12, fontWeight: '600' },
  textAccent: { color: colors.accent },
  empty: { color: colors.textMuted, fontSize: 13 },
})

function StarRating({ rating }) {
  if (!rating) return null
  const full = Math.round(rating)
  return (
    <Text>
      <Text style={{ color: colors.star }}>{'★'.repeat(full)}</Text>
      <Text style={{ color: colors.starEmpty }}>{'☆'.repeat(5 - full)}</Text>
      <Text style={{ color: colors.accent, fontWeight: '700' }}> {rating.toFixed(1)}</Text>
    </Text>
  )
}

function formatChips(items, mapper) {
  if (!Array.isArray(items) || items.length === 0) return []
  return items.map(mapper).filter(Boolean)
}

export default function GameDetailsScreen({ route }) {
  const { gameId, initialGame } = route.params || {}
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const [libraryEntry, setLibraryEntry] = useState(null)
  const [savingLibrary, setSavingLibrary] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      if (!gameId) {
        setError('Jogo nao encontrado.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchGameDetails(gameId)
        if (active) {
          setDetails(data)
          setError('')
        }
      } catch (loadError) {
        console.error(loadError)
        if (active) setError('Nao foi possivel carregar os detalhes do jogo.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [gameId])

  const loadLibraryEntry = useCallback(async () => {
    if (!user || !gameId) return
    try {
      const idToken = await user.getIdToken()
      const items = await fetchLibrary(idToken)
      const found = items.find((item) => String(item.gameId) === String(gameId))
      setLibraryEntry(found || null)
    } catch {
      // silencioso
    }
  }, [user, gameId])

  useEffect(() => {
    loadLibraryEntry()
  }, [loadLibraryEntry])

  const addToLibrary = async () => {
    if (!user) {
      Alert.alert('Login necessario', 'Entre na aba Perfil para salvar jogos.')
      return
    }
    const game = details || initialGame || {}
    try {
      setSavingLibrary(true)
      const idToken = await user.getIdToken()
      const payload = mapGameToLibraryPayload(game, {
        isFavorite: libraryEntry?.isFavorite || false,
        status: libraryEntry?.status || 'want_to_play',
        notes: libraryEntry?.notes || '',
      })
      await upsertLibrary(idToken, payload)
      await loadLibraryEntry()
      Alert.alert('Salvo!', 'Jogo adicionado a sua biblioteca.')
    } catch (err) {
      console.error(err)
      Alert.alert('Erro', 'Nao foi possivel salvar na biblioteca.')
    } finally {
      setSavingLibrary(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert('Login necessario', 'Entre na aba Perfil para favoritar jogos.')
      return
    }
    const game = details || initialGame || {}
    try {
      setSavingLibrary(true)
      const idToken = await user.getIdToken()
      const payload = mapGameToLibraryPayload(game, {
        isFavorite: !libraryEntry?.isFavorite,
        status: libraryEntry?.status || 'want_to_play',
        notes: libraryEntry?.notes || '',
      })
      await upsertLibrary(idToken, payload)
      await loadLibraryEntry()
    } catch (err) {
      console.error(err)
      Alert.alert('Erro', 'Nao foi possivel favoritar o jogo.')
    } finally {
      setSavingLibrary(false)
    }
  }

  const game = details || initialGame || {}

  const ratingValue = typeof game?.rating === 'number' ? game.rating : null
  const released = game?.released || 'N/A'

  const genreChips = useMemo(
    () => formatChips(game?.genres, (g) => g?.name),
    [game?.genres]
  )
  const platformChips = useMemo(
    () => formatChips(game?.platforms, (p) => p?.platform?.name || p?.name),
    [game?.platforms]
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image
          source={{ uri: game?.background_image || game?.backgroundImage }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(5,5,7,0.6)', 'rgba(5,5,7,0.98)']}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.title} numberOfLines={3}>{game?.name || 'Jogo'}</Text>
          <View style={styles.metaRow}>
            <StarRating rating={ratingValue} />
            <Text style={styles.releaseText}> · {released}</Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actionRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            libraryEntry && styles.actionBtnActive,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={addToLibrary}
          disabled={savingLibrary}
        >
          <Text style={styles.actionBtnText}>
            {libraryEntry ? '✓ Na biblioteca' : '+ Biblioteca'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            libraryEntry?.isFavorite && styles.favBtnActive,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={toggleFavorite}
          disabled={savingLibrary}
        >
          <Text style={[styles.actionBtnText, libraryEntry?.isFavorite && styles.favBtnText]}>
            {libraryEntry?.isFavorite ? '★ Favorito' : '☆ Favoritar'}
          </Text>
        </Pressable>
      </View>

      {/* Gêneros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gêneros</Text>
        <ChipList items={genreChips} />
      </View>

      {/* Plataformas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plataformas</Text>
        <ChipList items={platformChips} accent />
      </View>

      {/* Descrição */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.sectionBody}>
          {game?.description_raw || 'Sem descrição detalhada disponível no momento.'}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 28,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: 20,
  },
  heroWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: colors.surfaceAlt,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 190,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    color: colors.textMain,
    fontSize: 26,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  releaseText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 14,
  },
  sectionTitle: {
    color: colors.textBody,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionBody: {
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: 6,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(124,58,237,0.35)',
    borderColor: colors.primary,
  },
  actionBtnPressed: {
    opacity: 0.72,
  },
  favBtnActive: {
    backgroundColor: 'rgba(250,204,21,0.14)',
    borderColor: 'rgba(250,204,21,0.5)',
  },
  actionBtnText: {
    color: colors.textBody,
    fontWeight: '700',
    fontSize: 14,
  },
  favBtnText: {
    color: colors.star,
  },
})
