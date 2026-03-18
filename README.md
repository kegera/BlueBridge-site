# BlueBridge Global Prep

Full-stack web platform for BlueBridge Global Prep — test prep, study abroad services, and an online shop with M-Pesa payments.

## Tech Stack

- **Frontend** — React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend** — Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT, bcrypt
- **Database** — SQLite (via SQLAlchemy)
- **Payments** — Safaricom M-Pesa STK Push

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |

---

## Running in Development

You need **two terminals** — one for the backend, one for the frontend.

### 1. Backend (Flask)

```bash
# From the project root (Site/)
pip install flask flask-sqlalchemy flask-cors pyjwt bcrypt requests

python server.py
```

The API runs at **http://localhost:5000**

### 2. Frontend (Vite dev server)

```bash
# From the frontend/ directory
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**

> The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically — no CORS issues in development.

---

## Environment Variables

Create `frontend/.env.local` with:

```env
VITE_BOOKING_URL=https://calendly.com/your-link
VITE_WHATSAPP=2547XXXXXXXX
VITE_EMAIL=info@yourdomain.com
```

---

## Building for Production

```bash
# 1. Build the React app
cd frontend
npm run build

# 2. Run Flask (serves the built frontend + API)
cd ..
python server.py
```

The built app is served at **http://localhost:5000** — Flask serves both the API and the static React files.

---

## Project Structure

```
Site/
├── server.py              # Flask backend (API + static file serving)
├── instance/
│   └── bluebridge.db      # SQLite database (auto-created on first run)
└── frontend/
    ├── src/
    │   ├── App.tsx         # React Router root, all routes
    │   ├── pages/
    │   │   ├── public/     # Home, Services, Pricing, Shop, Contact
    │   │   ├── auth/       # Login, Register
    │   │   ├── instructor/ # Dashboard, tests, grading, analytics
    │   │   └── student/    # Dashboard, take test, results
    │   ├── components/
    │   │   ├── layout/     # Navbar, Footer, MobileMenu, ProtectedRoute
    │   │   ├── marketing/  # Public page components
    │   │   ├── portal/     # Portal-specific components
    │   │   └── cart/       # CartDrawer, MpesaModal
    │   ├── contexts/       # AuthContext, CartContext
    │   ├── lib/            # api.ts, auth.ts, toast.ts, constants.ts
    │   └── types/          # Shared TypeScript types
    └── dist/               # Production build output (gitignored)
```

---

## User Roles

| Role | Access |
|------|--------|
| **Student** | Register/login, take published tests, view results |
| **Instructor** | Create/edit/publish tests, grade open answers, view analytics |

Register at `/register` — select your role during sign-up.

---

## API Overview

| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Tests | `GET/POST /api/tests`, `GET/PUT/DELETE /api/tests/:id`, `PATCH /api/tests/:id/publish` |
| Questions | `POST /api/tests/:id/questions`, `PUT/DELETE /api/questions/:id` |
| Submissions | `POST /api/submissions`, `POST /api/submissions/:id/submit`, `PATCH /api/submissions/:id/grade` |
| Analytics | `GET /api/analytics/instructor`, `GET /api/analytics/student` |
| M-Pesa | `POST /api/mpesa/stkpush`, `POST /api/mpesa/callback`, `GET /api/mpesa/status/:id` |
