# 01 — Arquitetura

## Visão geral

```
Navegador (PWA)
      │
      ▼
Cloudflare Worker  ──►  /api/*  (worker/src/*.js)
      │                     │
      │                     ├─► Cloudflare D1 (banco de dados)
      │                     ├─► Google (verificação de login)
      │                     └─► API da Anthropic (IA de dúvidas)
      │
      └─►  qualquer outra rota  →  arquivos estáticos (ASSETS binding)
```

Um único Worker cuida de tudo: se a rota pedida começa com `/api/`, ele processa a
lógica (login, salas, IA); qualquer outra rota cai direto nos arquivos estáticos do
app (`index.html`, `css/`, `js/`, `assets/`, `data/`).

## Frontend

- **Sem framework** — HTML + CSS + JavaScript puro (vanilla). Sem build step.
- **SPA de uma página só** (`index.html`): as "telas" são `<section class="view">`
  que aparecem/somem via JS (`showView()` em `js/app.js`), não são páginas separadas.
- **PWA**: tem `manifest.json` e `sw.js` (service worker) para funcionar instalado e
  com cache offline dos arquivos estáticos.

### Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura de todas as telas (views) |
| `css/style.css` | Todo o visual do app |
| `js/app.js` | Navegação entre views, renderização da biblioteca (livros/capítulos), progresso de leitura |
| `js/community.js` | Login Google, criação de sala Jitsi, chat com a IA |
| `js/meet-config.js` | Configuração do link fixo do Google Meet da família |
| `sw.js` | Service worker (cache offline) |
| `manifest.json` | Configuração do PWA (ícones, cores, nome) |

## Backend (Worker)

Ver `worker/src/`. Rotas documentadas em `05_AUTH.md` (login), `08_MEETINGS.md` (salas)
e `09_AI_ASSISTANT.md` (perguntas).

| Arquivo | Responsabilidade |
|---|---|
| `worker/src/index.js` | Roteador principal — decide qual função tratar cada `/api/*` |
| `worker/src/auth.js` | Verificação do token do Google + sessão (cookie assinado) |
| `worker/src/search.js` | Busca por palavras-chave nos livros (para embasar a IA) |
| `worker/src/ai.js` | Chamada à API da Anthropic |
| `worker/src/utils.js` | Helpers pequenos (JSON, IDs aleatórios) |

## Banco de dados

Cloudflare D1 (SQLite). Ver `02_DATABASE.md`.

## Hospedagem / Deploy

Cloudflare Workers, via `wrangler`. Ver `wrangler.toml` na raiz e `DEPLOY.md` para o
passo a passo de configuração (contas, chaves, segredos).

## Por que essa stack (e não Flutter/Supabase)

Decisão registrada aqui para não ser perdida: o app começou como PWA estática e cresceu
organicamente. Trocar para Flutter/Supabase significaria reescrever tudo do zero
(incluindo a tradução dos livros, já feita e testada). Mantivemos PWA + Cloudflare por
já ter uma base funcional considerável. Se um dia fizer sentido ter apps nativos de loja
(App Store/Play Store), a opção mais barata é empacotar esta mesma PWA (ex.: Capacitor/Trusted
Web Activity) antes de considerar uma reescrita completa em Flutter.
