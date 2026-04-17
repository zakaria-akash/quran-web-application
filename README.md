# Quran Web Application (QWA)

Minimal Quran reader built with Next.js App Router and JavaScript only.

Theme direction:

- Black `#0A0A0A`
- Navy `#0D1B2A`

Core scope:

- Surah list page
- Surah detail page with Arabic and English translation
- Translation search
- Reader settings (font family and sizes) persisted in localStorage

Excluded scope:

- Audio recitation
- Tafsir
- Authentication
- Database integration
- Multi-translation support

## Tech Stack

- Next.js 16 (App Router)
- React 19
- JavaScript (no TypeScript)
- Local JSON dataset in `public/quran-json/`

## Project Structure

- `src/app/page.js` - Surah list page
- `src/app/surah/[id]/page.js` - Surah detail page
- `src/app/search/page.js` - Search page
- `src/app/settings/page.js` - Reader settings page
- `src/app/api/quran/route.js` - Surah list API
- `src/app/api/quran/[id]/route.js` - Surah detail API
- `src/app/api/search/route.js` - Search API
- `src/lib/quran.js` - Dataset loading and normalization helpers
- `src/lib/settings.js` - Settings validation and storage helpers
- `src/app/settings-provider.js` - Global settings context provider

## Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Dataset

Dataset location:

- `public/quran-json/surah.json`
- `public/quran-json/ayat.json`
- `public/quran-json/translation.json`

Current expected sizes:

- Surahs: `114`
- Ayat: `6236`
- Translations: `6236`

Refresh dataset from free API source:

```bash
npm run sync:quran
```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - build production bundle
- `npm run start` - serve production build
- `npm run lint` - run ESLint checks
- `npm run sync:quran` - download and normalize Quran dataset
- `npm run qa:check` - run release dataset QA checks

## API Summary

`GET /api/quran`

- Returns all surahs with total count.

`GET /api/quran/[id]`

- Returns Surah metadata and joined ayat+translation content.
- Invalid id returns `400`.
- Unknown id returns `404`.

`POST /api/search`

- Request body: `{ "query": "text" }`
- Empty query returns `400`.
- Invalid JSON payload returns `400`.

## QA and Release Notes

Phase 5 release checklist:

- `QA_SIGNOFF.md`

Recommended release verification:

```bash
npm run lint
npm run qa:check
npm run build
```
