# QWA Phase 5 QA Sign-Off

This checklist captures release readiness for the MVP scope.

## Scope Verification

- Surah list page is implemented and renders all available surahs.
- Surah detail page is implemented with Arabic text and English translation.
- Search page is implemented and queries translation text.
- Settings page is implemented with localStorage persistence.
- Non-goal features remain excluded (audio, tafsir, auth, database, multi-translation).

## Route Regression Checklist

UI routes:
- `/`
- `/surah/[id]`
- `/search`
- `/settings`

API routes:
- `/api/quran`
- `/api/quran/[id]`
- `/api/search`

Validation points:
- Invalid surah id returns `400`.
- Unknown surah id returns `404`.
- Empty search query returns `400`.
- Malformed JSON payload returns `400`.

## Data Integrity Checklist

- `public/quran-json/surah.json` contains 114 surahs.
- `public/quran-json/ayat.json` contains 6236 ayat records.
- `public/quran-json/translation.json` contains 6236 translation records.
- Ayah and translation records align by `(surahId, ayahNumber)`.

## Performance and Build Checklist

- `npm run lint` passes.
- `npm run build` passes.
- Static generation includes all 114 Surah routes.
- Dataset loader uses production cache and dev-safe refresh behavior.

## Clean Code and Release Checklist

- Dead code artifacts removed from runtime project.
- README updated with accurate project usage and route details.
- Workflow Phase 5 marked completed with implementation record.
- Project is ready for deployment dry run and handoff.
