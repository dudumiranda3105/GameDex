# 📱 GameDex Mobile

Aplicativo mobile **GameDex** desenvolvido com **React Native** e **Expo**, oferecendo uma experiência completa de descoberta e gerenciamento de videogames em dispositivos Android (e iOS).

Sincronize sua biblioteca entre web e mobile em tempo real via **Firebase**, descubra centenas de jogos da **RAWG Database** e gerencie seu status de cada título.

---

## 🔗 Acesso Rápido

| Item | Link |
|---|---|
| **APK Android** | 📥 [Download APK Pronto](https://expo.dev/artifacts/eas/fuVowPQ9T5WqaXW1lYpWFG.apk) |
| **Código-fonte** | 🔗 [GitHub GameDex](https://github.com/dudumiranda3105/GameDex) |
| **Documentação Completa** | 📚 [README Principal](../README.md) |

---

## ✨ Funcionalidades

### Home Screen
- Listagem de jogos populares e top rated
- Skeleton loading durante carregamento
- Shimmer effects nas imagens
- Navegação por abas (Tab Navigation)

### Search Screen  
- Busca em tempo real por nome de jogo
- Suporte a múltiplas queries
- Resultados instantâneos conforme digita

### Game Details Screen
- Capa e arte completa do jogo
- Avaliação em pontos (1-100)
- Gêneros, plataformas e descrição
- Botões para adicionar à biblioteca e marcar favorito
- Sincronização com Firebase

### Library Screen
- Biblioteca pessoal sincronizada com Firebase
- Gerenciamento de status: Backlog, Jogando, Completado, Pausado, Abandonado
- Marcação de favoritos
- Sincronização em tempo real

### Profile Screen
- Login com email/senha (Firebase Auth)
- Login com Google OAuth
- Exibição de perfil do usuário
- Edição de nickname e bio
- Logout

---

## 🧱 Stack Técnico

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework** | React Native | 0.81.5 |
| **Expo SDK** | Expo | 54.0.34 |
| **Navegação** | React Navigation | 7.x |
| **HTTP Client** | Axios | 1.15.0 |
| **Autenticação** | Firebase Auth | 12.12.0 |
| **Banco de Dados** | Cloud Firestore | 12.12.0 |
| **Armazenamento Local** | AsyncStorage | 2.2.0 |
| **OAuth/Web Browser** | expo-auth-session + expo-web-browser | 7.0.11 + 15.0.11 |
| **Gradientes** | expo-linear-gradient | 15.0.8 |
| **Segurança** | expo-crypto | 15.0.9 |
| **Build/Deploy** | EAS Build (Expo Application Services) | — |

---

## 🔌 APIs Utilizadas

### RAWG Video Games Database
- `GET /games` — listagem, busca e filtros de jogos
- `GET /games/{id}` — detalhes completos de um jogo
- `GET /games/{id}/screenshots` — screenshots do jogo
- `GET /genres` — lista de gêneros
- `GET /platforms` — lista de plataformas

### Firebase (Google Cloud)
- **Firebase Auth** — autenticação com email/senha e Google OAuth
- **Cloud Firestore** — armazenamento de biblioteca pessoal e perfil

### Backend Próprio (Vercel Serverless Functions)
- `GET /api/health` — status da API
- `GET /api/library` — obter biblioteca do usuário
- `POST /api/library` — salvar/atualizar status de jogo
- `DELETE /api/library?gameId={id}` — remover jogo
- `GET /api/profile` — obter perfil do usuário
- `POST /api/profile` — atualizar nickname e bio

---

## 🛠️ Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Aplicativo **Expo Go** no celular (para testar via QR Code)

### 1) Instalar dependências

```bash
cd mobile
npm install
```

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `mobile/`:

```env
EXPO_PUBLIC_RAWG_API_KEY=sua_chave_rawg
EXPO_PUBLIC_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abcdef

# Google OAuth (opcional)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_web_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=seu_android_client_id
```

### 3) Rodar em desenvolvimento

```bash
npx expo start
```

Escaneie o QR Code com o **Expo Go** ou pressione `a` para abrir no emulador Android.

### 4) Gerar APK (EAS Build)

```bash
npx eas-cli build --platform android --profile preview
```

---

## 📜 Scripts

- `npx expo start` → inicia o servidor de desenvolvimento
- `npx eas-cli build --platform android --profile preview` → gera APK de teste
- `npx expo-doctor` → verifica saúde das dependências

---
## 🛠️ Pré-requisitos

- **Node.js** ≥ 18.0.0
- **npm** ou **yarn**
- **Expo CLI** (opcional): `npm install -g expo-cli`
- **EAS CLI** (para builds): `npm install -g eas-cli`
- **Android Studio** (emulador) ou dispositivo Android físico
- **Expo Go App** instalado no celular (para desenvolvimento com QR Code)
- **RAWG API Key**: https://rawg.io/api
- **Projeto Firebase** com credenciais configuradas

---

## 📦 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/dudumiranda3105/GameDex.git
cd GameDex/mobile
```

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `mobile/`:

```env
# RAWG API
EXPO_PUBLIC_RAWG_API_KEY=sua_chave_rawg
EXPO_PUBLIC_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

# Firebase Web SDK
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Google OAuth (obrigatório para login com Google)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_web_client_id
```

> **Nota**: Obtenha essas credenciais no Firebase Console (Project Settings) e Google Cloud Console.

---

## ▶️ Desenvolvimento

### Rodar no Expo Go (Recomendado)

```bash
# Inicia o servidor Expo
npx expo start

# Opções:
# - Pressione 'a' para abrir no emulador Android
# - Pressione 'i' para abrir no emulador iOS (macOS)
# - Escaneie o QR Code com Expo Go (iOS/Android)
```

### Rodar no Emulador Android

```bash
# Com Android Studio instalado:
npx expo start --android

# Ou com emulador já rodando:
npx expo start
# Depois pressione 'a'
```

### Limpar Cache e Rebuild

```bash
# Limpa cache do Expo
npx expo start --clear

# Reinstala dependências
rm -rf node_modules
npm install
```

---

## 🔨 Build e Deploy

### Preview Build (para testes)

```bash
cd mobile
npx eas-cli build --platform android --profile preview
```

### Production Build

```bash
npx eas-cli build --platform android --profile production
```

### Gerenciar Builds

```bash
# Listar todas as builds
npx eas-cli build:list

# Ver detalhes de uma build
npx eas-cli build:view <build-id>

# Cancelar uma build em progresso
npx eas-cli build:cancel <build-id>
```

### EAS Update (sem rebuild)

Se apenas código JavaScript mudou:

```bash
npx eas update --branch production --message "Descrição da atualização"
```

---

## 📁 Estrutura do Projeto

```
mobile/
├── App.js                  # Ponto de entrada (navegação principal)
├── app.json                # Configuração do Expo
├── eas.json                # Configuração EAS Build
├── package.json            # Dependências
├── .env                    # Variáveis de ambiente (não versionar)
├── .env.example            # Exemplo de variáveis
│
└── src/
    ├── screens/            # Telas da aplicação
    │   ├── HomeScreen.js   # Listagem de jogos populares/top-rated
    │   ├── SearchScreen.js # Busca em tempo real
    │   ├── GameDetailsScreen.js  # Detalhes + biblioteca/favoritos
    │   ├── LibraryScreen.js      # Biblioteca pessoal sincronizada
    │   └── ProfileScreen.js      # Login/perfil/logout
    │
    ├── components/         # Componentes reutilizáveis
    │   └── GameItem.js     # Item de jogo na lista/grid
    │
    ├── context/            # Contextos React (estado global)
    │   └── AuthContext.js  # Gerenciamento de autenticação Firebase
    │
    ├── services/           # Integrações com APIs
    │   ├── rawgApi.js      # Chamadas para RAWG API
    │   └── backendApi.js   # Chamadas para backend Vercel
    │
    ├── config/             # Configurações
    │   └── env.js          # Carregamento de variáveis de ambiente
    │
    ├── theme/              # Design tokens
    │   └── theme.js        # Cores, tipografia, espaçamentos
    │
    └── lib/                # Utilitários
        └── gameLibrary.js  # Funções de gerenciamento de biblioteca
```

---

## 🏗️ Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────┐
│                  Usuário (Celular Android)               │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│              React Native + Expo (App.js)                │
│                                                          │
│  Bottom Tabs: Home | Busca | Biblioteca | Perfil         │
│                                                          │
│  Stack: GameDetails (sobre qualquer tab)                 │
│                                                          │
│  AuthContext ──► Firebase Auth (login/logout/registro)   │
│                                                          │
│  rawgApi.js ─────────────────────────► RAWG API          │
│  backendApi.js ──────┐                (dados de jogos)   │
└──────────────────────┼──────────────────────────────────┘
                       │ Bearer Token (Firebase ID Token)
┌──────────────────────▼──────────────────────────────────┐
│         Vercel Serverless Functions (/api/*)             │
│              Firebase Admin SDK                          │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│             Firebase (Google Cloud)                      │
│   Firestore (biblioteca / perfil)  +  Firebase Auth      │
└─────────────────────────────────────────────────────────┘
```

---

## 🖼️ Prints da Aplicação

### Home
![Home](../docs/screenshots/mobile-home.png)

### Busca
![Busca](../docs/screenshots/mobile-search.png)

### Detalhes do Jogo
![Detalhes](../docs/screenshots/mobile-details.png)

### Biblioteca
![Biblioteca](../docs/screenshots/mobile-library.png)

### Perfil / Login
![Perfil](../docs/screenshots/mobile-profile.png)

> **Nota:** tire os prints do APK instalado e salve em `docs/screenshots/` com os nomes acima.

---

## 📲 Download do APK

Baixe a versão mais recente do APK:

👉 **[Download APK — GameDex Mobile](https://expo.dev/accounts/dudunerd/projects/gamedex-mobile/builds/ccc40b77-8692-41b2-b9f0-a595b179dd1d)**

---

## 🔐 Integração com Firebase

O app usa o Firebase para:

1. **Firebase Auth** — login com email/senha e Google OAuth
2. **Firestore** (via backend) — armazenamento da biblioteca e perfil do usuário
3. **Token de Autenticação** — token Firebase enviado no header `Authorization: Bearer <token>` em todas as requisições ao backend

O backend valida o token via **Firebase Admin SDK** antes de processar qualquer requisição.

---

## 🔧 Troubleshooting

| Problema | Solução |
|---|---|
| Expo Go não conecta ao servidor | Verificar firewall, reconectar WiFi, tentar `expo start --localhost` |
| "Unterminated regular expression" | Procurar strings regex quebradas ou comentários mal fechados no código |
| APK não instala | Desinstalar versão anterior ou usar `adb install -r` para forçar reinstalação |
| Firebase não carrega dados | Verificar variáveis de ambiente `.env` e regras de segurança Firestore |
| Login com Google falha | Verificar SHA-1 do keystore no Firebase Console e Google Cloud Console |
| Memória insuficiente ao rodar | Aumentar heap: `NODE_OPTIONS=--max-old-space-size=2048 expo start` |
| Gradle build falha | Limpar cache Android: `cd android && ./gradlew clean && cd ..` |
| Mudanças de código não refletem | Usar `expo start --clear` para limpar cache |

---

## 📖 Documentação Adicional

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation Docs**: https://reactnavigation.org
- **Firebase Docs**: https://firebase.google.com/docs
- **RAWG API Docs**: https://rawg.io/apidocs
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

---

## 📚 Referência do Código

### Exemplo de Integração Firebase

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
```

### Exemplo de Chamada à API

```javascript
import axios from 'axios'

const backendApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
})

export async function getLibrary(token) {
  const response = await backendApi.get('/library', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
```

---

## 🤝 Contribuição

Para contribuir com melhorias:

1. Fork o repositório principal
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Faça commits descritivos: `git commit -m 'feat: descrição'`
4. Push para a branch: `git push origin feature/sua-feature`
5. Abra um Pull Request no repositório principal

---

## 📄 Licença

MIT License — veja [LICENSE](../LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Eduardo Miranda**
- GitHub: https://github.com/dudumiranda3105

---

## 🎯 Próximas Melhorias

- [ ] Temas dark/light persistentes
- [ ] Cache offline de jogos
- [ ] Notificações push de novos lançamentos
- [ ] Compartilhamento de biblioteca com amigos
- [ ] Sistema de avaliações/reviews
- [ ] Wishlist sincronizado
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Integração com redes sociais

---

**Atualizado em**: 27 de abril de 2026  
**Status**: ✅ Em desenvolvimento ativo  
**Versão**: 1.0.0
