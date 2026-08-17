// ---------- Biblioteca: livros, capítulos, leitura, progresso ----------

const PROGRESS_KEY = "lar-espirita:progress";
const FONT_KEY = "lar-espirita:reading-font";

const BOOK_SOURCES = [
  { url: "data/livro-dos-espiritos.json", icon: "book" },
  { url: "data/evangelho-segundo-espiritismo.json", icon: "book" },
];

let BOOKS_DATA = [];
let currentBookId = null;
let currentChapterNum = null;

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }

function markChapterRead(bookId, chapterNum) {
  const progress = getProgress();
  if (!progress[bookId]) progress[bookId] = { read: [], last: null };
  if (!progress[bookId].read.includes(chapterNum)) progress[bookId].read.push(chapterNum);
  progress[bookId].last = chapterNum;
  progress[bookId].lastAt = Date.now();
  saveProgress(progress);
  if (typeof renderHomeProgress === "function") renderHomeProgress();
}

function isChapterPlaceholder(cap) {
  if (cap.questoes) return cap.questoes.every(q => q.resposta === "TEXTO A INSERIR");
  if (cap.paragrafos) return cap.paragrafos.every(p => p.startsWith("TEXTO A INSERIR"));
  return true;
}

async function loadLibrary() {
  try {
    const results = await Promise.all(BOOK_SOURCES.map(s => fetch(s.url).then(r => r.json())));
    BOOKS_DATA = results;
    renderBookList();
  } catch (err) {
    console.error("Falha ao carregar biblioteca", err);
    const list = document.getElementById("book-list");
    if (list) list.innerHTML = emptyStateHTML("Não foi possível carregar os livros agora.");
  }
}

function emptyStateHTML(msg) {
  return `<div class="empty-state">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>
    <p>${msg}</p>
  </div>`;
}

// ---------- Lista de livros ----------

function bookProgressCount(book) {
  const total = (book.capitulos || []).filter(c => !isChapterPlaceholder(c)).length;
  const progress = getProgress()[book.id];
  const read = progress ? progress.read.filter(n => (book.capitulos || []).some(c => c.numero === n && !isChapterPlaceholder(c))).length : 0;
  return { read, total };
}

function renderBookList(filter = "") {
  const list = document.getElementById("book-list");
  if (!list) return;
  const q = filter.trim().toLowerCase();

  const filtered = BOOKS_DATA.filter(book => {
    if (!q) return true;
    if (book.titulo.toLowerCase().includes(q)) return true;
    return (book.capitulos || []).some(c => c.titulo.toLowerCase().includes(q));
  });

  if (!filtered.length) {
    list.innerHTML = emptyStateHTML("Nenhum resultado para essa busca.");
    return;
  }

  list.innerHTML = filtered.map(book => {
    const { read, total } = bookProgressCount(book);
    const pct = total ? Math.round((read / total) * 100) : 0;
    return `
      <div class="book-card" data-book="${book.id}">
        <div class="glyph">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H4Z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6H20Z"/></svg>
        </div>
        <div class="body">
          <h3>${book.titulo}</h3>
          <span class="meta">${book.autor} · ${book.ano}</span>
        </div>
        <span class="progress-pill">${pct}%</span>
      </div>`;
  }).join("");

  list.querySelectorAll("[data-book]").forEach(card => {
    card.addEventListener("click", () => openBook(card.dataset.book));
  });
}

document.getElementById("book-search")?.addEventListener("input", e => renderBookList(e.target.value));

// ---------- Capítulos ----------

function openBook(bookId) {
  currentBookId = bookId;
  const book = BOOKS_DATA.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById("chapters-eyebrow").textContent = `${book.autor} · ${book.ano}`;
  document.getElementById("chapters-title").textContent = book.titulo;
  document.getElementById("chapters-subtitle").textContent = `${book.capitulos.length} capítulos`;

  const progress = getProgress()[bookId] || { read: [] };
  let lastPart = null;
  const list = document.getElementById("chapter-list");

  list.innerHTML = book.capitulos.map(cap => {
    const placeholder = isChapterPlaceholder(cap);
    const read = progress.read.includes(cap.numero);
    let partHTML = "";
    if (cap.parte && cap.parte !== lastPart) {
      partHTML = `<div class="part-divider">${cap.parte}</div>`;
      lastPart = cap.parte;
    }
    return `${partHTML}
      <div class="chapter-item" data-cap="${cap.numero}" ${placeholder ? 'style="opacity:.5;"' : ""}>
        <span class="num">${String(cap.numero).padStart(2, "0")}</span>
        <span class="titulo">${cap.titulo}${placeholder ? " <em style='opacity:.7;'>(em tradução)</em>" : ""}</span>
        ${read ? `<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>` : ""}
      </div>`;
  }).join("");

  list.querySelectorAll("[data-cap]").forEach(item => {
    item.addEventListener("click", () => openChapter(bookId, parseInt(item.dataset.cap, 10)));
  });

  showView("chapters");
}

// ---------- Leitura ----------

function applyFontSize(size) {
  document.getElementById("app-main")?.classList.toggle("reading-lg", size === "grande");
  document.querySelectorAll("[data-fontsize]").forEach(btn => btn.classList.toggle("active", btn.dataset.fontsize === size));
}

