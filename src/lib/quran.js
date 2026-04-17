import { readFile } from "node:fs/promises";
import path from "node:path";

// This cache object stores parsed dataset arrays so repeated calls do not
// re-read and re-parse the same JSON files during a server process lifetime.
const quranDataCache = {
  surahs: null,
  ayat: null,
  translations: null,
};

// This constant points to the dataset directory agreed in Phase 0.
const QURAN_DATA_DIR = path.join(process.cwd(), "public", "quran-json");

// These file names are centralized so any future renaming stays in one place.
const DATA_FILES = {
  surahs: "surah.json",
  ayat: "ayat.json",
  translations: "translation.json",
};

// In development we bypass long-lived cache so dataset file edits are reflected immediately.
const SHOULD_USE_DATA_CACHE = process.env.NODE_ENV === "production";

// This helper safely converts values to positive integers for ID fields.
function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

// This helper builds an absolute file path from the known dataset directory.
function getDataFilePath(fileName) {
  return path.join(QURAN_DATA_DIR, fileName);
}

// This helper reads and parses JSON files with clear error context.
async function readJsonArray(fileName) {
  const absolutePath = getDataFilePath(fileName);
  const rawFileContent = await readFile(absolutePath, "utf8");
  const parsedValue = JSON.parse(rawFileContent);

  // The data layer expects top-level arrays for predictable iteration.
  if (!Array.isArray(parsedValue)) {
    throw new Error(`${fileName} must contain a top-level array.`);
  }

  return parsedValue;
}

// This helper validates and normalizes one surah record.
function normalizeSurahRecord(inputRecord) {
  const id = toPositiveInteger(inputRecord?.id);
  const nameArabic = typeof inputRecord?.nameArabic === "string" ? inputRecord.nameArabic.trim() : "";
  const nameEnglish = typeof inputRecord?.nameEnglish === "string" ? inputRecord.nameEnglish.trim() : "";

  // Returning null means the record is invalid and should be skipped safely.
  if (!id || !nameArabic || !nameEnglish) {
    return null;
  }

  return {
    id,
    nameArabic,
    nameEnglish,
    revelationType:
      typeof inputRecord?.revelationType === "string" ? inputRecord.revelationType.trim() : "",
    totalAyah: toPositiveInteger(inputRecord?.totalAyah),
  };
}

// This helper validates and normalizes one ayah record.
function normalizeAyahRecord(inputRecord) {
  const surahId = toPositiveInteger(inputRecord?.surahId);
  const ayahNumber = toPositiveInteger(inputRecord?.ayahNumber);
  const arabicText = typeof inputRecord?.arabicText === "string" ? inputRecord.arabicText.trim() : "";

  // Returning null means the record is invalid and should be skipped safely.
  if (!surahId || !ayahNumber || !arabicText) {
    return null;
  }

  return {
    surahId,
    ayahNumber,
    arabicText,
  };
}

// This helper validates and normalizes one translation record.
function normalizeTranslationRecord(inputRecord) {
  const surahId = toPositiveInteger(inputRecord?.surahId);
  const ayahNumber = toPositiveInteger(inputRecord?.ayahNumber);
  const text = typeof inputRecord?.text === "string" ? inputRecord.text.trim() : "";

  // Returning null means the record is invalid and should be skipped safely.
  if (!surahId || !ayahNumber || !text) {
    return null;
  }

  return {
    surahId,
    ayahNumber,
    text,
  };
}

// This helper applies a normalizer and removes invalid entries.
function normalizeArrayRecords(inputArray, normalizer) {
  return inputArray.map(normalizer).filter(Boolean);
}

