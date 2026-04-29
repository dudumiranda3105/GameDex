import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../context/AuthContext'
import { fetchProfile, updateProfile } from '../services/backendApi'
import { colors } from '../theme'

export default function ProfileScreen() {
  const {
    user,
    ready,
    error,
    login,
    register,
    logout,
  } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [submittingAuth, setSubmittingAuth] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!user) return

    user.getIdToken()
      .then((idToken) => fetchProfile(idToken))
      .then((profile) => {
        setNickname(profile?.nickname || user.displayName || '')
        setBio(profile?.bio || '')
      })
      .catch((profileError) => console.error(profileError))
  }, [user])

  const submitAuth = async () => {
    const cleanEmail = email.trim()

    if (!cleanEmail.includes('@')) {
      Alert.alert('Atencao', 'Informe um email valido.')
      return
    }

    if (!password || password.length < 6) {
      Alert.alert('Atencao', 'A senha deve ter pelo menos 6 caracteres.')
      return
    }

    try {
      setSubmittingAuth(true)
      if (isRegisterMode) {
        await register(cleanEmail, password, nickname)
      } else {
        await login(cleanEmail, password)
      }
    } catch {
      // Erro tratado no contexto.
    } finally {
      setSubmittingAuth(false)
    }
  }

  const saveProfileData = async () => {
    if (!user) return

    try {
      setSavingProfile(true)
      const idToken = await user.getIdToken()
      await updateProfile(idToken, { nickname, bio })
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.')
    } catch (saveError) {
      console.error(saveError)
      Alert.alert('Erro', 'Nao foi possivel salvar seu perfil.')
    } finally {
      setSavingProfile(false)
    }
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEyebrow}>GAMEDEX ID</Text>
          <Text style={styles.helpText}>Preparando autenticacao...</Text>
        </View>
      </View>
    )
  }

  if (!user) {
    return (
      <ScrollView contentContainerStyle={styles.authContainer}>
        <LinearGradient
          colors={[colors.primarySoft, 'rgba(34,211,238,0.08)', 'transparent']}
          style={styles.heroCard}
        >
          <Text style={styles.eyebrow}>GAMEDEX ID</Text>
          <Text style={styles.title}>{isRegisterMode ? 'Crie sua conta' : 'Entre na sua conta'}</Text>
          <Text style={styles.helpText}>Salve favoritos, acompanhe status dos jogos e mantenha sua biblioteca sincronizada.</Text>

          <View style={styles.modeSwitch}>
            <Pressable
              style={[styles.modeButton, !isRegisterMode && styles.modeButtonActive]}
              onPress={() => setIsRegisterMode(false)}
            >
              <Text style={[styles.modeButtonText, !isRegisterMode && styles.modeButtonTextActive]}>Entrar</Text>
            </Pressable>
            <Pressable
              style={[styles.modeButton, isRegisterMode && styles.modeButtonActive]}
              onPress={() => setIsRegisterMode(true)}
            >
              <Text style={[styles.modeButtonText, isRegisterMode && styles.modeButtonTextActive]}>Criar conta</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="voce@email.com"
              placeholderTextColor={colors.textFaint}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="No minimo 6 caracteres"
              placeholderTextColor={colors.textFaint}
            />
          </View>

          {isRegisterMode && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nickname</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Como voce quer aparecer"
                placeholderTextColor={colors.textFaint}
              />
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryBtn} onPress={submitAuth} disabled={submittingAuth}>
            <Text style={styles.primaryBtnText}>
              {submittingAuth ? 'Processando...' : isRegisterMode ? 'Criar conta' : 'Entrar'}
            </Text>
          </Pressable>

          <Text style={styles.formHint}>
            {isRegisterMode
              ? 'Seu perfil sera criado no Firebase Auth e sincronizado com a biblioteca.'
              : 'Use o mesmo email da sua conta para recuperar biblioteca e perfil.'}
          </Text>
        </View>

        <Pressable onPress={() => setIsRegisterMode((value) => !value)}>
          <Text style={styles.switchMode}>
            {isRegisterMode ? 'Ja tenho conta' : 'Quero criar conta'}
          </Text>
        </Pressable>
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['rgba(124,58,237,0.3)', 'rgba(34,211,238,0.08)', 'rgba(12,14,22,0.98)']}
        style={styles.profileHero}
      >
        <Text style={styles.eyebrow}>PERFIL</Text>
        <Text style={styles.title}>{nickname?.trim() || user.displayName || 'Jogador GameDex'}</Text>
        <Text style={styles.heroEmail}>{user.email}</Text>
        <Text style={styles.helpText}>Atualize sua identidade no app e deixe seu perfil pronto para acompanhar a biblioteca.</Text>
      </LinearGradient>

      <View style={styles.formCard}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Seu nome no app"
            placeholderTextColor={colors.textFaint}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholder="Fale dos seus generos favoritos, backlog ou jogo do momento"
            placeholderTextColor={colors.textFaint}
          />
        </View>

        <Pressable style={styles.primaryBtn} onPress={saveProfileData} disabled={savingProfile}>
          <Text style={styles.primaryBtnText}>{savingProfile ? 'Salvando...' : 'Salvar perfil'}</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={logout}>
          <Text style={styles.secondaryBtnText}>Sair</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 14,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },
  authContainer: {
    padding: 18,
    gap: 14,
    backgroundColor: colors.bg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.bg,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 22,
    gap: 8,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    overflow: 'hidden',
  },
  profileHero: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    overflow: 'hidden',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  loadingEyebrow: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.textMain,
    fontSize: 28,
    fontWeight: '800',
  },
  helpText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  heroEmail: {
    color: colors.textBody,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  modeSwitch: {
    marginTop: 18,
    flexDirection: 'row',
    backgroundColor: 'rgba(5,5,7,0.32)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.textMain,
  },
  modeButtonText: {
    color: colors.textBody,
    fontWeight: '700',
  },
  modeButtonTextActive: {
    color: colors.bg,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.textBody,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.textMain,
    backgroundColor: colors.surfaceAlt,
  },
  bioInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: colors.textMain,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.bg,
    fontWeight: '700',
  },
  formHint: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  secondaryBtn: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.textMain,
    fontWeight: '700',
  },
  switchMode: {
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
})