document.querySelectorAll("[data-fontsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    localStorage.setItem(FONT_KEY, btn.dataset.fontsize);
    applyFontSize(btn.dataset.fontsize);
  });
});
applyFontSize(localStorage.getItem(FONT_KEY) || "normal");

function openChapter(bookId, chapterNum) {
  const book = BOOKS_DATA.find(b => b.id === bookId);
  const cap = book?.capitulos.find(c => c.numero === chapterNum);
  if (!book || !cap) return;

  currentBookId = bookId;
  currentChapterNum = chapterNum;

  document.getElementById("reading-back-label").textContent = book.titulo;
  document.getElementById("reading-eyebrow").textContent = cap.parte || book.titulo;
  document.getElementById("reading-title").textContent = cap.titulo;

  const content = document.getElementById("reading-content");

  if (cap.questoes) {
    content.innerHTML = cap.questoes.map(q => `
      <div class="reading-block">
        <p class="question"><span class="qnum">${q.numero}.</span>${q.pergunta}</p>
        <p class="answer">${q.resposta === "TEXTO A INSERIR" ? "<em>Este trecho ainda está em tradução.</em>" : q.resposta}</p>
        ${q.comentario ? `<p class="comment">${q.comentario}</p>` : ""}
      </div>`).join("");
  } else if (cap.paragrafos) {
    content.innerHTML = `<div class="reading-block">${cap.paragrafos.map(p =>
      `<p class="paragraph">${p.startsWith("TEXTO A INSERIR") ? "<em>Este trecho ainda está em tradução.</em>" : p}</p>`
    ).join("")}</div>`;
  }

  if (!isChapterPlaceholder(cap)) markChapterRead(bookId, chapterNum);

  const idx = book.capitulos.findIndex(c => c.numero === chapterNum);
  const prevBtn = document.getElementById("btn-prev-chapter");
  const nextBtn = document.getElementById("btn-next-chapter");
  prevBtn.disabled = idx <= 0;
  prevBtn.style.opacity = idx <= 0 ? 0.4 : 1;
  nextBtn.disabled = idx >= book.capitulos.length - 1;
  nextBtn.style.opacity = idx >= book.capitulos.length - 1 ? 0.4 : 1;

  showView("reading");
}

document.getElementById("btn-prev-chapter")?.addEventListener("click", () => {
  const book = BOOKS_DATA.find(b => b.id === currentBookId);
  const idx = book.capitulos.findIndex(c => c.numero === currentChapterNum);
  if (idx > 0) openChapter(currentBookId, book.capitulos[idx - 1].numero);
});
document.getElementById("btn-next-chapter")?.addEventListener("click", () => {
  const book = BOOKS_DATA.find(b => b.id === currentBookId);
  const idx = book.capitulos.findIndex(c => c.numero === currentChapterNum);
  if (idx < book.capitulos.length - 1) openChapter(currentBookId, book.capitulos[idx + 1].numero);
});

// ---------- Widget de progresso + "continue estudando" na Início ----------

function renderHomeProgress() {
  const progress = getProgress();
  const bookIds = Object.keys(progress);

  const lampFill = document.getElementById("lamp-fill");
  const title = document.getElementById("progress-title");
  const detail = document.getElementById("progress-detail");
  const continueSection = document.getElementById("continue-section");
  const rail = document.getElementById("continue-rail");

  let totalRead = 0, totalChapters = 0;
  BOOKS_DATA.forEach(book => {
    const real = (book.capitulos || []).filter(c => !isChapterPlaceholder(c));
    totalChapters += real.length;
    const p = progress[book.id];
    if (p) totalRead += p.read.filter(n => real.some(c => c.numero === n)).length;
  });

  const pct = totalChapters ? totalRead / totalChapters : 0;
  const circumference = 113;
  if (lampFill) lampFill.style.strokeDashoffset = String(circumference * (1 - pct));

  if (totalRead === 0) {
    title.textContent = "Você ainda não começou a leitura";
    detail.textContent = "Abra Estudos para conhecer os livros disponíveis";
  } else {
    title.textContent = `${totalRead} de ${totalChapters} capítulos lidos`;
    detail.textContent = pct >= 1 ? "Você concluiu toda a biblioteca disponível" : "Continue no seu ritmo";
  }

  if (!bookIds.length) {
    continueSection.style.display = "none";
    return;
  }

  const cards = bookIds.map(bookId => {
    const book = BOOKS_DATA.find(b => b.id === bookId);
    if (!book) return "";
    const p = progress[bookId];
    const cap = book.capitulos.find(c => c.numero === p.last);
    if (!cap) return "";
    return `
      <div class="book-card rail-card" data-book="${bookId}" data-cap="${cap.numero}">
        <div class="glyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H4Z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6H20Z"/></svg></div>
        <div class="body"><h3>${cap.titulo}</h3><span class="meta">${book.titulo}</span></div>
      </div>`;
  }).filter(Boolean).join("");

  if (!cards) {
    continueSection.style.display = "none";
    return;
  }

  continueSection.style.display = "block";
  rail.innerHTML = cards;
  rail.querySelectorAll("[data-book]").forEach(card => {
    card.addEventListener("click", () => openChapter(card.dataset.book, parseInt(card.dataset.cap, 10)));
  });
}
