// Verifica o ID token que o Google Identity Services devolve no popup de login.
// Usamos o endpoint tokeninfo do próprio Google: ele valida a assinatura pra gente,
// então não precisamos implementar verificação de JWT/RS256 na mão.
export async function verifyGoogleToken(credential, expectedClientId) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );
  if (!res.ok) return null;

  const payload = await res.json();

  if (payload.aud !== expectedClientId) return null;
  if (payload.iss !== "accounts.google.com" && payload.iss !== "https://accounts.google.com") return null;
  if (Number(payload.exp) * 1000 < Date.now()) return null;

  return payload;
}

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

export async function createSession(userId, secret) {
  const payload = JSON.stringify({ sub: userId, exp: Date.now() + SESSION_DURATION_MS });
  const payloadB64 = toBase64Url(payload);
  const signature = await sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export async function readSession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!match) return null;

  const [payloadB64, signature] = decodeURIComponent(match[1]).split(".");
  if (!payloadB64 || !signature) return null;

  const expected = await sign(payloadB64, secret);
  if (expected !== signature) return null;

  try {
    const payload = JSON.parse(fromBase64Url(payloadB64));
    if (payload.exp < Date.now()) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export function sessionCookie(token) {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  return `session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearCookie() {
  return `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

async function sign(data, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(String.fromCharCode(...new Uint8Array(sig)));
}

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return atob(padded);
}
