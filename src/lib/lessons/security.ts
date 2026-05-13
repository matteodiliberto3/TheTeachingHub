import type { LessonDefinition } from "./types";

export const securityLesson: LessonDefinition = {
  slug: "security",
  title: "Cybersecurity integrata nel flusso",
  shortTitle: "Sicurezza",
  summary:
    "JWT in cookie httpOnly, sanitizzazione input, rate limit, CORS e CSP con esempi client/server.",
  mermaid: `sequenceDiagram
    participant B as Browser
    participant A as API
    participant IdP as Auth
    B->>IdP: login
    IdP-->>B: Set-Cookie httpOnly + Secure
    B->>A: Cookie + Origin
    A-->>B: JSON + CSP + CORS`,
  jsonContract: `{
  "auth": {
    "tokenLocation": "httpOnly-cookie",
    "sameSite": "lax",
    "secure": true,
    "rotation": "refresh-endpoint"
  },
  "headers": {
    "content-security-policy": "default-src 'self'; frame-ancestors 'none'",
    "strict-transport-security": "max-age=31536000; includeSubDomains"
  }
}`,
  serverSnippet: `// Express — cookie httpOnly + rate limit + helmet-like headers
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

app.use(cookieParser());
app.use(
  rateLimit({ windowMs: 10_000, max: 30, standardHeaders: true, legacyHeaders: false })
);

app.post("/session", (req, res) => {
  const token = mintJwt(req.body); // server-only
  res.cookie("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 900_000,
  });
  res.status(204).end();
});`,
  clientSnippet: `// Browser — NON salvare access token in localStorage se XSS è un rischio
async function callApi() {
  const res = await fetch("/api/me", {
    credentials: "include", // invia cookie httpOnly
    headers: { "x-csrf-token": readCsrfMeta() },
  });
  if (!res.ok) throw new Error("auth");
  return res.json();
}`,
  seniorNotes: [
    "localStorage + XSS = furto token: preferisci cookie httpOnly con CSRF mitigations per sessioni browser.",
    "CORS non sostituisce l'autenticazione: è solo policy same-origin per risposte lette dal browser.",
    "CSP riduce XSS ma richiede tuning: inizia con report-only in staging.",
  ],
};
