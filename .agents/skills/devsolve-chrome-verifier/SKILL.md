---
name: devsolve-chrome-verifier
description: Chrome DevTools MCP verification skill for automated browser testing and verification of all DevSolve Admin Platform features, handling authentication, page navigation, visual inspection, and dynamic DB seeder feedback loops.
---

# DevSolve Chrome MCP Feature Verifier

This skill provides step-by-step instructions for using Chrome DevTools MCP tools to test and verify all Admin Platform features end-to-end on `http://localhost:3000`.

## Target Credentials & Authentication Rules

- **Base URL**: `http://localhost:3000`
- **Username**: `devsolve`
- **Password**: `qwer`

> [!IMPORTANT]
> **Authentication Protocol**: If the browser auto-logs in under any user account other than `devsolve`, ALWAYS trigger logout immediately and perform a fresh login using username `devsolve` and password `qwer`.

## Chrome DevTools MCP Tool Usage

Use `call_mcp_tool` with `ServerName: "chrome-devtools-mcp"`:

- `navigate_page`: `{ type: "url", url: "http://localhost:3000/login" }`
- `fill_form` / `fill` / `type_text`: Input username (`devsolve`) and password (`qwer`).
- `click`: Submit login form or click action buttons.
- `take_screenshot`: Capture UI pages for verification.
- `list_console_messages`: Check for console JS errors.

## Verification Checklist across Admin Features

Navigate through all dashboard pages under `/dashboard/*`:

1. **User Administration** (`/dashboard/users`)
2. **Moderation Audit Log** (`/dashboard/moderation-log`)
3. **Content Flag Moderation** (`/dashboard/content-moderation`)
4. **Problem Moderation** (`/dashboard/problem-moderation`)
5. **Program / Bounty Admin** (`/dashboard/admin-program-management`)
6. **Showcase Review Queue** (`/dashboard/showcase-review`)
7. **Solution Review Queue** (`/dashboard/solution-review`)
8. **Category Management** (`/dashboard/categories`)
9. **Company Verification** (`/dashboard/company-verification`)
10. **Report Confirmation & Triage** (`/dashboard/report-confirmation`)
11. **Platform Analytics & Overview** (`/dashboard/analytics`)

## Database Seeding Feedback Loop

If any page displays zero data or an empty state during Chrome DevTools MCP inspection:

1. Request / execute the DB seeder script using `devsolve-db-seeder`:
   ```powershell
   $env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table <table_name> --count 10
   ```
2. Reload the page in Chrome using `navigate_page` (`type: "reload"`).
3. Re-verify page rendering, interactive dialogs, and action buttons until all features pass.
