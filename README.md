# 🎮 GameDex

Plataforma para descobrir e gerenciar jogos, consumindo dados da **RAWG API** com integração ao **Firebase**. Disponível como aplicação **web** (React + Vite) e **mobile** (React Native + Expo).

---

## 🔗 Acesso

| Plataforma | Link |
|---|---|
| Web | **https://game-dex-dudumiranda3105s-projects.vercel.app** |
| APK Android | **[Download APK](https://expo.dev/artifacts/eas/eu23AZcRw258trhDoVVZrh.apk)** |

---

## 🚀 Funcionalidades

### Web (`src/`)

- **Home** (`/`) — jogos em alta, top rated e lançamentos
- **Busca** (`/search`) — pesquisa por nome, filtro por gênero, plataforma e ordenação
- **Detalhes** (`/game/:id`) — capa, nota, Metacritic, descrição, screenshots e informações completas
- **Biblioteca** (`/library`) — biblioteca pessoal com status e favoritos (requer login)
- **Sobre** (`/about`) — visão do projeto e stack
- **App** (`/download`) — link para download do APK mobile

### Mobile (`mobile/`)

- **Home** — jogos em alta carregados da RAWG API
- **Busca** — pesquisa por nome em tempo real
- **Detalhes do jogo** — capa, nota, gêneros, plataformas, descrição, botões de salvar e favoritar
- **Biblioteca** — biblioteca pessoal com troca de status e favoritos
- **Perfil** — login com email/senha ou Google, edição de nickname e bio

---

## 🧱 Stack Técnica

### Web

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, React Router DOM |
| Build | Vite 7 |
| Estilo/UI | CSS custom + Tailwind CSS |
| Animações | Framer Motion |
| Requisições | Axios |
| Backend | Vercel Serverless Functions (Node.js) |
| Banco/Auth | Firebase (Firestore + Firebase Auth) |
| Ícones | React Icons |

### Mobile

| Camada | Tecnologia |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Navegação | React Navigation (Native Stack + Bottom Tabs) |
| Autenticação | Firebase Auth (firebase ^12) |
| OAuth Google | expo-auth-session + expo-web-browser |
| Requisições | Axios |
| Backend | Vercel Serverless Functions (compartilhado com web) |
| Build/Deploy | EAS Build (Expo Application Services) |

---

## 🔌 APIs utilizadas

- **RAWG Video Games Database** — https://rawg.io/apidocs
  - `GET /games` — listagem e busca
  - `GET /games?search=...` — busca por nome
  - `GET /games/{id}` — detalhes do jogo
  - `GET /games/{id}/screenshots` — screenshots
  - `GET /genres` — lista de gêneros
  - `GET /platforms/lists/parents` — lista de plataformas

- **Backend próprio** (`https://game-dex-dudumiranda3105s-projects.vercel.app/api`)
  - `GET /api/health` — status da API
  - `GET /api/library` — biblioteca do usuário autenticado
  - `POST /api/library` — salvar/atualizar jogo na biblioteca
  - `DELETE /api/library?gameId=ID` — remover jogo
  - `GET /api/profile` — perfil do usuário
  - `POST /api/profile` — atualizar nickname e bio

---

## ⚙️ Como rodar localmente

### Web

#### 1) Instalar dependências

```bash
npm install
```

#### 2) Configurar variáveis de ambiente

Crie `.env` na raiz do projeto:

```env
VITE_RAWG_API_KEY=sua_chave_rawg
VITE_API_BASE_URL=http://localhost:5173/api

# Firebase Web
VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456

# Backend (Firebase Admin)
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----\n"
```

#### 3) Rodar em desenvolvimento

```bash
npm run dev
```

#### 4) Build de produção

```bash
npm run build
```

---

### Mobile

#### Pré-requisitos

- Node.js 18+
- Aplicativo **Expo Go** no celular

#### 1) Instalar dependências

```bash
cd mobile
npm install
```

#### 2) Configurar variáveis de ambiente

Crie `mobile/.env`:

```env
EXPO_PUBLIC_RAWG_API_KEY=sua_chave_rawg
EXPO_PUBLIC_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

EXPO_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abcdef

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_web_client_id
```

#### 3) Rodar em desenvolvimento

```bash
cd mobile
npx expo start
```

Escaneie o QR Code com o **Expo Go** ou pressione `a` para abrir no emulador Android.

#### 4) Gerar APK

```bash
cd mobile
npx eas-cli build --platform android --profile preview
```

---

## 📁 Estrutura do Projeto

```
GameDex/
├── src/                        # Código-fonte Web
│   ├── components/             # Layout, GameCard, FeedbackState
│   ├── pages/                  # Home, Search, GameDetails, Library, About, Download
│   ├── services/               # rawgApi.js, backendApi.js
│   ├── lib/                    # utils.js
│   └── App.jsx
│
├── api/                        # Backend Serverless (Vercel)
│   ├── _lib/                   # firebaseAdmin.js, http.js
│   ├── health.js
│   ├── library.js
│   └── profile.js
│
├── mobile/                     # Código-fonte Mobile
│   ├── App.js                  # Ponto de entrada e navegação
│   ├── app.json                # Configuração Expo
│   ├── eas.json                # Configuração EAS Build
│   └── src/
│       ├── screens/            # Home, Search, GameDetails, Library, Profile
│       ├── components/         # GameItem
│       ├── context/            # AuthContext (Firebase Auth)
│       ├── services/           # rawgApi.js, backendApi.js
│       ├── config/             # env.js
│       └── lib/                # gameLibrary.js
│
└── docs/
    └── screenshots/            # Prints da aplicação
```

---

## 🏗️ Arquitetura da Aplicação

```mermaid
flowchart TD
    UserWeb["👤 Usuário (Web)"]
    UserMobile["📱 Usuário (Mobile)"]

    subgraph Web ["Web — React + Vite"]
        Pages["Pages\nHome / Search / GameDetails / Library / About"]
        Components["Components\nLayout / GameCard / FeedbackState"]
        WebApi["services/rawgApi.js\nservices/backendApi.js"]
    end

    subgraph Mobile ["Mobile — React Native + Expo"]
        Screens["Screens\nHome / Search / GameDetails / Library / Profile"]
        AuthCtx["AuthContext\nFirebase Auth"]
        MobileApi["services/rawgApi.js\nservices/backendApi.js"]
    end

    RAWG["🌐 RAWG API\nrawg.io/apidocs"]

    subgraph Backend ["Backend — Vercel Serverless (api/)"]
        Functions["health / library / profile\nFirebase Admin SDK"]
    end

    subgraph Firebase ["🔥 Firebase — Google Cloud"]
        Auth["Firebase Auth\nemail/senha + Google"]
        Firestore["Firestore\nbiblioteca / perfil"]
    end

    UserWeb --> Web
    UserMobile --> Mobile

    WebApi -->|GET /games| RAWG
    MobileApi -->|GET /games| RAWG

    WebApi -->|Bearer Token| Backend
    MobileApi -->|Bearer Token| Backend

    Backend --> Firebase
    Auth --> AuthCtx
```

---

## 🖼️ Prints da Aplicação

### Web — Home
![Home Web](docs/screenshots/home.png)

### Web — Busca
![Busca Web](docs/screenshots/search.png)

### Web — Detalhes do Jogo
![Detalhes Web](docs/screenshots/details.png)

### Web — Sobre
![Sobre Web](docs/screenshots/about.png)

### Web — Download do App
![Download Web](docs/screenshots/download.png)

### Mobile — Home
![Home Mobile](docs/screenshots/mobile-home.png)

### Mobile — Busca
![Busca Mobile](docs/screenshots/mobile-search.png)

### Mobile — Detalhes do Jogo
![Detalhes Mobile](docs/screenshots/mobile-details.png)

### Mobile — Biblioteca
![Biblioteca Mobile](docs/screenshots/mobile-library.png)

### Mobile — Perfil / Login
![Perfil Mobile](docs/screenshots/mobile-profile.png)

> Salve os prints do app mobile em `docs/screenshots/` com os nomes `mobile-*.png`.

---

## 🔐 Integração com Firebase

- **Firebase Auth** — autenticação com email/senha e Google OAuth (web e mobile)
- **Firestore** — armazenamento de biblioteca pessoal e perfil do usuário
- O token Firebase é enviado no header `Authorization: Bearer <token>` para o backend, que valida via Firebase Admin SDK

---

## 🌐 Deploy (Web)

1. Suba o repositório para o GitHub
2. No painel da **Vercel**, importe o repositório
3. Configure as variáveis de ambiente (`VITE_RAWG_API_KEY`, `FIREBASE_*`)
4. Build Command: `npm run build` / Output: `dist`
5. O `vercel.json` já inclui rewrite para o React Router funcionar sem quebrar rotas

---

## 📝 Observações

- Sem `VITE_RAWG_API_KEY` (web) ou `EXPO_PUBLIC_RAWG_API_KEY` (mobile), os jogos não carregam
- O login com Google no mobile requer o SHA-1 da keystore registrado no Google Cloud Console OAuth
