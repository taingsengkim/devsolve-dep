# AGENT.MD — DevSolve Frontend UI/UX Refactoring Blueprint

> **IMPORTANT:** Read this entire file before making any changes.
> All agents must strictly follow the file-ownership table in §5 to prevent merge conflicts.
> No agent may touch a file listed in another agent's ownership block without explicit coordination noted here.

---

## §1 — Extracted Design System (from reference image + design.md)

### 1.1 Color Palette

| Token                | Light Mode                          | Dark Mode                           | Usage                               |
|----------------------|-------------------------------------|-------------------------------------|-------------------------------------|
| `--background`       | `oklch(1 0 0)` (#FFFFFF)            | `oklch(0.145 0 0)` (~#1A1A1A)       | Page canvas                         |
| `--foreground`       | `oklch(0.145 0 0)` (#0F172A)        | `oklch(0.985 0 0)` (#FAFAFA)        | Primary text                        |
| `--card`             | `#FFFFFF`                           | `oklch(0.205 0 0)` (~#282828)       | Card/surface background             |
| `--muted`            | `oklch(0.97 0 0)` (~#F5F5F5)        | `oklch(0.269 0 0)` (~#363636)       | Muted backgrounds, skeleton         |
| `--muted-foreground` | `oklch(0.556 0 0)` (~#737373)       | `oklch(0.708 0 0)` (~#A3A3A3)       | Placeholder/secondary text          |
| `--primary`          | `#2563EB` (Blue-600)                | `oklch(0.922 0 0)` (~#E5E5E5)       | Primary CTAs, active states         |
| `--border`           | `oklch(0.922 0 0)` (~#EBEBEB)       | `oklch(1 0 0 / 10%)`                | Dividers, input borders             |
| Accent Blue          | `#2563EB`                           | `#60A5FA`                           | Interactive highlights, tabs        |
| Accent Emerald       | `#10B981`                           | `#34D399`                           | Success badges, status indicators   |
| Amber / Draft badge  | `#F59E0B` (amber-500)               | amber-400                           | Draft status badge                  |
| Destructive          | `oklch(0.577 0.245 27.325)`         | `oklch(0.704 0.191 22.216)`         | Error, delete actions               |
| Sidebar bg           | `oklch(0.985 0 0)` (~#F9F9F9)       | `oklch(0.205 0 0)`                  | Sidebar panel background            |

**Reference image dark-mode card observations:**
- Near-black card backgrounds: `#1C1C1C` / `#212121` range
- High-contrast white text on dark surfaces
- Blue pill badges on cards: `bg-blue-600 text-white`
- Amber "Draft" pill: `bg-amber-500/15 text-amber-400`
- Card border: `ring-1 ring-white/10` in dark, `ring-black/5` in light
- No gradients on cards — flat backgrounds only

### 1.2 Typography System

| Level           | Size             | Weight | Tracking    | Line-height | Usage                           |
|-----------------|------------------|--------|-------------|-------------|---------------------------------|
| Display H1      | 32px (2rem)      | 600    | -0.03em     | 1.2         | Page titles                     |
| H2 / Section    | 28px (1.75rem)   | 600    | -0.03em     | 1.25        | Section/card headings           |
| H3 / Card title | 17px             | 700    | normal      | 1.3         | Draft card titles               |
| Body            | 14px (0.875rem)  | 400    | normal      | 1.6         | Descriptions, muted text        |
| Small Label     | 12px (0.75rem)   | 500    | 0.08–0.12em | 1.4         | "IN-SCOPE ASSETS", "Status"     |
| Badge/Pill      | 11–12px          | 600    | normal      | —           | Tab counts, status badges       |
| Nav items       | 14px (0.875rem)  | 500    | normal      | —           | Sidebar navigation              |

Font family: **Inter** (already configured in `globals.css`)

### 1.3 Spacing Scale

Base unit: `0.5rem` (8px). Key tokens from reference image:
- Page content: `p-6 md:p-8`
- Card internal padding: `p-5 sm:p-6`
- Between cards: `gap-5`
- Between sections: `space-y-5 md:space-y-6`

### 1.4 Border Radius

| Name  | Value   | Tailwind           | Usage                         |
|-------|---------|--------------------|-------------------------------|
| sm    | 6px     | `rounded`          | Tags, small chips             |
| md    | 10px    | `rounded-xl`       | Buttons, inputs               |
| lg    | 16px    | `rounded-2xl`      | Cards, modals, panels         |
| xl    | 20–24px | `rounded-[24px]`   | Featured header cards         |
| pill  | 9999px  | `rounded-full`     | Badge pills, toggle tabs      |

### 1.5 Elevation / Shadow Tokens

```
ring-1 ring-foreground/5 dark:ring-foreground/10    -> default card border (shadow-as-border)
shadow-[0_1px_4px_rgba(15,23,42,0.04)]              -> subtle card lift
shadow-[0_10px_24px_rgba(15,23,42,0.05)]            -> elevated panel
shadow-[0_10px_24px_rgba(37,99,235,0.18)]           -> active tab blue glow
```

### 1.6 Animation Standards

```tsx
// Page entrance — every dashboard page
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}

// Staggered list items
transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}

// Hover: hover:-translate-y-1 + shadow upgrade, 200ms ease-out
// Press:  active:scale-95
```

### 1.7 Layout Breakpoints

| Breakpoint | Prefix | Width   | Behavior                                      |
|------------|--------|---------|-----------------------------------------------|
| Mobile     | (none) | <640px  | Single column, stacked layout                 |
| Small      | `sm:`  | 640px+  | 2-column grids start                          |
| Medium     | `md:`  | 768px+  | Expanded padding p-8                          |
| Large      | `lg:`  | 1024px  | Sidebar persistent, 3-col grids               |
| XL         | `xl:`  | 1280px  | Max width, horizontal search bar              |

---

## §2 — Codebase Analysis: Current Issues

### 2.1 Global / Theme Issues
- `SavedDraftOverview.tsx` uses hardcoded hex colors (`#0F172A`, `#64748B`, `#2563EB`). Must migrate to Tailwind semantic tokens.
- Same file uses `border-slate-200`, `bg-slate-50/70`, `bg-white` — breaks in dark mode.
- Tailwind v4 lint warnings about paired `ring-foreground/5 dark:ring-foreground/10` classes are cosmetic and acceptable.

### 2.2 Saved Draft Page — Status
- `SavedDraftCard.tsx` — **ALREADY FIXED**: duplicate title removed, `h-full flex flex-col justify-between` enforced, `min-h-10` for description.
- `SavedDraftGrid.tsx` — **ALREADY FIXED**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch`.
- Remaining: Polish pass on dark mode badges and hover states (A10).

### 2.3 Dashboard Layout
- `dashboard/layout.tsx`: Uses `bg-slate-50/60 dark:bg-neutral-950` instead of `bg-background`.

### 2.4 Admin / Program Management
- `ProgramFiltersBar.tsx`: Large volume of lint warnings from hardcoded paired light/dark classes.
- `program-management/[id]/page.tsx`: Hardcoded `bg-white dark:bg-slate-900` pairs.

### 2.5 Responsive Gaps
- Most pages implement responsive grids but need audit at `sm` breakpoint.
- Tables need `overflow-x-auto` wrappers for mobile scrolling.

---

## §3 — Phase 2: Standardization Strategy

### 3.1 Design Token Rule (MANDATORY)
- **DO**: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`
- **DO NOT**: `bg-white`, `text-slate-700`, `#0F172A`, `border-slate-200`

Exception: Explicit blue accent (`text-blue-600 dark:text-blue-400`), amber, emerald, red status palette are allowed as explicit color scales since they lack semantic token mappings.

### 3.2 Component Class Standards

```
Cards:         rounded-2xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10 p-5 sm:p-6
Primary btn:   bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200
Ghost btn:     bg-card border border-border text-muted-foreground rounded-xl hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600
Inputs:        rounded-xl border border-transparent bg-muted/50 focus-visible:border-blue-500 focus-visible:ring-blue-500/20
Badges:        rounded-full text-xs font-semibold px-2.5 py-0.5
Nav items:     rounded-xl text-sm font-medium
Page header:   flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border
```

### 3.3 Responsive Rules

| Context        | Grid                                         | Rule                                        |
|----------------|----------------------------------------------|---------------------------------------------|
| Draft cards    | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`  | Equal height via `h-full` propagation       |
| Stat cards     | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`  | Even columns at lg                          |
| Sidebar        | Mobile drawer → fixed at `lg:`               | Never overflow                              |
| Top header     | `hidden lg:flex`                             | Mobile uses Sidebar header controls         |
| Forms          | Single column mobile, two-column at `md:`    | Labels always above inputs                  |

---

## §4 — Agent Task Assignments

> Each agent owns specific files. No agent may touch files owned by another agent.

---

### GROUP 1: Foundation (A1–A3)

#### A1 — CSS Variables & Global Theme
**Files:** `src/app/globals.css`

Tasks:
1. Verify all CSS custom properties for both light and dark modes.
2. Add any missing semantic tokens.
3. Ensure dark `--background` = `oklch(0.145 0 0)`.
4. Validate `@theme inline` block maps tokens to Tailwind classes.

Done when: CSS variables resolve correctly. Dark mode flips all semantic tokens.

---

#### A2 — shadcn/ui Primitive Standardization
**Files:** `src/components/ui/button.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `textarea.tsx`

Tasks:
1. `button`: `text-sm font-medium`, `rounded-xl` variants.
2. `badge`: `text-xs font-semibold rounded-full`.
3. `input`: `rounded-xl border-border bg-muted/40 focus-visible:border-blue-500 focus-visible:ring-blue-500/20`.
4. `card`: `rounded-2xl bg-card text-card-foreground`.
5. Zero hardcoded hex values.

Done when: All base primitives use semantic tokens with no visual regressions.

---

#### A3 — Page Entrance Motion & Animation Tokens
**Files:** `src/components/ui/page-enter-motion.ts`, `src/components/motion/theme-toggle.tsx`

Tasks:
1. Verify `pageEnterContainer`/`pageEnterItem` match: `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}`.
2. Stagger delay: `index * 0.04`.
3. Theme toggle: `size-10 rounded-full border-border bg-card`.

Done when: All page transitions are smooth. No layout shifts.

---

### GROUP 2: Shell Layout (A4–A8)

#### A4 — Dashboard Shell Layout
**Files:** `src/app/(private)/dashboard/layout.tsx`

Tasks:
1. Change container: `bg-background` (remove `bg-slate-50/60 dark:bg-neutral-950`).
2. Header: `h-16 border-b border-border bg-card/80 backdrop-blur-md`.
3. Main: `p-6 md:p-8 overflow-y-auto`.

Done when: Shell renders correctly mobile (stacked) and desktop (sidebar + main).

---

#### A5 — Sidebar Responsiveness & Avatar Polish
**Files:** `src/components/Sidebar.tsx`

Tasks:
1. Verify mobile drawer with `<AnimatePresence>` + spring slide-in from left.
2. Avatar: `rounded-full` with no rectangular border.
3. Active nav item: `bg-blue-50/60 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl`.
4. Collapsed state shows tooltips on hover.
5. Footer (user info + sign out) does not overflow.
6. **Styling and layout only — no logic changes.**

Done when: Sidebar renders correctly on all breakpoints. Avatar is round.

---

#### A6 — Navbar (Public) Responsiveness
**Files:** `src/components/Navbar.tsx`

Tasks:
1. Audit mobile hamburger — ensure no overflow.
2. Verify logo sizing and padding.
3. Sticky: `z-100 backdrop-blur`.
4. Does not render inside dashboard.

Done when: Public navbar responsive at all breakpoints.

---

#### A7 — Footer Responsiveness
**Files:** `src/components/Footer.tsx`

Tasks:
1. Mobile: stack columns vertically.
2. Replace hardcoded colors with semantic tokens.

Done when: Footer responsive at all breakpoints with proper dark mode.

---

#### A8 — Notifications & Top Bar Controls
**Files:** `src/components/notifications/` (all)

Tasks:
1. Bell icon: `rounded-xl` button with correct sizing.
2. Notification count: `rounded-full text-xs font-semibold`.
3. No logic changes.

Done when: Notification trigger renders correctly in dashboard header.

---

### GROUP 3: Saved Draft Page (A9–A11)

#### A9 — SavedDraftPage & SavedDraftHeader
**Files:** `src/components/saved-draft/SavedDraftPage.tsx`, `SavedDraftHeader.tsx`

Tasks:
1. `SavedDraftPage.tsx`: `motion.section` with `pageEnterContainer` variants.
2. Header: `flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between`.
3. Stat card: `bg-card ring-1 ring-foreground/5 dark:ring-foreground/10`.
4. Page title: `text-[32px] font-semibold tracking-[-0.03em] text-foreground`.
5. Subtitle: `text-sm sm:text-base text-muted-foreground max-w-3xl`.

Done when: Header matches reference image at all breakpoints.

---

#### A10 — SavedDraftCard & SavedDraftGrid (Polish Pass)
**Files:** `src/components/saved-draft/SavedDraftCard.tsx`, `SavedDraftGrid.tsx`

Tasks:
1. Verify `h-full flex flex-col justify-between` (already done).
2. Confirm duplicate title is removed (already done).
3. Description: `min-h-10 line-clamp-2`.
4. In-Scope Assets: `min-h-7.5`.
5. Amber badge dark mode: `bg-amber-500/15 text-amber-400`.
6. "Continue" hover: `group-hover:bg-primary group-hover:text-primary-foreground`.
7. Delete dialog: `max-w-md rounded-2xl bg-card ring-1 ring-foreground/5`.
8. Outer card hover: `hover:-translate-y-1 hover:ring-blue-500/40 hover:shadow-xl`.

Done when: Equal-height cards in grid. Dark mode matches reference image exactly.

---

#### A11 — SavedDraftTabs, Search, EmptyState, Pagination
**Files:** `SavedDraftTabs.tsx`, `SavedDraftSearch.tsx`, `SavedDraftEmptyState.tsx`, `SavedDraftPagination.tsx`

Tasks:
1. **Tabs** — Active: `bg-[#2563EB] text-white` (blue filled pill per reference).
2. **Tabs** — Inactive: `bg-card text-muted-foreground` with blue hover tint.
3. **Search** — Input: `h-11 rounded-xl`.
4. **Search** — Sort select: `SelectTrigger` has no unwanted border.
5. **EmptyState** — Container: `bg-card rounded-2xl ring-1 ring-foreground/5`.
6. **Pagination** — Buttons: `rounded-xl border-border`.

Done when: Filter/search controls responsive, accessible, match reference image styling.

---

### GROUP 4: Dashboard Home & Admin (A12–A15)

#### A12 — Dashboard Home Page
**Files:** `src/app/(private)/dashboard/page.tsx`, `src/components/dashboard/*`

Tasks:
1. `DashboardSkeleton`: `animate-pulse` with `bg-muted` (not `bg-slate-200/60`).
2. Stat cards grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
3. Page entrance animation: matches §1.6 spec.
4. Page header: standard pattern with breadcrumb + h1 + subtitle.
5. Stat values: `text-2xl sm:text-3xl font-bold text-foreground`.

Done when: Dashboard home renders with semantic tokens, responsive layout, correct skeleton.

---

#### A13 — Program Management Page
**Files:** `src/app/(private)/dashboard/program-management/**`, `src/components/admin/programs/*`

Tasks:
1. Replace `bg-white dark:bg-slate-900` → `bg-card`.
2. Replace `border-slate-200 dark:border-slate-800` → `border-border`.
3. Fix `ProgramFiltersBar.tsx` to use semantic tokens — resolves lint warnings.
4. Tables: `overflow-x-auto` wrapper for mobile horizontal scroll.

Done when: Program management pages use only semantic tokens. Lint warnings resolved.

---

#### A14 — Admin Overview & Report Management
**Files:** `src/components/admin/AdminDashboardOverview.tsx`, `ModerationHistoryTable.tsx`, `src/app/(private)/dashboard/report-management/**`, `src/app/(private)/dashboard/content-moderation/**`

Tasks:
1. Audit all files: replace hardcoded colors with semantic tokens.
2. Table headers: `text-xs font-semibold text-muted-foreground uppercase tracking-wider`.
3. Table rows: `hover:bg-muted/50 transition-colors`.
4. Status badges: `rounded-full text-xs font-semibold px-2.5 py-0.5`.

Done when: All admin and report pages use semantic tokens and are responsive.

---

#### A15 — Profile, Organizations, Teams
**Files:** `src/app/(private)/dashboard/profile/**`, `organizations/**`, `team-management/**`, `src/components/organizations/*`, `src/components/profile/*`

Tasks:
1. Audit all pages for hardcoded colors. Migrate to semantic tokens.
2. User avatars: `rounded-full`. Org logos: `rounded-xl`.
3. Forms: `label above input, border-border bg-muted/40, rounded-xl, focus:ring-blue-500/20`.
4. Page headers: breadcrumb + h1 title + subtitle standard pattern.

Done when: All profile/org/team pages use semantic tokens, correct avatars, standard forms.

---

### GROUP 5: Consistency & QA (A16–A20)

#### A16 — Remaining Dashboard Pages Audit
**Files:** `src/app/(private)/dashboard/bookmarks/**`, `discussions/**`, `notifications/**`, `programs/**`, `leaderboard/**`, `my-community/**`, `my-reports/**`, `submit-report/**`, `showcases/**`, `rewards/**`

Tasks: For each page: standard header pattern, semantic tokens, `motion.div` entrance animation, responsive grids.

Done when: All pages use standard header, semantic tokens, entrance animation.

---

#### A17 — Public Pages Audit
**Files:** `src/app/(public)/**`, `src/components/landing/*`, `public-programs/*`, `public-about/*`

Tasks: Verify typography, no broken images, responsive at all breakpoints. No structural/content changes.

Done when: All public pages render correctly on mobile, tablet, and desktop.

---

#### A18 — Auth Pages Audit
**Files:** `src/app/(auth)/**`, `src/components/auth/*`

Tasks: `bg-background` canvas; form inputs `rounded-xl border-border bg-card focus:ring-blue-500/20`; error messages `text-destructive text-sm`; centered card layout on mobile.

Done when: Auth pages responsive with semantic tokens.

---

#### A19 — Shared Components Final Pass
**Files:** `src/components/shared/*`, `src/components/ui/StatsCards.tsx`, `field.tsx`, `table.tsx`, `tabs.tsx`, `select.tsx`, `dialog.tsx`, `alert-dialog.tsx`

Tasks:
1. Audit all shared primitives for semantic token usage.
2. `table.tsx`: correct thead/tbody/td styling.
3. `dialog.tsx`: `rounded-2xl bg-card ring-1 ring-foreground/5`.
4. `select.tsx`: correct border-radius and token colors for trigger and content.

Done when: All shared UI primitives are token-compliant and visually consistent.

---

#### A20 — TypeScript Build Verification & Final QA
**Files:** Read-only access to all files.

Tasks:
1. Run `npx tsc --noEmit`. Report type errors.
2. Verify no runtime errors on: `/dashboard`, `/dashboard/saved-draft`, `/dashboard/program-management`, `/dashboard/profile`.
3. Verify responsive at: 375px, 640px, 768px, 1024px, 1280px.
4. Verify dark mode toggle.
5. Produce final QA report.

Done when: `npx tsc --noEmit` passes with 0 errors. All routes render correctly. Dark mode and responsive verified.

---

## §5 — File Ownership Map (Conflict Prevention)

> **Critical rule**: Each file belongs to exactly ONE agent. Verify ownership before editing.

| File / Directory                                      | Owner |
|-------------------------------------------------------|-------|
| `src/app/globals.css`                                 | A1    |
| `src/components/ui/button.tsx`                        | A2    |
| `src/components/ui/badge.tsx`                         | A2    |
| `src/components/ui/input.tsx`                         | A2    |
| `src/components/ui/label.tsx`                         | A2    |
| `src/components/ui/card.tsx`                          | A2    |
| `src/components/ui/textarea.tsx`                      | A2    |
| `src/components/ui/page-enter-motion.ts`              | A3    |
| `src/components/motion/theme-toggle.tsx`              | A3    |
| `src/app/(private)/dashboard/layout.tsx`              | A4    |
| `src/components/Sidebar.tsx`                          | A5    |
| `src/components/Navbar.tsx`                           | A6    |
| `src/components/Footer.tsx`                           | A7    |
| `src/components/notifications/*`                      | A8    |
| `src/components/saved-draft/SavedDraftPage.tsx`       | A9    |
| `src/components/saved-draft/SavedDraftHeader.tsx`     | A9    |
| `src/components/saved-draft/SavedDraftCard.tsx`       | A10   |
| `src/components/saved-draft/SavedDraftGrid.tsx`       | A10   |
| `src/components/saved-draft/SavedDraftTabs.tsx`       | A11   |
| `src/components/saved-draft/SavedDraftSearch.tsx`     | A11   |
| `src/components/saved-draft/SavedDraftEmptyState.tsx` | A11   |
| `src/components/saved-draft/SavedDraftPagination.tsx` | A11   |
| `src/app/(private)/dashboard/page.tsx`                | A12   |
| `src/components/dashboard/*`                          | A12   |
| `src/app/(private)/dashboard/program-management/**`   | A13   |
| `src/components/admin/programs/*`                     | A13   |
| `src/components/admin/AdminDashboardOverview.tsx`     | A14   |
| `src/components/admin/ModerationHistoryTable.tsx`     | A14   |
| `src/app/(private)/dashboard/report-management/**`    | A14   |
| `src/app/(private)/dashboard/content-moderation/**`   | A14   |
| `src/app/(private)/dashboard/profile/**`              | A15   |
| `src/app/(private)/dashboard/organizations/**`        | A15   |
| `src/app/(private)/dashboard/team-management/**`      | A15   |
| `src/components/organizations/*`                      | A15   |
| `src/components/profile/*`                            | A15   |
| `src/app/(private)/dashboard/bookmarks/**`            | A16   |
| `src/app/(private)/dashboard/discussions/**`          | A16   |
| `src/app/(private)/dashboard/notifications/**`        | A16   |
| `src/app/(private)/dashboard/programs/**`             | A16   |
| `src/app/(private)/dashboard/leaderboard/**`          | A16   |
| `src/app/(private)/dashboard/my-community/**`         | A16   |
| `src/app/(private)/dashboard/my-reports/**`           | A16   |
| `src/app/(private)/dashboard/submit-report/**`        | A16   |
| `src/app/(private)/dashboard/showcases/**`            | A16   |
| `src/app/(private)/dashboard/rewards/**`              | A16   |
| `src/app/(public)/**`                                 | A17   |
| `src/components/landing/*`                            | A17   |
| `src/app/(auth)/**`                                   | A18   |
| `src/components/auth/*`                               | A18   |
| `src/components/shared/*`                             | A19   |
| `src/components/ui/table.tsx`                         | A19   |
| `src/components/ui/tabs.tsx`                          | A19   |
| `src/components/ui/select.tsx`                        | A19   |
| `src/components/ui/dialog.tsx`                        | A19   |
| `src/components/ui/alert-dialog.tsx`                  | A19   |
| `src/components/ui/field.tsx`                         | A19   |
| `src/components/ui/StatsCards.tsx`                    | A19   |

---

## §6 — Step-by-Step Execution Plan

**Round 1 — Foundation** (run A1, A2, A3 in parallel)
Establishes the token foundation. All subsequent rounds depend on these.

**Round 2 — Shell** (run A4, A5, A6, A7, A8 in parallel after Round 1 is verified)
Establishes the layout shell. Pages render inside this shell.

**Round 3 — Pages** (run A9–A18 in parallel after Round 2)
Individual page/component groups with no cross-dependencies.
**A9–A11 (Saved Draft) are highest priority** — they match the reference image.

**Round 4 — Shared Components** (run A19 after Round 3)
Touched last to avoid conflicts with page-level agent changes.

**Round 5 — QA & Verification** (run A20 after all others complete)
Final type check and visual regression verification.

---

## §7 — Definition of Done

Complete when ALL of the following are true:

1. `npx tsc --noEmit` exits with **0 errors**.
2. `npm run build` completes without errors.
3. **Zero hardcoded hex colors** in any component file (except `#2563EB` primary blue, `#10B981` emerald, `#F59E0B` amber status colors).
4. **Dark mode** works correctly on every page — no white boxes, invisible text, or broken borders.
5. **Responsive** verified at 375px, 640px, 768px, 1024px, 1280px with no horizontal overflow.
6. **Card uniformity** — equal-height cards in every grid row.
7. **Animations** — page entrance fires on every dashboard page. No layout shifts.
8. **Reference match** — `/dashboard/saved-draft` visually matches the reference image in light and dark modes.
9. **No regressions** — auth flow, data fetching, CRUD operations all work correctly.

---

## §8 — Notes & Constraints

- **Do NOT modify** `src/proxy.ts`, `src/lib/auth/*`, or any RTK Query API slice files.
- **Do NOT modify** `package.json` or Tailwind configuration.
- **Do NOT use** `@apply` in component files — use Tailwind utility classes directly.
- **Do NOT add** `bg-white` or `bg-black` — always use `bg-card`, `bg-background`, `bg-muted`.
- Use **shadcn/ui** components for all dropdowns (Select), dialogs, and tabs per project rules.
- Import motion as: `import { motion } from "motion/react"` (v12).
- All new pages under `/dashboard/*` MUST use the standard entrance animation.
- `SavedDraftCard.tsx` and `SavedDraftGrid.tsx` are already fixed. A10's job is a polish/verification pass only.
