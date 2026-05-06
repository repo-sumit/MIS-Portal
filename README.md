# HP Higher Education MIS - Admin Portal

The `Portal` application is the administrative interface for the Himachal Pradesh Higher Education Management Information System prototype. It models the work performed by State Admin and College Admin users after students submit admission applications in the companion `Student-App`.

This README is based on the current repository contents, especially `package.json`, `src/app`, `src/components`, `src/context`, `src/lib`, and `src/data`. Where behavior is inferred from frontend-only mock logic, it is explicitly labeled as inferred.

## Overview

The Portal is a Next.js frontend for reviewing student applications, managing college scrutiny, publishing merit lists, running a first-pass allocation workflow, viewing analytics, and validating college seat matrices.

The app is currently a local prototype:

- It has no backend API routes in this repository.
- It uses deterministic mock data and browser `localStorage`.
- Authentication is simulated with a client-side login form.
- State Admin and College Admin authorization is enforced in the frontend.

The main user flows are:

1. A user signs in through `/login`.
2. The mock session is stored in `localStorage` under `hp-mis:portal-session`.
3. The user lands in a role-specific administrative workspace.
4. College Admin users review applications assigned to their college and manage document scrutiny.
5. State Admin users view statewide metrics, publish merit, run allocation, and access reporting.
6. Application, merit, allocation, and some report data persist in browser storage for the current browser/origin.

## Key Features

### Mock Authentication And Role Switching

- Login page at `/login`.
- Default user ID is `director.dhe@hp.gov.in`.
- Default role is State Admin.
- Any non-empty password is accepted.
- Session is stored by `SessionProvider` in `src/context/session-context.tsx`.
- The portal frame allows switching between State Admin and College Admin roles from the header.
- Authentication state is checked by `AuthGate`.
- Role-specific pages are protected by `RoleGate`.

Important files:

- `src/app/login/page.tsx`
- `src/context/session-context.tsx`
- `src/components/auth/auth-gate.tsx`
- `src/components/auth/role-gate.tsx`
- `src/components/layout/portal-frame.tsx`

### State Admin Dashboard

- Main dashboard route: `/`.
- Shows statewide admission metrics, application conversion trends, student lifecycle movement, district summaries, college performance, alerts, and operational follow-ups.
- Dashboard data is static mock data defined in `src/data/state-dashboard-data.ts`.
- Visualizations are implemented with custom React/SVG/CSS components rather than an external charting library.

Important files:

- `src/app/page.tsx`
- `src/components/dashboard/*`
- `src/data/state-dashboard-data.ts`

### College Admin Dashboard

- College dashboard route: `/college`.
- Visible to College Admin users.
- Uses scoped data for the active college.
- Summarizes verification workload, scrutiny aging, accepted/rejected/discrepancy counts, category composition, district spread, and course demand.

Important files:

- `src/app/college/page.tsx`
- `src/lib/scoping.ts`
- `src/context/applications-context.tsx`

### Application Review Queue

- Application queue route: `/applications`.
- Available to both State Admin and College Admin users.
- State Admin can see all seeded applications.
- College Admin users are scoped to the active college.
- Supports status filters, course filters, category filters, search, reset, and CSV export.
- Export behavior is client-side only.

Important files:

- `src/app/applications/page.tsx`
- `src/components/applications/applications-table.tsx`
- `src/lib/scoping.ts`

### Application Detail And Scrutiny Workflow

- Application detail route: `/applications/[applicationId]`.
- Shows applicant details, education details, uploaded documents, preferences, and audit history.
- Allows document-level review through a modal.
- Supports document decisions:
  - `verified`
  - `concern`
  - `rejected`
- Notes are required for concern and rejected decisions.
- If any document has a concern, the application is moved to `discrepancy_raised`.
- If all documents are verified, the application is moved to `verified`.
- If any document is rejected, the application is moved to `rejected`.
- Every review action appends an audit history entry.

Important files:

- `src/app/applications/[applicationId]/page.tsx`
- `src/components/applications/document-review-modal.tsx`
- `src/context/applications-context.tsx`
- `src/lib/types.ts`

### Seat Matrix Validation

- Seat matrix route: `/college/seats`.
- Visible to College Admin users.
- Shows sanctioned, submitted, filled, and available seats by course/category.
- Highlights mismatches between sanctioned and submitted seats.
- Inferred: this page models a college-side operational validation step before allocation, but it does not currently write changes back to a backend.

Important files:

