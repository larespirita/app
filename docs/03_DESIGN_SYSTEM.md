# 03 — Design System

Fonte da verdade: `css/style.css` (variáveis no topo do arquivo, em `:root`).
Este documento explica o *porquê* das escolhas, não repete o CSS inteiro.

> Revisão (reengenharia completa): a paleta "calma" (azul+verde estilo Kindle/Calm)
> foi substituída pela identidade da própria marca — a logo (`assets/logo.png`) já
> era um azul-noite profundo com raios de luz dourados saindo de uma casa. O app
> passou a usar essa mesma linguagem visual em vez de uma paleta genérica escolhida
> à parte da marca.

## Filosofia

"Uma casa acesa numa noite escura" — o elemento central da própria logo. Isso dá
duas cores de assinatura (azul-noite + dourado de vela) e uma metáfora concreta
para progresso de leitura (a "lâmpada" que se acende conforme os capítulos são
lidos, em vez de uma barra de progresso genérica). Continua sem cruzes, sem
imagens de espíritos, sem iconografia religiosa literal — o "sagrado" aqui é
sugerido por luz e silêncio, não por símbolos.

**Regra prática**: o dourado é cor de destaque, não cor de fundo — se um card
inteiro ficar dourado, provavelmente é uso em excesso.

## Paleta

| Variável CSS | Valor | Uso |
|---|---|---|
| `--ink-900` | `#0F1729` (azul-noite) | Fundo do cabeçalho, nav, cards em destaque, fundo do app em modo escuro |
| `--ink-800` | `#16213E` | Superfície de cards em modo escuro |
| `--paper-050` | `#FAF7F0` (branco quente) | Fundo do app em modo claro |
| `--gold-500` | `#C9A24C` (dourado de vela) | Cor de assinatura — CTA principal, progresso, números de questão. Usar com moderação |
| `--slate-500` | `#4A5F7A` (azul-ardósia) | Links e ações secundárias, mensagens do usuário no chat |
| `--text-main` / `--text-soft` / `--text-inverse` | | Texto principal / secundário / sobre fundo escuro |

Modo claro e escuro são o mesmo sistema de tokens — só a atribuição de
`--bg-app`/`--bg-surface` muda via `[data-theme="dark"]` (ver `js/app.js`,
`applyTheme()`). Preferência salva em `localStorage` (`lar-espirita:theme`),
com fallback para `prefers-color-scheme`.

## Tipografia

- **Fraunces** (serifada, variável) → títulos, nomes de capítulo, perguntas
  numeradas, citações da "Reflexão do dia". Remete à tipografia de livros do
  século XIX — a época da codificação de Kardec.
- **Manrope** (sem serifa, geométrica) → corpo de texto, botões, navegação,
  interface em geral.

## Elemento de assinatura: o facho de luz

Usado com moderação em exatamente dois lugares, para não virar papel de parede:
1. Um gradiente radial sutil atrás do cabeçalho (`header.app-header::before`)
2. O widget "janela acesa" na Início — um anel circular (`.progress-widget .lamp`)
   que se preenche de dourado proporcionalmente aos capítulos lidos

Fora desses dois lugares, os cards são sólidos, com borda fina e sombra discreta
— sem glassmorphism, sem glow espalhado pela tela.

## Navegação

- **Mobile** (< 900px): barra fixa embaixo, 5 ícones + label (`nav.app-nav`)
- **Desktop/tablet** (≥ 900px): a mesma `nav.app-nav` vira uma coluna lateral
  fixa à esquerda, com marca no topo e alternância de tema no rodapé — troca só
  de layout via media query, sem duplicar HTML

## Componentes recorrentes

- **`.hero-card`** — único bloco que usa `--ink-900` sólido, reservado para a
  ação mais importante da tela (entrar na reunião)
- **`.progress-widget`** — a "janela acesa", usada só na Início
- **`.book-card` / `.chapter-item` / `.reading-block` / `.account-card`** —
  cards com fundo de superfície, borda fina, sombra discreta
- **`.checklist-item`** — usado no roteiro do Evangelho no Lar, marca/desmarca
  etapas do encontro (estado local, reinicia todo dia)
- **`.btn-gold`** — botão principal (CTA único por tela)
- **`.btn-outline`** — ações secundárias, contorno fino, sem preenchimento

## Animação

Fade + leve subida ao trocar de view (`rise-in`, 0.28s). Sem glow pulsante
constante, sem shine sweep, sem partículas. Respeita `prefers-reduced-motion`.

## Ícones

SVG inline, outline (`stroke="currentColor"`, `stroke-width="1.8"`, sem
preenchimento) — consistente em todas as telas e nos dois tamanhos de nav.
