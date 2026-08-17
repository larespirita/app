// ---------- Evangelho no Lar: roteiro em checklist ----------

const ROTEIRO_KEY = "lar-espirita:roteiro";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getRoteiroState() {
  try {
    const saved = JSON.parse(localStorage.getItem(ROTEIRO_KEY));
    if (saved && saved.day === todayKey()) return saved.steps;
  } catch {}
  return [false, false, false, false];
}

function saveRoteiroState(steps) {
  localStorage.setItem(ROTEIRO_KEY, JSON.stringify({ day: todayKey(), steps }));
}

function renderRoteiro() {
  const steps = getRoteiroState();
  document.querySelectorAll("#roteiro-checklist .checklist-item").forEach(item => {
    const i = parseInt(item.dataset.step, 10);
    item.classList.toggle("done", !!steps[i]);
  });
}

document.querySelectorAll("#roteiro-checklist .checklist-item").forEach(item => {
  item.addEventListener("click", () => {
    const steps = getRoteiroState();
    const i = parseInt(item.dataset.step, 10);
    steps[i] = !steps[i];
    saveRoteiroState(steps);
    renderRoteiro();
  });
});

document.getElementById("btn-reset-roteiro")?.addEventListener("click", () => {
  saveRoteiroState([false, false, false, false]);
  renderRoteiro();
  showToast("Roteiro reiniciado");
});

renderRoteiro();