- `src/app/college/seats/page.tsx`
- `src/lib/mock-data.ts`
- `src/lib/types.ts`

### Merit Publication

- Merit route: `/merit`.
- Visible to State Admin users.
- Generates merit overlays from verified and conditional applications.
- Ranks candidates using deterministic frontend logic:
  - Higher board score ranks first.
  - Earlier date of birth breaks score ties.
  - Category priority is considered after date of birth.
  - Application number is the final deterministic tie-breaker.
- Allows course-wise merit publication.
- Merit version increments when a course is republished.
- Published merit overlays are stored in `localStorage` under `hp-mis:merit`.

Important files:

- `src/app/merit/page.tsx`
- `src/context/lifecycle-context.tsx`
- `src/lib/lifecycle.ts`
- `src/lib/storage.ts`

### Allocation Workflow

- Allocation route: `/allocation`.
- Visible to State Admin users.
- Requires published merit data before allocations can be generated.
- Performs a simplified first-preference allocation flow.
- Tracks allocated, waitlisted, and unassigned candidates.
- Allocation overlays are stored in `localStorage` under `hp-mis:allocation`.

Important files:

- `src/app/allocation/page.tsx`
- `src/context/lifecycle-context.tsx`
- `src/lib/lifecycle.ts`
- `src/lib/storage.ts`

### Reports

- Reports route: `/reports`.
- Visible to State Admin users.
- Shows application status distribution, category distribution, district participation, seat-fill indicators, and reporting snapshots.
- Includes client-side export-style actions.
- Inferred: report export is a prototype action; no server-side report generation is present.

Important files:

- `src/app/reports/page.tsx`
- `src/data/state-dashboard-data.ts`
- `src/context/applications-context.tsx`

## Tech Stack

| Area | Technology | Evidence |
| --- | --- | --- |
| Framework | Next.js `15.4.6` | `package.json`, `src/app` |
| UI Library | React `19.1.0` | `package.json` |
| Language | TypeScript `^5` | `tsconfig.json`, `.tsx` files |
| Styling | Tailwind CSS `^3.4.17` | `tailwind.config.ts`, `src/app/globals.css` |
| Icons | `lucide-react` `^0.468.0` | `package.json`, UI components |
| Font | Noto Sans via `next/font/google` | `src/app/layout.tsx` |
| State | React Context and hooks | `src/context/*` |
| Persistence | Browser `localStorage` | `src/lib/storage.ts` |
| Build Tooling | Next.js scripts | `package.json` |
| Testing | Not found in the current repository | No test scripts or test files found |
| Backend/API | Not found in the current repository | No `src/app/api` routes or server API layer found |
| Database | Not found in the current repository | No schema, migration, ORM, or database client found |
| CI/CD | Not found in the current repository | No workflow files found inside this app |
| Docker | Not found in the current repository | No Dockerfile found inside this app |

## Architecture

### Application Structure

```text
Portal/
├── package.json                  # Next.js app metadata and scripts
├── next.config.mjs               # Next.js config
├── postcss.config.mjs            # PostCSS/Tailwind integration
├── tailwind.config.ts            # Tailwind theme configuration
├── tsconfig.json                 # TypeScript configuration
├── public/                       # Static assets
└── src/
    ├── app/                      # App Router pages and layout
    │   ├── allocation/           # State Admin allocation workflow
    │   ├── applications/         # Application queue and detail pages
    │   ├── college/              # College Admin dashboard and seat matrix
    │   ├── login/                # Mock login page
    │   ├── merit/                # State Admin merit publication
    │   ├── reports/              # Reporting dashboard
    │   ├── globals.css           # Global styles and Tailwind layers
    │   ├── layout.tsx            # Root HTML shell and providers
    │   ├── not-found.tsx         # Custom 404 page
    │   └── page.tsx              # State Admin dashboard
    ├── components/               # Feature and shared UI components
    │   ├── applications/         # Tables and scrutiny modal
    │   ├── auth/                 # AuthGate and RoleGate
    │   ├── dashboard/            # Dashboard metrics and visualizations
    │   ├── layout/               # Portal shell
    │   └── ui/                   # Shared UI primitives
    ├── context/                  # React providers for session, data, lifecycle, toasts
    ├── data/                     # Static dashboard fixtures
    └── lib/                      # Types, mock data, lifecycle, storage, helpers
```

### Provider Tree

The root layout wraps the application in the following providers:

