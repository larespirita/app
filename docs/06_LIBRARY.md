# 06 — Biblioteca (Livros)

## Obras incluídas hoje

| Obra | Arquivo | Autor / Ano |
|---|---|---|
| O Livro dos Espíritos | `data/livro-dos-espiritos.json` | Allan Kardec, 1857 |
| O Evangelho Segundo o Espiritismo | `data/evangelho-segundo-espiritismo.json` | Allan Kardec, 1864 |

## Regra de direito autoral (importante — não pular)

O texto original francês de Kardec é domínio público. **Mas as traduções brasileiras
comerciais (ex.: edição FEB/Guillon Ribeiro, edição Mundo Maior) são protegidas por
direitos autorais** e não podem ser reproduzidas no app.

Por isso, o conteúdo em português dos dois livros é **tradução própria, feita
capítulo por capítulo, direto do francês original (edição definitiva de 1860)**,
cotejada com fontes de domínio público (Wikisource, arquivos públicos). Nunca copiar
de uma edição comercial brasileira, mesmo que pareça mais rápido.

Fonte de referência em francês limpo (não redistribuir, é só material de trabalho):
os arquivos `le_livre_des_esprits.json` / `le_livre_des_mediums.json` que o usuário
forneceu (edição 1860, 1123 entradas incluindo sub-itens "a"/"b"). Guardar esse
arquivo fora do repositório do app — ele é ferramenta de tradução, não conteúdo do
produto.

## Estrutura do JSON de cada livro

```
{
  "id": "livro-dos-espiritos",
  "titulo": "...",
  "autor": "Allan Kardec",
  "ano": 1857,
  "capitulos": [
    {
      "numero": 1,
      "parte": "Parte Primeira — Das causas primárias",   // só no Livro dos Espíritos
      "titulo": "De Deus",
      "questoes": [                                          // Livro dos Espíritos
        { "numero": 1, "pergunta": "...", "resposta": "...", "comentario": "" }
      ]
      // OU, no Evangelho:
      "paragrafos": ["...", "..."]
    }
  ]
}
```

## Status da tradução (atualizar conforme for avançando)

**O Livro dos Espíritos** — 29 capítulos ao todo (4 partes). Completos: capítulos 1–4
(Parte Primeira inteira, perguntas 1–75). Restam: Partes Segunda, Terceira e Quarta
(25 capítulos, ~945 perguntas) — hoje como placeholder (`"TEXTO A INSERIR"`).

**O Evangelho Segundo o Espiritismo** — 28 capítulos, todos como placeholder
(`"TEXTO A INSERIR"`) — só a estrutura (títulos reais, tirados do sumário) está pronta.
Falta encontrar/confirmar uma fonte francesa limpa equivalente à usada no Livro dos
Espíritos (a fornecida até agora foi só o Livro dos Espíritos e o Livro dos Médiuns).

## Como continuar uma tradução (para retomar em outra conversa)

1. Achar o capítulo/faixa de perguntas no JSON francês de referência
2. Traduzir com fidelidade, sem copiar de tradução comercial de memória
3. Escrever no JSON em português, substituindo o placeholder `"TEXTO A INSERIR..."`
4. Nunca inventar conteúdo para preencher número faltante — melhor deixar o
   placeholder do que uma tradução não conferida

## Consumo dos dados

- Frontend (`js/app.js`) busca os JSONs direto via `fetch()` e renderiza a lista de
  capítulos/leitura
- Backend (`worker/src/search.js`) lê os mesmos JSONs (via `env.ASSETS.fetch`) para
  embasar as respostas da IA — pula automaticamente qualquer entrada que ainda seja
  placeholder (`"TEXTO A INSERIR"`)
