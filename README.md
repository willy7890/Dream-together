# Dream Together — Monorepo

A real, running full-stack app: FastAPI backend + React/TypeScript frontend, connected end-to-end.

## Kuiendesha (fastest — local dev, no Docker needed)

**Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend inaanza kwenye **http://localhost:8000** (docs: `/docs`). Tables zinaundwa moja kwa moja kwenye SQLite (`dev.db`) — hakuna Postgres inayohitajika kwa dev.

**Frontend** (terminal nyingine):
```bash
cd frontend
npm install
npm run dev
```
Fungua **http://localhost:5173**. Register akaunti mbili (mfano wako na mpenzi), tumia "Connect with your partner" kualika kwa email ya pili, kisha ingia na akaunti ya pili ukubali mwaliko — sasa mna couple workspace ya pamoja ya kufanyia majaribio ya Goals, Savings, Memories, n.k.

## Kuiendesha na Docker (Postgres + Redis halisi)

```bash
docker-compose up --build
```
Hii inaanzisha Postgres, Redis, backend, na frontend pamoja — msingi wa production-style environment.

## Kilichofanya kazi kikamilifu (nimejaribu mwenyewe kabla ya kukupa)

- ✅ Register / Login / JWT auth
- ✅ Couple invite-by-email + accept flow
- ✅ Goals: create, list, +10% progress button, delete — zote real API calls
- ✅ Savings: add income/expense, live chart, running balance
- ✅ Memories: add/delete na image URL preview
- ✅ Journal: andika na uone entries na mood emoji
- ✅ Timeline: ongeza matukio muhimu
- ✅ Mood check: bonyeza emoji → inahifadhiwa → inaonekana kwenye history
- ✅ Settings: **language switcher halisi** (EN/SW, inabadilisha UI mara moja bila reload, na inahifadhiwa backend), **theme toggle** (dark/light halisi), profile update
- ✅ Logout button halisi

## Ambayo ni stub kwa sasa (backend inarudisha "coming_soon")

- Messaging (inahitaji WebSocket server)
- Documents (inahitaji S3/object storage)
- AI Assistant (inahitaji Anthropic API key)
- Premium/Subscriptions (inahitaji payment gateway — mfano Stripe au Flutterwave/Selcom kwa TZ)
- Admin dashboard (backend `/admin/stats` iko, frontend UI bado)

Hizi ni stub kwa uwazi — si za uongo. Nikuambie ni ipi unataka nikamilishe kwanza.

## Muundo

```
Dream-together/
├── backend/    (FastAPI — app/api, core, database, models, schemas, services)
├── frontend/   (React + TS + Vite — src/features, components, services, i18n)
├── docker-compose.yml
└── docs/
```

Muundo huu ni sawasawa na ule ulionipa.
