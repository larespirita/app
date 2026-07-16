# 02 — Banco de Dados

Cloudflare D1 (SQLite). Schema completo em `worker/schema.sql` — este documento é a
versão legível/comentada do mesmo conteúdo.

## Tabelas atuais

### `users`

Criada/atualizada no primeiro login de cada pessoa (via Google).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | TEXT (PK) | `sub` do Google — identificador único e estável da conta |
| `email` | TEXT | |
| `name` | TEXT | |
| `avatar_url` | TEXT | Foto de perfil do Google (opcional) |
| `created_at` | INTEGER | Unix timestamp |

### `meetings`

Uma sala de reunião criada por um usuário logado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | TEXT (PK) | Slug curto usado internamente |
| `owner_id` | TEXT (FK → users.id) | Quem criou |
| `title` | TEXT | Nome da reunião |
| `room_name` | TEXT | Nome da sala no Jitsi (aleatório, difícil de adivinhar) |
| `is_public` | INTEGER (0/1) | Reservado para o futuro — hoje toda sala é só por link direto |
| `created_at` | INTEGER | Unix timestamp |

### `ai_questions`

Histórico de perguntas feitas à IA (para auditoria/qualidade — não é exibido de volta
para outros usuários).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER (PK autoincrement) | |
| `user_id` | TEXT (FK → users.id, nullable) | `NULL` se a pessoa não estiver logada |
| `question` | TEXT | |
| `answer` | TEXT | |
| `created_at` | INTEGER | Unix timestamp |

## Não é banco de dados (fica em arquivo estático)

Os livros (`data/livro-dos-espiritos.json`, `data/evangelho-segundo-espiristismo.json`)
**não estão no banco** — são arquivos JSON estáticos servidos direto pelo Worker.
Motivo: conteúdo raramente muda, não precisa de query relacional, e fica mais simples
de versionar (git) e de a IA ler para embasar respostas (`worker/src/search.js`).

O progresso de leitura pessoal (quais capítulos a pessoa já leu) também não está no
banco — fica em `localStorage` no próprio navegador (ver `js/app.js`, `PROGRESS_KEY`).
Isso significa que hoje o progresso **não sincroniza entre dispositivos**. Se isso virar
um problema, é candidato a mover para uma tabela nova (`reading_progress`) — ver
`11_ROADMAP.md`.

## Migrações

Sem ferramenta de migração formal ainda — mudanças de schema são feitas editando
`worker/schema.sql` e rodando `wrangler d1 execute lar-espirita-db --file=worker/schema.sql --remote`
de novo (os `CREATE TABLE IF NOT EXISTS` fazem isso ser seguro para rodar mais de uma vez,
mas **não** alteram tabelas já existentes — para mudar uma coluna existente, é preciso
escrever o `ALTER TABLE` manualmente).
