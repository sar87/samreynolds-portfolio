# Roadmap: Sam Reynolds Academic Website

## Milestones

- **v0.9 Beta** - Phases 1-9 (shipped 2026-02-02) - See `.planning/milestones/v0.9-ROADMAP.md`
- **v1.0 Professional Polish** - Phases 10-14 (in progress)

## Overview

Transforming the dual-mode academic portfolio into a polished professional website. The journey begins by archiving the game mode and removing mode switching, then establishes a light theme design foundation with halftone texture and accessibility support, adds Linear-style animations (scroll reveals, gradient text, hover micro-interactions), syncs all content from samreynolds.org, and concludes with mobile responsiveness testing and GitHub Pages deployment verification.

## Phases

- [x] **Phase 10: Architecture Cleanup** - Archive game, bypass landing, remove mode toggle
- [x] **Phase 11: Design Foundation** - Light theme with Playfair Display typography and reduced-motion support
- [x] **Phase 12: Animations** - Scroll reveals, gradient text, hover micro-interactions
- [ ] **Phase 13: Content Sync** - Update all content from samreynolds.org
- [ ] **Phase 14: Deployment** - Mobile responsiveness and GitHub Pages verification

## Phase Details

### Phase 10: Architecture Cleanup
**Goal**: Site loads directly to professional website with game code archived but preserved
**Depends on**: v0.9 completion
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):
  1. Site loads directly to main website content (no landing page choice)
  2. Game code files exist in codebase but are not imported or accessible
  3. Mode toggle button is removed from header and UI
  4. No console errors or broken imports from archived game code
**Plans**: 2 plans

Plans:
- [x] 10-01-PLAN.md — Remove game imports, simplify main.ts, clean Header
- [x] 10-02-PLAN.md — Archive game files to _archived/ directory

### Phase 11: Design Foundation
**Goal**: Site uses cohesive light theme with NYT-style typography that respects accessibility preferences
**Depends on**: Phase 10
**Requirements**: DESIGN-01, DESIGN-05
**Success Criteria** (what must be TRUE):
  1. All pages use off-white background (#fafafa) with dark text
  2. Playfair Display font for elegant editorial aesthetic (user-approved pivot from halftone)
  3. Color contrast meets WCAG AA standards (4.5:1 for text)
  4. Users with prefers-reduced-motion see no animations
  5. Design is consistent across all content sections
**Plans**: 4 plans

Plans:
- [x] 11-01-PLAN.md — Design tokens: light theme colors, shadow elevation, texture config
- [x] 11-02-PLAN.md — Global styles: halftone texture overlay, reduced-motion support
- [x] 11-03-PLAN.md — Component styling: Card/Header shadows, motion-safe transitions
- [x] 11-04-PLAN.md — Visual verification checkpoint (design pivot to Playfair Display)

### Phase 12: Animations
**Goal**: Site features Linear-style motion design with scroll reveals, gradient text, and hover effects
**Depends on**: Phase 11
**Requirements**: DESIGN-02, DESIGN-03, DESIGN-04
**Success Criteria** (what must be TRUE):
  1. Content sections fade/slide into view when scrolled into viewport
  2. Main headings display gradient text effects (color transitions)
  3. Cards lift with subtle shadow on hover
  4. Links and interactive elements have color shift on hover
  5. Animations are smooth (no jank on 60fps displays)
**Plans**: 4 plans

Plans:
- [x] 12-01-PLAN.md — Animation infrastructure: CSS utilities, TypeScript module, render integration
- [x] 12-02-PLAN.md — Scroll reveals: section fade/slide, staggered card animations
- [x] 12-03-PLAN.md — Gradient text and hover interactions: headings, cards, links
- [x] 12-04-PLAN.md — Visual verification checkpoint

### Phase 13: Content Sync
**Goal**: All academic content reflects current information from samreynolds.org
**Depends on**: Phase 10 (can run parallel with 11-12)
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04
**Success Criteria** (what must be TRUE):
  1. Publications list shows all 15 papers (2019-2025) with correct metadata
  2. Media section includes CIEEM podcast, COP30 video, Wildscreen panel, Cambridge feature
  3. About/bio section reflects current focus on AI + Conservation
  4. Research section describes evidence synthesis work and PhD research
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

### Phase 14: Deployment
**Goal**: Site is fully responsive and deployed successfully to GitHub Pages
**Depends on**: Phases 11, 12, 13
**Requirements**: DEPLOY-01, DEPLOY-02
**Success Criteria** (what must be TRUE):
  1. Site is readable and navigable on mobile devices (320px width minimum)
  2. All interactive elements are touch-friendly (44px minimum tap targets)
  3. GitHub Pages deployment builds and serves without errors
  4. Site loads and functions correctly on deployed URL
**Plans**: TBD

Plans:
- [ ] 14-01: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 10. Architecture Cleanup | v1.0 | 2/2 | Complete | 2026-02-02 |
| 11. Design Foundation | v1.0 | 4/4 | Complete | 2026-02-02 |
| 12. Animations | v1.0 | 4/4 | Complete | 2026-02-04 |
| 13. Content Sync | v1.0 | 0/TBD | Not started | - |
| 14. Deployment | v1.0 | 0/TBD | Not started | - |

---
*Created: 2026-02-02 for v1.0 Professional Polish milestone*
