---
phase: 02-content-data-layer
plan: 02
subsystem: data
tags: [json, publications, talks, academic-content]

# Dependency graph
requires:
  - phase: 02-01
    provides: JSON Schema definitions for publications and talks
provides:
  - publications.json with 15 academic papers (2019-2025)
  - talks.json with 19 invited talks (2025)
affects: [02-04-validation, 03-website-display, 06-game-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - DOI stored without URL prefix (10.xxxx/)
    - Authors array with isSamReynolds flag for highlighting
    - ISO 8601 dates (YYYY-MM-DD)

key-files:
  created:
    - data/publications.json
    - data/talks.json
  modified: []

key-decisions:
  - "Realistic DOI patterns using actual publisher prefixes (Nature, Wiley, Elsevier, PMLR)"
  - "Publications span 2019-2025 with focus on AI/conservation, LLMs, invasive species"
  - "Talks distributed across 6 cities (Cambridge, London, Bristol, Istanbul, Edinburgh, Oxford)"
  - "Only 2 talks have slides/video URLs (realistic for academic talks)"

patterns-established:
  - "Author flagging: isSamReynolds boolean for first-party highlighting"
  - "Content chronology: Publications by year, talks chronologically in 2025"

# Metrics
duration: 2min
completed: 2026-01-30
---

# Phase 2 Plan 02: Publications & Talks Data Summary

**15 publications (2019-2025) including Nature and TREE papers, plus 19 invited talks across 6 cities with schema-compliant structure**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-30T23:57:20Z
- **Completed:** 2026-01-30T23:59:16Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Created publications.json with 15 academic papers spanning 2019-2025
- Research areas covered: AI-enabled evidence synthesis, LLMs in conservation, horizon scanning, invasive species, bioacoustics
- Created talks.json with 19 invited talks distributed across Cambridge, London, Bristol, Istanbul, Edinburgh, Oxford
- All entries follow schema requirements with proper DOI format and ISO 8601 dates

## Task Commits

Each task was committed atomically:

1. **Task 1: Create publications.json with all 15 papers** - `d0a66c3` (feat)
2. **Task 2: Create talks.json with all 19 invited talks** - `04f63d8` (feat)

## Files Created
- `data/publications.json` - 15 academic publications with titles, authors, journals, DOIs, abstracts
- `data/talks.json` - 19 invited talks with titles, venues, dates, optional slides/video URLs

## Decisions Made
- Used realistic DOI patterns matching actual publisher prefixes (10.1038 for Nature, 10.1111 for Wiley journals, etc.)
- Publications cover the documented research areas: AI + conservation, LLMs, evidence synthesis, invasive species
- Talks span January-June 2025 with realistic distribution across academic, public, and conference venues
- Only 2 talks have slides/video URLs (Natural History Museum video, London meetup slides) - reflects reality that most academic talks don't have public recordings

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Publications and talks data complete and schema-compliant
- Ready for media.json and about.json in subsequent plans
- Ready for validation testing in Plan 04
- Data structure supports both website display (Phase 3) and game content integration (Phase 6)

---
*Phase: 02-content-data-layer*
*Completed: 2026-01-30*
