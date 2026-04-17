"use client";

import { useEffect, useMemo, useState } from "react";

// This component provides manual-only slide navigation for Surah ayat.
export default function AyahSlider({ ayat, initialAyahNumber = null }) {
  // Current slide index tracks the visible ayah panel.
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!Array.isArray(ayat) || ayat.length === 0 || !initialAyahNumber) {
      return 0;
    }

    const matchedIndex = ayat.findIndex((ayah) => ayah.ayahNumber === initialAyahNumber);
    return matchedIndex >= 0 ? matchedIndex : 0;
  });

  // Total count is memoized for minor render efficiency and readability.
  const totalAyat = useMemo(() => ayat.length, [ayat.length]);

  // When query params change on the same route, sync to the requested ayah.
  useEffect(() => {
    if (!initialAyahNumber || totalAyat === 0) {
      return;
    }

    const matchedIndex = ayat.findIndex((ayah) => ayah.ayahNumber === initialAyahNumber);
    if (matchedIndex >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(matchedIndex);
    }
  }, [ayat, initialAyahNumber, totalAyat]);

  // Prev/next are explicit user-driven actions with no auto-sliding behavior.
  const goToPrev = () => {
    setActiveIndex((current) => (current === 0 ? 0 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === totalAyat - 1 ? totalAyat - 1 : current + 1));
  };

  // Guard handles unexpected empty input without rendering slider controls.
  if (totalAyat === 0) {
    return null;
  }

  return (
    <section className="ayah-slider" aria-label="Ayah slider">
      {/* Controls are placed at the top of the panel for direct manual navigation. */}
      <div className="ayah-slider-controls">
        <button
          type="button"
          onClick={goToPrev}
          disabled={activeIndex === 0}
          className="ayah-slider-button"
          aria-label="Go to previous ayah"
        >
          Prev
        </button>

        <p className="ayah-slider-counter" aria-live="polite">
          {activeIndex + 1} / {totalAyat}
        </p>

        <button
          type="button"
          onClick={goToNext}
          disabled={activeIndex === totalAyat - 1}
          className="ayah-slider-button"
          aria-label="Go to next ayah"
        >
          Next
        </button>
      </div>

      {/* Slider viewport masks off-screen slides while preserving smooth transitions. */}
      <div className="ayah-slider-viewport">
        <div
          className="ayah-slider-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {ayat.map((ayah, index) => (
            <article
              key={`${ayah.surahId}-${ayah.ayahNumber}`}
              className="ayah-slide"
              aria-hidden={index !== activeIndex}
            >
              <p className="ayah-number">Ayah {ayah.ayahNumber}</p>

              {/* Decorative Arabic frame gives each ayah a focused reading presence. */}
              <div className="ayah-arabic-frame">
                <p className="ayah-arabic-text">{ayah.arabicText}</p>
              </div>

              <p className="ayah-translation-text">{ayah.translationText || "Translation unavailable."}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
