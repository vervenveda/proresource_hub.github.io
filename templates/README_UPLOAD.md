# Khaemenes Scholarly Publishing Core — PROSE Extension Pack

This pack extends the existing PROSE Template Mini-Cloud without duplicating templates that already exist.

## Why there are 12 new files instead of 16

The current PROSE installation already contains useful Khaemenes academic/mathematics templates. The canonical 16-document Khaemenes publishing standard therefore reuses:

- Concept Reference → `formula-concept-organizer`
- Worked Examples → `math-worked-example`
- Problem Set → `problem-set`
- Study Guide → `study-guide`

The new pack supplies the 12 missing higher-learning publishing types.

## Upload destination

Upload the folder:

`templates/packs/khaemenes-scholarly-publishing/`

to the ProResource repository.

Then add this source object to the `sources` array in:

`templates/mini-cloud.json`

```json
{
  "id": "khaemenes-scholarly-publishing",
  "title": "Khaemenes Scholarly Publishing Core",
  "manifest": "packs/khaemenes-scholarly-publishing/manifest.json",
  "role": "higher-learning-publishing"
}
```

Do not replace the existing `core`, `khaemenes-academic-core`, or `khaemenes-mathematics-core` source records.

## Compatibility

This pack follows the existing `prose-template-pack` schema used by the Khaemenes Academic Core and Khaemenes Mathematics Core.

Template IDs are deliberately unique because the live Mini-Cloud uses `rejectDuplicateIds: true`.

## First intended publication

After installation, the first production use should be:

`KH-MATH-AGT-W01-R01 — Building Surfaces from Polygons`

using the `khaemenes-course-reading` template.
