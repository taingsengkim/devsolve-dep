---
version: "alpha"
name: "Vercel Geist Minimal"
description: "Vercel-inspired minimal landing page. Ideal for infraestrutura developer, plataformas de deploy, ferramentas frontend, ci/cd. AI-ready template."
colors:
  primary: "#2563EB"
  secondary: "#1E293B"
  tertiary: "#ebebeb"
  neutral: "#fafafa"
  surface: "#ff5b4f"
  accent: "#10B981"
typography:
  fontFamily: Inter
  h1:
    fontSize: 64px (4rem)
    fontWeight: 700
  h2:
    fontSize: 40px (2.5rem)
    fontWeight: 700
  h3:
    fontSize: 28px (1.75rem)
    fontWeight: 600
  body:
    fontSize: 16px (1rem)
    fontWeight: 400
  small:
    fontSize: 14px (0.875rem)
    fontWeight: 500
rounded:
  sm: 6px
  md: 12px
  lg: 18px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

Vercel-inspired minimal landing page. Ideal for infraestrutura developer, plataformas de deploy, ferramentas frontend, ci/cd. AI-ready template. Vercel didn't invent black-and-white interfaces, but they made them feel inevitable. When Guillermo Rauch's team released Geist in 2023 — a sans-serif and monospace pair designed specifically for code and UI — they weren't just shipping a typeface. They were codifying an aesthetic that had been brewing since Zeit's early days: the idea that developer tools should look like they were designed by someone who actually reads terminal output.

The lineage traces back to Swiss modernism, obviously. Univers, Helvetica, the whole Zurich school obsession with grids and negative space. But Vercel's interpretation strips even that tradition down further. No warm grays. No subtle brand colors hiding in the background. Just pure black on white, monospace for data, sans-serif for hierarchy, and enough whitespace to make every element feel considered rather than decorated.

What's remarkable is how this became the default. Linear adopted it. Raycast adopted it. Half the YC batch ships with black-and-white landing pages now. Geist made minimalism feel like a technical decision rather than an aesthetic one — as if color itself were technical debt.

- Density: 3/10 — Airy
- Variance: 2/10 — Structured
- Motion: 4/10 — Subtle

- **Style:** Extreme Minimalism, Shadow-as-Border, Inter Font, Compressed Typography
- **Keywords:** vercel, inter, minimal, shadow-as-border, compressed typography, ligatures, workflow colors, multi-layer shadows, developer infrastructure
- **Era:** 2024-2026 Developer Infrastructure
- **Light/Dark:** ✓ Full / ✗ Not Recommended

## Colors

- **Primary Blue** (#2563EB) — Primary brand color, key actions, highlight elements
- **Dark Slate** (#1E293B) — Secondary background, dark surface, headers
- **Emerald Accent** (#10B981) — Accent highlights, status indicators, badges
- **Cinza 100** (#ebebeb) — Secondary text, borders, muted elements
- **Cinza 50** (#fafafa) — Secondary text, borders, muted elements
- **Ship Red** (#ff5b4f) — Error states, destructive actions
- **Cinza 600** (#4d4d4d) — Secondary text, borders, muted elements


## Typography

- **Font Family:** Inter (Google Fonts)
- **Heading 1 (H1):** 64px / 4rem (font-weight 700, tight tracking)
- **Heading 2 (H2):** 40px / 2.5rem (font-weight 700, tight tracking)
- **Heading 3 (H3):** 28px / 1.75rem (font-weight 600)
- **Body:** 16px / 1rem (font-weight 400, line-height 1.6)
- **Small / UI Labels:** 14px / 0.875rem (font-weight 500)

Scale:
- H1: 64px (4rem)
- H2: 40px (2.5rem)
- H3: 28px (1.75rem)
- Body: 16px (1rem / 1.6)
- Small: 14px (0.875rem)


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).
- **Detail Page Asymmetric Grid:** 2-column main content (`lg:col-span-2 space-y-8`) + 1-column sidebar (`aside space-y-6`) using `grid grid-cols-1 lg:grid-cols-3 gap-8 items-start`.
- **Hero Header Section:** Top full-width card (`bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs`) with back nav link, header metadata bar, logo/avatar, action buttons, title, description tags, and 4-column metric list (`dl`).


## Elevation & Depth

Shadow-as-border: box-shadow 0px 0px 0px 1px rgba(0,0,0,0.08) substituindo bordas tradicionais. Multi-layer shadow stacks para cards (border + elevation + ambient + inner highlight). Geist Sans com letter-spacing extremo negativo (-2.4px a -2.88px em display). Ligatures (liga) habilitadas globalmente. Cores de workflow: Ship Red, Preview Pink, Develop Blue. Canvas quase branco puro com texto #171717.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Mount animation with `motion.div` (`initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}`). Staggered cascades for lists: 80ms between items.
- **Tab navigation indicator:** Active tab underline indicator using `motion.div` with `layoutId` spring animation (`transition={{ type: "spring", stiffness: 400, damping: 35 }}`).
- **Tab transition mode:** Wrap dynamic tab components inside `<AnimatePresence mode="wait">` to prevent UI content jumps.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

- **Card / Surface Corner Radius:** `rounded-2xl` (16px / 1rem) for main page sections, hero headers, sidebar widgets, and modal dialogs.
- **Button & Control Corner Radius:** `rounded-xl` (12px / 0.75rem) for interactive buttons, navigation tabs, and inputs.
- **Tag & Badge Corner Radius:** `rounded-lg` (8px / 0.5rem) for status indicators, categories, and tag chips.


## Components

- **Primary Button:** Pill/Rounded shape (`rounded-xl` or `rounded-full`). Accent color fill (`bg-blue-600 hover:bg-blue-700`). Active: -1px translate tactile press. Font weight 600.
- **Secondary / Ghost Button:** Outline variant (`border-slate-300 hover:bg-slate-50`). 1.5px border in muted color. Text in primary color (`text-slate-700`).
- **Tab Navigation (`ProgramDetailTabNav`):** Elevated tab bar (`bg-white rounded-xl border-b border-slate-200 px-2 pt-2 shadow-2xs`) with animated active underline (`motion.div` `layoutId`).
- **Sidebar Widgets:** Structured cards (`bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4`) for timeline/stats metadata, plus dark gradient CTA cards (`bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-md`).
- **Cards:** `rounded-2xl` surface cards (`bg-white border border-slate-200 shadow-xs`).
- **Inputs:** Label above input (`border-slate-300 bg-white`). Focus ring: 2px accent color offset 2px. Error text below in semantic red.
- **Loading Skeleton State:** Page layout mirroring `animate-pulse` containers (`h-64 bg-slate-200 rounded-2xl`, 2:1 column split placeholders) avoiding circular spinners.
- **Error / Empty State:** Centered card (`bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4`) with rounded icon container (`w-14 h-14 bg-slate-100 rounded-2xl text-slate-400`), title (`text-xl font-bold text-slate-800`), subtext, and back button.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No decorative gradients — flat color only
- No shadows heavier than 0 2px 8px rgba(0,0,0,0.08)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Shadow-as-border technique
- Do Geist com tracking negativo extremo
- Do Ligatures habilitadas
- Do Multi-layer shadow stacks
- Do Cores de workflow
- Do Canvas branco com texto #171717
- Do Pill badges
- Do Responsivo


## Use Case

Infraestrutura developer, Platforms de deploy, Tools frontend, CI/CD
