<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI & Design System Guidelines

When performing any work related to UI components, layout, styling, theme, animations, or visual design, AI agents MUST:
1. Read and follow the design specifications in [`design.md`](file:///c:/Users/tolsa/Documents/My%20project/devsolve-frontend/design.md).
2. Use the `motion` library (`import { motion } from "motion/react"`) for smooth UI animations, layout transitions, and interactive visual feedback.
3. **Typography & Font Sizes**: Maintain legible, clear typography across all components and pages:
   - Body & Form Inputs: Use `text-base` (16px) or `text-sm` (14px) for optimal readability. Avoid small fonts like `text-xs` (12px) or `text-[11px]` for main form inputs, primary table content, and body paragraphs.
   - Headers & Navigation: Use `text-base` / `text-lg` for navigation items and clear visual hierarchy for section titles (`text-lg`, `text-xl`, `text-2xl`).
   - Form Styling: Ensure input fields use clean white backgrounds (`bg-white`) with clear, defined borders (`border-slate-300`).

# Data Fetching & Mutations

Use **RTK Query** (via `@reduxjs/toolkit`) as the **only** approach for fetching and mutating server data. Specifically:
- Use generated hooks (e.g. `useGetXxxQuery`, `useUpdateXxxMutation`) in components.
- Do **NOT** use raw `fetch`, `axios`, or `useEffect` for server-side data — always go through RTK Query endpoints.
- The Redux store is already configured; add new API slices and wire them into the store's `reducer` and `middleware` accordingly.

# Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 16.2.10 (App Router) |
| UI | shadcn/ui + TailwindCSS v4 |
| Animations | `motion/react` (Motion v12) |
| State / Data | Redux Toolkit + RTK Query |
| Forms | react-hook-form + zod |
| Auth | better-auth + Keycloak (OIDC/PKCE) |
| Icons | lucide-react |
| HTTP (internal) | RTK Query only — no raw fetch/axios |

# Auth Flow

- **Keycloak issuer:** `https://auth.quizzy.it.com/realms/devsolve`
- **Protocol:** OIDC with PKCE (S256) — `Require PKCE` is enabled on the Keycloak client.
- **Library:** `better-auth` with the `genericOAuth` + `keycloak` preset (`src/lib/auth/auth.ts`).
- **Login trigger:** Calling better-auth's `genericOAuth` sign-in redirects the user to the Keycloak login form.
- **Session:** better-auth issues a session cookie after the OAuth callback; the middleware (`src/proxy.ts`) reads this cookie via `getSessionCookie()` to gate private routes.
- **Route protection:**
  - Unauthenticated users hitting `/dashboard/*` → redirected to `/`.
  - Authenticated users hitting `/` directly (not via internal nav) → redirected to `/dashboard`.



***
## If any change in the future please reflex change this instruction.