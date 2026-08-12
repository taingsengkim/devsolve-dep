# DevSolve Frontend

Production URL: https://devsolve-frontend.vercel.app/

---

## Progress Status

### ✅ Ready — Real API Calls Wired

| Feature | Endpoint | URL |
|---------|----------|-----|
| User Registration | `POST /auth/register` | [/register/user](https://devsolve-frontend.vercel.app/register/user) |
| Company Registration | `POST /organizations/register` | [/register/company](https://devsolve-frontend.vercel.app/register/company) |
| Bounty Programs List | `GET /programs` (pagination, search, filters) | [/dashboard/programs](https://devsolve-frontend.vercel.app/dashboard/programs) |
| Program Details | `GET /programs/{id}` | [/dashboard/programs/[id]](https://devsolve-frontend.vercel.app/dashboard/programs/%5Bid%5D) |
| Submit Vulnerability Report | `POST /programs/{programId}/reports` | [/dashboard/submit-report](https://devsolve-frontend.vercel.app/dashboard/submit-report) |
| My Reports List | `GET /reports/mine` | [/dashboard/my-reports](https://devsolve-frontend.vercel.app/dashboard/my-reports) |
| Profile (own user) | `GET /user-profiles/me`, `GET /reports/mine`, `GET /follows/mine`, `GET /follows/USER/{id}/followers` | [/dashboard/profile/[username]](https://devsolve-frontend.vercel.app/dashboard/profile/%5Busername%5D) |
| Account Settings | `PATCH /user-profiles/me` | [/dashboard/profile/settings](https://devsolve-frontend.vercel.app/dashboard/profile/settings) |
| Showcases List | `GET /showcases` | [/showcases](https://devsolve-frontend.vercel.app/showcases) |
| Showcase Detail | `GET /showcases/{id}` | [/showcases/[id]](https://devsolve-frontend.vercel.app/showcases/%5Bid%5D) |
| Submit Showcase | `POST /showcases` | [/community/create/showcase](https://devsolve-frontend.vercel.app/community/create/showcase) |
| Admin — User Management | `GET /admin/users`, `POST /admin/{id}/moderation-actions` | [/dashboard/users](https://devsolve-frontend.vercel.app/dashboard/users) |
| Admin — Company Verification | `GET /admin/organizations`, `PATCH /admin/organizations/{id}/approve\|reject` | [/dashboard/company-verification](https://devsolve-frontend.vercel.app/dashboard/company-verification) |
| Program Management (Company) | `GET /organizations/me/programs`, `POST /organizations/me/programs`, `PUT /organizations/me/programs/{id}`, `PATCH /programs/{id}/publish\|pause\|resume\|close` | [/dashboard/program-management](https://devsolve-frontend.vercel.app/dashboard/program-management) |
| Program Management (Admin) | `GET /admin/programs`, `PATCH /admin/programs/{id}/approve\|reject` | [/dashboard/program-management](https://devsolve-frontend.vercel.app/dashboard/program-management) |

### 🚧 Still on Mock Data — Needs Backend Endpoints

| Feature | URL |
|---------|-----|
| Landing Page | [/](https://devsolve-frontend.vercel.app/) |
| Dashboard Overview (hardcoded stats, charts, feed) | [/dashboard](https://devsolve-frontend.vercel.app/dashboard) |
| Hacktivity Feed | [/hacktivity](https://devsolve-frontend.vercel.app/hacktivity) |
| Leaderboard | [/leaderboard](https://devsolve-frontend.vercel.app/leaderboard) |
| Discussions — all CRUD (list, create, vote, bookmark) | [/discussions](https://devsolve-frontend.vercel.app/discussions) |
| Bookmarks | [/dashboard/bookmarks](https://devsolve-frontend.vercel.app/dashboard/bookmarks) |
| Notifications | [/dashboard/notifications](https://devsolve-frontend.vercel.app/dashboard/notifications) |
| Content Reports & Moderation | [/dashboard/content-reports](https://devsolve-frontend.vercel.app/dashboard/content-reports) |
| Report Confirmation | [/dashboard/report-confirmation](https://devsolve-frontend.vercel.app/dashboard/report-confirmation) |

---

## Quick Navigation Links

---

### Public & Community Pages

- Landing Page: https://devsolve-frontend.vercel.app/ [Mock Data]
- Hacktivity Feed: https://devsolve-frontend.vercel.app/hacktivity [Mock Data]
- Leaderboard: https://devsolve-frontend.vercel.app/leaderboard [Mock Data]
- Discussions Hub: https://devsolve-frontend.vercel.app/discussions [Mock Data]
- Showcase Index: https://devsolve-frontend.vercel.app/showcases [Real API]
- Showcase Detail: https://devsolve-frontend.vercel.app/showcases/[id] [Real API]
- Submit Showcase: https://devsolve-frontend.vercel.app/community/create/showcase [Real API]
- Public Programs: https://devsolve-frontend.vercel.app/programs [Real API]

---

### Authentication & Onboarding

- Account Type Selection: https://devsolve-frontend.vercel.app/account-type [Real API]
- User Registration: https://devsolve-frontend.vercel.app/register/user [Real API — `POST /auth/register`]
- Company Registration: https://devsolve-frontend.vercel.app/register/company [Real API — `POST /organizations/register`]

---

### User & Researcher Dashboard

- Dashboard Overview: https://devsolve-frontend.vercel.app/dashboard [Mock Data]
- Bounty Programs: https://devsolve-frontend.vercel.app/dashboard/programs [Real API — `GET /programs`]
- Program Details: https://devsolve-frontend.vercel.app/dashboard/programs/[id] [Real API — `GET /programs/{id}`]
- Submit Vulnerability Report: https://devsolve-frontend.vercel.app/dashboard/submit-report?program-id=[id] [Real API — `POST /programs/{programId}/reports`]
- My Reports: https://devsolve-frontend.vercel.app/dashboard/my-reports [Real API — `GET /reports/mine`]
- My Bookmarks: https://devsolve-frontend.vercel.app/dashboard/bookmarks [Mock Data]
- Notifications: https://devsolve-frontend.vercel.app/dashboard/notifications [Mock Data]
- Profile View: https://devsolve-frontend.vercel.app/dashboard/profile/[username] [Real API — `/user-profiles/me`, `/follows/*`]
- Account Settings: https://devsolve-frontend.vercel.app/dashboard/profile/settings [Real API — `PATCH /user-profiles/me`]
- Saved Drafts: https://devsolve-frontend.vercel.app/dashboard/saved-draft [Real API]
- My Community: https://devsolve-frontend.vercel.app/dashboard/my-community [Real API]
- Analytics: https://devsolve-frontend.vercel.app/dashboard/analytics [Real API]
- Rewards: https://devsolve-frontend.vercel.app/dashboard/rewards [Real API]

---

### Company Dashboard

- Program Management: https://devsolve-frontend.vercel.app/dashboard/program-management [Real API — `GET/POST/PUT /organizations/me/programs`, `PATCH /programs/{id}/publish|pause|resume|close`]
- Program Detail (Company): https://devsolve-frontend.vercel.app/dashboard/program-management/[id] [Real API]
- Create Program: https://devsolve-frontend.vercel.app/dashboard/create-program [Real API — `POST /organizations/me/programs`]
- Organizations: https://devsolve-frontend.vercel.app/dashboard/organizations [Real API]
- Team Management: https://devsolve-frontend.vercel.app/dashboard/team-management [Real API]
- Report Management: https://devsolve-frontend.vercel.app/dashboard/report-management [Real API]

---

### Admin & Moderation Dashboard

- User Management: https://devsolve-frontend.vercel.app/dashboard/users [Real API — `GET /admin/users`, moderation actions]
- Company Verification: https://devsolve-frontend.vercel.app/dashboard/company-verification [Real API — `GET /admin/organizations`, approve/reject]
- Program Management (Admin): https://devsolve-frontend.vercel.app/dashboard/program-management [Real API — `GET /admin/programs`, approve/reject]
- Content Reports & Moderation: https://devsolve-frontend.vercel.app/dashboard/content-reports [Mock Data]
- Report Confirmation: https://devsolve-frontend.vercel.app/dashboard/report-confirmation [Partial — attempts `/reports/management`, falls back to mock]
- Showcase Review: https://devsolve-frontend.vercel.app/dashboard/showcase-review [Real API]
- Solution Review: https://devsolve-frontend.vercel.app/dashboard/solution-review [Real API]
- Problem Moderation: https://devsolve-frontend.vercel.app/dashboard/problem-moderation [Real API]
- Moderation Log: https://devsolve-frontend.vercel.app/dashboard/moderation-log [Real API]

---

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 16.2.10 (App Router) & React 19 |
| Styling | TailwindCSS v4 & shadcn/ui |
| Animations | motion/react (Motion v12) |
| State & API | Redux Toolkit & RTK Query |
| Authentication | better-auth with Keycloak OIDC/PKCE |
| Icons | lucide-react |
| Forms | react-hook-form + zod |

---

## Auth Flow

- **Keycloak Issuer:** `https://auth.quizzy.it.com/realms/devsolve`
- **Protocol:** OIDC with PKCE (S256)
- **Library:** `better-auth` with `genericOAuth` + Keycloak preset
- **Route Protection:** Unauthenticated → `/` | Authenticated → `/dashboard`

---

## API Proxy Pattern

All API calls route through Next.js server-side proxy routes (`src/app/api/...`) which:
1. Validate payloads with Zod
2. Verify session via `auth.api.getSession()` / `getAccessToken()`
3. Relay server-to-server to `${BACKEND_API_URL}` with `Authorization: Bearer <token>`

---

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Recent Changes (August 2026)

- **`feature/create-program` merged into `develop` → `main`:**
  - Added `PATCH /programs/{id}/pause` and `PATCH /programs/{id}/resume` proxy routes
  - Added `pauseProgram` / `resumeProgram` RTK mutations to `programsApi`
  - Refactored program management detail page (`/dashboard/program-management/[id]`)
  - Updated Navbar routing
- **Profile — Admin View:** New `AdminProfileView` component for admins to view any user's profile with moderation capabilities
- **Date Picker:** Added custom `DatePicker` component (`src/components/ui/date-picker.tsx`)
- **Program Cards & Hero:** Updated `ProgramCard` and `ProgramDetailHero` with new state/action support
- **profileApi:** Extended with additional profile endpoints and follow management
