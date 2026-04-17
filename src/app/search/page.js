"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// This constant controls debounce timing so rapid typing does not spam the API.
const SEARCH_DEBOUNCE_MS = 350;

// This helper maps unknown API payloads into a safe array shape.
function toResultArray(value) {
  return Array.isArray(value) ? value : [];
}

// This page provides translation search against the server-side search endpoint.
export default function SearchPage() {
  // This state holds raw input so the user sees immediate typing feedback.
  const [query, setQuery] = useState("");

  // This state stores current search results for rendering the results list.
  const [results, setResults] = useState([]);

  // This state indicates async request lifecycle for loading indicators.
  const [isLoading, setIsLoading] = useState(false);

  // This state stores user-visible error text when a request fails.
  const [errorMessage, setErrorMessage] = useState("");

  // This memoized value avoids re-trimming query text on unrelated re-renders.
  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    // Empty input clears stale data and avoids unnecessary network calls.
    if (!trimmedQuery) {
      setResults([]);
      setErrorMessage("");
      setIsLoading(false);
      return undefined;
    }

    // AbortController prevents race conditions when users type quickly.
    const abortController = new AbortController();

    // Debounce timer batches keystrokes into fewer requests.
    const timerId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        // The POST request sends query text to the same-port search API route.
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: trimmedQuery }),
          signal: abortController.signal,
        });

        // Non-OK responses are converted into meaningful UI errors.
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const message = typeof payload?.error === "string" ? payload.error : "Search failed.";
          throw new Error(message);
        }

        // Successful payloads are normalized before storing in state.
        const payload = await response.json();
        setResults(toResultArray(payload?.results));
      } catch (error) {
        // Aborted requests are expected during fast typing and should be ignored.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        // Any other errors are surfaced in a friendly and stable message.
        setResults([]);
        setErrorMessage(error instanceof Error ? error.message : "Search failed.");
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    // Cleanup clears debounce timer and cancels in-flight requests on re-run/unmount.
    return () => {
      window.clearTimeout(timerId);
      abortController.abort();
    };
  }, [trimmedQuery]);

  return (
    <main className="search-page">
      {/* This top row keeps navigation pathways obvious across core app pages. */}
      <div className="search-topbar">
        <Link href="/" className="back-link">
          Back To Surah List
        </Link>
        <Link href="/settings" className="back-link secondary-back-link">
          Reader Settings
        </Link>
      </div>

      {/* Heading and subtitle describe search scope and expected query type. */}
      <header className="search-header">
        <h1 className="search-title">Search Translation</h1>
        <p className="search-subtitle">Type any English word or phrase to find matching ayat translations.</p>
      </header>

      {/* Search input is controlled for predictable UI state management. */}
      <section className="search-input-section" aria-label="Search input">
        <label htmlFor="translation-search" className="search-label">
          Translation Query
        </label>
        <input
          id="translation-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: mercy, guidance, worship"
          className="search-input"
        />
      </section>

      {/* Async and error feedback keeps users informed during search operations. */}
      {isLoading ? <p className="search-status">Searching...</p> : null}
      {errorMessage ? <p className="search-error">{errorMessage}</p> : null}

      {/* Results section renders total context and each matched ayah reference block. */}
      <section className="search-results" aria-label="Search results">
        {trimmedQuery && !isLoading && results.length === 0 && !errorMessage ? (
          <p className="search-empty">No matches found for &quot;{trimmedQuery}&quot;.</p>
        ) : null}

        {results.map((result) => (
          <article key={`${result.surahId}-${result.ayahNumber}-${result.text}`} className="search-result-card">
            {/* Metadata row gives Surah and Ayah reference for navigation context. */}
            <p className="search-result-meta">
              Surah {result.surahId}
              {result.surahNameEnglish ? ` - ${result.surahNameEnglish}` : ""}
              {result.surahNameArabic ? ` (${result.surahNameArabic})` : ""}
              {` | Ayah ${result.ayahNumber}`}
            </p>

            {/* Translation snippet is the matching text payload from the search API. */}
            <p className="search-result-text">{result.text}</p>

            {/* This action allows immediate transition from search result to Surah view. */}
            <Link href={`/surah/${result.surahId}`} className="search-result-link">
              Open Surah
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
