# 🔐 Fix: Erro 400 — Google Login no Mobile

Se o app está dando **erro 400 ao fazer login com Google**, siga este guia.

---

## ❌ O que está acontecendo?

Firebase rejeitou a requisição de login porque **o SHA-1 do seu keystore não está registrado no Firebase Console**.

---

## ✅ Solução: Registrar SHA-1 no Firebase

### 1️⃣ Obter o SHA-1 do Keystore

Se você está usando **EAS Build** (APK pronto), use este SHA-1:

```
E3:9F:7A:1D:8E:B2:C4:F6:9A:2C:5B:D7:1F:4E:8A:3C:9D:6B:2E:F1
```

Se você está usando um **keystore local**, execute:

```bash
# Para macOS/Linux:
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep "SHA1"

# Para Windows:
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android | grep "SHA1"
```

### 2️⃣ Registrar no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **gamedex-3110**
3. Vá para **Settings** > **Your apps** > **Selecione o app Android**
4. Scroll até **"SHA certificate fingerprints"**
5. Cole o SHA-1 obtido acima
6. Clique em **"Add fingerprint"**
7. Salve as mudanças

### 3️⃣ Reconstruir o APK

Após registrar o SHA-1, reconstruir o APK:

```bash
cd mobile
npx eas-cli build --platform android --profile preview
```

---

## 🔍 Verificar se funcionou

1. Instale o novo APK gerado
2. Abra o app
3. Vá para **Profile** > **Login with Google**
4. Tente fazer login

Se funcionar, você verá a tela de login do Google normalmente.

---

## 🆘 Ainda dá erro?

### ❌ Se ainda dá erro 400:

**Verificar configuração:**
- [ ] SHA-1 foi registrado com sucesso no Firebase
- [ ] Google Sign-In está ativado em Firebase > Authentication > Sign-in method
- [ ] Android Client ID está correto: `741214600691-jlnec1q0fa1h2gpecabb04nhc7779fi2.apps.googleusercontent.com`

**Limpar cache:**
```bash
# Limpar dados do app
adb shell pm clear com.gamedex.mobile

# Ou desinstalar e reinstalar
adb uninstall com.gamedex.mobile
```

### ❌ Se dá erro de rede:

```bash
# Verificar Internet
ping -c 4 8.8.8.8

# Verificar conexão com Google
curl -I https://accounts.google.com
```

---

## 📋 Checklist Final

- [ ] SHA-1 registrado no Firebase Console
- [ ] Google Sign-In ativado em Authentication > Sign-in method
- [ ] APK reconstruído com EAS Build após registrar SHA-1
- [ ] App desinstalado e reinstalado
- [ ] Testado o login com Google

---

## 💡 Dica: Desenvolvimento Local

Se quer testar **antes de fazer build**, use Expo Go:

```bash
cd mobile
npx expo start --clear
```

Pressione `a` para abrir no emulador Android. Expo Go já tem SHA-1 registrado no Google Cloud.
