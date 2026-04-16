import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export default function GameItem({ game, rightContent }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: game.background_image }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.title}>{game.name}</Text>
        <Text style={styles.meta}>Nota: {game.rating ? game.rating.toFixed(1) : 'N/A'}</Text>
        <Text style={styles.meta}>Lancamento: {game.released || 'N/A'}</Text>
        {rightContent}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f1420',
    borderColor: '#1e2638',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    height: 170,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  title: {
    color: '#f3f6fd',
    fontWeight: '700',
    fontSize: 16,
  },
  meta: {
    color: '#9eabc4',
    fontSize: 13,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4f73ff',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})

export function InlineButton({ label, onPress, secondary = false }) {
  return (
    <Pressable style={[styles.button, secondary && { backgroundColor: '#1f2840' }]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  )
}
