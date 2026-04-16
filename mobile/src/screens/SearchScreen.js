import { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { searchGames } from '../services/rawgApi'
import GameItem from '../components/GameItem'

export default function SearchScreen() {
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
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar jogo..."
          placeholderTextColor="#7b879f"
        />
        <Pressable style={styles.searchBtn} onPress={runSearch}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={runSearch}
        renderItem={({ item }) => <GameItem game={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Digite algo para pesquisar.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#070a12' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#202a40',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#f3f6fd',
    backgroundColor: '#0f1420',
  },
  searchBtn: {
    backgroundColor: '#4f73ff',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#8e9ab4', marginTop: 20 },
})
