// ---------- Estado ----------
const state = {
  books: [],       // conteúdo carregado dos JSON
  currentBook: null,
  currentChapter: null
};

const BOOK_FILES = [
  "data/livro-dos-espiritos.json",
  "data/evangelho-segundo-espiritismo.json"
];

const PROGRESS_KEY = "lar-espirita-progresso";

// ---------- Navegação entre views ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");

  document.querySelectorAll("nav.tab-bar button").forEach(b => {
    b.classList.toggle("active", b.dataset.view === name);
  });

  const nav = document.querySelector("nav.tab-bar");
  if (nav) nav.dataset.active = name;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("nav.tab-bar button").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// ---------- Meet ----------
function enterMeet() {
  window.open(MEET_LINK, "_blank");
}
document.getElementById("btn-enter-inicio").addEventListener("click", enterMeet);
document.getElementById("btn-enter-evangelho").addEventListener("click", enterMeet);

// ---------- Saudação por horário ----------
(function greet() {
  const h = new Date().getHours();
  const el = document.getElementById("greeting");
  if (!el) return;
  if (h < 12) el.textContent = "Bom dia";
  else if (h < 18) el.textContent = "Boa tarde";
  else el.textContent = "Boa noite";
})();

// ---------- Progresso (localStorage) ----------
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function markRead(bookId, chapterNumero) {
  const progress = getProgress();
  progress[bookId] = progress[bookId] || [];
  if (!progress[bookId].includes(chapterNumero)) {
    progress[bookId].push(chapterNumero);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

function progressLabel(book) {
  const progress = getProgress();
  const done = (progress[book.id] || []).length;
  const total = book.capitulos.length;
  return done === 0 ? "Não iniciado" : `${done}/${total} capítulos`;
}

// ---------- Carregar livros ----------
async function loadBooks() {
  const results = await Promise.all(
    BOOK_FILES.map(path => fetch(path).then(r => r.json()))
  );
  state.books = results;
  renderBookGrid();
  renderContinueGrid();
}

function renderBookGrid() {
  const grid = document.getElementById("book-grid");
  grid.innerHTML = "";
  state.books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div>
        <h3>${book.titulo}</h3>
        <span class="meta">${book.autor} · ${book.ano}</span>
      </div>
      <span class="progress-pill">${progressLabel(book)}</span>
    `;
    card.addEventListener("click", () => openBook(book));
    grid.appendChild(card);
  });
}

function renderContinueGrid() {
  const grid = document.getElementById("continue-grid");
  grid.innerHTML = "";
  const progress = getProgress();
  const started = state.books.filter(b => (progress[b.id] || []).length > 0);
  const toShow = started.length ? started : state.books;

  toShow.slice(0, 2).forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div>
        <h3>${book.titulo}</h3>
        <span class="meta">${book.autor} · ${book.ano}</span>
      </div>
      <span class="progress-pill">${progressLabel(book)}</span>
    `;
    card.addEventListener("click", () => openBook(book));
    grid.appendChild(card);
  });
}

// ---------- Abrir livro → lista de capítulos ----------
function openBook(book) {
  state.currentBook = book;
  document.getElementById("chapters-title").textContent = book.titulo;

  const list = document.getElementById("chapter-list");
  list.innerHTML = "";
  book.capitulos.forEach(cap => {
    const item = document.createElement("div");
    item.className = "chapter-item";
    item.innerHTML = `
      <div><span class="num">${String(cap.numero).padStart(2, "0")}</span>${cap.titulo}</div>
    `;
    item.addEventListener("click", () => openChapter(book, cap));
    list.appendChild(item);
  });

  showView("chapters");
}

// ---------- Abrir capítulo → leitura ----------
function openChapter(book, cap) {
  state.currentChapter = cap;
  document.getElementById("reading-title").textContent = `${book.titulo} — Cap. ${cap.numero}`;

  const content = document.getElementById("reading-content");
  content.innerHTML = "";

  if (cap.questoes) {
    // Formato Livro dos Espíritos: pergunta / resposta / comentário
    cap.questoes.forEach(q => {
      const block = document.createElement("div");
      block.className = "reading-block";
      block.innerHTML = `
        <p class="question">${q.numero}. ${q.pergunta}</p>
        <p class="answer">${q.resposta}</p>
        ${q.comentario ? `<p class="comment">${q.comentario}</p>` : ""}
      `;
      content.appendChild(block);
    });
  } else if (cap.paragrafos) {
    // Formato Evangelho Segundo o Espiritismo: parágrafos corridos
    const block = document.createElement("div");
    block.className = "reading-block";
    block.innerHTML = cap.paragrafos.map(p => `<p class="paragraph">${p}</p>`).join("");
    content.appendChild(block);
  }

  markRead(book.id, cap.numero);
  showView("reading");
}

// ---------- Navegação "voltar" ----------
document.getElementById("back-to-books").addEventListener("click", () => {
  renderBookGrid();
  showView("estudos");
});

document.getElementById("back-to-chapters").addEventListener("click", () => {
  if (state.currentBook) openBook(state.currentBook);
});

// ---------- Service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

// ---------- Início ----------
loadBooks();
