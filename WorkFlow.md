# Quran Web Application (QWA) - Implementation Workflow

This workflow defines the full project implementation path for the MVP described in:
- QWA_Overview.md
- QWA_FrontendGuide.md
- QWA_BackendGuide.md

Project constraints:
- JavaScript only (no TypeScript)
- Next.js app with minimal backend on same port (API Routes)
- Black + Navy UI theme
- Minimal feature set only (no audio, no tafsir, no auth, no DB)

Note on structure:
- Current codebase uses `src/app`.
- All page and API route tasks below should be implemented under `src/app/...` and shared helpers under `src/lib/...` to match the existing repository structure.

## Phase 0 - Discovery, Scope Lock, and Architecture Baseline

### Goals
- Lock the exact MVP scope and non-goals.
- Confirm data source shape and routing strategy.
- Define implementation standards before coding.

### Tasks
- Review and freeze required features:
  - Surah list page (114 surahs)
  - Surah detail page with ayat + English translation
  - Search on English translation text
  - Settings (Arabic font family, Arabic size, translation size) persisted in localStorage
- Freeze non-goals:
  - No audio recitation
  - No tafsir
  - No accounts/auth
  - No database
  - No multi-translation support
- Confirm route design:
  - `src/app/page.js`
  - `src/app/surah/[id]/page.js`
  - `src/app/search/page.js`
  - `src/app/settings/page.js`
- Confirm API surface:
  - `src/app/api/quran/route.js`
  - `src/app/api/quran/[id]/route.js`
  - `src/app/api/search/route.js`
- Decide data loading model:
  - Primary: static JSON dataset from `public/quran-json/`
  - Helper layer in `src/lib/quran.js`
  - Optional in-memory cache for repeated API requests
- Define quality baseline:
  - Responsive layout (mobile-first)
  - Basic accessibility (contrast, semantic structure)
  - Basic performance checks (payload and route behavior)

### Deliverables
- Finalized scope checklist
- Agreed route map and folder map
- Dataset contract documented (required fields for surah, ayah, translation)

### Exit Criteria
- No unresolved feature/scope questions remain.
- Team can begin implementation without architecture ambiguity.

## Phase 1 - Foundation and Data Layer Setup

### Goals
- Prepare project foundation for fast implementation.
- Install and verify data availability and utility helpers.

### Tasks
- Prepare/verify dataset files in `public/quran-json/`:
  - Surah metadata list
  - Ayat data grouped or indexable by surah id
  - Translation data searchable by text
- Create shared data utilities in `src/lib/quran.js`:
  - Read/load surah list
  - Read/load surah ayat by id
  - Read/load translation dataset
  - Normalize IDs and defensive validation
  - Optional memoized in-memory cache
- Create settings utilities in `src/lib/settings.js`:
  - Read default settings
  - Read from localStorage safely
  - Persist settings to localStorage
  - Validation and fallback values
- Define UI base theme in global CSS/Tailwind tokens:
  - Black `#0A0A0A`
  - Navy `#0D1B2A`
  - Light readable text
- Verify local development environment and scripts run cleanly.

### Deliverables
- Stable dataset folder in `public/quran-json/`
- Reusable helper modules in `src/lib/`
- Baseline global theme tokens/styles

### Exit Criteria
- Data can be loaded reliably from helpers.
- Settings helper API is stable and safe against missing localStorage values.

## Phase 2 - Core Reading Experience (Surah List + Surah Detail)

### Goals
- Build the two primary reading journeys end-to-end.
- Ensure static generation strategy is applied where suitable.

### Tasks
- Implement Surah list page (`src/app/page.js`):
  - Display all 114 surahs
  - Show Arabic name, English name, surah number
  - Link each item to `/surah/[id]`
- Implement Surah detail page (`src/app/surah/[id]/page.js`):
  - Load ayat for selected surah
  - Render Arabic text and English translation for each ayah
  - Add clear surah heading/context
- Configure SSG behavior for list/detail routes (according to current Next version conventions).
- Add loading/error-safe states for invalid/missing surah id.
- Ensure readability and spacing on mobile and desktop.

