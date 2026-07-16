# 05 — Autenticação

## Provedor

Só **Google**, via Google Identity Services (`accounts.google.com/gsi/client`).
Sem email/senha, sem Apple login (por enquanto — ver `11_ROADMAP.md`).

## Por que popup, não redirect

Requisito de produto: a pessoa nunca deve sair do app (ver `00_PRD.md`, princípios).
Por isso o login usa `ux_mode: "popup"` — abre uma janelinha por cima, autentica,
fecha sozinha e devolve o controle pro app, sem navegar a aba principal para fora.

## Fluxo

1. Frontend (`js/community.js`) carrega o script do Google e renderiza o botão
   oficial "Entrar com Google" dentro de `#google-btn-container`
2. Pessoa autentica no popup → Google devolve um `credential` (JWT assinado por eles)
3. Frontend manda esse `credential` pro backend: `POST /api/auth/google`
4. Backend (`worker/src/auth.js`) valida o token chamando o endpoint `tokeninfo`
   do próprio Google — isso confirma a assinatura sem a gente precisar implementar
   verificação de JWT/RS256 na mão
5. Backend cria/atualiza a linha em `users` (tabela D1) e devolve um cookie de sessão

## Sessão

- Cookie `session`, `HttpOnly; Secure; SameSite=Lax`, validade de 30 dias
- Conteúdo: `{sub: <id do usuário>, exp: <timestamp>}`, codificado em base64url e
  assinado com HMAC-SHA256 (segredo: `SESSION_SECRET`, configurado via `wrangler secret`)
- **Não é JWT padrão** — é um formato próprio, simples de propósito, pra não precisar
  de biblioteca externa dentro do Worker
- Sem refresh token / renovação automática — quando expira, a pessoa loga de novo

## Rotas relacionadas

| Rota | Método | O que faz |
|---|---|---|
| `/api/auth/google` | POST | Recebe `{credential}`, valida, cria sessão |
| `/api/auth/logout` | POST | Apaga o cookie |
| `/api/me` | GET | Retorna o usuário da sessão atual (ou `{user: null}`) |

## O que precisa de login vs. o que não precisa

- **Não precisa**: ler os livros, ver capítulos, entrar na reunião fixa da família,
  fazer perguntas à IA (perguntas de visitante ficam com `user_id = NULL`)
- **Precisa**: criar uma sala de reunião própria (`POST /api/meetings`)

## Configuração necessária (fora do código)

Client ID OAuth criado no Google Cloud Console, colado em dois lugares:
`wrangler.toml` (`GOOGLE_CLIENT_ID`) e `js/community.js` (constante no topo).
Passo a passo completo em `DEPLOY.md`.
