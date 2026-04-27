import { useRef } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme'

function StarRating({ rating }) {
  if (!rating) return <Text style={s.meta}>Sem avaliação</Text>
  const full = Math.round(rating)
  return (
    <Text style={s.ratingRow}>
      <Text style={s.starFilled}>{'★'.repeat(full)}</Text>
      <Text style={s.starEmpty}>{'☆'.repeat(5 - full)}</Text>
      <Text style={s.ratingNum}> {rating.toFixed(1)}</Text>
    </Text>
  )
}

export default function GameItem({ game, rightContent, onPress }) {
  const scale = useRef(new Animated.Value(1)).current

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30, bounciness: 4 }).start()
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 4 }).start()

  return (
    <Animated.View style={[s.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={s.card}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!onPress}
      >
        <Image
          source={{ uri: game.background_image || game.backgroundImage }}
          style={s.cover}
        />
        <LinearGradient
          colors={['transparent', 'rgba(5,5,7,0.72)', 'rgba(5,5,7,0.97)']}
          style={s.gradient}
        />
        <View style={s.content}>
          <Text style={s.title} numberOfLines={2}>{game.name}</Text>
          <StarRating rating={game.rating} />
          <Text style={s.meta}>{game.released || 'Sem data de lançamento'}</Text>
          {rightContent}
        </View>
      </Pressable>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  cardWrap: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 190,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 165,
  },
  content: {
    padding: 14,
    gap: 5,
    marginTop: -130,
  },
  title: {
    color: colors.textMain,
    fontWeight: '800',
    fontSize: 19,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  ratingRow: {
    fontSize: 14,
  },
  starFilled: {
    color: colors.star,
  },
  starEmpty: {
    color: colors.starEmpty,
  },
  ratingNum: {
    color: colors.textMuted,
    fontSize: 13,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
})

export function InlineButton({ label, onPress, secondary = false, danger = false }) {
  return (
    <Pressable
      style={({ pressed }) => [
        btn.base,
        secondary && btn.secondary,
        danger && btn.danger,
        pressed && btn.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[btn.text, danger && btn.dangerText]}>{label}</Text>
    </Pressable>
  )
}

const btn = StyleSheet.create({
  base: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  pressed: {
    opacity: 0.72,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  dangerText: {
    color: colors.danger,
  },
})
