// Lar Espírita — Worker (API + arquivos estáticos)
//
// Rotas:
//   POST /api/auth/google   { credential }        -> loga com o token do Google, cria cookie de sessão
//   POST /api/auth/logout                          -> apaga a sessão
//   GET  /api/me                                   -> dados do usuário logado (ou null)
//   POST /api/meetings      { title, isPublic }     -> cria uma sala (precisa estar logado)
//   GET  /api/meetings/mine                         -> lista as salas do usuário logado
//   POST /api/ask           { question }            -> pergunta à IA, com base nos livros
//
// Tudo o que não for /api/* cai direto nos arquivos estáticos do app.

import { json, readJsonBody, randomId } from "./utils.js";
import { verifyGoogleToken, createSession, readSession, sessionCookie, clearCookie } from "./auth.js";
import { findRelevantExcerpts } from "./search.js";
import { askClaude } from "./ai.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        console.error(err);
        return json({ error: "Erro interno." }, 500);
      }
    }

    // Tudo que não é /api/* -> serve os arquivos estáticos normalmente
    return env.ASSETS.fetch(request);
  },
};

async function handleApi(request, env, url) {
  const { pathname } = url;
  const method = request.method;

  if (pathname === "/api/auth/google" && method === "POST") {
    const { credential } = await readJsonBody(request);
    if (!credential) return json({ error: "Token ausente." }, 400);

    const payload = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID);
    if (!payload) return json({ error: "Token inválido." }, 401);

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      avatar_url: payload.picture || null,
    };

    await env.DB.prepare(
      `INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, avatar_url = excluded.avatar_url`
    ).bind(user.id, user.email, user.name, user.avatar_url).run();

    const token = await createSession(user.id, env.SESSION_SECRET);
    return json({ user }, 200, { "Set-Cookie": sessionCookie(token) });
  }

  if (pathname === "/api/auth/logout" && method === "POST") {
    return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
  }

  if (pathname === "/api/me" && method === "GET") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ user: null });
    const user = await env.DB.prepare("SELECT id, email, name, avatar_url FROM users WHERE id = ?")
      .bind(userId).first();
    return json({ user: user || null });
  }

  if (pathname === "/api/meetings" && method === "POST") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "Faça login para criar uma reunião." }, 401);

    const { title, isPublic } = await readJsonBody(request);
    const id = randomId(8);
    const roomName = `lar-espirita-${randomId(16)}`;

    await env.DB.prepare(
      `INSERT INTO meetings (id, owner_id, title, room_name, is_public) VALUES (?, ?, ?, ?, ?)`
    ).bind(id, userId, title || "Evangelho no Lar", roomName, isPublic ? 1 : 0).run();

    return json({ id, roomName, title: title || "Evangelho no Lar" });
  }

  if (pathname === "/api/meetings/mine" && method === "GET") {
    const userId = await readSession(request, env.SESSION_SECRET);
    if (!userId) return json({ error: "Faça login." }, 401);

    const { results } = await env.DB.prepare(
      `SELECT id, title, room_name as roomName, is_public as isPublic, created_at as createdAt
       FROM meetings WHERE owner_id = ? ORDER BY created_at DESC`
    ).bind(userId).all();

    return json({ meetings: results });
  }

  if (pathname === "/api/ask" && method === "POST") {
    const { question } = await readJsonBody(request);
    if (!question || question.trim().length < 3) {
      return json({ error: "Escreva a pergunta com mais detalhes." }, 400);
    }

    const excerpts = await findRelevantExcerpts(env, question, request);
    const answer = await askClaude(env, question, excerpts);

    const userId = await readSession(request, env.SESSION_SECRET);
    await env.DB.prepare(
      `INSERT INTO ai_questions (user_id, question, answer) VALUES (?, ?, ?)`
    ).bind(userId || null, question, answer).run();

    return json({ answer, excerpts: excerpts.map(e => ({ fonte: e.fonte, referencia: e.referencia })) });
  }

  return json({ error: "Rota não encontrada." }, 404);
}
