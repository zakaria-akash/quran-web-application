# Quran JSON Dataset (Phase 1 Baseline)

This folder stores static Quran dataset files used by both UI pages and API routes.

Current files:
- `surah.json`: Surah metadata list
- `ayat.json`: Arabic ayat records
- `translation.json`: English translation records

Current status:
- The repository now includes a **Phase 1 starter dataset** (Surah 1 / Al-Fatihah)
- In Phase 2, this should be replaced with the full 114-surah dataset before complete UI/API rollout

Minimum contracts:
- Surah record: `id`, `nameArabic`, `nameEnglish`
- Ayah record: `surahId`, `ayahNumber`, `arabicText`
- Translation record: `surahId`, `ayahNumber`, `text`

Join rule:
- Ayah and translation rows are matched by (`surahId`, `ayahNumber`)
