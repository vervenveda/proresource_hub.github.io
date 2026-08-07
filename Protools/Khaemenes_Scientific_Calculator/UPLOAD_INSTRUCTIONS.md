# Upload instructions — Scientific Calculator v4.1

Repository:

`vervenveda/proresource_hub.github.io`

Destination:

`Protools/`

Upload or replace these five files together:

1. `Khaemenes_Scientific_Calculator_index.html`
2. `Khaemenes_Scientific_Calculator_manifest.webmanifest`
3. `Khaemenes_Scientific_Calculator_service-worker.js`
4. `Khaemenes_Scientific_Calculator_icon-192.png`
5. `Khaemenes_Scientific_Calculator_icon-512.png`

The HTML filename remains unchanged, so existing links do not need to be revised.

The v4 local-storage key is intentionally retained. Existing answer, memory, history, theme, haptic preference, and angle mode should migrate into v4.1 on the same origin.

## Post-upload check

1. Allow GitHub Pages to refresh.
2. Open the calculator and perform a hard refresh once.
3. Open History → Functions and keyboard help → Run calculator self-test.
4. Confirm the result says all 30 parser and domain checks passed.
5. Also test `2e`, `2e3`, `(2+3)4`, `sqrt(9)2`, and `pi2`.

The same automated check can be opened by adding `?selftest=1` to the calculator URL.

## Service-worker note

The service worker resides in the shared `Protools` directory because the calculator is currently a single-file tool there. Its fetch handler responds only to the five calculator assets and remains passive for every unrelated ProResource Hub file.
