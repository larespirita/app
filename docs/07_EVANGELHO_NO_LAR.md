# 07 — Evangelho no Lar

## O que é

A reunião semanal de estudo e prece em família — a funcionalidade que dá origem ao
nome do app. Hoje existe em duas telas (Início e Evangelho), ambas apontando para a
mesma sala fixa.

## Sala fixa da família

Configurada em `js/meet-config.js` — um único link de Google Meet, sempre o mesmo,
usado toda semana. Botão "Entrar na reunião" abre esse link (fora do app — ver
`08_MEETINGS.md` sobre por quê).

## Roteiro sugerido (hoje é só texto estático)

1. Prece de abertura
2. Leitura de um capítulo do Evangelho Segundo o Espiritismo
3. Comentários e reflexão em família
4. Prece de encerramento

Isso está fixo no `index.html` — não é dinâmico, não sorteia capítulo, não sincroniza
entre participantes. Ideias de evolução (sorteio de capítulo/pergunta, roteiro com
progresso em tempo real entre participantes, cronômetro) estão em `11_ROADMAP.md`,
não implementadas.

## Diferença para "Comunidade → Criar sala"

| | Reunião fixa (Início/Evangelho) | Sala criada em Comunidade |
|---|---|---|
| Link | Sempre o mesmo, configurado no código | Novo a cada vez que a pessoa cria |
| Quem pode entrar | Quem tem o link (não muda) | Quem tem o link daquela sala específica |
| Tecnologia | Google Meet (externo) | Jitsi Meet (embutido no app) |
| Precisa login | Não | Sim, para criar (não para entrar) |
