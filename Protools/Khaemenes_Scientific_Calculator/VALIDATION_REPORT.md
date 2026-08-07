# Khaemenes Scientific Calculator v4.1 — Validation Report

## Final result

- **PASS** — all automated release checks passed
- **PASS** — application JavaScript syntax
- **PASS** — service-worker JavaScript syntax
- **PASS** — manifest JSON and local assets
- **PASS** — no duplicate HTML IDs
- **PASS** — all application element references resolve
- **PASS** — no `eval()` or `Function()` execution
- **PASS** — legacy v4 storage migration retained
- **PASS** — Euler/scientific-notation collision repaired
- **PASS** — complete implicit-multiplication cases
- **PASS** — hardened backup import
- **PASS** — shifted accessibility labels and toggle state
- **PASS** — offline manifest, icons, and selective service worker
- **PASS** — forbidden-credit scan

## Counts

- Automated release checks: **24**
- Passed: **24**
- Failed: **0**
- Built-in parser/domain tests: **30**
- Extended parser tests: **6**
- HTML IDs inspected: **32**
- JavaScript element references inspected: **29**
- HTML lines: **1591**

## Verified numerical behavior

- Standard precedence and parentheses
- Right-associative exponentiation
- Unary-negative precedence
- Trigonometric and inverse-trigonometric functions
- Roots, logarithms, powers, reciprocals, and absolute value
- Factorials and domain limits
- Calculator-style percentages
- Constants, memory, and previous-answer handling
- Scientific notation such as `2e3` and `2e-3`
- Euler multiplication such as `2e`, `e2`, and button-generated `2euler3`
- Implicit multiplication such as `(2+3)4`, `sqrt(9)2`, `pi2`, and adjacent groups
- Division-by-zero, negative-root, invalid-logarithm, and noninteger-factorial errors

## Browser-validation limitation

The container Chromium process hung while attempting direct file rendering because of its DBus/zygote environment. The full application script was therefore executed through a deterministic DOM substitute in Node.js, not through a visual browser session. The parser, initialization path, generated controls, element references, and built-in self-test all executed successfully. A short live GitHub Pages smoke test remains appropriate after upload.

## Deployable files

- `Khaemenes_Scientific_Calculator_index.html`
- `Khaemenes_Scientific_Calculator_manifest.webmanifest`
- `Khaemenes_Scientific_Calculator_service-worker.js`
- `Khaemenes_Scientific_Calculator_icon-192.png`
- `Khaemenes_Scientific_Calculator_icon-512.png`

## SHA-256

- `484fc51d2992f0faac114aa993e2dfacf3f6424d5335cec06d5f4ba07bbf95ea  Khaemenes_Scientific_Calculator_index.html`
- `8eecc1e4f584406c6ca64ae69dc0042e14eaf34899fc60bea19d208227fbf75e  Khaemenes_Scientific_Calculator_manifest.webmanifest`
- `c2462bbe6f82b000067cb8d63e0f84594c03a06865a777dc2acf57142e232486  Khaemenes_Scientific_Calculator_service-worker.js`
- `86ec27ab5fa34873b70cae7676109b541c4c1d9aaf6aa0c15154dae7e9ce5be2  Khaemenes_Scientific_Calculator_icon-192.png`
- `794384694af8f4c033bd9db37838a59b10beb31f2fa11b4dc0fb1e732d12fc43  Khaemenes_Scientific_Calculator_icon-512.png`
