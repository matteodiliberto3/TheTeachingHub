# The Teaching Hub

Hub interattivo (Next.js) per formare associati su **EDA**, **architetture frontend**, **design pattern** (con animazioni) e **cybersecurity** integrata, con tab JSON / server / client, diagrammi Mermaid e playground Sandpack.

## Avvio locale

```bash
npm install
cp .env.example .env.local
# Imposta DATABASE_URL in .env.local (mai committare questo file)
npm run dev
```

## Database (Supabase / Postgres)

1. Copia `DATABASE_URL` nel file `.env.local` (escluso da git).
2. Applica lo schema Drizzle:

```bash
npm run db:push
```

In alternativa: `npm run db:generate` per creare migrazioni SQL versionate.

L’endpoint `GET /api/db-health` verifica la connessione. `POST /api/progress` registra una visita leggera (slug + `client_id` anonimo in `localStorage`).

### Sicurezza importante

Se hai incollato una password di database in chat, email o issue, **ruotala subito** nel pannello Supabase e aggiorna `DATABASE_URL`. Non committare mai segreti nel repository.
