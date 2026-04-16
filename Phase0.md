# Phase 0 - Discovery, Scope Lock, and Architecture Baseline

This file is the implementation artifact for Phase 0 from WorkFlow.md.

## 1. Scope Lock (MVP Features)

The following features are in scope for the first release:

1. Surah List Page
- Route: `src/app/page.js`
- Must list all 114 surahs
- Must show surah number, Arabic name, and English name

2. Surah Detail (Ayat) Page
- Route: `src/app/surah/[id]/page.js`
- Must render ayat for selected surah
- Must show Arabic ayah text and English translation

3. Search Page
- Route: `src/app/search/page.js`
- Must support search by English translation text
- Must return ayah matches with surah reference

4. Settings Page
- Route: `src/app/settings/page.js`
- Must allow Arabic font family switch (minimum 2 fonts)
- Must allow Arabic font size adjustment
- Must allow translation font size adjustment
- Must persist settings in localStorage

## 2. Non-Goals (Explicitly Out of Scope)

The following items are not part of the MVP and must not be implemented in this phase plan:

- Audio recitation
- Tafsir
- Authentication or user accounts
- Database integration
- Multi-translation support

## 3. Agreed Route and Folder Map

### App Routes (UI)
- `src/app/layout.js` (global layout)
- `src/app/page.js` (surah list)
- `src/app/surah/[id]/page.js` (surah ayat page)
- `src/app/search/page.js` (search UI)
- `src/app/settings/page.js` (settings UI)

### API Routes (Minimal Backend)
- `src/app/api/quran/route.js` (GET all surahs)
- `src/app/api/quran/[id]/route.js` (GET ayat by surah id)
- `src/app/api/search/route.js` (POST search query)

### Shared Utilities
- `src/lib/quran.js` (quran data loading and normalization)
- `src/lib/settings.js` (localStorage settings read/write/validation)

### Data Directory
- `public/quran-json/` (all static Quran JSON files)

## 4. Dataset Contract (Required Data Shape)

This section defines the minimum JSON schema contract needed for implementation.

### 4.1 Surah List Contract

Expected data source:
- `public/quran-json/surah.json`

Expected minimum fields per surah entry:
- `id` (number)
- `nameArabic` (string)
- `nameEnglish` (string)

Optional fields (allowed but not required):
- `revelationType` (string)
- `totalAyah` (number)

### 4.2 Ayat Contract

Expected data source:
- `public/quran-json/ayat.json` OR equivalent split file model

Expected minimum fields per ayah entry:
- `surahId` (number)
- `ayahNumber` (number)
- `arabicText` (string)

### 4.3 Translation Contract

Expected data source:
- `public/quran-json/translation.json`

Expected minimum fields per translation entry:
- `surahId` (number)
- `ayahNumber` (number)
- `text` (string)

### 4.4 Join Rules

To render Surah Detail and Search results correctly:
- Ayah and translation must be joinable by `(surahId, ayahNumber)`.
- Surah references in all datasets must use numeric IDs.
- If a record is incomplete, implementation must fail gracefully (skip invalid entries, never crash page rendering).

## 5. API Contract Baseline (Phase 0 Definition)

These are response contracts to keep stable across implementation phases.

### 5.1 GET `/api/quran`
- Returns array of surahs
- Success: `200`
- Error: `500` with `{ error: string }`

### 5.2 GET `/api/quran/[id]`
- Returns ayat (with translations if joined server-side)
- Success: `200`
- Invalid surah id: `400`
- Not found: `404`
- Error: `500` with `{ error: string }`

### 5.3 POST `/api/search`
- Request body: `{ query: string }`
- Empty query: `400`
- Success: `200` with `{ results: [] }`
- Error: `500` with `{ error: string }`

## 6. Quality Baseline (Definition Before Coding)

- Responsive layout for mobile and desktop
- Basic accessibility baseline:
  - semantic headings and landmarks
  - readable contrast on black/navy theme
  - keyboard focus visibility
- Performance baseline:
  - avoid repeated dataset parsing where possible
  - keep API responses small and predictable
  - use static generation strategy for content routes where suitable

## 7. Open Questions and Decisions Log

Current status:
- No blocking open questions for Phase 0.
- Implementation can start from Phase 1 without architecture ambiguity.

Decision notes:
- App structure must remain under `src/app` (current repository standard).
- Minimal backend will be implemented with Next.js API routes in `src/app/api`.
- Data source remains static JSON under `public/quran-json`.

## 8. Phase 0 Exit Check

Phase 0 deliverables from WorkFlow.md are complete:
- Finalized scope checklist: Done
- Agreed route map and folder map: Done
- Dataset contract documented: Done
