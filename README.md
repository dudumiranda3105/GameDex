# 🎮 GameDex

**GameDex** é uma plataforma full-stack para descobrir, pesquisar e gerenciar sua biblioteca pessoal de videogames. Consume dados da **RAWG Video Games Database** com integração a **Firebase** para autenticação e persistência de dados. Disponível como **aplicação web responsiva** (React + Vite + Vercel) e **aplicativo mobile** (React Native + Expo + EAS Build).

---

## 📱 Acesso Rápido

| Plataforma | Tecnologia | Link |
|---|---|---|
| **Web** | React + Vite | 🔗 https://game-dex-dudumiranda3105s-projects.vercel.app |
| **APK Android** | React Native + Expo | 📥 [Download APK Pronto](https://expo.dev/artifacts/eas/fuVowPQ9T5WqaXW1lYpWFG.apk) |

---

## 📋 Índice

1. [Funcionalidades](#-funcionalidades)
2. [Stack Técnica](#-stack-técnica)
3. [Instalação e Configuração](#%EF%B8%8F-instalação-e-configuração)
4. [Como Usar](#-como-usar)
5. [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
6. [Estrutura do Projeto](#-estrutura-do-projeto)
7. [Screenshots](#-screenshots)
8. [APIs Utilizadas](#-apis-utilizadas)
9. [Versionamento Git](#-versionamento-git)
10. [Troubleshooting](#-troubleshooting)
11. [Licença](#-licença)

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

### Web (React + Vite)

| Camada | Tecnologia | Versão |
|---|---|---|
| **Runtime** | Node.js | ≥ 20.19.0 |
| **Frontend Framework** | React + React DOM | 19.2.5 |
| **Bundler** | Vite | 8.0.8 |
| **Roteamento** | React Router DOM | 7.14.1 |
| **Estilização** | CSS3 Custom Properties + Tailwind CSS | — |
| **Animações** | Framer Motion | 12.38.0 |
| **HTTP Client** | Axios | 1.15.0 |
| **Ícones** | Lucide React + React Icons | 1.8.0 + 5.6.0 |
| **Backend** | Vercel Serverless Functions (Node.js) | — |
| **Autenticação** | Firebase Auth | 12.12.0 |
| **Banco de Dados** | Firestore | 12.12.0 |
| **Deploy** | Vercel | — |

### Mobile (React Native + Expo)

| Camada | Tecnologia | Versão |
|---|---|---|
| **Runtime** | Node.js | ≥ 18.0.0 |
| **Framework** | React Native (via Expo) | 0.81.5 |
| **Expo SDK** | Expo | 54.0.34 |
| **Navegação** | React Navigation | 7.x |
| **HTTP Client** | Axios | 1.15.0 |
| **Autenticação** | Firebase Auth + Google OAuth | 12.12.0 |
| **Armazenamento Local** | AsyncStorage | 2.2.0 |
| **OAuth/Web Browser** | expo-auth-session + expo-web-browser | 7.0.11 + 15.0.11 |
| **Gradientes** | expo-linear-gradient | 15.0.8 |
| **Segurança** | expo-crypto | 15.0.9 |
| **Build/Deploy** | EAS Build (Expo Application Services) | — |

---

## 🔌 APIs Utilizadas

### RAWG Video Games Database

Plataforma de dados aberta sobre videogames. Base de dados com mais de 500 mil jogos.

- **Site**: https://rawg.io/apidocs
- **Endpoints utilizados**:
  - `GET /games` — lista de jogos (com filtros, busca e paginação)
  - `GET /games?search=<query>` — busca por nome
  - `GET /games/{id}` — detalhes completos do jogo
  - `GET /games/{id}/screenshots` — screenshots do jogo
  - `GET /genres` — lista de todos os gêneros
  - `GET /platforms/lists/parents` — lista de plataformas

### Firebase (Google Cloud)

Plataforma de backend como serviço para autenticação, banco de dados em tempo real e storage.

- **Firebase Auth** — autenticação com email/senha e Google OAuth
- **Cloud Firestore** — armazenamento de biblioteca pessoal, favoritos e perfil do usuário
- **Estrutura de dados**:
  - `users/{userId}/library/{gameId}` — biblioteca pessoal (status: backlog/playing/completed/dropped)
  - `users/{userId}/profile` — dados de perfil (nickname, bio, avatar)

### Backend Próprio (Vercel Serverless Functions)

API que funciona como intermediária entre as aplicações (web/mobile) e Firebase, com validação de autenticação.

- **URL**: https://game-dex-dudumiranda3105s-projects.vercel.app/api
- **Endpoints**:
  - `GET /api/health` — status da API
  - `GET /api/library` — obter biblioteca do usuário autenticado
  - `POST /api/library` — salvar/atualizar status de um jogo
  - `DELETE /api/library?gameId={id}` — remover jogo da biblioteca
  - `GET /api/profile` — obter perfil do usuário
  - `POST /api/profile` — atualizar nickname e bio
  - Autenticação via Bearer Token (Firebase Auth Token)

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** ≥ 20.19.0 (web) ou ≥ 18.0.0 (mobile)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (para clonar o repositório)
- **Expo CLI** (opcional, para rodar mobile em desenvolvimento): `npm install -g expo-cli`
- **EAS CLI** (opcional, para buildar APK): `npm install -g eas-cli`
- **Conta RAWG** (para API key): https://rawg.io/api
- **Projeto Firebase** (para autenticação e banco de dados)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/dudumiranda3105/GameDex.git
cd GameDex
```

### 2️⃣ Configurar Firebase

1. Acesse https://console.firebase.google.com
2. Crie um novo projeto ou use um existente
3. Ative **Firebase Auth** (Email/Senha + Google)
4. Ative **Cloud Firestore** com permissões de leitura/escrita para usuários autenticados
5. Copie as credenciais do projeto (Settings > Project Settings)

#### Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /library/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      match /profile {
        allow read: if request.auth.uid == userId;
        allow write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 3️⃣ Instalar Dependências

#### Web

```bash
npm install
```

#### Mobile

```bash
cd mobile
npm install
```

### 4️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (web):

```env
# RAWG API
VITE_RAWG_API_KEY=sua_chave_rawg_aqui
VITE_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

# Firebase Web SDK
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# Firebase Admin SDK (para backend Vercel)
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----\n"
```

Para mobile, crie `mobile/.env`:

```env
# RAWG API
EXPO_PUBLIC_RAWG_API_KEY=sua_chave_rawg_aqui
EXPO_PUBLIC_API_BASE_URL=https://game-dex-dudumiranda3105s-projects.vercel.app/api

# Firebase Web SDK
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Google OAuth (para mobile)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu_web_client_id_aqui
```

> **Nota**: Para obter as credenciais do Firebase, acesse o painel do Firebase > Settings > Your Apps > Web/Android.

---

## ▶️ Como Usar

### Web (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Buildar para produção
npm run build

# Preview do build
npm run preview

# Validar linting
npm lint
```

### Mobile (Desenvolvimento)

```bash
cd mobile

# Instalar dependências
npm install

# Rodar Expo
npx expo start

# Opções:
# - Pressione 'a' para abrir no emulador Android
# - Pressione 'i' para abrir no emulador iOS (macOS)
# - Escaneie o QR Code com o app Expo Go (iOS/Android)
```

### Mobile (Build)

```bash
cd mobile

# Build para Android (gera APK)
npx eas-cli build --platform android --profile preview

# Ver status das builds
npx eas-cli build:list

# Usar EAS Update (sem rebuild)
npx eas update
```

> **Nota**: Para buildar com EAS, você precisa fazer login primeiro: `npx eas-cli login`

---

## 🏗️ Arquitetura da Aplicação

## 📁 Estrutura do Projeto

```
GameDex/
├── 📄 .env.example                 # Exemplo de variáveis de ambiente
├── 📄 package.json                 # Dependências da web
├── 📄 vite.config.js               # Configuração do Vite
├── 📄 eslint.config.js             # Configuração do ESLint
├── 📄 vercel.json                  # Configuração de deploy Vercel
│
├── 📂 src/                         # 🌐 Código-fonte Web (React)
│   ├── App.jsx                     # Componente raiz com rotas
│   ├── App.css                     # Estilos globais
│   ├── main.jsx                    # Ponto de entrada
│   ├── index.css                   # Estilos base
│   │
│   ├── 📂 components/              # Componentes reutilizáveis
│   │   ├── Layout.jsx              # Header, navegação e rodapé
│   │   ├── GameCard.jsx            # Card individual do jogo
│   │   └── FeedbackState.jsx       # Componente de feedback/loading
│   │
│   ├── 📂 pages/                   # Páginas/Rotas
│   │   ├── HomePage.jsx            # Home com jogos em alta/top
│   │   ├── SearchPage.jsx          # Busca e filtros
│   │   ├── GameDetailsPage.jsx     # Detalhes do jogo (biblioteca)
│   │   ├── AboutPage.jsx           # Sobre o projeto
│   │   └── DownloadPage.jsx        # Download do APK
│   │
│   ├── 📂 services/                # Integrações com APIs
│   │   └── rawgApi.js              # Chamadas para RAWG API
│   │
│   └── 📂 lib/                     # Utilitários
│       └── utils.js                # Funções auxiliares
│
├── 📂 api/                         # 🔥 Backend Serverless (Vercel Functions)
│   ├── health.js                   # Endpoint de status
│   ├── library.js                  # Operações de biblioteca
│   ├── profile.js                  # Operações de perfil
│   │
│   └── 📂 _lib/                    # Módulos internos
│       ├── firebaseAdmin.js        # Instância Firebase Admin
│       └── http.js                 # Utilitários HTTP
│
├── 📂 mobile/                      # 📱 Código-fonte Mobile (React Native)
│   ├── App.js                      # Ponto de entrada e navegação principal
│   ├── app.json                    # Configuração do Expo
│   ├── eas.json                    # Configuração EAS Build
│   ├── package.json                # Dependências do mobile
│   │
│   └── 📂 src/                     # Código-fonte da aplicação mobile
│       ├── 📂 screens/             # Telas da aplicação
│       │   ├── HomeScreen.js       # Listagem de jogos em alta
│       │   ├── SearchScreen.js     # Busca de jogos
│       │   ├── GameDetailsScreen.js # Detalhes e biblioteca
│       │   ├── LibraryScreen.js    # Biblioteca pessoal
│       │   └── ProfileScreen.js    # Perfil e login
│       │
│       ├── 📂 components/          # Componentes reutilizáveis
│       │   └── GameItem.js         # Item de jogo na lista
│       │
│       ├── 📂 context/             # Contextos React
│       │   └── AuthContext.js      # Gerenciamento de autenticação
│       │
│       ├── 📂 services/            # Integrações com APIs
│       │   ├── rawgApi.js          # Chamadas para RAWG API
│       │   └── backendApi.js       # Chamadas para backend próprio
│       │
│       ├── 📂 config/              # Configurações
│       │   └── env.js              # Variáveis de ambiente
│       │
│       ├── 📂 theme/               # Tema visual
│       │   └── theme.js            # Cores, tipografia, espaçamentos
│       │
│       └── 📂 lib/                 # Utilitários
│           └── gameLibrary.js      # Funções de gerenciamento de biblioteca
│
├── 📂 docs/                        # 📚 Documentação
│   └── 📂 screenshots/             # Screenshots da aplicação
│       ├── home.png                # Tela Home (web)
│       ├── search.png              # Tela Busca (web)
│       ├── details.png             # Detalhes do Jogo (web)
│       ├── about.png               # Sobre (web)
│       └── download.png            # Download do App (web)
│
└── 📄 README.md                    # Este arquivo

## 🏗️ Arquitetura da Aplicação

```mermaid
graph TD
    subgraph "🌍 Usuários"
        UserWeb["🖥️ Usuário Web<br/>Browser Desktop/Mobile"]
        UserMobile["📱 Usuário Mobile<br/>Smartphone Android"]
    end

    subgraph Web ["🌐 Web — React + Vite"]
        Pages["📄 Pages<br/>Home / Search / GameDetails<br/>Library / About / Download"]
        Components["🧩 Components<br/>Layout / GameCard<br/>FeedbackState"]
        WebApi["🔌 Services<br/>rawgApi.js<br/>backendApi.js"]
    end

    subgraph Mobile ["📱 Mobile — React Native + Expo"]
        Screens["📱 Screens<br/>Home / Search / GameDetails<br/>Library / Profile"]
        AuthCtx["🔐 AuthContext<br/>Firebase Auth"]
        MobileApi["🔌 Services<br/>rawgApi.js<br/>backendApi.js"]
    end

    RAWG["🎮 RAWG API<br/>500k+ Games Database"]

    subgraph Backend ["⚙️ Backend — Vercel Serverless"]
        Functions["🛠️ Functions<br/>/api/health<br/>/api/library<br/>/api/profile<br/>Firebase Admin SDK"]
    end

    subgraph Firebase ["☁️ Firebase — Google Cloud"]
        Auth["🔐 Firebase Auth<br/>Email/Senha + Google"]
        Firestore["📚 Firestore<br/>Biblioteca / Perfil"]
    end

    UserWeb --> Pages & Components & WebApi
    UserMobile --> Screens & AuthCtx & MobileApi
    
    WebApi -->|GET /games| RAWG
    MobileApi -->|GET /games| RAWG
    
    WebApi -->|Bearer Token| Functions
    MobileApi -->|Bearer Token| Functions
    
    AuthCtx --> Auth
    Functions --> Firestore
    
    style UserWeb fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style UserMobile fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    style Web fill:#10b981,stroke:#065f46,stroke-width:2px,color:#fff
    style Mobile fill:#06b6d4,stroke:#164e63,stroke-width:2px,color:#fff
    style RAWG fill:#f59e0b,stroke:#92400e,stroke-width:2px,color:#fff
    style Backend fill:#ef4444,stroke:#7f1d1d,stroke-width:2px,color:#fff
    style Firebase fill:#ec4899,stroke:#831843,stroke-width:2px,color:#fff
    style Auth fill:#ec4899,stroke:#831843,stroke-width:1px,color:#fff
    style Firestore fill:#ec4899,stroke:#831843,stroke-width:1px,color:#fff
```

---

## 🖼️ Screenshots

### Web Application

#### Home Page
![Home Web](docs/screenshots/home.png)
*Tela inicial exibindo jogos em alta, top rated e lançamentos. Header responsivo com menu hambúrguer no mobile.*

#### Search Page  
![Search Web](docs/screenshots/search.png)
*Página de busca com filtros por gênero, plataforma e ordenação. Suporte a busca em tempo real.*

#### Game Details Page
![Game Details Web](docs/screenshots/details.png)
*Detalhes completos do jogo: capa, avaliação Metacritic, descrição, generos, plataformas e biblioteca pessoal.*

#### About Page
![About Web](docs/screenshots/about.png)
*Página sobre o projeto com informações do desenvolvedor e stack técnico.*

#### Download App Page
![Download Web](docs/screenshots/download.png)
*Página de download com link direto para o APK da aplicação mobile.*

### Mobile Application

*Screenshots do app mobile (React Native) estarão disponíveis após gerar build com EAS.*

---

## 🔐 Autenticação e Segurança

### Firebase Auth

A aplicação suporta dois métodos de autenticação:

1. **Email/Senha** — criação de conta e login tradicional
2. **Google OAuth** — autenticação federated com Google
   - Web: Google Sign-In SDK
   - Mobile: expo-auth-session + Google Cloud Console

### Tokens e Headers

- Todas as requisições para o backend incluem o token Firebase no header:
  ```
  Authorization: Bearer <firebase_id_token>
  ```
- O backend valida o token via Firebase Admin SDK antes de processar a requisição

### Firestore Security Rules

- Acesso apenas para usuários autenticados
- Cada usuário só pode acessar seus próprios dados (biblioteca e perfil)
- Sem acesso de escrita cruzada entre usuários

---

## 📝 Versionamento Git

O projeto segue as práticas de versionamento semântico e commits descritivos.

### Histórico de Commits

```bash
# Ver histórico de commits
git log --oneline

# Ver detalhes de um commit específico
git show <commit_hash>

# Ver mudanças entre commits
git diff <commit1> <commit2>
```

### Branches

- **main** — branch de produção (estável)
- **develop** — branch de desenvolvimento (integração)
- **feature/*** — branches de funcionalidades
- **bugfix/*** — branches de correções

### Convenção de Commits

Seguimos Conventional Commits:

```
<type>(<scope>): <description>

<body>

<footer>
```

Tipos comuns:
- `feat` — nova funcionalidade
- `fix` — correção de bug
- `refactor` — reorganização de código
- `style` — formatação/estilo
- `chore` — tarefas de manutenção
- `docs` — documentação

**Exemplos**:
```
feat(web): add responsive hamburger menu
fix(mobile): correct safe-area overlap in tab bar
refactor(api): improve firebase helper functions
docs(readme): update installation instructions
```

### Verificar Versionamento

```bash
# Ver status atual
git status

# Ver mudanças não commitadas
git diff

# Ver mudanças staged
git diff --cached

# Ver tags (versões)
git tag -l
```

---

## 🚀 Deploy

### Web (Vercel)

1. **Preparar repositório**:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin main
   ```

2. **Configurar Vercel**:
   - Acesse https://vercel.com
   - Importe o repositório do GitHub
   - Configure variáveis de ambiente
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy automático**:
   - Vercel faz deploy automático em cada push para `main`
   - Todos os merges em `main` disparam uma build de produção
   - URL de produção: https://game-dex-dudumiranda3105s-projects.vercel.app

### Mobile (EAS Build)

1. **Autenticar com EAS**:
   ```bash
   npx eas-cli login
   ```

2. **Buildar APK**:
   ```bash
   cd mobile
   npx eas-cli build --platform android --profile preview
   ```

3. **Monitorar build**:
   ```bash
   npx eas-cli build:list
   ```

4. **Download do APK**:
   - Após concluir, a EAS fornece um link para download
   - APK link é armazenado em `eas.json` e no histórico da EAS
   - Compartilhe o link para usuários testarem

---

## 🔧 Troubleshooting

### Web

| Problema | Solução |
|---|---|
| Porta 5173 já em uso | `lsof -i :5173` e kill do processo, ou usar porta diferente |
| `.env` não está sendo lido | Verificar se arquivo `.env` existe na raiz do projeto e reiniciar servidor |
| Build falha com erro de memória | Aumentar heap: `NODE_OPTIONS=--max-old-space-size=4096 npm run build` |
| Dados da RAWG API não carregam | Verificar se `VITE_RAWG_API_KEY` é válido e a quota da API não foi excedida |
| CORS error ao chamar API | Verificar se `VITE_API_BASE_URL` está correto e backend está respondendo |

### Mobile

| Problema | Solução |
|---|---|
| Expo Go não conecta ao servidor | Verificar firewall, reconectar WiFi, tentar `expo start --localhost` |
| APK não instala no celular | Verificar se versão antiga já está instalada, usar `adb install` |
| Login com Google não funciona | Verificar Google Client ID e SHA-1 da keystore registrado no Firebase Console |
| Erro "Unterminated regular expression" no bundle | Verificar se há strings regex quebradas ou comentários mal fechados no código |
| Memory issues ao rodar `expo start` | Aumentar memória Node: `NODE_OPTIONS=--max-old-space-size=2048 expo start` |

---

## 📖 Documentação Adicional

- **RAWG API Documentation**: https://rawg.io/apidocs
- **Firebase Documentation**: https://firebase.google.com/docs
- **React Documentation**: https://react.dev
- **React Native Documentation**: https://reactnative.dev
- **Expo Documentation**: https://docs.expo.dev
- **React Router Documentation**: https://reactrouter.com
- **Vercel Documentation**: https://vercel.com/docs
- **Conventional Commits**: https://www.conventionalcommits.org/

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Eduardo Miranda**
- GitHub: https://github.com/dudumiranda3105
- Portfolio: https://eduardomiranda.dev
- LinkedIn: https://linkedin.com/in/dudumiranda3105

---

## 🎯 Próximas Melhorias

- [ ] Suporte a temas dark/light persistentes com localStorage
- [ ] Paginação infinita (infinite scroll) na listagem de jogos
- [ ] Cache local de API responses com service workers
- [ ] Notificações push de novos lançamentos
- [ ] Integração com redes sociais (compartilhar biblioteca)
- [ ] Interface de admin para moderação de conteúdo
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Sistema de avaliação/críticas por usuários
- [ ] Wishlist compartilhável entre usuários
- [ ] Recomendações baseadas em histórico

---

**Atualizado em**: 27 de abril de 2026  
**Status**: ✅ Em manutenção ativa  
**Versão**: 1.0.0
