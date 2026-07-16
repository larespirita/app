# 09 — IA de Dúvidas

## Propósito

Permitir que qualquer pessoa (logada ou não) descreva uma situação da vida real ou
faça uma pergunta, e receba uma resposta fundamentada na doutrina espírita — sem
precisar que um humano (o dono do app) responda manualmente cada dúvida.

## Fluxo

1. Frontend (`js/community.js`, `askAI()`) manda `POST /api/ask` com `{question}`
2. Backend (`worker/src/search.js`, `findRelevantExcerpts`) faz uma busca simples por
   palavras-chave nos dois livros (ver `06_LIBRARY.md`) e seleciona até 4 trechos
   relevantes — pula qualquer capítulo ainda placeholder
3. Backend (`worker/src/ai.js`, `askClaude`) chama a API da Anthropic (modelo
   `claude-sonnet-5`) com um system prompt fixo + os trechos encontrados + a pergunta
4. Resposta salva em `ai_questions` (com `user_id` se a pessoa estiver logada, `NULL`
   se for visitante) e devolvida ao frontend junto com as fontes citadas

## Busca (retrieval) — como funciona hoje

`worker/src/search.js`: tokeniza a pergunta (minúsculas, sem acento, remove stopwords
comuns em português), e pontua cada pergunta/parágrafo dos livros por quantidade de
palavras em comum. **Não é busca semântica** — é contagem de palavras-chave. Funciona
razoavelmente para termos concretos ("caridade", "reencarnação"), mas erra em
perguntas muito indiretas ou com sinônimos que não aparecem no texto original. Se
isso virar problema, trocar por embeddings/busca vetorial é o próximo passo natural
(ver `11_ROADMAP.md`).

## Regras de segurança do prompt (não remover)

O `SYSTEM_PROMPT` em `worker/src/ai.js` instrui a IA a:
- Basear a resposta nos trechos fornecidos, citando capítulo/questão
- Nunca inventar citação literal — parafrasear quando não tiver certeza da frase exata
- **Em temas de crise** (luto recente, ideação suicida, autolesão, violência doméstica):
  acolher com cuidado e **sempre** recomendar apoio humano real (psicólogo, CVV 188,
  centro espírita local) além da resposta doutrinária — nunca tratar como só uma
  questão filosófica a esclarecer

Esse bloco existe por responsabilidade do produto, não é detalhe estético do prompt —
qualquer alteração nele deve manter essa garantia.

## Limitações atuais

- Sem streaming de resposta (a pessoa espera a resposta inteira, sem efeito de
  "digitando")
- Sem memória de conversa — cada pergunta é isolada, a IA não vê perguntas
  anteriores da mesma pessoa
- Sem limite de uso por pessoa/IP — custo por pergunta é real (API paga); considerar
  rate limiting se o uso público crescer