```tsx
<SessionProvider>
  <ToastProvider>
    <ApplicationsProvider>
      <LifecycleProvider>
        {children}
      </LifecycleProvider>
    </ApplicationsProvider>
  </ToastProvider>
</SessionProvider>
```

This means:

- Session state is available to all pages.
- Toast notifications can be emitted across workflows.
- Application data is initialized before merit and allocation lifecycle logic.
- Lifecycle state depends on application data.

### Important Modules

| Module | Purpose |
| --- | --- |
| `src/lib/types.ts` | Central application, college, course, document, session, merit, allocation, and reporting types |
| `src/lib/mock-data.ts` | Deterministic seeded colleges, courses, districts, applications, seat matrix, and helper formatters |
| `src/lib/storage.ts` | Safe wrappers for browser storage keys and overlay persistence |
| `src/lib/lifecycle.ts` | Merit ranking and allocation generation logic |
| `src/lib/scoping.ts` | Role-aware application filtering for State Admin and College Admin users |
| `src/context/session-context.tsx` | Mock login/session/role-switching behavior |
| `src/context/applications-context.tsx` | Application register state, document review, CSV export, and derived summaries |
| `src/context/lifecycle-context.tsx` | Merit publication and allocation state |
| `src/context/toast-context.tsx` | Toast notification state |
| `src/components/layout/portal-frame.tsx` | Main authenticated shell, navigation, user controls, role switching |

## Business Logic / Application Logic

### Seed Data

The app generates deterministic mock admissions data in `src/lib/mock-data.ts`:

- 12 Himachal Pradesh districts.
- 10 colleges.
- 6 courses:
  - `BA`
  - `BSc`
  - `BCom`
  - `BCA`
  - `BBA`
  - `BVoc`
- 220 seeded applications.
- Multiple application statuses, document statuses, caste categories, genders, payment states, board scores, and preference combinations.

Seeded records are used to initialize `hp-mis:applications:v2` when browser storage does not already contain application data.

### Session And Permissions

The app defines two roles:

- `state_admin`
- `college_admin`

State Admin users can access:

- `/`
- `/applications`
- `/applications/[applicationId]`
- `/merit`
- `/allocation`
- `/reports`

College Admin users can access:

- `/college`
- `/college/seats`
- `/applications`
- `/applications/[applicationId]`

Role controls are client-side only. They are useful for prototyping workflows but are not production-grade authorization.

### Application Review State

Applications include a top-level status and document-level review states. The current type definitions include statuses such as:

- `submitted`
- `under_review`
- `discrepancy_raised`
- `verified`
- `rejected`
- `conditional`
- `merit_listed`
- `allocated`
- `waitlisted`

Document review state influences application state:

- If a document is marked `concern`, the application becomes `discrepancy_raised` unless another terminal state applies.
- If every document is verified, the application becomes `verified`.
- If a document is rejected, the application becomes `rejected`.
- Concern and rejection actions require a note.
- Each review action appends a history entry.

### Merit Logic

Merit generation is implemented in `src/lib/lifecycle.ts`.

The current candidate pool includes applications with these statuses:

- `verified`
- `conditional`

Ranking is deterministic:

1. Higher board score first.
2. Earlier date of birth first.
3. Category priority.
4. Application number alphabetical order.

Publishing merit creates or replaces a course-level merit overlay and increments the version for that course.

### Allocation Logic

Allocation is also implemented in `src/lib/lifecycle.ts`.

The current allocation workflow:

- Reads published merit for a course.
- Allocates candidates to their first preference for that course.
- Uses available seats from seeded college/course/category seat data.
- Marks candidates as allocated when a seat is available.
- Marks remaining eligible candidates as waitlisted.
- Stores allocation overlays by course.

Inferred: this is a simplified prototype of a real allocation process. It does not currently implement full preference sliding, reservation roster rotation, fee-locking, withdrawal, upgrade rounds, or server-side seat locking.

### Reports Logic

Reports combine seeded dashboard fixtures with derived summaries from the application register. Reports are rendered in the browser and do not currently call a reporting service.

## Routes

