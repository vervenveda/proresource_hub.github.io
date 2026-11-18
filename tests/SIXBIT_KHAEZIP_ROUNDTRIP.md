# SixBit Bun × KhaeZip — Synthetic Compatibility Lab

**Scope:** Public tool source-level regression using fictional data only; no learner data, no secrets, no Gateway, no Account Cloud authority.

## Source-derived test

`tests/sixbit-khaezip-source-roundtrip.test.mjs` loads the actual checked-in `Protools/SixBit_Bun_Studio_index.html` and `Protools/KhaeZip™_index.html` source, extracts their existing standard ZIP writer and strict ZIP parser / CRC extraction routines, then tests:

1. SixBit STORE ZIP with a fictional image, text and versioned SHA-256 evidence manifest; KhaeZip parses/extracts each entry and checks CRC, bytes and independent Node SHA-256.
2. One-byte asset tampering causes KhaeZip CRC extraction to fail.
3. Corrupted central-directory signature causes parse failure.
4. Duplicate case-folded archive paths are rejected during SixBit creation.
5. Mismatched local-header offset is rejected by KhaeZip strict parsing.

No new archive algorithm is substituted; fixture file creation and SHA digest comparison use Node built-ins. This is a **source-function compatibility test**, **not a real browser conversion**, raster-decoder validation, user download, KhaeZip encrypted `.kz` roundtrip or independent native STOS commissioning proof.

Run inside a checkout of the public ProReSources repo:

```sh
node --test tests/sixbit-khaezip-source-roundtrip.test.mjs
```

GitHub Actions: `.github/workflows/sixbit-khaezip-source-roundtrip.yml`, source-only with `contents: read`. No STOS commands, no service listener, no external API credentials.

**Result classification:** test and CI source committed; results are not marked PASS until independent GitHub Actions logs show them. Mac browser operation remains pending.
