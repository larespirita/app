// Busca bem simples por palavras-chave dentro dos dois livros já traduzidos.
// Não é uma busca semântica sofisticada, mas evita que a IA responda "no vácuo":
// ela recebe trechos reais do Kardec relacionados à pergunta da pessoa.

const STOPWORDS = new Set([
  "que", "qual", "quais", "como", "para", "por", "com", "uma", "um", "de", "da", "do",
  "das", "dos", "eu", "meu", "minha", "isso", "esse", "essa", "porque", "pois", "mas",
  "tenho", "tem", "não", "sim", "estou", "está", "ser", "sou", "e", "o", "a", "os", "as",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos pra comparar
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function score(itemTokens, queryTokens) {
  let s = 0;
  for (const t of queryTokens) if (itemTokens.includes(t)) s++;
  return s;
}

async function loadJson(env, request, path) {
  const url = new URL(path, request?.url || "http://internal/");
  const res = await env.ASSETS.fetch(new Request(url));
  if (!res.ok) return null;
  return res.json();
}

export async function findRelevantExcerpts(env, question, request) {
  const queryTokens = tokenize(question);
  const candidates = [];

  const livroEspiritos = await loadJson(env, request, "/data/livro-dos-espiritos.json");
  if (livroEspiritos) {
    for (const cap of livroEspiritos.capitulos) {
      for (const q of cap.questoes || []) {
        if (!q.resposta || q.resposta.startsWith("TEXTO A INSERIR")) continue;
        const text = `${q.pergunta} ${q.resposta} ${q.comentario || ""}`;
        candidates.push({
          fonte: "O Livro dos Espíritos",
          referencia: `Cap. ${cap.numero} — ${cap.titulo}, questão ${q.numero}`,
          texto: `${q.pergunta}\n${q.resposta}${q.comentario ? "\n" + q.comentario : ""}`,
          tokens: tokenize(text),
        });
      }
    }
  }

  const evangelho = await loadJson(env, request, "/data/evangelho-segundo-espiritismo.json");
  if (evangelho) {
    for (const cap of evangelho.capitulos) {
      for (const p of cap.paragrafos || []) {
        if (!p || p.startsWith("TEXTO A INSERIR")) continue;
        candidates.push({
          fonte: "O Evangelho Segundo o Espiritismo",
          referencia: `Cap. ${cap.numero} — ${cap.titulo}`,
          texto: p,
          tokens: tokenize(p),
        });
      }
    }
  }

  const ranked = candidates
    .map((c) => ({ ...c, score: score(c.tokens, queryTokens) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return ranked;
}