### Deliverables
- Functional Surah index page
- Functional per-surah ayat page
- Stable static generation approach for content routes

### Exit Criteria
- User can navigate from list to any surah detail and read ayat + translation smoothly.
- Invalid ids are handled without app-breaking errors.

## Phase 3 - Search and Minimal Backend API Routes

### Goals
- Deliver translation search UX.
- Provide minimal backend endpoints required by MVP.

### Tasks
- Implement API endpoints:
  - `src/app/api/quran/route.js`: returns surah list
  - `src/app/api/quran/[id]/route.js`: returns ayat for surah id
  - `src/app/api/search/route.js`: accepts query and returns matching translation ayat
- Add input validation and safe error responses for API routes.
- Implement search page (`src/app/search/page.js`):
  - Query input
  - Trigger search (client-side filtering or API call as selected in design)
  - Render results with ayah context and surah reference
- Optimize response handling:
  - Debounce search input (if live search)
  - Avoid unnecessary repeated dataset parsing
- Verify same-port architecture (frontend + API routes in same Next app).

### Deliverables
- Working search page
- Working minimal API route set
- Consistent response structure and error behavior

### Exit Criteria
- Search returns relevant translation matches.
- API endpoints return expected data and status codes for normal/invalid requests.

## Phase 4 - Settings, Personalization, and UX Refinement

### Goals
- Enable user control over reading comfort.
- Improve polish while keeping app minimal.

### Tasks
- Implement settings page (`src/app/settings/page.js`) with controls for:
  - Arabic font family (at least 2 options)
  - Arabic font size
  - Translation font size
- Persist settings using localStorage via `src/lib/settings.js`.
- Apply settings consistently across Surah detail and relevant views.
- Refine dark UI polish:
  - Maintain Black + Navy direction
  - Improve typographic hierarchy
  - Ensure spacing consistency
- Accessibility pass:
  - Contrast checks
  - Keyboard focus visibility
  - Semantic headings/landmarks
- Responsive pass for common breakpoints.

### Deliverables
- Functional settings screen with persistent preferences
- Settings reflected in reading UI
- Improved visual and interaction consistency

### Exit Criteria
- Refreshing browser preserves settings.
- Reading view correctly reflects selected fonts/sizes.

## Phase 5 - QA, Performance Hardening, Documentation, and Release

### Goals
- Make MVP production-ready and maintainable.
- Verify app behavior against original scope.

### Tasks
- Full feature QA against scope checklist.
- Regression QA across routes:
  - `/`
  - `/surah/[id]`
  - `/search`
  - `/settings`
  - `/api/quran`
  - `/api/quran/[id]`
  - `/api/search`
- Data integrity checks:
  - All 114 surahs listed
  - Surah/ayah references consistent between pages and search
- Performance checks:
  - Validate route render performance
  - Ensure API responses are lightweight and stable
- Clean code pass:
  - Remove dead code and unused assets
  - Confirm no scope creep features slipped in
- Update README with:
  - Setup and run instructions
  - Dataset placement instructions
  - Route/API summary
  - Feature scope and non-goals
- Deployment dry run and post-deploy sanity checks.

### Deliverables
- QA sign-off checklist
- Final README update
- Release-ready MVP build

### Exit Criteria
- All MVP features complete and verified.
- No high-severity defects remain.
- Documentation is sufficient for handoff and future maintenance.

## Cross-Phase Rules (Apply Throughout)

- Keep implementation minimal and aligned to MVP only.
- Prefer straightforward, readable JavaScript over abstraction-heavy design.
- Avoid introducing any feature not listed in scope.
- Maintain consistent API response contracts.
- Keep visual theme anchored to Black + Navy with readable contrast.

## Suggested Milestone Sequence

- Milestone A: Phase 0 + Phase 1 complete
- Milestone B: Phase 2 complete (core reading usable)
- Milestone C: Phase 3 complete (search + APIs usable)
- Milestone D: Phase 4 complete (settings + UX polish)
- Milestone E: Phase 5 complete (QA + release)