| Route | Access | Purpose | Important File |
| --- | --- | --- | --- |
| `/login` | Public | Mock login | `src/app/login/page.tsx` |
| `/` | State Admin | State dashboard | `src/app/page.tsx` |
| `/applications` | State Admin, College Admin | Application queue | `src/app/applications/page.tsx` |
| `/applications/[applicationId]` | State Admin, College Admin | Application detail and scrutiny | `src/app/applications/[applicationId]/page.tsx` |
| `/college` | College Admin | College dashboard | `src/app/college/page.tsx` |
| `/college/seats` | College Admin | Seat matrix validation | `src/app/college/seats/page.tsx` |
| `/merit` | State Admin | Merit publication | `src/app/merit/page.tsx` |
| `/allocation` | State Admin | Allocation workflow | `src/app/allocation/page.tsx` |
| `/reports` | State Admin | Reports and analytics | `src/app/reports/page.tsx` |

## API Documentation

No API routes were found in the current repository.

Not found:

- `src/app/api`
- REST route handlers
- GraphQL schema
- API client module
- server actions that persist to a backend
- generated OpenAPI or Swagger documentation

Inferred current behavior:

- All workflows are local browser workflows.
- Application data is generated from `src/lib/mock-data.ts`.
- State changes persist only to `localStorage`.
- CSV/report exports are simulated or generated client-side.

If a backend is added later, the likely API boundaries are:

- Authentication/session exchange.
- Application register search and detail retrieval.
- Document scrutiny updates.
- Merit publication.
- Seat matrix submission.
- Allocation generation and publication.
- Report export generation.

## Data Model / Database

No database schema, migrations, seed scripts, ORM configuration, or database client were found in this app.

The effective data model is TypeScript types plus browser storage.

### Main Entities

Defined in `src/lib/types.ts`:

| Entity | Purpose |
| --- | --- |
| `Session` | Logged-in mock user, role, college scope, and timestamps |
| `College` | College metadata and affiliation information |
| `Course` | Course code, name, duration, and type |
| `Application` | Applicant profile, academics, preferences, documents, status, and history |
| `DocumentEntry` | Uploaded document metadata, review status, reviewer, and notes |
| `HistoryEntry` | Audit-style timeline event |
| `MeritOverlay` | Published merit state for a course |
| `AllocationOverlay` | Allocation state for a course |
| `SeatMatrix` | Course/category seat capacity for colleges |
| `ReportSnapshot` | Report export metadata shape |

### Browser Storage

Defined in `src/lib/storage.ts`:

| Key | Purpose | Notes |
| --- | --- | --- |
| `hp-mis:portal-session` | Portal session | Written by `SessionProvider` |
| `hp-mis:applications:v2` | Portal application register | Initialized from seeded mock data |
| `hp-mis:merit` | Published merit overlays | Written by lifecycle provider |
| `hp-mis:allocation` | Allocation overlays | Written by lifecycle provider |
| `hp-mis:reports` | Report snapshots | Key exists; active usage was not found |

Important integration constraint:

- The companion `Student-App` also references some `hp-mis:*` storage keys.
- In the current code, `Student-App` stores submitted applications under `hp-mis:applications`, while Portal stores its seeded register under `hp-mis:applications:v2`.
- Both apps reference `hp-mis:allocation`, but their expected data shapes differ. If the two apps are served from the same origin, this key can become an integration conflict.

## Environment Variables

No environment variable usage was found in this app.

| Variable | Purpose | Required | Default | Used In |
| --- | --- | --- | --- | --- |
| Not found in the current repository | N/A | N/A | N/A | N/A |

Checked locations:

- `.env.example`
- `.env.local.example`
- `package.json`
- `next.config.mjs`
- `src/**/*`
- Docker and CI/CD files

No Docker or CI/CD files were found in this app.

## Installation

### Prerequisites

- Node.js compatible with Next.js 15.
- npm.

The repository does not define an `.nvmrc`, `engines` field, Volta config, pnpm workspace, or yarn workspace for this app.

### Setup

```bash
cd Portal
npm install
```

No environment file is required for the current prototype.

### Local Development

```bash
npm run dev
```

The dev server is configured to run on port `3002`.

Open:

```text
http://localhost:3002
```

PowerShell note:

```powershell
npm.cmd run dev
```

