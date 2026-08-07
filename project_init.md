# DevSolve Frontend — Project Init




> **Next.js 16.2.10 (App Router) · React 19 · TailwindCSS v4 · shadcn/ui · RTK Query · better-auth + Keycloak**

---

## 📁 Directory Map

```
src/
├── app/
│   ├── (auth)/            # Auth pages (login, register…)
│   ├── (private)/
│   │   └── dashboard/     # All private/gated dashboard routes
│   ├── (public)/          # Public-facing pages
│   ├── api/               # API route handlers
│   ├── globals.css        # Global styles (Tailwind v4 imports)
│   └── layout.tsx         # Root layout — Inter font, StoreProvider, Toaster
│
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── shared/            # Shared layout atoms
│   ├── dashboard/         # Dashboard page components
│   ├── programs/          # Bug bounty program components
│   ├── reports/           # Report flow components
│   ├── discussions/       # Discussion components
│   ├── landing/           # Public landing page sections
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
├── lib/
│   ├── auth/
│   │   ├── auth.ts        # better-auth server config (genericOAuth + Keycloak)
│   │   ├── auth-client.ts # Client-side auth helpers
│   │   ├── access-token.ts
│   │   └── token-utils.ts
│   ├── redux/
│   │   ├── store.ts       # configureStore (single baseApi)
│   │   ├── hooks.ts       # useAppDispatch / useAppSelector
│   │   ├── StoreProvider.tsx
│   │   └── services/
│   │       ├── baseApi.ts        # createApi base
│   │       ├── authApi.ts
│   │       ├── reportsApi.ts
│   │       ├── profileApi.ts
│   │       ├── adminApi.ts
│   │       ├── dashboardApi.ts
│   │       ├── discussionsApi.ts
│   │       ├── notificationsApi.ts
│   │       ├── program/          # Program-scoped endpoints
│   │       └── … (9 more slices)
│   ├── hooks/             # Custom React hooks
│   ├── types/             # Global TypeScript types
│   ├── validations/       # Zod schemas
│   ├── constants/
│   ├── ease.ts            # Animation easings
│   └── utils.ts           # cn(), etc.
│
└── proxy.ts               # Next.js middleware (auth gating)
```

---

## 🔑 Key Facts

| Area | Detail |
|------|--------|
| **Framework** | Next.js **16.2.10** — App Router, React 19 |
| **Styling** | TailwindCSS **v4** + shadcn/ui |
| **Animations** | `motion/react` (Motion v12) — use `import { motion } from "motion/react"` |
| **State / Data** | RTK Query via `@reduxjs/toolkit` — **no raw fetch/axios** |
| **Forms** | react-hook-form + zod |
| **Auth** | better-auth + Keycloak OIDC/PKCE (`https://auth.quizzy.it.com/realms/devsolve`) |
| **Icons** | lucide-react |
| **Charts** | recharts |
| **Rich editor** | @uiw/react-md-editor, @monaco-editor/react |

---

## 🎨 Design System (Vercel Geist Minimal)

| Token | Value |
|-------|-------|
| Primary blue | `#2563EB` |
| Dark slate | `#1E293B` |
| Emerald accent | `#10B981` |
| Error / Ship Red | `#ff5b4f` |
| Surface bg | `#fafafa` |
| Font | **Inter** (Google Fonts) |
| Card radius | `rounded-2xl` (16px) |
| Button radius | `rounded-xl` (12px) |
| Shadow style | Shadow-as-border: `box-shadow 0 0 0 1px rgba(0,0,0,0.08)` |

### Animation Standard (dashboard pages)
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="space-y-6 w-full pb-12"
>
```

---

-----

## Production Deployment URL

https://devsolve-frontend.vercel.app/

-----

## Quick Navigation Links

-----

### Public & Community Pages

- Landing Page: https://devsolve-frontend.vercel.app/
- Hacktivity Feed: https://devsolve-frontend.vercel.app/hacktivity
- Leaderboard: https://devsolve-frontend.vercel.app/leaderboard
- Discussions Hub: https://devsolve-frontend.vercel.app/discussions
- Create Discussion: https://devsolve-frontend.vercel.app/discussions/create
- Submit Problem: https://devsolve-frontend.vercel.app/discussions/create/problem
- Submit Showcase: https://devsolve-frontend.vercel.app/discussions/create/showcase

-----

### Authentication & Onboarding

- Account Type Selection: https://devsolve-frontend.vercel.app/account-type
- User Registration: https://devsolve-frontend.vercel.app/register/user
- Company Registration: https://devsolve-frontend.vercel.app/register/company

-----

### User & Researcher Dashboard

- Dashboard Overview: https://devsolve-frontend.vercel.app/dashboard
- Bounty Programs: https://devsolve-frontend.vercel.app/dashboard/programs
- Program Details: https://devsolve-frontend.vercel.app/dashboard/programs/[id]
- Submit Vulnerability Report: https://devsolve-frontend.vercel.app/dashboard/submit-report?program-id=[id]
- My Reports: https://devsolve-frontend.vercel.app/dashboard/my-reports
- My Bookmarks: https://devsolve-frontend.vercel.app/dashboard/bookmarks
- Notifications: https://devsolve-frontend.vercel.app/dashboard/notifications
- Profile View: https://devsolve-frontend.vercel.app/dashboard/profile/[username]
- Account Settings: https://devsolve-frontend.vercel.app/dashboard/profile/settings

-----

### Admin & Moderation Dashboard

- User Management: https://devsolve-frontend.vercel.app/dashboard/users
- Company Verification: https://devsolve-frontend.vercel.app/dashboard/company-verification
- Content Reports & Moderation: https://devsolve-frontend.vercel.app/dashboard/content-reports
- Report Confirmation: https://devsolve-frontend.vercel.app/dashboard/report-confirmation

-----

## ⚙️ Critical Rules (from AGENTS.md)

1. **No raw `<select>`** — always use shadcn `Select` component
2. **No raw `fetch`/`axios`** — always use RTK Query hooks
3. **All `/dashboard/*` pages** must use the standard motion wrapper + page header pattern
4. **Animations** via `motion/react` only (`import { motion } from "motion/react"`)
5. **Dropdowns** use shadcn/ui `Select` everywhere
6. **Loading states** → skeleton pulse containers, not spinners

---

## 🔐 Auth Flow & API Proxy Pattern Summary

```
User → "/" → (unauthenticated) → landing page
             (authenticated, direct visit) → /dashboard

User → "/dashboard/*" → middleware checks better-auth session cookie
                        → unauthenticated → redirect "/"
```

- Keycloak PKCE flow via `better-auth` `genericOAuth`
- Session cookie read in `src/proxy.ts` via `getSessionCookie()`
- **Mandatory Pattern for ALL Code & Endpoints**:
  - UI components call RTK Query hooks exclusively (`src/lib/redux/services/*`).
  - `baseApi` automatically retrieves Keycloak Bearer token via `getAccessToken()` (`src/lib/auth/access-token.ts`) from `better-auth` session.
  - Next.js server-side API proxy routes (`src/app/api/...`) validate Zod schemas, check session authentication via `auth.api.getSession()`, and relay requests server-to-server to `${BACKEND_API_URL}` with `Authorization: Bearer <token>`.
  - Direct browser calls to `${BACKEND_API_URL}` or raw `fetch`/`axios` inside components are strictly prohibited.

---

## 🧩 RTK Query Pattern

```ts
// services/baseApi.ts → createApi
// All domain APIs inject endpoints into baseApi

// In components:
const { data, isLoading } = useGetProgramsQuery({ page: 1 });
const [submitReport] = useSubmitReportMutation();
```
