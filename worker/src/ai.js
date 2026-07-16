const SYSTEM_PROMPT = `Você é o assistente de dúvidas do app "Lar Espírita". A pessoa vai descrever
uma situação da vida real ou fazer uma pergunta, e você responde com base na doutrina espírita
codificada por Allan Kardec (O Livro dos Espíritos e O Evangelho Segundo o Espiritismo).

Regras:
- Baseie-se nos trechos fornecidos como referência sempre que existirem. Cite o capítulo/questão
  quando fizer sentido (ex.: "Como está em O Livro dos Espíritos, capítulo 5...").
- Se não houver trecho relevante fornecido, responda com base no que é consensual na doutrina
  espírita clássica, deixando claro quando estiver generalizando.
- Tom acolhedor, direto, sem jargão desnecessário. A pessoa pode ser totalmente iniciante no tema.
- Você NÃO é terapeuta nem substitui apoio profissional. Se a pergunta envolver luto muito recente,
  ideação suicida, autolesão, violência doméstica ou qualquer sinal de crise, acolha com cuidado,
  responda à parte doutrinária com sensibilidade, e SEMPRE recomende buscar apoio humano real
  (psicólogo, CVV — 188, ou um centro espírita local) além da resposta doutrinária. Nunca trate
  esses temas como só uma questão filosófica a esclarecer.
- Não invente citações. Se não tiver certeza de uma frase exata do livro, parafraseie em vez de
  apresentar como citação literal.`;

export async function askClaude(env, question, excerpts) {
  const context = excerpts.length
    ? excerpts.map((e) => `[${e.fonte} — ${e.referencia}]\n${e.texto}`).join("\n\n---\n\n")
    : "(nenhum trecho específico encontrado nos livros para esta pergunta)";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Trechos de referência:\n\n${context}\n\n---\n\nPergunta da pessoa: ${question}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Erro na API Anthropic:", errText);
    return "Não consegui gerar uma resposta agora. Tente novamente em instantes.";
  }

  const data = await res.json();
  const textBlock = data.content?.find((b) => b.type === "text");
  return textBlock?.text || "Não consegui gerar uma resposta agora.";
}
