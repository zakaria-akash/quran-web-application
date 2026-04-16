import Link from "next/link";
import { notFound } from "next/navigation";
import { getSurahContent, getSurahList } from "@/lib/quran";

// This configuration ensures only generated static params are valid route entries.
export const dynamicParams = false;

// This build-time function enables SSG for all known surah ids in the dataset.
export async function generateStaticParams() {
  // The surah list is normalized by the helper, so IDs are safe to stringify.
  const surahList = await getSurahList();

  // Next.js expects params values as strings for dynamic route segments.
  return surahList.map((surah) => ({ id: String(surah.id) }));
}

// This helper parses and validates the route id parameter into a positive integer.
function parseRouteSurahId(rawId) {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

// This page renders one Surah with Arabic ayat and English translation.
export default async function SurahDetailPage({ params }) {
  // Params can be async in the App Router, so we await before reading id.
  const resolvedParams = await params;

  // Invalid ids are treated as unknown routes and sent to not-found UI.
  const surahId = parseRouteSurahId(resolvedParams?.id);
  if (!surahId) {
    notFound();
  }

  // We load surah metadata and joined ayat content in parallel for performance.
  const [surahList, surahContent] = await Promise.all([
    getSurahList(),
    getSurahContent(surahId),
  ]);

  // If no matching surah exists in the dataset, we show not-found state.
  const surahMeta = surahList.find((surah) => surah.id === surahId);
  if (!surahMeta) {
    notFound();
  }

  return (
    <main className="surah-detail-page">
      {/* This top row gives navigation back to the Surah index for easier flow. */}
      <div className="surah-detail-topbar">
        <Link href="/" className="back-link">
          Back To Surah List
        </Link>
      </div>

      {/* This header identifies the Surah clearly in both naming styles. */}
      <header className="surah-detail-header">
        <h1 className="surah-detail-title">{surahMeta.nameEnglish}</h1>
        <p className="surah-detail-arabic-name">{surahMeta.nameArabic}</p>
        <p className="surah-detail-meta">Surah {surahMeta.id}</p>
      </header>

      {/* If content is missing, we show an inline safe fallback instead of crashing. */}
      {surahContent.length === 0 ? (
        <section className="surah-empty-state" aria-live="polite">
          No ayat data is currently available for this Surah.
        </section>
      ) : (
        // This list renders ayat blocks with Arabic text and translation side by side in one flow.
        <section className="ayah-list" aria-label="Ayat list">
          {surahContent.map((ayah) => (
            <article key={`${ayah.surahId}-${ayah.ayahNumber}`} className="ayah-card">
              {/* Ayah number acts as a stable visual and reference anchor. */}
              <p className="ayah-number">Ayah {ayah.ayahNumber}</p>

              {/* Arabic text is separated for readability and future font customization. */}
              <p className="ayah-arabic-text">{ayah.arabicText}</p>

              {/* Translation text gives the English understanding for each ayah. */}
              <p className="ayah-translation-text">{ayah.translationText || "Translation unavailable."}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
