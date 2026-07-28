---
name: code-review
description: Conducts code reviews enforcing modularity, the Single Responsibility Principle (SRP), clean code structure, and tech stack compliance (Next.js 16 App Router, RTK Query, shadcn/ui, motion/react).
---

# Code Review & Refactoring Skill

This skill guides AI agents in conducting structured code reviews and refactoring code for modularity, Single Responsibility Principle (SRP), clean architecture, and tech stack compliance.

## Review Principles & Guidelines

### 1. Single Responsibility Principle (SRP) & Modularity
- **One Responsibility per Component/Module**: A single component, custom hook, or module should handle only one distinct concern (e.g., data fetching UI presentation, layout structure, or custom state logic).
- **Extracted Custom Hooks**: Complex business logic, state machines, or data transformations should be extracted into custom hooks or domain helper functions.
- **Decomposed UI Trees**: Multi-hundred-line TSX/JSX components must be decomposed into smaller, highly cohesive, single-purpose sub-components.

### 2. Tech Stack Compliance
- **Framework**: Next.js 16 App Router conventions (proper Server vs. Client Component boundaries using `"use client"` directives only when required).
- **Data Fetching & Mutations**:
  - **MUST** use **RTK Query** (`@reduxjs/toolkit`) generated hooks (`useGetXxxQuery`, `useUpdateXxxMutation`).
  - **NEVER** use raw `fetch`, `axios`, or `useEffect` for server-side data fetching or mutations.
- **UI & Styling**:
  - Enforce `shadcn/ui` primitives and Tailwind CSS v4 semantic tokens.
  - Comply with [`design.md`](file:///c:/Users/tolsa/Documents/My%20project/devsolve-frontend/design.md) specifications (e.g., flex with `gap-*` instead of `space-x`/`space-y`, `size-*` for equal dimensions, semantic color tokens).
- **Animations**:
  - **MUST** use `motion/react` (`import { motion } from "motion/react"`).

### 3. Formatting, Naming & Readability
- **Self-documenting Naming**: Functions, components, types, and variables must have descriptive, unambiguous names.
- **Strict TypeScript Types**: Avoid `any` or loose implicit types; define explicit interfaces/types for props and state.
- **Clean Import Organization**: Group imports systematically (Framework -> Third-party UI/Icons -> Internal Components -> State/Hooks -> Utils/Types).

---

## Review Output Structure

When executing a code review with this skill, present findings using this structured format:

### 📊 Executive Summary
A concise overview of overall code quality, architectural strengths, and key refactoring targets.

### 🔍 Detailed Findings & Violations
Categorize all findings under:
1. **Single Responsibility Principle (SRP) & Modularity**
2. **Tech Stack & Framework Compliance**
3. **Naming, Readability & TypeScript Typing**

For each finding, include:
- **Severity**: 🔴 Critical | 🟡 Warning | 🔵 Suggestion
- **Location**: Clickable file link with line numbers (e.g., [filename.tsx](file:///path/to/file#L10-L25))
- **Issue**: Explanation of why the current code breaks principles or project conventions
- **Recommendation**: Concrete step-by-step guidance on how to fix or modularize it

### 🛠️ Proposed Refactoring Diffs
Provide ready-to-apply diffs or modular code block proposals demonstrating the refactored components and extracted hooks.
