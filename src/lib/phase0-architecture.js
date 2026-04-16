/**
 * Phase 0 Architecture Reference
 *
 * This file captures the finalized Phase 0 decisions in executable JavaScript constants.
 * It is intentionally not imported by runtime pages yet, because Phase 0 defines
 * architecture and contracts only and does not implement features.
 */

/**
 * Locked MVP feature set for the first release.
 *
 * Each key represents one approved feature area that later phases can implement.
 * Any feature not listed here should be treated as out-of-scope unless explicitly approved.
 */
export const PHASE0_MVP_FEATURES = {
  surahListPage: true,
  surahDetailPage: true,
  translationSearch: true,
  settingsPersistence: true,
};

/**
 * Explicit non-goals for the MVP.
 *
 * These flags protect scope and help prevent accidental feature creep in later phases.
 */
export const PHASE0_NON_GOALS = {
  audioRecitation: false,
  tafsir: false,
  authentication: false,
  databaseIntegration: false,
  multiTranslationSupport: false,
};

/**
 * UI route map agreed in Phase 0.
 *
 * These values define where each user-facing page will be implemented under src/app.
 */
export const PHASE0_UI_ROUTES = {
  home: "/",
  surahDetail: "/surah/[id]",
  search: "/search",
  settings: "/settings",
};

/**
 * API route map agreed in Phase 0.
 *
 * These routes define the minimal backend surface that will live in the same Next app.
 */
export const PHASE0_API_ROUTES = {
  getAllSurahs: "/api/quran",
  getSurahAyatById: "/api/quran/[id]",
  searchTranslation: "/api/search",
};

/**
 * Data directory contract.
 *
 * All Quran JSON data must be placed under this public folder so both frontend
 * and backend route handlers can read from a known, stable location.
 */
export const PHASE0_DATA_DIRECTORY = "public/quran-json";

/**
 * Minimum required data field contracts.
 *
 * These field lists act as schema baselines for runtime validation in later phases.
 */
export const PHASE0_DATA_CONTRACT = {
  surah: ["id", "nameArabic", "nameEnglish"],
  ayah: ["surahId", "ayahNumber", "arabicText"],
  translation: ["surahId", "ayahNumber", "text"],
};

/**
 * API response baseline contracts.
 *
 * This object documents the status behavior to keep responses predictable
 * and easy to consume by the frontend during implementation.
 */
export const PHASE0_API_CONTRACT = {
  quran: {
    method: "GET",
    successStatus: 200,
    errorStatus: 500,
  },
  quranById: {
    method: "GET",
    successStatus: 200,
    invalidIdStatus: 400,
    notFoundStatus: 404,
    errorStatus: 500,
  },
  search: {
    method: "POST",
    successStatus: 200,
    emptyQueryStatus: 400,
    errorStatus: 500,
  },
};

/**
 * Quality baseline set in Phase 0.
 *
 * These requirements are non-functional constraints that all later code
 * implementations should satisfy.
 */
export const PHASE0_QUALITY_BASELINE = {
  responsiveDesign: true,
  basicAccessibility: true,
  predictablePerformance: true,
};
