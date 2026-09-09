---
name: vue-best-practices
description: "Use for Vue 3 application architecture, composables, reactivity patterns, routing, and component design. Trigger on: Vue, Vite, Pinia, Nuxt pages, and Vue storefront UI components."
license: MIT
metadata:
  domain: frontend
  role: specialist
  scope: implementation
  output-format: code
  related-skills: vue-expert, vue-expert-js
---

# Vue Best Practices

Build predictable Vue 3 UI in a way that is simple to maintain and easy to scale.

## Component Strategy
- Keep components single-purpose and split at behavior boundaries.
- Props should be explicit and typed.
- Prefer emits for parent-child intent rather than deep store writes for local interaction.
- Keep complex side effects in composables.

## State and Data
- Local UI state in components; shared UI/domain state in Pinia; remote state in dedicated fetch/composable layer.
- Avoid mutating props.
- Use computed refs for derived state before methods.

## Template Discipline
- Keep template readable; avoid logic-heavy inline expressions.
- Use `v-bind` and class utilities consistently.
- Avoid one-off styles when utility classes already cover requirement.

## Accessibility for Commerce UX
- Buttons and links should be explicit labels.
- Form inputs require label and error feedback.
- Card and CTA tap zones must meet mobile touch target size.

## Performance for Mobile-First Commerce
- Lazy load below-the-fold sections and large media.
- Use route-level code splitting.
- Keep watchers minimal and scoped.
- Memoize expensive selectors and computed views in composables.

## SSR/Static Considerations
- Keep hydration-safe rendering for data-dependent components.
- Prevent SSR mismatches from browser-only APIs (guards in `onMounted`).

## Storefront Patterns
- Build reusable building-block components for ProductCard, ProductGallery, VariantSelect, and QuickAdd.
- Keep storefront blocks decoupled from CMS-specific payload shape.
- Normalize image and price data at edge of component boundary.
