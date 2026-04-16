# 🎮 GameDex Web

Aplicação web para descobrir jogos usando a **RAWG API**, com foco em experiência moderna, animações suaves e visual premium.

---

## ✨ Destaques

- Home com seções de jogos em alta.
- Busca com filtros (gênero, plataforma e ordenação).
- Página completa de detalhes com estatísticas e screenshots.
- Layout responsivo com sidebar, header e footer refinados.
- Skeleton loading para carregamento visualmente agradável.

---

## 🚀 Funcionalidades

### Home (`/`)
- Seções: **Trending Games**, **Top Rated** e **Lançamentos**.
- Cards com animações e microinterações.

### Busca (`/search`)
- Pesquisa por nome.
- Filtro por gênero.
- Filtro por plataforma.
- Ordenação por relevância, nota, data e popularidade.

### Detalhes (`/game/:id`)
- Banner/capa do jogo.
- Nota, Metacritic, tempo médio e avaliações.
- Bloco de descrição.
- Informações organizadas (dev, publicadora, classificação etc.).
- Grid de screenshots.

### Outras páginas
- **Sobre** (`/about`) com visão do projeto e stack.
- **App** (`/download`) com download de APK e link do repositório.

---

## 🧱 Stack Técnica

| Camada | Tecnologias |
|---|---|
| Front-end | React 19, React Router DOM |
| Build | Vite 7 |
| Estilo/UI | CSS custom + Tailwind CSS (plugin Vite) |
| Animações | Framer Motion |
| Requisições | Axios |
| Backend | Vercel Functions (Node.js) |
| Banco/Auth | Firebase (Firestore + Firebase Auth) |
| Ícones | React Icons |

---

## 🔌 API

- API: **RAWG Video Games Database**
- Docs: https://rawg.io/apidocs

### Endpoints usados

- `GET /games`
- `GET /games?search=...`
- `GET /games/{id}`
- `GET /games/{id}/screenshots`
- `GET /genres`
- `GET /platforms/lists/parents`

---

## ⚙️ Como rodar localmente

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variável de ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_RAWG_API_KEY=sua_chave_rawg
VITE_API_BASE_URL=http://localhost:5173/api

# Firebase Web (frontend)
VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456

# Backend (Vercel/Firebase Admin)
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
```

### 3) Rodar em desenvolvimento

```bash
npm run dev
```

### 4) Build de produção

```bash
npm run build
```

### 5) Pré-visualizar build

```bash
npm run preview
```

---

## 📜 Scripts

- `npm run dev` → inicia ambiente de desenvolvimento.
- `npm run build` → gera versão de produção.
- `npm run preview` → visualiza build local.
- `npm run lint` → executa lint do projeto.

---

## 📁 Estrutura do Projeto

```text
src/
  assets/
  components/
  pages/
  services/
  App.jsx
  App.css
  index.css

api/
  _lib/
    firebaseAdmin.js
    http.js
  health.js
  favorites.js
  library.js
```

---

## 🏗️ Arquitetura da Aplicação

```mermaid
flowchart LR
  U[Usuário] --> R[React + React Router]
  R --> P[Pages]
  P --> C[Components]
  P --> S[rawgApi service]
  S --> A[RAWG API]
  R --> ST[App.css / index.css]

  subgraph Frontend
    R
    P
    C
    S
    ST
  end
```

---

## 🖼️ Prints da Aplicação

> Dica: salve as imagens em `docs/screenshots/` e atualize os caminhos abaixo.

### Home
![Home](docs/screenshots/home.png)

### Busca
![Busca](docs/screenshots/search.png)

### Detalhes do jogo
![Detalhes](docs/screenshots/details.png)

### Sobre
![Sobre](docs/screenshots/about.png)

### App
![App](docs/screenshots/download.png)

---

## 🔗 Acesso Online

- URL da aplicação: **https://SEU-LINK-DE-DEPLOY-AQUI**

---

## 📝 Observações

- O projeto depende da variável `VITE_RAWG_API_KEY`.
- Sem chave válida, os dados da API não serão carregados.

---

## 🌐 Deploy

Plataformas recomendadas:

- Vercel
- Netlify

### Deploy na Vercel (front + backend)

1. Suba o repositório para o GitHub.
2. No painel da Vercel, clique em **Add New > Project**.
3. Importe o repositório `GameDex`.
4. Em **Build and Output Settings**, mantenha:

- Build Command: `npm run build`
- Output Directory: `dist`

5. Em **Environment Variables**, adicione:

- `VITE_RAWG_API_KEY`
- `VITE_API_BASE_URL` (em produção use `/api`)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

6. Faça o deploy.

O arquivo `vercel.json` deste projeto ja inclui rewrite para SPA com React Router sem quebrar as rotas.

## 🔐 Backend Firebase

O backend foi criado em funcoes serverless dentro da pasta `api/`:

- `GET /api/health` -> status da API
- `GET /api/favorites` -> lista favoritos do usuario autenticado
- `POST /api/favorites` -> salva/atualiza favorito
- `DELETE /api/favorites?gameId=ID` -> remove favorito
- `GET /api/library` -> lista biblioteca completa do usuario
- `POST /api/library` -> salva status, favorito e observacoes
- `DELETE /api/library?gameId=ID` -> remove item da biblioteca

## 👤 Login e Biblioteca

O frontend agora suporta login com Google via Firebase Auth e uma biblioteca pessoal de jogos.

### O que o usuario pode fazer

- Entrar com Google
- Favoritar jogos
- Marcar status: `Quero jogar`, `Jogando`, `Completado`, `Pausado`, `Abandonado`
- Adicionar observacoes pessoais
- Ver tudo na rota `/library`

### Configuracao no Firebase Console

1. Crie um app Web no projeto Firebase.
2. Copie as credenciais do SDK Web para as variaveis `VITE_FIREBASE_*`.
3. Em **Authentication > Sign-in method**, habilite **Google**.
4. Em **Authentication > Settings > Authorized domains**, adicione seu dominio da Vercel.

### Como autenticar no backend

1. No frontend (web ou React Native), autentique o usuario via Firebase Auth.
2. Pegue o ID Token do usuario logado.
3. Envie no header:

```http
Authorization: Bearer SEU_ID_TOKEN
```

### Exemplo de payload do POST /api/favorites

```json
{
  "gameId": 3328,
  "title": "The Witcher 3: Wild Hunt",
  "coverUrl": "https://...",
  "rating": 4.67,
  "released": "2015-05-18",
  "platforms": ["PC", "PlayStation", "Xbox"]
}
```

