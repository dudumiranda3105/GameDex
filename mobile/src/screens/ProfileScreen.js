import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useAuth } from '../context/AuthContext'
import { fetchProfile, updateProfile } from '../services/backendApi'
import { ENV } from '../config/env'

WebBrowser.maybeCompleteAuthSession()

export default function ProfileScreen() {
  const {
    user,
    ready,
    error,
    login,
    register,
    logout,
    loginWithGoogleIdToken,
  } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [submittingAuth, setSubmittingAuth] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const hasGoogleConfig = Boolean(
    ENV.GOOGLE_ANDROID_CLIENT_ID || ENV.GOOGLE_EXPO_CLIENT_ID || ENV.GOOGLE_WEB_CLIENT_ID,
  )

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: ENV.GOOGLE_EXPO_CLIENT_ID || undefined,
    androidClientId: ENV.GOOGLE_ANDROID_CLIENT_ID || undefined,
    iosClientId: ENV.GOOGLE_IOS_CLIENT_ID || undefined,
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID || undefined,
    scopes: ['profile', 'email'],
  })

  useEffect(() => {
    if (!response) return

    if (response.type === 'dismiss' || response.type === 'cancel') return

    if (response.type !== 'success') {
      const providerError = response?.params?.error || 'invalid_request'
      const providerDescription = response?.params?.error_description || 'Requisicao do Google invalida para este app.'
      Alert.alert(
        'Erro no Google Login',
        `${providerError}: ${providerDescription}\n\nConfira package name + SHA-1 no OAuth Android e o client ID correto.`,
      )
      return
    }

    const idToken = response?.authentication?.idToken || response?.params?.id_token
    if (!idToken) {
      Alert.alert('Erro', 'Falha ao recuperar o token do Google.')
      return
    }

    loginWithGoogleIdToken(idToken)
      .catch(() => {
        // Erro tratado no contexto.
      })
  }, [response])

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

  const loginWithGoogle = async () => {
    if (!hasGoogleConfig) {
      Alert.alert('Configurar Google', 'Defina EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID no build para habilitar o login.')
      return
    }

    try {
      await promptAsync({
        showInRecents: true,
      })
    } catch (googleError) {
      console.error(googleError)
      Alert.alert('Erro', 'Nao foi possivel iniciar o login com Google.')
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
        <Text style={styles.helpText}>Preparando autenticacao...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isRegisterMode ? 'Criar conta' : 'Entrar'}</Text>
        <Text style={styles.helpText}>Acesse sua biblioteca e salve progresso dos seus jogos favoritos.</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#8090ad"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Senha"
          placeholderTextColor="#8090ad"
        />

        {isRegisterMode && (
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Nickname"
            placeholderTextColor="#8090ad"
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.primaryBtn} onPress={submitAuth} disabled={submittingAuth}>
          <Text style={styles.primaryBtnText}>
            {submittingAuth ? 'Processando...' : isRegisterMode ? 'Criar conta' : 'Entrar'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.googleBtn, (!request || !hasGoogleConfig) && styles.disabledBtn]}
          onPress={loginWithGoogle}
          disabled={!request || !hasGoogleConfig}
        >
          <Text style={styles.googleBtnText}>Continuar com Google</Text>
        </Pressable>

        {!hasGoogleConfig ? (
          <Text style={styles.warning}>Login Google desativado: falta configurar EXPO_PUBLIC_GOOGLE_*.</Text>
        ) : null}

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
      <Text style={styles.title}>Meu perfil</Text>
      <Text style={styles.helpText}>{user.email}</Text>

      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Nickname"
        placeholderTextColor="#8090ad"
      />

      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        placeholder="Bio"
        placeholderTextColor="#8090ad"
      />

      <Pressable style={styles.primaryBtn} onPress={saveProfileData} disabled={savingProfile}>
        <Text style={styles.primaryBtnText}>{savingProfile ? 'Salvando...' : 'Salvar perfil'}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={logout}>
        <Text style={styles.secondaryBtnText}>Sair</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 10,
    backgroundColor: '#060b17',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#060b17',
  },
  title: {
    color: '#f5f8ff',
    fontSize: 28,
    fontWeight: '800',
  },
  helpText: {
    color: '#9fb2d6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#26385d',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f5f8ff',
    backgroundColor: '#0f182c',
  },
  bioInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: '#3f66ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  googleBtn: {
    backgroundColor: '#e9eef9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  googleBtnText: {
    color: '#202b45',
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  secondaryBtn: {
    backgroundColor: '#1d2a46',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#d8e3fa',
    fontWeight: '700',
  },
  switchMode: {
    color: '#8fb6ff',
    textAlign: 'center',
    marginTop: 4,
  },
  warning: {
    color: '#f7c17b',
    fontSize: 12,
  },
  error: {
    color: '#ff9a9a',
  },
})
