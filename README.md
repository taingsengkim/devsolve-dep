# DevSolve Frontend

Production Deployment URL: https://devsolve.app/

-----

## Quick Navigation Links

-----

### Public & Community Pages

- Landing Page: https://devsolve.app/ [Mock Data]
- Hacktivity Feed: https://devsolve.app/hacktivity [Mock Data]
- Leaderboard: https://devsolve.app/leaderboard [Mock Data]
- Discussions Hub: https://devsolve.app/discussions [Mock Data]
- Create Discussion: https://devsolve.app/discussions/create [Mock Data]
- Submit Problem: https://devsolve.app/discussions/create/problem [Mock Data]
- Showcase Index: https://devsolve.app/showcases [Real API]
- Showcase Detail: https://devsolve.app/showcases/[id] [Real API]
- Submit Showcase: https://devsolve.app/community/create/showcase [Real API]

-----

### Authentication & Onboarding

- Account Type Selection: https://devsolve.app/account-type [Real API]
- User Registration: https://devsolve.app/register/user [Real API]
- Company Registration: https://devsolve.app/register/company [Real API]

-----

### User & Researcher Dashboard

- Dashboard Overview: https://devsolve.app/dashboard [Mock Data]
- Bounty Programs: https://devsolve.app/dashboard/programs [Real API]
- Program Details: https://devsolve.app/dashboard/programs/[id] [Real API]
- Submit Vulnerability Report: https://devsolve.app/dashboard/submit-report?program-id=[id] [Real API]
- My Reports: https://devsolve.app/dashboard/my-reports [Real API]
- My Bookmarks: https://devsolve.app/dashboard/bookmarks [Real API]
- Notifications: https://devsolve.app/dashboard/notifications [Mock Data]
- Profile View: https://devsolve.app/dashboard/profile/[username] [Real API]
- Account Settings: https://devsolve.app/dashboard/profile/settings [Real API]

-----

### Admin & Moderation Dashboard

- User Management: https://devsolve.app/dashboard/users [Real API]
- Company Verification: https://devsolve.app/dashboard/company-verification [Real API]
- Content Reports & Moderation: https://devsolve.app/dashboard/content-reports [Real API]
- Report Confirmation: https://devsolve.app/dashboard/report-confirmation [Mock Data]

-----

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router) & React 19
- **Styling**: TailwindCSS v4 & shadcn/ui
- **State & API**: Redux Toolkit & RTK Query
- **Authentication**: better-auth with Keycloak OIDC/PKCE
- **Animations**: motion/react (Motion v12)

-----

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
