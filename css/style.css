:root {
  /* Paleta calma — inspirada em Kindle + Calm, sem excesso de dourado */
  --color-primary: #1E3A5F;      /* azul profundo */
  --color-primary-dark: #142943;
  --color-secondary: #5C8D76;    /* verde suave */
  --color-bg: #FAF9F6;           /* branco quente */
  --color-accent: #C9A227;       /* dourado discreto — só para pequenos destaques */

  --text-main: #23303F;
  --text-soft: #6B7686;
  --text-inverse: #FAF9F6;

  --border-soft: #E4E1D8;
  --card-bg: #FFFFFF;

  --radius: 14px;
  --radius-sm: 10px;
  --shadow-soft: 0 2px 10px rgba(30, 58, 95, 0.06);
  --shadow-card: 0 4px 16px rgba(30, 58, 95, 0.08);

  --font-display: "Merriweather", "Iowan Old Style", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  color: var(--text-main);
  font-family: var(--font-body);
  -webkit-tap-highlight-color: transparent;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

a { color: inherit; text-decoration: none; }

::selection { background: rgba(201, 162, 39, 0.25); }

/* ---------- Cabecalho ---------- */

header.app-header {
  background: var(--color-bg);
  border-bottom: 1px solid var(--border-soft);
  padding: 18px 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  border-radius: 9px;
  flex-shrink: 0;
}

.header-text h1 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0;
  color: var(--color-primary);
}

.header-text p {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: var(--text-soft);
}

/* ---------- Conteudo ---------- */

main {
  flex: 1;
  padding: 20px 18px 100px;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.view { display: none; }
.view.active { display: block; animation: fade-in 0.25s var(--ease-out); }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-eyebrow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-soft);
  font-weight: 600;
  margin: 0 0 10px;
}

.section-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0 0 16px;
  color: var(--color-primary);
}

/* ---------- Cartao do Evangelho no Lar ---------- */

.meet-card {
  background: var(--color-primary);
  border-radius: var(--radius);
  padding: 22px 22px;
  color: var(--text-inverse);
  box-shadow: var(--shadow-card);
  margin-bottom: 26px;
}

.meet-card h2 {
  font-family: var(--font-display);
  font-size: 1.08rem;
  margin: 0 0 6px;
  font-weight: 700;
}

.meet-card p {
  margin: 0 0 18px;
  font-size: 0.87rem;
  color: rgba(250, 249, 246, 0.8);
  line-height: 1.55;
}

.btn-enter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out);
}

.btn-enter:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
.btn-enter:active { transform: translateY(0); }

/* ---------- Cartoes de livro ---------- */

.book-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 28px;
}

.book-card {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: border-color 0.15s var(--ease-out), transform 0.15s var(--ease-out);
}

.book-card:hover {
  border-color: var(--color-secondary);
  transform: translateY(-1px);
}

.book-card h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  margin: 0 0 4px;
  color: var(--color-primary);
  font-weight: 700;
}

.book-card span.meta {
  font-size: 0.78rem;
  color: var(--text-soft);
}

.progress-pill {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-secondary);
  background: rgba(92, 141, 118, 0.12);
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---------- Lista de capitulos ---------- */

.chapter-list { display: grid; gap: 8px; }

.chapter-item {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-soft);
  transition: border-color 0.15s var(--ease-out), transform 0.15s var(--ease-out);
}

.chapter-item:hover {
  border-color: var(--color-secondary);
  transform: translateX(2px);
}

.chapter-item .num {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-weight: 700;
  margin-right: 10px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-soft);
  margin-bottom: 16px;
  cursor: pointer;
  transition: color 0.15s var(--ease-out);
}

.back-link:hover { color: var(--color-primary); }

/* ---------- Leitura ---------- */

.reading-block {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-soft);
}

.reading-block .question {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.02rem;
  color: var(--color-primary);
  margin: 0 0 10px;
  line-height: 1.45;
}

.reading-block .answer {
  font-size: 0.94rem;
  line-height: 1.65;
  color: var(--text-main);
}

.reading-block .comment {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
  font-size: 0.86rem;
  color: var(--text-soft);
  font-style: italic;
}

.reading-block .paragraph {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-main);
  margin: 0 0 12px;
}

/* ---------- Comunidade: conta, sala e IA ---------- */

.account-card {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 18px 20px;
  margin-bottom: 26px;
  box-shadow: var(--shadow-soft);
}

.account-hint {
  font-size: 0.82rem;
  color: var(--text-soft);
  margin: 0 0 12px;
  line-height: 1.5;
}

#signed-in-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.user-info strong { color: var(--color-primary); }

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-soft);
  color: var(--text-soft);
  font-weight: 600;
  font-size: 0.82rem;
  padding: 9px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.15s var(--ease-out), color 0.15s var(--ease-out);
}

.btn-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }

.jitsi-container {
  width: 100%;
  height: 420px;
  border-radius: var(--radius);
  overflow: hidden;
  margin: 14px 0 30px;
  border: 1px solid var(--border-soft);
}

.ai-chat {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 18px 20px 20px;
  box-shadow: var(--shadow-soft);
}

.ai-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
  max-height: 50vh;
  overflow-y: auto;
}

.ai-message {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.55;
}

.ai-message.user {
  background: rgba(30, 58, 95, 0.06);
  align-self: flex-end;
  max-width: 85%;
  color: var(--color-primary);
}

.ai-message.assistant {
  background: rgba(92, 141, 118, 0.08);
  color: var(--text-main);
}

.ai-message.assistant .fontes {
  display: block;
  margin-top: 8px;
  font-size: 0.74rem;
  color: var(--color-secondary);
  font-style: italic;
}

.ai-input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-textarea {
  width: 100%;
  resize: vertical;
  min-height: 60px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-soft);
  background: var(--color-bg);
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-main);
}

.ai-textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
}

/* ---------- Navegacao inferior ---------- */

nav.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border-top: 1px solid var(--border-soft);
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 10;
}

.tab-indicator { display: none; }

nav.tab-bar button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-soft);
  font-size: 0.62rem;
  font-family: var(--font-body);
  font-weight: 600;
  padding: 8px 8px;
  flex: 1;
  cursor: pointer;
  transition: color 0.15s var(--ease-out);
}

nav.tab-bar button.active { color: var(--color-primary); }
nav.tab-bar button svg {
  width: 21px;
  height: 21px;
}

/* ---------- Utilitarios ---------- */

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-soft);
  font-size: 0.9rem;
}

@media (prefers-reduced-motion: reduce) {
  .view.active {
    animation: none !important;
  }
}
