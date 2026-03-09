# GameDex Web

Aplicação web feita com React para explorar jogos usando a API da RAWG, com foco em visual moderno, navegação fluida e experiência responsiva.

## Visão Geral

O GameDex permite:

- Descobrir jogos populares por categorias.
- Pesquisar jogos por nome com filtros.
- Visualizar detalhes completos de cada jogo.
- Navegar por uma interface estilizada com animações suaves.

## Funcionalidades Atuais

- **Home** com seções de destaque:
	- Trending Games
	- Top Rated
	- Lançamentos
- **Busca de jogos** com:
	- termo de pesquisa
	- filtro por gênero
	- filtro por plataforma
	- ordenação de resultados
- **Detalhes do jogo** (`/game/:id`) com:
	- capa, nota, metacritic e estatísticas
	- descrição rica
	- informações técnicas (desenvolvedor, publicadora, classificação, etc.)
	- screenshots
- **Página Sobre** (`/about`) com visão do projeto e stack.
- **Página App** (`/download`) com links de instalação.
- **Skeleton loading** para carregamento mais elegante (Home, Busca e Detalhes).

## Rotas

- `/` — Home
- `/search` — Busca
- `/game/:id` — Detalhes do jogo
- `/download` — App
- `/about` — Sobre

## Stack

- React 19
- Vite 7
- React Router DOM
- Axios
- Framer Motion
- Tailwind CSS (via plugin Vite)
- React Icons

## API Utilizada

RAWG Video Games Database API  
Documentação: https://rawg.io/apidocs

Endpoints principais:

- `GET /games`
- `GET /games?search=...`
- `GET /games/{id}`
- `GET /games/{id}/screenshots`
- `GET /genres`
- `GET /platforms/lists/parents`

## Configuração Local

### 1) Instalar dependências

```bash
npm install
```

### 2) Criar arquivo de ambiente

Crie um arquivo `.env` na raiz com:

```env
VITE_RAWG_API_KEY=sua_chave_aqui
```

### 3) Rodar em desenvolvimento

```bash
npm run dev
```

### 4) Gerar build de produção

```bash
npm run build
```

### 5) Pré-visualizar build local

```bash
npm run preview
```

## Scripts

- `npm run dev` — inicia ambiente de desenvolvimento
- `npm run build` — gera build de produção
- `npm run preview` — serve a build localmente
- `npm run lint` — executa lint do projeto

## Estrutura Básica

```text
src/
	components/
	pages/
	services/
	assets/
	App.jsx
	App.css
	index.css
```

## Observações

- A aplicação depende da chave da RAWG (`VITE_RAWG_API_KEY`).
- Sem chave válida, as listagens não serão carregadas.

## Deploy

Recomendado: Vercel ou Netlify.
