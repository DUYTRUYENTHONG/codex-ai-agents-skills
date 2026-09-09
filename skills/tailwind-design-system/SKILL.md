---
name: tailwind-design-system
description: "Use for building and enforcing a consistent Tailwind-based design system: tokens, spacing scale, typography, color semantics, responsive behavior, and reusable component contracts. Trigger on: tailwind, design system, utility tokens, component variants."
license: MIT
metadata:
  domain: frontend
  role: specialist
  scope: architecture
  output-format: code
  related-skills: frontend-ui-engineering, ui-ux-pro-max
---

# Tailwind Design System

Use this skill when implementing UI at product level where consistency, speed, and maintainability matter.

## Base Rules
- Define semantic tokens first (color, spacing, radius, type scale) before writing page-level classes.
- Never invent arbitrary values unless required by an explicit design constraint.
- Use utility-first classes for layout/spacing; avoid custom inline ad-hoc CSS for common patterns.
- Keep semantic aliases (`bg-surface`, `text-muted`, `border-default`) over raw hex whenever possible.

## Spacing and Rhythm
- Enforce a single spacing scale across cards, forms, list gaps, and paddings.
- Use `container`, paddings, and section rhythm consistently across devices.

## Mobile-First Layout
- Compose sections on single-column mobile and progressively enhance with rows/columns.
- Maintain sticky important CTAs for commerce funnels.
- Set predictable tap targets (minimum 44x44 CSS px).

## Component Contracts
- Document component states: default, hover, active, disabled, loading, error.
- Define shared variants (`size`, `tone`, `density`) rather than duplicating component implementations.
- Ensure disabled states remain distinguishable in color and affordance.

## Campaign/Sale Page Patterns
- Keep hero, offer summary, trust indicators, social proof, FAQ, and final CTA in a clear hierarchy.
- Avoid competing color priorities that weaken action clarity.
- Use section delimiters to guide attention through funnel sequence.

## Validation
- Check visual consistency between mobile and desktop snapshots.
- Ensure dark mode and contrast states still preserve readability and clickability.
- Remove dead utility classes and duplicated token values.
