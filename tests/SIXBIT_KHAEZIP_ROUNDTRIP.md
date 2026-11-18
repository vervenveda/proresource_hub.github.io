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


## Next gate: authenticated KhaeZip v5 roundtrip

The additional `tests/khaezip-kzp5-encryption-roundtrip.test.mjs` extracts KhaeZip's **existing actual** `encryptKZ5`, `decryptKhae`, PBKDF2/SHA-256 key derivation, and AES-GCM authentication code from the browser source. The isolated Node WebCrypto suite checks:
1. KZP5 encrypted `.kz` seal/decrypt roundtrip preserves independent SHA-256;
2. incorrect password denial;
3. ciphertext tampering denial;
4. authenticated metadata/header tampering denial;
5. invalid oversized header rejection.

No production password or real account record is used. Test fixture is fictional content; generated encrypted bytes remain inside the test process. This is a *source-function* cryptographic interoperability check, not a commissioned archive vault, real browser workflow or independent security certification.

```sh
node --test tests/sixbit-khaezip-source-roundtrip.test.mjs tests/khaezip-kzp5-encryption-roundtrip.test.mjs
```

The existing GitHub Actions workflow now runs both suites. **New encryption test verification is pending CI logs**. The previous five ZIP checks passed in Actions run `44343209593`.

### Browser acceptance still required
- In a trusted browser, create a clearly fictional image and synthetic report; use the private Account Cloud handoff to hash them.
- Load fictional image only into SixBit Bun, preserve format and generate its BunLink and standard ZIP. Check manifest SHA-256.
- In KhaeZip choose the ZIP plus separately reviewed manifest/report, create a password-protected `.kz` with a disposable testing-only password, reopen it, run Deep SHA-256 Scan, then verify restored files against original independent digests.
- Test one wrong password and one deliberately corrupted copy. Confirm neither is accepted.
- Export proof without including the disposable password, session cookies, real network maps, or personal records.

No browser-to-GitHub automatic file upload was added. Original tools remain unchanged.