## Running The Project

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run dev` | Start local development server | Runs `next dev --port 3002` |
| `npm run build` | Create production build | Verified during README update |
| `npm run start` | Start production server | Runs `next start` |
| `npm run lint` | Run Next lint command | Prompts for ESLint setup because no ESLint config is present |
| `npm run typecheck` | Run TypeScript without emitting files | Verified during README update |

No migration, seed, worker, queue, format, or deployment scripts were found.

## Testing

Automated tests are not configured in the current repository.

Not found:

- test scripts in `package.json`
- Jest/Vitest/Playwright/Cypress configuration
- `*.test.*` or `*.spec.*` files
- coverage configuration

Recommended smoke-test paths for manual QA:

1. Visit `/login`, enter any non-empty password, and sign in.
2. Confirm State Admin dashboard loads at `/`.
3. Open `/applications`, filter/search records, and export CSV.
4. Open an application detail page and review a document.
5. Publish merit from `/merit`.
6. Run allocation from `/allocation`.
7. Switch to College Admin and verify `/college` and `/college/seats`.

## Deployment

No deployment configuration was found in this app.

Not found:

- Dockerfile
- Docker Compose
- GitHub Actions
- Vercel configuration
- Netlify configuration
- Kubernetes manifests
- cloud deployment scripts

Generic Next.js deployment flow:

```bash
npm install
npm run build
npm run start
```

Deployment constraints:

- This app currently depends on browser `localStorage`; data will not be shared across users, devices, browsers, or origins.
- The mock login is not secure for production.
- There is no backend persistence, server-side authorization, or audit log service.
- If deployed with the companion `Student-App`, storage keys and expected data shapes should be reconciled before using a shared origin.

## Security / Permissions

Current security behavior:

- Authentication is simulated.
- Any non-empty password is accepted.
- Role checks are implemented client-side.
- College scoping is implemented client-side.
- Application actions are local browser state changes.
- Document scrutiny notes are validated in the UI for concern/rejection decisions.

Not found:

- server-side authentication
- password hashing
- session cookies
- JWT handling
- CSRF protection
- API authorization middleware
- rate limiting
- server-side input validation
- encrypted persistence
- production audit log service

Production readiness note:

The current Portal should be treated as a frontend prototype. Real deployment would require backend identity, durable persistence, server-side authorization, tamper-resistant audit logging, and API-level validation.

## Error Handling & Logging

Current error and feedback behavior:

- Toast notifications are available through `ToastProvider`.
- Role-restricted pages render guarded fallback states.
- Unknown routes render a custom 404 page.
- Storage helpers guard against unavailable browser storage and malformed persisted JSON.
- Application review actions validate required notes for concern/rejection decisions.
- Empty states are shown for filtered tables and missing records.

Not found:

- remote logging
- structured server logs
- monitoring or tracing
- retry queues
- error reporting integrations
- centralized exception boundary

## Known Constraints

- The Portal is frontend-only in the current repository.
- Authentication and authorization are mock client-side behaviors.
- Data persistence is limited to browser storage.
- Seeded applications are generated inside `src/lib/mock-data.ts`, not loaded from a backend.
- Portal application data is not automatically synchronized with `Student-App` submissions.
- `Student-App` and Portal use different application storage keys.
- `Student-App` and Portal both reference `hp-mis:allocation` but with different expected shapes.
- CSV/report export flows are client-side prototype actions.
- Seat matrix validation highlights mismatches but does not submit them to a backend.
- Allocation is simplified and does not implement full admissions counseling rules.
- ESLint is not configured even though `npm run lint` exists.
- No automated tests are configured.
- No deployment pipeline is configured.

## Future Improvements

- Add real authentication through a server-backed identity provider.
- Replace mock `localStorage` persistence with API-backed data access.
- Align storage/data contracts between Portal and `Student-App`.
- Add durable audit logging for scrutiny, merit, allocation, and role changes.
- Implement server-side role and college-scope authorization.
- Expand allocation logic to support multi-preference rounds, reservation rules, upgrades, withdrawals, and fee confirmation.
- Add API documentation once backend endpoints exist.
- Add unit tests for `src/lib/lifecycle.ts`, `src/lib/scoping.ts`, and storage helpers.
- Add integration or E2E tests for login, scrutiny, merit, allocation, and seat validation flows.
- Configure ESLint explicitly so `npm run lint` runs non-interactively.
- Add environment-specific deployment documentation.

## Contribution Guidelines

No dedicated contribution guide was found in this app.

Suggested workflow:

1. Create a focused branch for each change.
2. Run `npm run typecheck` before opening a PR.
3. Run `npm run build` before changes that affect routing, layout, or provider behavior.
4. Keep mock data changes deterministic.
5. Update this README when routes, workflows, commands, storage keys, or data contracts change.
6. Avoid committing generated build artifacts unless the team intentionally tracks them.

When adding production integrations, document:

- new environment variables
- backend endpoints
- authentication assumptions
- deployment steps
- migration or seed commands
- security implications
