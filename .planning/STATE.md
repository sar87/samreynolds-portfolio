# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-02)

**Core value:** Visitors access academic work through a visually striking, professional interface
**Current focus:** v1.0 Professional Polish - Phase 14 Deployment

## Current Position

Phase: 14 of 14 (Deployment)
Plan: 2 of TBD
Status: In progress
Last activity: 2026-02-15 - Completed 14-02-PLAN.md (GitHub Pages configuration)

Progress: [###################.] 95% (v0.9 complete, v1.0 phases 10-13 done, 14 in progress)

## Performance Metrics

**v0.9 Stats (archived):**
- Total plans completed: 36
- Phases completed: 8 (1-7, 9)
- Lines of code: ~8,600
- Timeline: 3 days

**v1.0 Stats:**
- Total plans completed: 19 (Phase 10: 2, Phase 11: 4, Phase 12: 4, Phase 13: 4, Phase 14: 2)
- Phases completed: 4 (10, 11, 12, 13)
- Phases remaining: 1 (14 in progress)
- Requirements: 14 (14 complete: DEPLOY-01, DEPLOY-02)

## Accumulated Context

### Decisions

**v1.0 pivot decisions (from PROJECT.md):**
- Archive game mode: Focus on polished professional website
- Light theme with blue accent (#0066cc)
- Linear-style animations: Scroll reveals, gradient text, hover micro-interactions

**Phase 11 design decisions (from visual verification):**
- **Font**: Playfair Display (Google Fonts) for NYT-style editorial aesthetic
- **Halftone texture**: Removed entirely per user preference (clean look preferred)
- **Typography scale**: Enlarged (base 18px, headings 48px)
- **Shadows**: Layered shadow tokens (sm, md, lg) for card/header elevation
- **Accessibility**: Comprehensive reduced-motion support

**Phase 12 animation decisions:**
- Scroll reveals: Sections fade/slide in, cards stagger with 50ms delay
- Gradient text: 5s cycle, ambient effect (charcoal -> blue -> charcoal)
- Card hover: -6px lift with shadow-lg
- Link hover: Animated underline sweep

**Phase 13 content decisions:**
- 14 published papers (not 15) - 15th is "in preparation" and excluded
- DOI made optional in schema to support publications without DOI
- Added url field as fallback for direct-link publications
- Author format: "Last, F." with isSamReynolds flag
- Bio text taken verbatim from samreynolds.org for tone fidelity
- Research simplified from 6 topics to 2 areas (Conservation+AI, PhD Research)
- Education corrected: PhD Zoology 2021, MSc Environmental Bioscience 2013, BSc 2011
- Links: ResearchGate, LinkedIn, Scholar, Department
- CIEEM podcast uses direct MP3 audio element (not Spotify iframe)
- Media schema updated with embedUrl field
- Linear-style 3D perspective showcase for Nature featured work
- Profile photo in sidebar layout with education below
- Publication and media images with hover zoom on cards
- 18 real talks replacing fabricated placeholders

**Phase 14 deployment decisions:**
- Base path conditional on GITHUB_PAGES env var (local dev: '/', GitHub Pages: '/Website/')
- Repository name 'Website' assumed from directory (will need update if GitHub repo differs)
- CSS and JS minification added to build config
- GitHub Actions v4 official Pages actions for deployment

### Pending Todos

- **Next:** GitHub repository creation and deployment verification

### Blockers/Concerns

None currently.

## Session Continuity

Last session: 2026-02-15
Stopped at: Phase 14 plan 02 complete (GitHub Pages configuration)
Resume file: None

### Key Context for Next Session

**Phase 14 plans completed:**
- [x] 14-01: Mobile responsiveness (verified and approved)
- [x] 14-02: GitHub Pages configuration (Vite config + CI/CD workflow)

**Deployment configuration complete:**
- Vite config with conditional base path (GITHUB_PAGES env var)
- GitHub Actions workflow ready for automated deployment
- Production builds verified in both local and GitHub Pages modes
- All static assets confirmed in build output

**Next steps:**
1. Create GitHub repository (no remote configured yet)
2. Push code and enable GitHub Pages in repo settings
3. Verify deployment at https://[username].github.io/Website/
4. Test deployed site functionality

**Build status:** Clean, passing

**How to run:**
```bash
npm run dev                    # Vite dev server on localhost:5173
npm run build                  # Local build (base: '/')
GITHUB_PAGES=true npm run build  # GitHub Pages build (base: '/Website/')
npm run preview                # Preview local build
```

---
*Updated: 2026-02-15 after Phase 14-02 completion*
