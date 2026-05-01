# HP Higher Education MIS — Admin Portal (Prototype)

Government of Himachal Pradesh · Department of Higher Education · UX4G-styled web prototype.

This is a mobile-friendly, demo-grade admin portal for the State Admin (DHE) and College Admin roles. It is a **frontend-only prototype** — no backend, no real authentication. State is persisted to browser `localStorage`.

---

## Quick start

```bash
cd "HP HE MIS/Portal"
npm install
npm run dev
```

Open `http://localhost:3002`.

The first visit redirects to `/login`. Use any credentials (defaults pre-filled). After signing in, you land on the State Admin command centre.

To switch between State Admin and College Admin views during a demo, click your avatar in the top-right header → choose a role.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Run dev server on port 3002 |
| `npm run build` | Production build |
| `npm run start` | Start production server on 3002 |
| `npm run typecheck` | TypeScript typecheck (no emit) |
| `npm run lint` | Next.js lint |

---

## Routes

| Route | Purpose | Visible to |
|---|---|---|
| `/login` | Mock authentication, government-branded login card | Public |
| `/` | State Admin command centre — KPIs, district performance, cycle progress, alerts | Authenticated |
| `/applications` | Applications oversight queue with search + filters | Authenticated (scoped for College Admin) |
| `/applications/[applicationId]` | Six-tab applicant detail with scrutiny actions (verify / discrepancy / conditional / reject) | Authenticated |
| `/college` | College Operations dashboard — KPIs, queue health, next actions | Authenticated |
| `/college/seats` | Seat matrix with category split & download CTA | Authenticated |
| `/reports` | Status / category / district / seat-fill reports + CSV / XLSX / weekly export CTAs | Authenticated |

`/applications/[applicationId]` is dynamic; everything else is statically rendered.

---

## Tech stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS 3** with UX4G design tokens (Government violet `#613AF5`, Noto Sans, formal radius and shadows)
- **lucide-react** icons
- **localStorage** for persistence (`hp-mis:portal-session`, `hp-mis:applications`)

The visual language follows the UX4G v2.0.8 design system — Noto Sans typography, government violet primary, accessible focus rings, formal cards/tables/badges, GoI 4-column footer, tricolor identity strip and conformance to WCAG 2.1 AA.

---

## Mock data

Seeded on first run from `src/lib/mock-data.ts`:

- 12 HP districts
- 10 government colleges (Sanjauli, RKMV, Dharamshala, Mandi, Hamirpur, Una, Solan, Kullu, Nahan, Chamba)
- 5 UG courses (BA, BSc, BCom, BCA, BBA)
- 32 applications with full profiles, documents, preferences and audit history
- All six application statuses (submitted / under_scrutiny / discrepancy_raised / verified / conditional / rejected)
- 4 policy alerts and a 7-row seat matrix

To reset the seeded data, clear `localStorage` from your browser dev tools (DevTools → Application → Storage), or run `localStorage.removeItem('hp-mis:applications')` in the console.

---

## Implementation notes

**Authentication.** Login accepts any non-empty user ID + password. On submit, a 600 ms hold simulates server verification, then the session is persisted and the user is routed to `/`.

**Scrutiny actions.** Verify, conditional accept, raise discrepancy and reject all run through a 600 ms loading hold, write the new status + a history entry to `localStorage`, push a named-entity toast (`"{Student} has been approved."`) and either redirect to the queue or update in place. No CTA is dead.

**Role switching.** The top-right user menu lets you toggle State Admin ⇄ College Admin during a demo without signing out. State Admin sees the statewide application queue; College Admin sees only the configured college's queue (`gc-sanjauli`).

**Responsive.** Below 768 px the sidebar collapses into a drawer, the applications table renders as a card list, KPI strips stack into 2-up grids, filters become a single-column form. All interactive elements meet 44 pt minimum tap target.

**Accessibility.** Native `<button>` / `<a>` / `<input>` / `<table>` semantics throughout, visible focus rings, `aria-busy` on loading buttons, `aria-current` on active sidebar links, `role="status"` toasts, `prefers-reduced-motion` respected.

---

## Assumptions

1. **Frontend-only.** No backend service. Persistence is per-browser via `localStorage`.
2. **State Admin is the default sign-in.** College Admin is reachable via the demo role switcher rather than a distinct credentials path — simpler for demos.
3. **Reduced scope vs. the full report.** The `Docs/PORTAL_APP_REPORT.md` reference describes 13 routes; this prototype intentionally ships 7 polished routes (login, dashboard, applications, application detail, college operations, seat matrix, reports). Merit publication, allocation runs, cycle setup, policy alerts feed and lifecycle metrics are out of scope for the prototype.
4. **No real exports.** Download CSV / XLSX / Weekly report and Download seat matrix simulate generation with a 700 ms hold and a toast — they do not actually produce a file.
5. **UX4G colours and tokens are reproduced** in `tailwind.config.ts` rather than imported from the published UX4G CSS bundle. This avoids a runtime fetch and keeps the prototype self-contained.

---

## File map

```
Portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  Root layout (font, providers)
│   │   ├── globals.css                 UX4G tokens, reset, focus rings
│   │   ├── page.tsx                    State Admin command centre  /
│   │   ├── login/page.tsx              /login
│   │   ├── applications/
│   │   │   ├── page.tsx                /applications
│   │   │   └── [applicationId]/page.tsx /applications/[id]
│   │   ├── college/
│   │   │   ├── page.tsx                /college
│   │   │   └── seats/page.tsx          /college/seats
│   │   ├── reports/page.tsx            /reports
│   │   └── not-found.tsx               404
│   ├── components/
│   │   ├── shell/portal-frame.tsx      Header + sidebar + footer
│   │   ├── shell/auth-gate.tsx         Redirects to /login if unauthenticated
│   │   └── ui/                         Button, Card, Badge, Input, Stat,
│   │                                    Alert, EmptyState, ProgressBar
│   ├── lib/
│   │   ├── types.ts                    Domain types
│   │   ├── mock-data.ts                Seed districts, colleges, applications
│   │   ├── storage.ts                  localStorage helpers + keys
│   │   └── format.ts                   Status / category / date formatters
│   └── providers/
│       ├── session-provider.tsx        Mock auth + role switching
│       ├── toast-provider.tsx          Toast queue
│       └── applications-provider.tsx   Applications state + setStatus()
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## Remaining gaps / Phase 2 candidates

- Real authentication (SSO, OTP, Aadhaar bridge)
- Backend service for the application register
- Merit publication (`/merit`) and allocation (`/allocation`) workflow pages
- Cycle setup authoring (`/state/cycle`)
- Policy alerts feed (`/state/alerts`) as a dedicated page
- Student lifecycle dashboard (`/state/lifecycle`)
- File generation for CSV / XLSX exports
- Cross-tab live sync with the Student-App via `storage` events
- Multi-language toggle for English / Hindi (Devanagari)
