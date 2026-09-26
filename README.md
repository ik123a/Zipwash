# ZippWash

Campus laundry-management platform. Students book washing machines, track their loads, pay and earn rewards; laundry staff manage orders, customers, machines and settings from a separate admin surface.

The repository holds both halves of the product: a React single-page app in `src/` and an Express + MySQL API in `backend/`.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Available scripts](#available-scripts)
- [Routes](#routes)
- [API surface](#api-surface)
- [Project status](#project-status)

---

## Features

Implemented today:

**Student**

- Register and sign in with a roll number; JWT session persisted in `localStorage`
- Machine availability board with per-machine status and time remaining
- Live load tracking
- Pricing and payment
- Rewards and transaction history
- Reminders
- Light and dark appearance, toggled in Settings

**Staff**

- Separate staff sign-in, guarded by role
- Orders, customers, machine inventory and settings administration
- Feedback endpoint

**Both**

- Role-aware routing: students are confined to student routes, staff to `/admin/*`
- Responsive sidebar layout that collapses on small screens
- Toasts for action feedback and reduced-motion support

---

## Tech stack

**Frontend** — React 19, Vite 7, TypeScript 5.9, Tailwind CSS 3.4, shadcn/ui on Radix primitives, React Router 7, Axios, React Hook Form + Zod, Recharts, next-themes, lucide-react, Sonner.

**Backend** — Node.js, Express 5 (CommonJS), MySQL via `mysql2`, `jsonwebtoken`, `bcrypt`, `cors`, `express-rate-limit`, `dotenv`, `nodemon` in development.

---

## Architecture

```mermaid
flowchart LR
  subgraph client["React SPA (Vite)"]
    R[React Router + AuthProvider]
    G{StudentGuard / StaffGuard}
    P[Page components]
    A[Axios api.ts instance]
    R --> G --> P
    P --> A
  end

  subgraph api["Express API :5000/api"]
    C[CORS allowlist]
    MW[JWT auth middleware]
    AC[authController]
    SC[slotController]
    MC[machineController]
    TC[transactions]
    C --> MW
    MW --> AC & SC & MC & TC
  end

  subgraph db[("MySQL")]
    T1[students]
    T2[staff]
    T3[bookings]
    T4[machine_status]
    T5[clothes_entries]
    T6[transactions]
    T7[feedback]
  end

  A -- "Bearer token" --> C
  AC & SC & MC & TC --> db
```

`src/services/api.ts` is the single HTTP boundary. It attaches the stored JWT as an `Authorization: Bearer` header and reads its base URL from `VITE_API_URL`. All seven page modules import this one module, so there is exactly one place where the API contract lives.

---

## Project structure

```
.
├── src/
│   ├── App.tsx                  route table, guards, lazy route boundaries
│   ├── main.tsx                 React entry point
│   ├── index.css                design tokens, base layer, utilities
│   ├── components/
│   │   ├── layout/              AppLayout, Navbar, MainSidebar, Admin* shells
│   │   ├── ui/                  shadcn/ui primitives
│   │   ├── ui/custom/           MachineCard, StatusBadge, Navigation
│   │   ├── admin/               AnalyticsDashboard
│   │   ├── modals/              FeedbackModal, ProfileSettingsModal
│   │   └── student/             LaundryForms
│   ├── context/AuthContext.tsx  typed auth state and guards
│   ├── pages/                   route components (lazy-loaded)
│   ├── sections/                legacy page tree, not routed
│   ├── services/api.ts          Axios client + authService / slotService
│   ├── types/                   shared domain types
│   ├── hooks/                   use-mobile, useLaundry
│   └── data/mockData.ts         fixtures for the un-routed sections
├── backend/
│   ├── src/index.js             app entry, CORS, middleware
│   ├── src/config/db.js         MySQL pool
│   ├── src/middleware/auth.js   JWT verify, isStaff
│   ├── src/controllers/         auth, slot, staff, student, feedback
│   ├── src/routes/              route definitions
│   ├── schema.sql               table definitions
│   ├── migration.sql            incremental changes
│   ├── seed-admin.sql           staff seed
│   └── setup_db.js / init_db.js schema bootstrap
├── docs/
└── examples/
```

---

## Getting started

### Prerequisites

- Node.js 20+
- MySQL 8 (or MariaDB 10.6+)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit the values
node setup_db.js          # creates tables from schema.sql
npm run dev               # http://localhost:5000
```

`seed-admin.sql` holds a staff seed statement if you need one.

### 2. Frontend

```bash
npm install
cp .env.example .env      # VITE_API_URL should point at the backend
npm run dev               # http://localhost:5173
```

The backend CORS allowlist already permits `5173`, `5174`, `5175` and `127.0.0.1` on those ports, plus whatever `FRONTEND_URL` is set to.

---

## Configuration

### Frontend — `.env`

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for every API request | `http://localhost:5000/api` |
| `VITE_APP_TITLE` | Application title | `ZippWash` |

### Backend — `backend/.env`

| Variable | Purpose |
| --- | --- |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Signing secret for session tokens — use a long random value |
| `PORT` | API port, defaults to `5000` |
| `FRONTEND_URL` | Extra CORS origin, on top of the built-in dev allowlist |

`.env` files are git-ignored. `backend/.env` used to be committed; it has been untracked, and the values it held were local development defaults rather than live credentials. Git history still contains that file, so if a real `JWT_SECRET` or database password was ever committed anywhere, rotate it.

---

## Available scripts

Run from the repository root unless noted.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on the frontend |
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across the project |
| `cd backend && npm run dev` | API with nodemon reload |
| `cd backend && npm start` | API in production mode |

---

## Routes

`StudentGuard` redirects unauthenticated visitors to `/login` and staff away from student routes. `StaffGuard` does the mirror image.

| Path | Access | Page |
| --- | --- | --- |
| `/login` | public | `Login` |
| `/dashboard` | student | `StudentDashboard` |
| `/track` | student | `TrackLaundry` |
| `/pricing` | student | `Pricing` |
| `/rewards` | student | `Rewards` |
| `/transactions` | student | `Transactions` |
| `/reminders` | student | `Reminders` |
| `/privacy`, `/cookies`, `/terms` | student | `InfoPages` |
| `/admin` | staff | `StaffAdminPanel` |
| `/admin/orders` | staff | `OrdersPage` |
| `/admin/customers` | staff | `CustomersPage` |
| `/admin/inventory` | staff | `InventoryPage` |
| `/admin/settings` | staff | `SettingsPage` |
| anything else | — | redirected by role |

Route components load through `React.lazy`, so each page ships as its own chunk and the initial bundle stays near 500 kB instead of exceeding 1 MB.

---

## API surface

Base URL `http://localhost:5000/api`. Authenticated routes expect `Authorization: Bearer <token>`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/student/register` | Create a student account |
| `POST` | `/auth/student/login` | Student sign-in, returns a JWT |
| `POST` | `/auth/staff/login` | Staff sign-in, returns a JWT |
| `GET` | `/slots?date=&machine_id=` | Booked slots for a date |
| `POST` | `/slots` | Create a booking |

Staff login posts `{ email, password }` — the backend resolves the account with `WHERE email = ?`.

Database tables: `students`, `staff`, `bookings`, `machine_status`, `clothes_entries`, `transactions`, `feedback`.

---

## Project status

Honest notes on where this repository currently stands:

- **No automated tests.** `npm run lint` and `npm run build` are the only quality gates in place today.
- **No CI workflow.** Builds are not verified automatically on push.
- **No license file.** The backend `package.json` declares `ISC`, but no `LICENSE` file exists at the repository root, so the project is effectively unlicensed until one is added.
- **`src/sections/` is not routed.** It holds an earlier page tree (`HomePage`, `BookingPage`, `MyBookingsPage`, `NotificationsPage`, `PiDisplayPage`, `AdminPage`) that no import path reaches. It still typechecks and stays out of the production bundle, but it is dead weight and can go once its intent is confirmed.
- **Known lint debt.** 13 ESLint errors remain. Eight are `react-refresh/only-export-components` inside vendored shadcn/ui primitives, which is the framework's normal pattern of exporting a `cva` variant helper next to its component. The other five are React Compiler correctness findings: `NavContent` is declared inside render in `Navigation.tsx`, `Math.random()` is called in a `useMemo` in `sidebar.tsx`, `Date.now()` is called during render in `CustomersPage.tsx`, and `AuthContext` sets state synchronously in an effect. All `@typescript-eslint/no-explicit-any` errors are resolved.
- **Design-system debt.** `src/index.css` still carries a large block of `.dark` overrides that patch hardcoded palette utilities with attribute-substring selectors. The semantic tokens they bypass already exist in `tailwind.config.js`; migrating the page components onto those tokens would let that block be deleted.
- **`zippwash-final-project/`** contains stale duplicates of four files. Its `StudentDashboard.jsx` is 955 lines against 252 in the live `src/pages` copy, so it may hold a more developed iteration — left untouched pending a decision.
