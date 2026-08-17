// ---------- Assistente (IA) ----------

function appendMessage(container, role, text) {
  const el = document.createElement("div");
  el.className = `ai-message ${role}`;
  const texto = document.createElement("span");
  texto.className = "texto";
  texto.textContent = text;
  el.appendChild(texto);
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

function setAIEmptyVisible(visible) {
  const empty = document.getElementById("ai-empty");
  if (empty) empty.style.display = visible ? "block" : "none";
}

async function askAI(questionOverride) {
  const textarea = document.getElementById("ai-question");
  const question = (questionOverride ?? textarea.value).trim();
  if (question.length < 3) return;

  setAIEmptyVisible(false);

  const messages = document.getElementById("ai-messages");
  appendMessage(messages, "user", question);
  if (!questionOverride) textarea.value = "";
  autosizeTextarea(textarea);

  const sendBtn = document.getElementById("btn-ask-ai");
  sendBtn.disabled = true;

  const loadingEl = appendMessage(messages, "assistant", "Pensando…");
  loadingEl.classList.add("thinking");

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();

    loadingEl.classList.remove("thinking");
    loadingEl.querySelector(".texto").textContent = data.answer || "Não consegui responder agora.";

    if (data.excerpts && data.excerpts.length) {
      const fontes = document.createElement("span");
      fontes.className = "fontes";
      fontes.textContent = "Fontes: " + data.excerpts.map(e => `${e.fonte} (${e.referencia})`).join(" · ");
      loadingEl.appendChild(fontes);
    }
  } catch {
    loadingEl.classList.remove("thinking");
    loadingEl.querySelector(".texto").textContent = "Erro ao conectar. Tente novamente.";
  }

  sendBtn.disabled = false;
  messages.scrollTop = messages.scrollHeight;
}

function autosizeTextarea(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

document.getElementById("btn-ask-ai")?.addEventListener("click", () => askAI());

document.getElementById("ai-question")?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});
document.getElementById("ai-question")?.addEventListener("input", e => autosizeTextarea(e.target));

document.querySelectorAll("#ai-chips .chip").forEach(chip => {
  chip.addEventListener("click", () => askAI(chip.textContent));
});