// This function loads, normalizes, and caches the surah list dataset.
export async function getSurahList() {
  if (SHOULD_USE_DATA_CACHE && quranDataCache.surahs) {
    return quranDataCache.surahs;
  }

  const rawSurahArray = await readJsonArray(DATA_FILES.surahs);
  const normalizedSurahs = normalizeArrayRecords(rawSurahArray, normalizeSurahRecord);

  // Sorting by ID guarantees stable output order even if source order changes.
  normalizedSurahs.sort((a, b) => a.id - b.id);
  if (SHOULD_USE_DATA_CACHE) {
    quranDataCache.surahs = normalizedSurahs;
  }
  return normalizedSurahs;
}

// This function loads, normalizes, and caches the ayat dataset.
export async function getAyatList() {
  if (SHOULD_USE_DATA_CACHE && quranDataCache.ayat) {
    return quranDataCache.ayat;
  }

  const rawAyatArray = await readJsonArray(DATA_FILES.ayat);
  const normalizedAyat = normalizeArrayRecords(rawAyatArray, normalizeAyahRecord);

  // Sorting by surah and ayah provides deterministic reading sequence.
  normalizedAyat.sort((a, b) => a.surahId - b.surahId || a.ayahNumber - b.ayahNumber);
  if (SHOULD_USE_DATA_CACHE) {
    quranDataCache.ayat = normalizedAyat;
  }
  return normalizedAyat;
}

// This function loads, normalizes, and caches the translation dataset.
export async function getTranslationList() {
  if (SHOULD_USE_DATA_CACHE && quranDataCache.translations) {
    return quranDataCache.translations;
  }

  const rawTranslationArray = await readJsonArray(DATA_FILES.translations);
  const normalizedTranslations = normalizeArrayRecords(
    rawTranslationArray,
    normalizeTranslationRecord,
  );

  // Sorting by surah and ayah keeps index alignment predictable.
  normalizedTranslations.sort((a, b) => a.surahId - b.surahId || a.ayahNumber - b.ayahNumber);
  if (SHOULD_USE_DATA_CACHE) {
    quranDataCache.translations = normalizedTranslations;
  }
  return normalizedTranslations;
}

// This function returns all ayat for one surah using a safe numeric ID parse.
export async function getAyatBySurahId(surahIdInput) {
  const surahId = toPositiveInteger(surahIdInput);
  if (!surahId) {
    return [];
  }

  const ayatList = await getAyatList();
  return ayatList.filter((ayah) => ayah.surahId === surahId);
}

// This function returns all translations for one surah using a safe numeric ID parse.
export async function getTranslationsBySurahId(surahIdInput) {
  const surahId = toPositiveInteger(surahIdInput);
  if (!surahId) {
    return [];
  }

  const translationList = await getTranslationList();
  return translationList.filter((translation) => translation.surahId === surahId);
}

// This function joins ayat and translation by surah and ayah number for rendering.
export async function getSurahContent(surahIdInput) {
  const surahId = toPositiveInteger(surahIdInput);
  if (!surahId) {
    return [];
  }

  const [ayat, translations] = await Promise.all([
    getAyatBySurahId(surahId),
    getTranslationsBySurahId(surahId),
  ]);

  // Map lookup keeps the join operation efficient for larger datasets.
  const translationByAyahNumber = new Map(
    translations.map((translation) => [translation.ayahNumber, translation.text]),
  );

  return ayat.map((ayah) => ({
    surahId: ayah.surahId,
    ayahNumber: ayah.ayahNumber,
    arabicText: ayah.arabicText,
    translationText: translationByAyahNumber.get(ayah.ayahNumber) || "",
  }));
}

// This function performs case-insensitive translation search for API or UI use.
export async function searchTranslationText(queryInput) {
  const query = typeof queryInput === "string" ? queryInput.trim().toLowerCase() : "";

  // Empty queries return no results so callers can avoid noisy full dumps.
  if (!query) {
    return [];
  }

  const translationList = await getTranslationList();
  return translationList.filter((entry) => entry.text.toLowerCase().includes(query));
}

// This function clears cache entries, useful in tests or debug flows.
export function clearQuranCache() {
  quranDataCache.surahs = null;
  quranDataCache.ayat = null;
  quranDataCache.translations = null;
}
