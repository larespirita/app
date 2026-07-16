# Configurando o backend (login Google + salas + IA)

O app deixou de ser só arquivos estáticos: agora tem um Worker (`worker/src/`) que
cuida do login, das salas de reunião e das perguntas para a IA. Veja o que fazer, na ordem.

## 1. Instalar o Wrangler (se ainda não tiver)

```bash
npm install -g wrangler
wrangler login
```

## 2. Criar o banco de dados (Cloudflare D1)

```bash
wrangler d1 create lar-espirita-db
```

Isso imprime um `database_id`. Copie e cole no `wrangler.toml`, no lugar de
`COLE_AQUI_O_ID_GERADO_PELO_WRANGLER`.

Depois, crie as tabelas:

```bash
wrangler d1 execute lar-espirita-db --file=worker/schema.sql --remote
```

## 3. Criar as credenciais do Google (login)

1. Acesse https://console.cloud.google.com/apis/credentials
2. Crie um projeto novo (ou use um existente)
3. "Criar credenciais" → "ID do cliente OAuth"
4. Tipo de aplicativo: **Aplicativo da Web**
5. Em "Origens JavaScript autorizadas", adicione:
   `https://app.larespiritaapp.workers.dev` (e `http://localhost:8787` se for testar local)
6. Copie o **Client ID** gerado (termina em `.apps.googleusercontent.com`)

Cole esse Client ID em **dois lugares**:
- `wrangler.toml` → `GOOGLE_CLIENT_ID`
- `js/community.js` → constante `GOOGLE_CLIENT_ID` no topo do arquivo

(O Client ID não é segredo — ele fica visível no navegador de qualquer forma — por
isso pode ficar direto no código, diferente da chave da IA abaixo.)

## 4. Criar a chave da IA (Anthropic)

1. Acesse https://console.anthropic.com/settings/keys e crie uma chave
2. Configure como segredo no Worker (isso sim é secreto, nunca vai no código):

```bash
wrangler secret put ANTHROPIC_API_KEY
```

(vai pedir pra colar a chave no terminal)

## 5. Criar o segredo de sessão (login)

Qualquer texto aleatório longo serve — é usado só para assinar o cookie de login:

```bash
wrangler secret put SESSION_SECRET
```

## 6. Deploy

```bash
wrangler deploy
```

## Testando localmente antes de publicar (opcional)

```bash
wrangler dev
```

Abre em `http://localhost:8787`. Você vai precisar adicionar essa URL nas
"Origens JavaScript autorizadas" do passo 3 pra o login funcionar localmente.

---

### O que cada peça faz

| Arquivo | Função |
|---|---|
| `worker/src/index.js` | Rotas da API (`/api/auth/google`, `/api/meetings`, `/api/ask`, etc.) |
| `worker/src/auth.js` | Verifica o token do Google e gerencia a sessão (cookie assinado) |
| `worker/src/search.js` | Busca trechos relevantes nos dois livros para embasar a resposta da IA |
| `worker/src/ai.js` | Chama a API da Anthropic com o contexto encontrado |
| `worker/schema.sql` | Estrutura do banco (usuários, salas, histórico de perguntas) |
| `js/community.js` | Frontend: botão de login (popup, sem sair do app), criação de sala, chat com a IA |

### Sobre a videochamada

As reuniões agora usam **Jitsi Meet** (gratuito, sem login necessário pra quem entra na sala,
e funciona embutido dentro do app — diferente do Google Meet, que não permite embutir).
O botão "Entrar na reunião" do Início/Evangelho continua abrindo o Google Meet fixo de vocês;
o botão novo em Comunidade cria uma sala Jitsi nova, dentro do app.
