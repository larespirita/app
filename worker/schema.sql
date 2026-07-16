-- Lar Espírita — schema do banco de dados (Cloudflare D1 / SQLite)
-- Rode com: wrangler d1 execute lar-espirita-db --file=worker/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,              -- "sub" do Google (identificador único e estável)
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,              -- slug curto usado na URL da sala (ex: "casa-8f3a1c")
  owner_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  room_name TEXT NOT NULL,          -- nome da sala no Jitsi (gerado, difícil de adivinhar)
  is_public INTEGER NOT NULL DEFAULT 0,  -- 0 = só quem tem o link, 1 = listada publicamente
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_meetings_owner ON meetings(owner_id);

CREATE TABLE IF NOT EXISTS ai_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id),   -- NULL permitido: visitante sem login também pode perguntar
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_ai_questions_user ON ai_questions(user_id);
