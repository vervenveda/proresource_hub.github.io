# PROSE Template Repository Audit

## Repository checked

- Repository: `vervenveda/proresource_hub.github.io`
- Branch: `main`
- Audited head commit: `7e3fe21b70da749bff811bd9008230326bf76a34`
- Canonical manifest: `templates/manifest.json`
- GitHub manifest blob SHA: `baf05229b44ffe2552613d3a7d3bda8316bc1d09`
- Rebuilt manifest blob SHA: `baf05229b44ffe2552613d3a7d3bda8316bc1d09`
- Manifest match: **exact byte-for-byte match**

## Verification summary

- Canonical manifest entries: **82**
- Unique template IDs: **82**
- Unique canonical file references: **82**
- Canonical files missing: **0**
- HTML files observed in `templates/`: **91**
- Unreferenced alternate or misspelled files: **9**
- Manifest JSON status: **valid**
- PROSE schema: `prose-template-library`
- Schema version: `1`

## Canonical category totals

| Category | Templates |
|---|---:|
| Career & Employment | 13 |
| Business & Nonprofit | 12 |
| Projects & Operations | 13 |
| Research & Education | 10 |
| Creative & Publishing | 14 |
| Civic & Community | 10 |
| Personal & Ceremonial | 10 |
| **Total** | **82** |

## Unreferenced files found

These files are present in the repository but are intentionally excluded from
the canonical manifest because a corrected or preferred version already exists.

| Extra repository file | Canonical manifest file | Finding |
|---|---|---|
| `after-action-revirew.html` | `after-action-review.html` | exact duplicate with misspelled filename |
| `donor-thank-you.html` | `donor-thank-you-letter.html` | exact duplicate with alternate filename |
| `employment-offer.html` | `offer-letter.html` | exact duplicate with alternate filename |
| `letter-of-recommendation.html` | `recommendation-letter.html` | older incomplete alternate; canonical file is complete |
| `meeting-brief-record.html` | `meeting-brief.html` | exact duplicate with alternate filename |
| `memoire-chapter.html` | `memoir-chapter.html` | exact duplicate with misspelled filename |
| `organizational-policy.html` | `policy-document.html` | exact duplicate with alternate filename |
| `standard-operating-proceedure.html` | `standard-operating-procedure.html` | exact duplicate with misspelled filename |
| `startegic-plan.html` | `strategic-plan.html` | exact duplicate with misspelled filename |

Eight pairs are byte-for-byte duplicates. The remaining alternate,
`letter-of-recommendation.html`, is an older incomplete copy; the canonical
`recommendation-letter.html` contains the complete closing contact block.

## Canonical manifest decision

The verified `manifest.json` contains the correct **82 canonical templates**.
It should continue to reference only the corrected filenames. Adding the nine
extra files to the manifest would create duplicate choices in PROSE and would
preserve spelling errors.

## Recommended repository cleanup

After reviewing the map, remove the nine unreferenced files listed above. No
canonical template needs to be renamed, and the verified manifest does not need
a schema change.
