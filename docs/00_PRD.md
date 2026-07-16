# 00 — PRD (Product Requirements Document)

> Documento de referência para o que o app **faz** e **por quê**. Detalhes técnicos de
> implementação ficam nos outros documentos desta pasta (`01_ARCHITECTURE.md` em diante).

## Visão geral

**Lar Espírita** é um app para o estudo da Doutrina Espírita e para a prática do
Evangelho no Lar — em família, sozinho, ou em comunidade com outras pessoas interessadas.

## Objetivos do produto

- Facilitar a realização semanal do Evangelho no Lar (roteiro + videochamada)
- Dar acesso à obra de Allan Kardec com fidelidade ao texto original
- Permitir que qualquer pessoa curiosa sobre espiritismo tire dúvidas e acesse o material,
  sem precisar de conta
- Permitir que qualquer pessoa logada crie sua própria sala de reunião
- Nunca tirar a pessoa do app durante o uso (login, vídeo e IA — tudo embutido)

## Público-alvo

- Famílias que praticam o Evangelho no Lar
- Pessoas iniciando os estudos espíritas, sem vínculo com nenhum centro
- Curiosos que querem entender a doutrina sem compromisso

## Funcionalidades atuais (implementadas)

| Área | O que faz |
|---|---|
| Início | Card de acesso rápido à reunião fixa da família + atalho para continuar a leitura |
| Evangelho no Lar | Roteiro sugerido da reunião + link fixo do Google Meet da família |
| Estudos | Biblioteca com O Livro dos Espíritos e O Evangelho Segundo o Espiritismo, por capítulo |
| Comunidade | Login Google (popup), criação de sala própria (Jitsi, embutida), IA de dúvidas baseada nos livros |

Ver `06_LIBRARY.md`, `07_EVANGELHO_NO_LAR.md`, `08_MEETINGS.md` e `09_AI_ASSISTANT.md` para
os detalhes de cada uma.

## Funcionalidades futuras (ideias, não implementadas)

Ver `11_ROADMAP.md`.

## Princípios do produto

- **Fidelidade ao texto original**: o conteúdo doutrinário (Livro dos Espíritos, Evangelho)
  nunca é alterado. Conteúdo gerado por IA é sempre identificado como complementar,
  separado do texto original.
- **Sem sair do app**: login, vídeo e IA acontecem dentro do app, sem redirecionar a
  pessoa para outro site/app (exceção documentada: o link fixo do Google Meet da família,
  que é externo por limitação técnica do próprio Google — ver `08_MEETINGS.md`).
- **Simplicidade antes de recurso novo**: preferir poucas telas bem feitas a muitas
  telas incompletas.
- **Respeito ao direito autoral**: nenhum texto de tradução comercial/protegida é
  reproduzido no app. Só textos de domínio público, traduzidos por nós quando necessário
  (ver `06_LIBRARY.md`).

## Restrições

- Não alterar o texto original das obras
- Não incluir obras protegidas por direitos autorais sem autorização
- Não inserir publicidade
- Não usar músicas comerciais em qualquer ambiente sonoro futuro
- Boa performance mesmo em conexão lenta (o app é leve: HTML/CSS/JS estático + Worker)
