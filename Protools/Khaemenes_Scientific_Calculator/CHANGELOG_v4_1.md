# Khaemenes Scientific Calculator v4.1

## Correctness repairs

- Separates Euler's constant from scientific-notation exponents.
- The `e` button now inserts an unambiguous internal `euler` token while displaying `e` to the learner.
- Preserves typed scientific notation such as `2e3` and `2e-3`.
- Completes implicit multiplication for expressions such as `(2+3)4`, `sqrt(9)2`, `pi2`, `e2`, and adjacent parenthetical groups.
- Preserves calculator precedence, right-associative powers, percentages, factorials, and domain checks.

## Editing and accessibility

- Makes the expression editor available on desktop and mobile.
- Adds Escape-to-clear and Alt+D angle-mode control while editing.
- Updates shifted function labels, titles, and screen-reader names together.
- Exposes theme and haptic toggle state with `aria-pressed`.
- Adds mobile history-dialog focus containment and focus return.
- Corrects the status wording to “12 Significant Digits Displayed.”

## Data safety and performance

- Limits imported backup files to 512 KB.
- Sanitizes and length-limits each imported history record.
- Validates history timestamps.
- Debounces local-storage writes.
- Avoids rebuilding the history panel when history has not changed.
- Preserves the original v4 storage key so existing local history, memory, and preferences migrate automatically.

## Validation and offline support

- Adds a built-in 30-case parser/domain self-test.
- Adds a self-test control in the History and Help drawer.
- Supports `?selftest=1` for a deterministic maintenance check.
- Exposes a read-only `window.KhaemenesCalculator` testing interface.
- Adds a web manifest, install prompt, two application icons, and an offline service worker.
- The service worker is deliberately passive for unrelated ProResource Hub tools.
