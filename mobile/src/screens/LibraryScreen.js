import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../context/AuthContext'
import { deleteLibraryEntry, fetchLibrary, upsertLibrary } from '../services/backendApi'
import GameItem, { InlineButton } from '../components/GameItem'
import { nextStatus, statusLabels } from '../lib/gameLibrary'
import { colors } from '../theme'

function libraryToGame(item) {
  return {
    id: item.gameId,
    name: item.title,
    background_image: item.coverUrl,
    rating: item.rating,
    released: item.released,
  }
}

export default function LibraryScreen({ navigation }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const summary = useMemo(() => {
    const favorites = items.filter((item) => item.isFavorite).length
    const completed = items.filter((item) => item.status === 'completed').length
    const inProgress = items.filter((item) => item.status === 'playing').length

    return {
      total: items.length,
      favorites,
      completed,
      inProgress,
    }
  }, [items])

  const loadLibrary = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }

    try {
      setLoading(true)
      const idToken = await user.getIdToken()
      const data = await fetchLibrary(idToken)
      setItems(data)
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Nao foi possivel carregar sua biblioteca.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadLibrary()
  }, [loadLibrary])

  const toggleFavorite = async (item) => {
    try {
      const idToken = await user.getIdToken()
      await upsertLibrary(idToken, {
        gameId: item.gameId,
        title: item.title,
        coverUrl: item.coverUrl,
        rating: item.rating,
        released: item.released,
        platforms: item.platforms || [],
        genres: item.genres || [],
        isFavorite: !item.isFavorite,
        status: item.status,
        notes: item.notes || '',
      })
      await loadLibrary()
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Nao foi possivel atualizar favorito.')
    }
  }

  const changeStatus = async (item) => {
    try {
      const idToken = await user.getIdToken()
      await upsertLibrary(idToken, {
        gameId: item.gameId,
        title: item.title,
        coverUrl: item.coverUrl,
        rating: item.rating,
        released: item.released,
        platforms: item.platforms || [],
        genres: item.genres || [],
        isFavorite: Boolean(item.isFavorite),
        status: nextStatus(item.status),
        notes: item.notes || '',
      })
      await loadLibrary()
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Nao foi possivel atualizar o status.')
    }
  }

  const removeItem = async (item) => {
    try {
      const idToken = await user.getIdToken()
      await deleteLibraryEntry(idToken, item.gameId)
      await loadLibrary()
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Nao foi possivel remover o jogo.')
    }
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEyebrow}>BIBLIOTECA</Text>
          <Text style={styles.emptyTitle}>Entre para liberar sua estante</Text>
          <Text style={styles.message}>Acesse a aba Perfil para salvar favoritos, trocar status e manter tudo sincronizado.</Text>
        </View>
      </View>
    )
  }

  const header = (
    <View style={styles.headerWrap}>
      <LinearGradient
        colors={['rgba(124,58,237,0.22)', 'rgba(34,211,238,0.08)', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.eyebrow}>MINHA COLECAO</Text>
        <Text style={styles.title}>Biblioteca GameDex</Text>
        <Text style={styles.subtitle}>Organize o que esta jogando, destaque favoritos e acompanhe seu backlog sem sair do app.</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.total}</Text>
          <Text style={styles.statLabel}>Jogos salvos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.favorites}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.inProgress}</Text>
          <Text style={styles.statLabel}>Jogando</Text>
        </View>
      </View>
    </View>
  )

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={(item) => String(item.gameId)}
      refreshing={loading}
      onRefresh={loadLibrary}
      ListHeaderComponent={header}
      ListEmptyComponent={(
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sua biblioteca ainda esta vazia</Text>
          <Text style={styles.message}>Adicione jogos na Home ou na tela de detalhes para começar a montar sua colecao.</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <GameItem
          game={libraryToGame(item)}
          onPress={() => navigation.navigate('GameDetails', { gameId: item.gameId, initialGame: libraryToGame(item) })}
          rightContent={(
            <View style={styles.itemActions}>
              <View style={styles.metaRow}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{statusLabels[item.status] || 'Quero jogar'}</Text>
                </View>
                {item.isFavorite ? (
                  <View style={styles.favoritePill}>
                    <Text style={styles.favoritePillText}>Favorito</Text>
                  </View>
                ) : null}
              </View>
              <InlineButton
                label={item.isFavorite ? '★ Favorito' : '☆ Favoritar'}
                onPress={() => toggleFavorite(item)}
                secondary
              />
              <InlineButton label="Trocar status" onPress={() => changeStatus(item)} secondary />
              <InlineButton label="Remover" onPress={() => removeItem(item)} danger />
            </View>
          )}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 26,
    backgroundColor: colors.bg,
  },
  headerWrap: {
    marginBottom: 8,
  },
  header: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: 18,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.textMain,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  statValue: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  message: { color: colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  itemActions: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusPill: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    color: colors.textMain,
    fontSize: 12,
    fontWeight: '700',
  },
  favoritePill: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.32)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  favoritePillText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.bg,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 360,
  },
  emptyEyebrow: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  emptyTitle: {
    color: colors.textMain,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
    marginBottom: 12,
  },
})
