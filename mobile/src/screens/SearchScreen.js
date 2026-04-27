import { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { searchGames } from '../services/rawgApi'
import GameItem from '../components/GameItem'
import { colors } from '../theme'

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const runSearch = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const data = await searchGames(query.trim())
      setResults(data)
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Falha ao buscar jogos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar jogos</Text>
      <Text style={styles.subtitle}>Encontre qualquer jogo e abra a ficha completa.</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar jogo..."
          placeholderTextColor={colors.textFaint}
          onSubmitEditing={runSearch}
          returnKeyType="search"
        />
        <Pressable
          style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.75 }]}
          onPress={runSearch}
        >
          <Text style={styles.searchBtnText}>Buscar</Text>
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={runSearch}
        renderItem={({ item }) => (
          <GameItem
            game={item}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id, initialGame: item })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Digite algo para pesquisar.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: colors.bg },
  title: {
    color: colors.textMain,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 14,
  },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.textMain,
    backgroundColor: colors.surface,
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  empty: { color: colors.textFaint, marginTop: 24, textAlign: 'center' },
})
