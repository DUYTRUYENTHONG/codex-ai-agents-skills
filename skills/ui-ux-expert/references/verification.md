# UI verification contract

Use the product's stricter acceptance criteria when present. Mark each relevant item PASS, FAIL, or NOT_TESTED with evidence. Do not pad a small change with unrelated checks, but never drop a required release gate.

## Layout and navigation

- Check 320, 390, 430, 768, 1280, and 1440px for shared responsive changes, plus a short-height screen. Use native browser 200% zoom separately; resizing is not equivalent.
- Confirm navigation, account controls, focused fields, errors, and submit actions remain reachable. Check sidebar/header/footer overlap and scroll containment, including expanded menus.
- Long Vietnamese/English text, URLs, and empty content must reflow without losing essential meaning. Test both supported themes and system-native controls.
- Measure actual contrast where possible. Project defaults: normal text at least 4.5:1, large text and essential control boundaries 3:1; do not claim full accessibility conformance from these alone.
- Use at least 44px touch targets for these products, preferably 48px for primary mobile controls. Preserve text size instead of squeezing required fields above the fold.

## Interaction and accessibility

- Prefer native buttons for actions and links for navigation. Check names, labels, heading structure, visible focus, and keyboard order.
- Exercise Tab/Shift+Tab, Enter/Space as appropriate, and Escape/return focus for dialogs. Do not add redundant custom keyboard handlers to native controls.
- On a reported inert CTA, test from the initial state and after switching modes. Confirm a perceivable destination/result, not merely an event firing.
- For asynchronous actions, prevent duplicate effects, expose progress, restore controls after errors, and provide retry guidance. Verify network failure as well as success.
- Password visibility toggles must be non-submit buttons with accurate accessible labels and retained input. Allow password managers and paste. Never log credentials.
- Respect reduced motion and user interruption. Avoid focus movement on every render.

## Real journey and safety

- Verify edited data after save/reload, and published output against preview when in scope. Test permissions server-side, not only hidden controls.
- For filters/search, inspect URL/API constraints and back navigation. For analytics, verify consent and duplicate events without inventing traffic.
- Check console errors and failed requests related to the change. Compare representative unaffected routes when changing shared components.
- Screenshots show layout, not successful persistence. Record the action and observed outcome alongside images; record video when motion or a multi-step defect needs it.
- Use isolated test identities/data and authorized environments. Avoid irreversible production submissions during a UI-only check.

## Minimum evidence record

Record: candidate/source SHA, environment/URL, role, viewport/zoom, action, expected result, observed result, evidence path, severity, and remaining gate. Do not store passwords, session tokens, or personal information in evidence. Independent review and release authorization remain separate from self-checking.
