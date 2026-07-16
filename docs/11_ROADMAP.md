# 11 — Roadmap (não implementado)

Ideias organizadas por área, incluindo boas sugestões vindas do PRD alternativo
(Flutter/Supabase) que continuam válidas independente da stack. Nada aqui está
decidido ou priorizado — é uma lista de possibilidades para puxar quando fizer sentido.

## Biblioteca

- Mais obras de Kardec em domínio público: O Livro dos Médiuns, O Céu e o Inferno,
  A Gênese, Obras Póstumas (mesma regra de tradução própria do `06_LIBRARY.md`)
- Pesquisa global por palavra-chave em todos os livros, com destaque do trecho
- Favoritos (perguntas/capítulos/parágrafos)
- Anotações pessoais por trecho
- Histórico de leitura sincronizado entre dispositivos (hoje é só `localStorage` —
  precisaria de uma tabela `reading_progress` no D1, ver `02_DATABASE.md`)
- Compartilhar uma pergunta/trecho específico (ex.: link direto, ou texto pro WhatsApp)

## Evangelho no Lar / Reuniões

- Sorteio sincronizado de capítulo/pergunta para todos os participantes de uma reunião
- Roteiro com progresso em tempo real (todos veem a mesma etapa: prece → leitura →
  comentários → prece final) — precisaria de canal realtime (Durable Objects ou
  WebSocket no Worker)
- Cronômetro compartilhado
- Lista de "minhas salas anteriores" (a rota de backend já existe, falta o frontend)
- Mensagem do Dia — um texto único, igual para todo mundo, trocado diariamente

## Comunidade / Conta

- Login por email/senha e Apple, além do Google
- Perfil com foto, histórico, favoritos, configurações
- Vibrações/pedidos de prece (privados ou compartilhados com o grupo)

## Personalização

- Modo escuro
- Fonte ajustável (tamanho)
- Ambiente sonoro opcional durante estudo/reunião (natureza/instrumental, sem letra,
  sem música comercial — licenciamento é pré-requisito antes de implementar)
- "Modo Reverência": interface mais limpa, menos animação, ao entrar numa reunião

## IA

- Busca semântica (embeddings) em vez de palavra-chave, para achar trechos mais
  relevantes em perguntas indiretas
- Memória de conversa (múltiplas perguntas relacionadas na mesma sessão)
- Rate limiting por pessoa/IP, para controlar custo de API se o uso público crescer

## Infraestrutura

- Apps nativos de loja: primeiro tentar empacotar a PWA atual (Capacitor/TWA) antes
  de considerar reescrita completa em Flutter (ver `01_ARCHITECTURE.md`)
- Modo offline mais completo (hoje já cacheia estático; poderia cachear os livros
  para leitura sem internet)
