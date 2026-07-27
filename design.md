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


## Elevation & Depth

Shadow-as-border: box-shadow 0px 0px 0px 1px rgba(0,0,0,0.08) substituindo bordas tradicionais. Multi-layer shadow stacks para cards (border + elevation + ambient + inner highlight). Geist Sans com letter-spacing extremo negativo (-2.4px a -2.88px em display). Ligatures (liga) habilitadas globalmente. Cores de workflow: Ship Red, Preview Pink, Develop Blue. Canvas quase branco puro com texto #171717.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 6px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Pill-shaped (9999px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Pill-shaped (9999px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.


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
