import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { fetchProfile, updateProfile } from '../services/backendApi'

export default function ProfileScreen() {
  const { user, ready, error, login, register, logout } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
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
    try {
      if (isRegisterMode) {
        await register(email, password, nickname)
      } else {
        await login(email, password)
      }
    } catch {
      // Erro tratado no contexto.
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
        <Text style={styles.helpText}>Use email e senha para autenticar no app mobile.</Text>

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

        <Pressable style={styles.primaryBtn} onPress={submitAuth}>
          <Text style={styles.primaryBtnText}>{isRegisterMode ? 'Criar conta' : 'Entrar'}</Text>
        </Pressable>

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
    padding: 16,
    gap: 10,
    backgroundColor: '#070a12',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070a12',
  },
  title: {
    color: '#f3f6fd',
    fontSize: 24,
    fontWeight: '800',
  },
  helpText: {
    color: '#94a2bd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#202a40',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f3f6fd',
    backgroundColor: '#0f1420',
  },
  bioInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: '#4f73ff',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#1d2438',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#d2dbef',
    fontWeight: '700',
  },
  switchMode: {
    color: '#9eb2ff',
    textAlign: 'center',
    marginTop: 4,
  },
  error: {
    color: '#ff9a9a',
  },
})
