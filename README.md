# Lar Espírita

PWA com duas áreas: Evangelho no Lar (link fixo do Meet) e Estudos (Livro dos Espíritos + Evangelho Segundo o Espiritismo).

## Antes de publicar

1. **Link do Meet** — editar `js/meet-config.js` com o código real da sala fixa.
2. **Ícones** — adicionar `icons/icon-192.png`, `icons/icon-512.png` e `icons/icon-maskable-512.png` (necessários para o manifest e depois para o Bubblewrap/TWA).
3. **Conteúdo dos livros** — os arquivos em `data/` têm só 2-3 capítulos de exemplo para validar o layout. O texto completo de ambas as obras é de domínio público (Kardec, 1857 e 1864); pode ser adicionado seguindo o mesmo formato JSON.
4. **Deploy** — mesmo fluxo do HappyMusic: subir para o Cloudflare Pages (sem Functions por enquanto, já que não há chamada a API externa nesta primeira versão).

## Estrutura de dados

**Livro dos Espíritos** — cada capítulo tem `questoes[]`, cada questão com `pergunta`, `resposta` e `comentario` (opcional).

**Evangelho Segundo o Espiritismo** — cada capítulo tem `paragrafos[]` (texto corrido).

O `app.js` detecta automaticamente qual formato renderizar (`questoes` vs `paragrafos`), então dá pra adicionar outras obras da codificação depois sem mexer no código, só criando um novo JSON no mesmo padrão e listando o caminho em `BOOK_FILES` (`js/app.js`).

## Progresso de leitura

Salvo em `localStorage` por enquanto (chave `lar-espirita-progresso`). Se depois quiser sincronizar entre dispositivos, dá pra migrar para Cloudflare KV com login Google, do mesmo jeito que foi feito no Enfy.
