// ---------- Perfil: login, sala e conta ----------
// Preencha aqui o mesmo Client ID que você colocou no wrangler.toml (GOOGLE_CLIENT_ID).
const GOOGLE_CLIENT_ID = "COLE_AQUI_SEU_CLIENT_ID.apps.googleusercontent.com";

let currentUser = null;
let jitsiApi = null;

async function fetchMe() {
  try {
    const res = await fetch("/api/me");
    const data = await res.json();
    currentUser = data.user;
  } catch {
    currentUser = null;
  }
  renderAccountBox();
}

function renderAccountBox() {
  const signedOut = document.getElementById("signed-out-box");
  const signedIn = document.getElementById("signed-in-box");
  if (!signedOut || !signedIn) return;

  if (currentUser) {
    signedOut.style.display = "none";
    signedIn.style.display = "flex";
    document.getElementById("user-avatar").src = currentUser.avatar_url || "assets/logo.png";
    document.getElementById("user-name").textContent = currentUser.name;
    document.getElementById("user-email").textContent = currentUser.email;
  } else {
    signedOut.style.display = "block";
    signedIn.style.display = "none";
    renderGoogleButton();
  }
}

function renderGoogleButton() {
  const container = document.getElementById("google-btn-container");
  if (!container || !window.google || container.dataset.rendered) return;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    ux_mode: "popup", // popup em vez de redirect — a pessoa nunca sai do app
  });

  window.google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "pill",
  });

  container.dataset.rendered = "true";
}

async function handleGoogleCredential(response) {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: response.credential }),
  });
  if (res.ok) {
    const data = await res.json();
    currentUser = data.user;
    renderAccountBox();
    showToast(`Bem-vindo(a), ${currentUser.name.split(" ")[0]}`);
  }
}

document.getElementById("btn-logout")?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  currentUser = null;
  renderAccountBox();
  showToast("Você saiu da conta");
});

// ---------- Criar sala / Jitsi embutido ----------

document.getElementById("btn-create-meeting")?.addEventListener("click", async () => {
  if (!currentUser) {
    showToast("Entre com o Google primeiro para criar sua sala.");
    return;
  }

  const res = await fetch("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Evangelho no Lar" }),
  });

  if (!res.ok) {
    showToast("Não foi possível criar a sala agora.");
    return;
  }

  const meeting = await res.json();
  embedJitsi(meeting.roomName);
});

function embedJitsi(roomName) {
  const container = document.getElementById("jitsi-container");
  document.getElementById("create-meeting-card").style.display = "none";
  container.style.display = "block";
  container.innerHTML = "";

  jitsiApi = new JitsiMeetExternalAPI("meet.jit.si", {
    roomName,
    parentNode: container,
    width: "100%",
    height: "100%",
    userInfo: currentUser ? { displayName: currentUser.name } : undefined,
    configOverwrite: { prejoinPageEnabled: false },
  });
}

// ---------- Sobre ----------

document.getElementById("btn-about")?.addEventListener("click", () => {
  showToast("Lar Espírita — um espaço de estudo livre, sem fins lucrativos.");
});

// Carrega o usuário atual assim que o app abre
fetchMe();

// O script do Google carrega de forma assíncrona; espera ele ficar pronto
// antes de tentar desenhar o botão "Entrar com Google".
const waitGoogle = setInterval(() => {
  if (window.google && window.google.accounts) {
    clearInterval(waitGoogle);
    if (!currentUser) renderGoogleButton();
  }
}, 200);
