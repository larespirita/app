// ---------- Núcleo: navegação, tema, saudação, Início ----------

const THEME_KEY = "lar-espirita:theme";
const NAV_STACK = ["inicio"];

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

// ---------- Tema ----------

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  const label = document.getElementById("theme-label-desktop");
  if (label) label.textContent = isDark ? "Modo claro" : "Modo escuro";
  const themeSwitch = document.getElementById("theme-switch");
  if (themeSwitch) themeSwitch.checked = isDark;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isDark ? "#0F1729" : "#0F1729");
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);
})();

document.getElementById("btn-theme-mobile")?.addEventListener("click", toggleTheme);
document.getElementById("btn-theme-desktop")?.addEventListener("click", toggleTheme);
document.getElementById("theme-switch")?.addEventListener("change", toggleTheme);

// ---------- Navegação entre views ----------

function showView(viewId, opts = {}) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    const isActive = btn.dataset.view === viewId;
    btn.classList.toggle("active", isActive);
    if (isActive) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });

  if (!opts.silent) {
    document.getElementById("app-main")?.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    window.scrollTo(0, 0);
  }

  if (!opts.isBack) {
    const topLevel = ["inicio", "estudos", "evangelho", "ia", "perfil"];
    if (topLevel.includes(viewId)) {
      NAV_STACK.length = 0;
      NAV_STACK.push(viewId);
    } else {
      NAV_STACK.push(viewId);
    }
  }
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

document.querySelectorAll("[data-goto]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.goto));
});

document.querySelectorAll("[data-back]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.back, { isBack: true }));
});

// ---------- Saudação ----------

(function greet() {
  const el = document.getElementById("header-greeting");
  if (!el) return;
  const h = new Date().getHours();
  const text = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  el.textContent = `${text}. Que bom te ver por aqui.`;
})();

// ---------- Reunião fixa da família ----------

function openFamilyMeet() {
  window.open(typeof MEET_LINK !== "undefined" ? MEET_LINK : "#", "_blank", "noopener");
}
document.getElementById("btn-join-meet")?.addEventListener("click", openFamilyMeet);
document.getElementById("btn-join-meet-2")?.addEventListener("click", openFamilyMeet);

// ---------- Reflexão do dia ----------

function renderReflection() {
  const card = document.getElementById("reflection-card");
  if (!card || typeof BOOKS_DATA === "undefined") return;

  const candidates = [];
  BOOKS_DATA.forEach(book => {
    (book.capitulos || []).forEach(cap => {
      (cap.questoes || []).forEach(q => {
        if (q.resposta && q.resposta !== "TEXTO A INSERIR" && q.resposta.length > 40 && q.resposta.length < 260) {
          candidates.push({ text: q.resposta, source: `${book.titulo} — questão ${q.numero}` });
        }
      });
    });
  });

  if (!candidates.length) {
    card.style.display = "none";
    return;
  }

  const dayIndex = Math.floor(Date.now() / 86400000) % candidates.length;
  const pick = candidates[dayIndex];
  card.querySelector(".text").textContent = `"${pick.text}"`;
  card.querySelector(".source").textContent = pick.source;
}

// ---------- Ponto de entrada ----------

document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadLibrary === "function") {
    loadLibrary().then(() => {
      renderReflection();
      if (typeof renderHomeProgress === "function") renderHomeProgress();
    });
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
