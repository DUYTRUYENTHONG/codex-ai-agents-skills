---
name: stos-product-ux
description: Use when working on STOS product UX/UI, public sale portfolio pages, visual CMS, template systems, user onboarding, responsive/mobile fixes, route flows, Linktree-competitive features, contact/account identity constraints, or QA gates for growth-commerce-os STOS. This skill forces user-centered design, mobile-first layout, route semantics, and no-deploy-without-QA behavior.
---

# STOS Product UX

## North star

Make STOS a user-centered sales portfolio SaaS that a non-technical sale/SME user can use without training:

1. Create account.
2. Pick a template.
3. Upload avatar and service/product images.
4. Add locked verified contact identity plus editable social links.
5. Add products/services, reviews/proof, and CTA buttons.
6. Preview mobile first.
7. Publish.
8. Copy/share public link.
9. Read simple leads/customers and funnel performance later.

If a basic user asks "upload avatar ở đâu", "template dùng như nào", or "khách hàng và hiệu quả khác gì", the UX failed.

## Required source references

Before changing STOS UI/CMS/routes, read the repo acceptance matrix:

```text
C:\Users\CROSSIAN\Downloads\chợ kênh\growth-commerce-os\docs\stos\STOS_UX_ACCEPTANCE_MATRIX.md
```

Use it to identify affected route rows, public portfolio requirements, CMS gates, mobile fail conditions, contact identity rules, and release evidence.

## Required STOS route semantics

Keep routes separate by render logic, not by CSS hiding:

- `/stos/page`: page builder and portfolio editing workspace.
- `/stos/templates`: template selection and apply flow.
- `/stos/studio`: visual block CMS, drag/drop ordering, media, theme, preview.
- `/stos/customers`: customer/lead table, contact source, follow-up status.
- `/stos/insights`: funnel analytics, views, clicks, contact rate, source comparison.
- `/stos/settings`: public link, domain, UTM, QR, account restrictions.

Do not let customers and insights show the same content.

## Public portfolio mobile contract

Preserve this order on mobile:

1. Brand/logo and language control.
2. Avatar.
3. Name.
4. Bio/headline.
5. Primary CTA.
6. Social/contact links.
7. Compact credibility metrics.
8. Products/services or content blocks.
9. Reviews/proof.
10. Contact form.
11. Footer.

Overlap, cropped avatar, hidden CTA, horizontal overflow, or low contrast is not acceptable.

## UX implementation hooks

Before editing UI, write down the exact user job:

- Who is using this screen?
- What is the next action after 5 seconds?
- What should be impossible to miss?
- What must never be editable because it belongs to verified account identity?
- Which acceptance-matrix rows are affected?

Build React structure first, scoped CSS second. Avoid global typography, broad selectors, and large override blocks. Prefer component classes scoped under STOS containers.

## Mobile-first frontend gate

For every STOS UI change, mentally design for these breakpoints before desktop polish:

- 320px: smallest Android.
- 360px: common Android.
- 390px: iPhone compact.
- 430px: iPhone large.
- 768px: tablet.
- 1280px and 1440px: desktop.

Required pass conditions:

- No text column becomes one-letter-per-line.
- No card or CTA overlaps another element.
- Avatar is centered, fully visible, and keeps `object-fit: cover`.
- Primary CTA is above secondary/social links on mobile.
- Sticky/sidebar navigation does not block content.
- Language switch and metrics never overlap.

## Template/CMS skill behavior

When improving templates or CMS:

- Make templates actually selectable and visibly applied.
- Show a clear before/after preview.
- Keep template differences simple for users: color, motion, avatar shape, button style, background style.
- Do not add 20 complex templates before one template is excellent and stable.
- Keep every block editable: hero, avatar, CTA, social link, product/service, review, form, footer.
- Use drag/drop ordering only where it saves user time; do not make users assemble basic structure from zero.

## Competitive posture vs Linktree

Beat Linktree by focusing on sales outcomes, not only link lists:

- Verified contact identity locked from account.
- Clean lead capture and dedupe-ready contact events.
- Sale-focused CTA hierarchy.
- Per-page funnel metrics that are understandable to a basic user.
- Templates for conversion trust, not only aesthetics.
- Mobile-first public portfolio that feels premium and fast.

## QA and release hook

Do not claim production-ready unless evidence exists for:

- Typecheck/build.
- Route smoke for `/stos`, `/stos/page`, `/stos/templates`, `/stos/studio`, `/stos/customers`, `/stos/insights`, `/stos/settings`, and a public `/u/...` page.
- Responsive visual smoke at 360px, 390px, 430px, 768px, 1280px.
- Account flow: login, create portfolio, upload avatar, add social link, add product/service, add review, preview, publish, copy link.
- Route semantic check: customers table is not analytics; insights is not customer table.

If QA is not run in the current turn, say so explicitly.
