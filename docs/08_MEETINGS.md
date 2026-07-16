# 08 — Reuniões / Videochamada

## Duas ferramentas diferentes, de propósito

- **Google Meet** — usado só para a sala fixa da família (`js/meet-config.js`).
  Mantido porque já era o que a família usava antes do app existir.
- **Jitsi Meet** — usado para salas criadas por qualquer pessoa logada, em Comunidade.

## Por que dois, e não só um

O requisito de produto é "nunca sair do app" (`00_PRD.md`). **O Google Meet não pode
ser embutido em iframe** — é bloqueio de segurança do próprio Google, sem contorno
possível. Então:
- A sala fixa da família continua abrindo por fora (é a exceção documentada e aceita)
- Toda sala *nova*, criada dentro do app, usa Jitsi — que permite embutir de verdade

Se um dia quiserem que a reunião fixa da família também fique embutida, a solução é
trocar essa sala específica de Google Meet para Jitsi também — não tem outro jeito
compatível com "nunca sair do app".

## Como a sala Jitsi é criada

1. Frontend chama `POST /api/meetings` (exige login)
2. Backend gera um `room_name` aleatório (`worker/src/utils.js`, `randomId(16)`) —
   difícil de adivinhar, funciona como "senha" da sala por obscuridade
3. Sala salva na tabela `meetings` (dono = quem criou)
4. Frontend recebe o `room_name` e chama `embedJitsi()` (`js/community.js`), que usa
   `JitsiMeetExternalAPI` (carregado de `meet.jit.si/external_api.js`) para desenhar
   a videochamada dentro de `#jitsi-container`

## Limitações atuais

- Sem lista de "minhas salas anteriores" na tela (a rota `GET /api/meetings/mine`
  já existe no backend, mas o frontend ainda não usa)
- Sem controle de quem pode entrar além de ter o link (sem lobby/aprovação)
- Sem gravação
- Servidor Jitsi usado é o público (`meet.jit.si`) — gratuito, mas sem SLA; para uso
  mais sério, considerar Jitsi self-hosted ou um provedor pago
