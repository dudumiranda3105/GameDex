import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
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
        <Text style={styles.message}>Entre na aba Perfil para acessar sua biblioteca.</Text>
      </View>
    )
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={(item) => String(item.gameId)}
      refreshing={loading}
      onRefresh={loadLibrary}
      ListHeaderComponent={<Text style={styles.title}>Minha biblioteca</Text>}
      ListEmptyComponent={<Text style={styles.message}>Nenhum jogo salvo ainda.</Text>}
      renderItem={({ item }) => (
        <GameItem
          game={libraryToGame(item)}
          onPress={() => navigation.navigate('GameDetails', { gameId: item.gameId, initialGame: libraryToGame(item) })}
          rightContent={(
            <View style={{ gap: 8 }}>
              <Text style={styles.status}>Status: {statusLabels[item.status] || 'Quero jogar'}</Text>
              <InlineButton
                label={item.isFavorite ? '★ Favorito' : '☆ Favoritar'}
                onPress={() => toggleFavorite(item)}
                secondary
              />
              <InlineButton label="Trocar status" onPress={() => changeStatus(item)} secondary />
              <InlineButton label="Remover" onPress={() => removeItem(item)} secondary />
            </View>
          )}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { padding: 14, backgroundColor: colors.bg },
  title: { color: colors.textMain, fontSize: 24, fontWeight: '800', marginBottom: 14 },
  message: { color: colors.textMuted, textAlign: 'center', marginTop: 10 },
  status: { color: colors.textBody, marginTop: 8, fontSize: 13 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.bg,
  },
})
