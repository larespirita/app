# 04 — Telas (UI/UX)

O app continua sendo uma única página (`index.html`); cada "tela" abaixo é uma
`<section class="view">` que aparece/some via `showView()` (`js/app.js`). O
cabeçalho e a navegação principal são fixos e compartilhados entre todas as
telas.

> Revisão (reengenharia completa): a antiga aba "Comunidade" misturava conta,
> sala de reunião e assistente de IA num só lugar — três funções sem relação
> direta entre si, competindo por espaço. Isso foi separado em duas abas
> dedicadas (**Assistente** e **Perfil**), e o menu foi ampliado de 4 para 5
> seções de primeiro nível.

## Arquitetura de navegação (5 abas)

1. **Início** — visão geral: CTA da reunião, progresso de leitura, reflexão do
   dia, atalhos
2. **Estudos** — biblioteca (era a mesma antes, mantida)
3. **Evangelho** — a reunião semanal em si + roteiro sugerido (mantida)
4. **Assistente** — chat com a IA, promovido a aba própria (antes vivia dentro
   de "Comunidade")
5. **Perfil** — conta Google, criação de sala, preferências (tema), sobre o
   app (antes era o restante de "Comunidade")

Mobile (< 900px): barra fixa embaixo. Desktop/tablet (≥ 900px): a mesma
navegação vira coluna lateral fixa. Ver `03_DESIGN_SYSTEM.md`.

## Início (`#view-inicio`)

- `.hero-card`: reunião fixa da família (Google Meet) — botão "Entrar na reunião"
- `.progress-widget`: "janela acesa" — anel de progresso com total de capítulos
  lidos entre os livros disponíveis
- Seção "Continue estudando": um cartão por livro em andamento, aponta pro
  último capítulo lido (via `localStorage`)
- "Reflexão": uma resposta curta do Livro dos Espíritos, escolhida de forma
  determinística pelo dia (mesmo trecho o dia inteiro, muda à meia-noite)
- Atalhos para Estudos e Assistente

## Estudos (`#view-estudos` → `#view-chapters` → `#view-reading`)

Fluxo de navegação em 3 níveis dentro da mesma aba (inalterado na essência):
1. Lista de livros, com busca por título/tema (`#view-estudos`)
2. Lista de capítulos do livro escolhido, agrupados por parte (`#view-chapters`)
3. Leitura do capítulo (`#view-reading`) — perguntas/respostas numeradas (Livro
   dos Espíritos) ou parágrafos (Evangelho), com alternância de tamanho de
   fonte e navegação anterior/próximo capítulo

Progresso de leitura salvo em `localStorage`, não sincroniza entre dispositivos
(ver `02_DATABASE.md`, seção "Não é banco de dados"). Alimenta o widget da
Início.

## Evangelho (`#view-evangelho`)

Mesma reunião fixa da família, com roteiro sugerido em formato de checklist
interativo (prece de abertura → leitura → comentários → prece de encerramento).
Estado do checklist é local e reinicia todo dia (`js/evangelho.js`).

## Assistente (`#view-ia`)

Chat com a IA: perguntas sugeridas (chips) + campo de texto livre. Resposta
inclui as fontes citadas (`data.excerpts`), igual ao comportamento anterior —
só a tela mudou de lugar no menu.

## Perfil (`#view-perfil`)

- **Conta** — login Google (popup) ou avatar/nome de quem já está logado
- **Sua sala** — botão "Criar sala" (exige login) → embute o Jitsi Meet direto
  na tela
- **Preferências** — alternância de modo claro/escuro
- **Sobre** — informações do app

## Padrões de navegação

- Trocar de aba sempre rola a página pro topo
- "Voltar" dentro de Estudos usa `.back-link` (não usa histórico do
  navegador/URL — é só estado de JS. Se um dia quisermos suportar botão
  "voltar" do navegador ou compartilhar link direto para um capítulo, isso
  precisa mudar para usar a History API)

## O que ainda não existe (não confundir com bug)

- Não há URL própria por tela (não dá pra favoritar/compartilhar um link direto
  de capítulo — está tudo na mesma URL)
- O roteiro do Evangelho no Lar não é compartilhado entre os participantes da
  chamada — cada pessoa marca no seu próprio aparelho
