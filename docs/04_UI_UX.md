# 04 — Telas (UI/UX)

O app é uma única página (`index.html`); cada "tela" abaixo é uma `<section class="view">`
que aparece/some via `showView()` (`js/app.js`). O cabeçalho (logo) e o menu inferior
são fixos e compartilhados entre todas as telas.

## Início (`#view-inicio`)

- Card de destaque: reunião fixa da família (Google Meet) — botão "Entrar na reunião"
- Seção "Continue estudando": atalho para o último capítulo lido (via `localStorage`)

## Evangelho (`#view-evangelho`)

- Mesma reunião fixa da família, com roteiro sugerido (prece de abertura → leitura →
  comentários → prece de encerramento)

## Estudos (`#view-estudos` → `#view-chapters` → `#view-reading`)

Fluxo de navegação em 3 níveis dentro da mesma aba:
1. Lista de livros (`#view-estudos`)
2. Lista de capítulos do livro escolhido (`#view-chapters`)
3. Leitura do capítulo (`#view-reading`) — perguntas/respostas (Livro dos Espíritos)
   ou parágrafos (Evangelho)

Progresso de leitura salvo em `localStorage`, não sincroniza entre dispositivos
(ver `02_DATABASE.md`, seção "Não é banco de dados").

## Comunidade (`#view-comunidade`)

Três blocos independentes:
1. **Conta** — login Google (popup) ou avatar/nome de quem já está logado
2. **Sua sala** — botão "Criar sala" (exige login) → embute o Jitsi Meet direto na tela
3. **Tire suas dúvidas** — chat simples com a IA (pergunta → resposta com fontes citadas)

## Padrões de navegação

- Trocar de aba sempre rola a página pro topo (`window.scrollTo`)
- "Voltar" dentro de Estudos usa `.back-link` (não usa histórico do navegador/URL —
  é só estado de JS. Se um dia quisermos suportar botão "voltar" do navegador ou
  compartilhar link direto para um capítulo, isso precisa mudar para usar a History API)

## O que ainda não existe (não confundir com bug)

- Não há URL própria por tela (não dá pra favoritar/compartilhar um link direto de
  capítulo — está tudo na mesma URL)
- Não há modo escuro
- Não há ajuste de tamanho de fonte
