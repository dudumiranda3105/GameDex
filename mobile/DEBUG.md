# 🔧 Guia de Debug — Erro 400 no APK

Se o APK está retornando **erro 400**, siga este checklist para resolver:

---

## ❌ Erro 400 — Bad Request

Significa que a requisição foi malformada ou as credenciais estão incorretas.

### 1️⃣ Verificar Variáveis de Ambiente

```bash
# Verificar o arquivo .env no mobile/
cat mobile/.env
```

Certifique-se de que **todas** estas variáveis estão preenchidas:

```env
# ✅ OBRIGATÓRIA
EXPO_PUBLIC_RAWG_API_KEY=sua_chave_rawg_aqui

# ✅ OBRIGATÓRIA
EXPO_PUBLIC_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

# ✅ OBRIGATÓRIA (Firebase)
EXPO_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id

# ✅ OBRIGATÓRIA (para login Google)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_web_client_id
```

### 2️⃣ Rodar Expo com Clear Cache

```bash
cd mobile
npx expo start --clear
```

Pressione `a` para Android ou escaneie o QR Code com Expo Go.

### 3️⃣ Verificar Logs no Expo Go

Quando abrir o app no Expo Go, procure por mensagens como:

```
⚠️ RAWG API Key não está configurado
⚠️ Variável EXPO_PUBLIC_API_BASE_URL não configurada
```

**Se ver essas mensagens**, as variáveis não foram carregadas corretamente.

### 4️⃣ Testar RAWG API Key

Para verificar se a chave RAWG é válida, acesse no navegador:

```
https://api.rawg.io/api/games?key=SUA_CHAVE_AQUI&page_size=5
```

- ✅ Se retornar JSON com `results: [...]`, a chave é **válida**
- ❌ Se retornar erro, a chave é **inválida** ou **expirou**

### 5️⃣ Testar API Backend

Para verificar se o backend está respondendo:

```bash
curl "https://game-dex-dudumiranda3105s-projects.vercel.app/api/health"
```

Deve retornar:
```json
{"ok":true,"service":"gamedex-api","timestamp":"..."}
```

### 6️⃣ Verificar Erros no Console

Abra o console do Expo Go:
- **iOS**: Agite o celular 3 vezes
- **Android**: Pressione Ctrl + M (ou Cmd + M)

Procure por mensagens de erro como:

```
API Error 400: ...
No response from API
Request error: ...
RAWG API Error 401: Invalid API key
```

---

## 🔍 Erros Comuns e Soluções

| Erro | Causa | Solução |
|---|---|---|
| `400 Bad Request` | Chave RAWG inválida | Gerar nova chave em https://rawg.io/api |
| `401 Unauthorized` | Token Firebase inválido | Fazer login novamente no app |
| `ENOTFOUND api.rawg.io` | Sem conexão internet | Verificar WiFi/dados móveis |
| `Cannot read property 'Bearer'` | idToken undefined | Fazer login antes de acessar biblioteca |
| `Variável não configurada` | `.env` não carregado | Rodar `npx expo start --clear` |

---

## 🛠️ Debug Avançado

### Verificar Arquivos de Configuração

```bash
# Ver variáveis carregadas
cd mobile
node -e "console.log(process.env.EXPO_PUBLIC_RAWG_API_KEY)"
```

### Limpar Completamente

```bash
cd mobile
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

### Build EAS com Debug

Se estava usando EAS Build, reconstruir com variáveis:

```bash
npx eas-cli build --platform android --profile preview
```

Na tela de input, asegure-se de que as variáveis de ambiente estão corretas.

---

## 📞 Próximos Passos

1. ✅ Verificar `.env` está correto
2. ✅ Rodar `npx expo start --clear`
3. ✅ Verificar logs no Expo Go
4. ✅ Testar API RAWG no navegador
5. ✅ Testar backend com `curl`

Se o problema persistir, compartilhe o erro exato que aparece no console do Expo Go.
