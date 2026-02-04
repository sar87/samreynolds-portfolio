---
phase: 13-content-sync
plan: 01
subsystem: content
tags: [publications, json, samreynolds.org, doi, academic]

# Dependency graph
requires:
  - phase: 05-data-layer
    provides: JSON data schema and content loading system
provides:
  - 14 real publications from samreynolds.org replacing synthetic placeholders
  - Optional DOI support for publications without DOI identifiers
  - Direct URL fallback for non-DOI publications
affects: [14-final-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Optional DOI with URL fallback for publications lacking formal DOI"

key-files:
  created: []
  modified:
    - data/publications.json
    - data/schemas/publication.schema.json
    - src/types/content.ts
    - src/pages/PublicationDetail.ts

key-decisions:
  - "14 published papers included (not 15) - 15th is 'in preparation' and not yet published"
  - "DOI made optional in schema to support Conservation Evidence publication without DOI"
  - "Added url field as fallback for direct-link publications"
  - "Author names use 'Last, F.' format consistently from samreynolds.org"

patterns-established:
  - "Optional DOI with url fallback: publications without DOI use url field instead"
  - "Author format: 'Last, F.' with isSamReynolds flag for highlighting"

# Metrics
duration: 4min
completed: 2026-02-04
---

# Phase 13 Plan 01: Publications Data Sync Summary

**14 real publications (2019-2025) from samreynolds.org replacing all synthetic placeholder data, with optional DOI support**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-04T21:13:21Z
- **Completed:** 2026-02-04T21:17:21Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Replaced all 15 synthetic placeholder publications with 14 real papers from samreynolds.org
- Papers span 2019-2025, covering Nature, TREE, PLoS ONE, Global Change Biology, and more
- Sam Reynolds correctly marked as author (isSamReynolds) in all publications
- Publications sorted reverse chronologically (newest first)
- Schema updated to support publications without DOI (e.g., Conservation Evidence synopsis)

## Task Commits

Each task was committed atomically:

1. **Tasks 1+2: Fetch and update publications data** - `2ac6c97` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `data/publications.json` - Complete replacement of 15 synthetic publications with 14 real papers from samreynolds.org
- `data/schemas/publication.schema.json` - Made DOI optional, added url field for direct-link publications
- `src/types/content.ts` - Made doi optional, added url field to Publication interface
- `src/pages/PublicationDetail.ts` - Updated to handle optional DOI with url fallback, conditional link rendering

## Decisions Made
- **14 vs 15 publications:** samreynolds.org lists 14 published papers plus 1 "in preparation" (targeting Biological Invasions). The in-prep paper was excluded as it has no DOI, no venue, and is not yet published. Including it would misrepresent the author's work.
- **DOI made optional:** The Eel Conservation in Inland Habitats paper (Conservation Evidence Series Synopsis) has no DOI - only a direct PDF link. Schema was updated to make DOI optional and add a `url` field as fallback.
- **Author name format:** Used "Last, F." format consistently (e.g., "Reynolds, S. A.") matching the citation style on samreynolds.org. Papers with many co-authors use "et al." as shown on the source.
- **Ordering among 2025 papers:** Matched the order shown on samreynolds.org (which appears to be most-recently-published first).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made DOI optional in schema and type system**
- **Found during:** Task 2 (updating publications.json)
- **Issue:** Eel Conservation paper has no DOI (only a direct URL to conservationevidence.com PDF). Schema required DOI with pattern `^10\.\d{4,}/`.
- **Fix:** Removed "doi" from required fields in schema, added optional `url` field, updated TypeScript interface, updated PublicationDetail.ts to use `pub.doi ? doiUrl : pub.url` fallback
- **Files modified:** data/schemas/publication.schema.json, src/types/content.ts, src/pages/PublicationDetail.ts
- **Verification:** Build passes, detail page renders correctly for both DOI and URL publications
- **Committed in:** 2ac6c97

**2. [Rule 1 - Bug] Publication count is 14 not 15**
- **Found during:** Task 1 (fetching publications from samreynolds.org)
- **Issue:** Plan expected 15 publications but samreynolds.org has 14 published + 1 in preparation
- **Fix:** Included only the 14 published papers. The 15th paper is "in preparation" and should not be presented as published.
- **Verification:** All 14 papers verified against samreynolds.org source

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both auto-fixes necessary for correctness. DOI optionality required to support real-world publication data. Count adjustment reflects accurate source data.

## Issues Encountered
- samreynolds.org pre-existing changes to about.json and MediaDetail.ts were present in working directory but unrelated to this plan - excluded from commit.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Publications data complete and ready for display
- Schema supports both DOI and direct URL publications
- Ready for plans 13-02 (media), 13-03 (about/bio), and 13-04 (research)

---
*Phase: 13-content-sync*
*Completed: 2026-02-04*
