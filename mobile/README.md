# 🎮 GameDex Mobile

Aplicativo mobile para descobrir e gerenciar jogos usando a **RAWG API**, com autenticação Firebase e biblioteca pessoal de jogos.

---

## ✨ Funcionalidades

- **Home** — jogos em alta carregados da RAWG API
- **Busca** — pesquisa por nome de jogo em tempo real
- **Detalhes do jogo** — capa, nota, gêneros, plataformas, descrição
- **Biblioteca pessoal** — salve jogos com status (Quero jogar, Jogando, Completado, Pausado, Abandonado) e marque favoritos
- **Perfil / Autenticação** — login com email/senha e Google via Firebase Auth

---

## 🧱 Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Navegação | React Navigation (Native Stack + Bottom Tabs) |
| Autenticação | Firebase Auth (`firebase ^12`) |
| OAuth Google | expo-auth-session + expo-web-browser |
| Requisições | Axios |
| Backend | Vercel Serverless Functions (compartilhado com a versão web) |
| Banco de dados | Firebase Firestore |
| Build/Deploy | EAS Build (Expo Application Services) |

---

## 🔌 APIs utilizadas

- **RAWG Video Games Database** — https://rawg.io/apidocs
  - `GET /games` — listagem e busca de jogos
  - `GET /games/{id}` — detalhes de um jogo específico

- **Backend próprio** (`https://game-dex-theta.vercel.app/api`)
  - `GET /api/library` — biblioteca do usuário autenticado
  - `POST /api/library` — salvar/atualizar jogo na biblioteca
  - `DELETE /api/library?gameId=ID` — remover jogo
  - `GET /api/profile` — perfil do usuário
  - `POST /api/profile` — atualizar nickname e bio

---

## ⚙️ Como rodar localmente

### Pré-requisitos

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
EXPO_PUBLIC_API_BASE_URL=https://game-dex-theta.vercel.app/api

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

## 📁 Estrutura do Projeto

```text
mobile/
  App.js                  # Ponto de entrada e navegação
  app.json                # Configuração do Expo
  eas.json                # Configuração de builds EAS
  .env                    # Variáveis de ambiente (não versionado)

  src/
    screens/
      HomeScreen.js         # Tela inicial com jogos em alta
      SearchScreen.js       # Busca de jogos
      GameDetailsScreen.js  # Detalhes + botões de biblioteca/favorito
      LibraryScreen.js      # Biblioteca pessoal do usuário
      ProfileScreen.js      # Login, cadastro e perfil

    components/
      GameItem.js           # Card de jogo reutilizável

    context/
      AuthContext.js        # Estado global de autenticação Firebase

    services/
      rawgApi.js            # Chamadas à RAWG API
      backendApi.js         # Chamadas ao backend próprio

    config/
      env.js                # Leitura das variáveis de ambiente

    lib/
      gameLibrary.js        # Utilitários de status/mapeamento de biblioteca
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

O token de autenticação do Firebase é enviado no header `Authorization: Bearer <token>` em todas as requisições ao backend, que valida via Firebase Admin SDK.

---

## 📝 Observações

- O app requer conexão com internet para carregar dados da RAWG API e do backend.
- Sem `EXPO_PUBLIC_RAWG_API_KEY` configurado no EAS, os jogos não serão carregados.
- O login com Google requer SHA-1 da keystore registrado no Google Cloud Console OAuth.
