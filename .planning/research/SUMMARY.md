# Research Summary: Pixel-Art Academic Portfolio Game Website

**Domain:** Dual-mode website (traditional + Pokemon-style pixel-art game)
**Researched:** 2026-01-30
**Overall confidence:** HIGH

## Executive Summary

Building a dual-mode academic portfolio with a Pokemon Fire Red/Leaf Green-style pixel-art game mode alongside a traditional website presents unique technical and content challenges. The domain sits at the intersection of three ecosystems: retro pixel-art browser games (governed by Phaser 3), legal free sprite assets (where Pokemon aesthetics collide with copyright), and academic portfolio conventions (where discoverability and professionalism trump novelty).

The good news: **Phaser 3.90 "Tsugumi" (released May 2025) is the definitive standard** for 2D browser games in 2026, with native pixel-art rendering, TypeScript support, Vite integration, and comprehensive documentation. The tooling ecosystem is mature and GitHub Pages deployment is straightforward with hash-based routing.

The challenge: **No free, legally-usable sprite library matches Pokemon Fire Red/Leaf Green aesthetics**. Official Pokemon sprites are copyrighted by Nintendo/Game Freak and absolutely cannot be used. The closest legal alternatives are:
- LPC (Liberated Pixel Cup) sprites (CC-BY-SA 3.0) - top-down Western RPG style, not GBA Pokemon style
- Kenney game assets (CC0) - general pixel art, lacks Pokemon visual identity
- itch.io "fakemon" packs - Pokemon-inspired but legally original

**The critical trade-off:** Accept a different visual style (LPC/Kenney) or invest in custom sprite creation. This constraint must be acknowledged early in roadmap planning.

The architecture is well-understood: dual-mode sites require **clean separation between presentation layers while sharing a unified content data layer**. Phaser handles the game canvas, vanilla HTML/CSS serves the traditional view, and both read from a single `content.json.js` source of truth. The codebase already demonstrates this pattern successfully.

## Key Findings

**Stack:** Phaser 3.90 + TypeScript + Vite for game; vanilla HTML or Astro for traditional site; GitHub Pages with hash routing; LPC/Kenney sprites (not Pokemon sprites due to copyright).

**Architecture:** Layered architecture with App Controller managing mode switching, shared Content Data layer, separate UI renderers for game vs traditional modes. Tilemap-based world structure with collision/interaction layers. Fixed timestep game loop. Programmatic sprite generation for GitHub Pages compatibility.

**Critical pitfall:** Sprite licensing landmines. Using copyrighted Pokemon sprites (even from "free" sources like PokeAPI) violates Nintendo copyright and risks legal action, particularly damaging for academic reputation. Must use CC0/CC-BY alternatives.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Asset Selection (CRITICAL)
**Why first:** Sprite license decisions and aesthetic trade-offs must be resolved before any implementation. Copyright violations discovered post-launch require complete asset replacement.

**Addresses:**
- Verify sprite licenses (CC0/CC-BY-SA only)
- Create attribution file for CC-BY assets
- Accept aesthetic compromise (LPC style ≠ Pokemon FRLG style)
- Set up Phaser 3 + TypeScript + Vite development environment

**Avoids:**
- Pitfall #1: Sprite licensing landmines
- Pitfall #3: GitHub Pages size budget (establish early)

**Duration:** 1 week
**Risk level:** HIGH (legal/aesthetic decisions with long-term impact)

---

### Phase 2: Core Game Engine
**Why second:** With sprites resolved, build the fundamental game loop, rendering pipeline, and camera system. Mobile performance characteristics are locked in early.

**Addresses:**
- Fixed timestep game loop
- Tilemap rendering with viewport culling
- Camera following player
- Pixel-perfect rendering config
- Mobile canvas optimization (layered canvas, no shadows in render loop)

**Avoids:**
- Pitfall #2: Mobile canvas performance collapse (test on Android by sprint 2)
- Anti-Pattern #2: Rendering during update pass
- Anti-Pattern #3: Absolute coordinates without camera

**Duration:** 2 weeks
**Risk level:** MEDIUM (performance testing critical)

---

### Phase 3: Player Movement & Collision
**Why third:** Core game mechanics that make the world navigable. Requires engine foundation from Phase 2.

**Addresses:**
- WASD/Arrow key input handling
- Character sprite animations (walk cycles)
- Tile-based collision detection
- Mobile touch controls (Rex virtual joystick plugin)

**Avoids:**
- Pitfall #7: Tile coordinate system errors (worldToTile/tileToWorld utilities)
- Pitfall #9: Keyboard focus management (canvas focus restoration)
- Pitfall #11: Touch control button sticking (touchcancel handlers)

**Duration:** 1-2 weeks
**Risk level:** LOW (well-understood patterns)

---

### Phase 4: Content Layer & Dual-Mode Foundation
**Why fourth:** Establish shared content structure before building interactions. Both modes must read from same source.

**Addresses:**
- Define content.json.js schema (research, publications, media, about)
- Build content renderer for traditional HTML mode
- App Controller for mode switching
- Hash-based routing implementation

**Avoids:**
- Anti-Pattern #1: Tight coupling between modes (shared data layer)
- Pitfall #12: Browser back button breaking game state (popstate handling)

**Duration:** 1 week
**Risk level:** LOW (architectural pattern already proven in codebase)

---

### Phase 5: Map Design & Building System
**Why fifth:** With player movement working, design the Cambridge campus map and building interiors.

**Addresses:**
- Campus map layout (30x40 tiles, dense design for <10s between buildings)
- Building entrance/exit system with spawn points
- Interior maps for each building
- Interaction layer metadata (doors, NPCs, objects)

**Avoids:**
- Pitfall #4: Making exploration tedious (compact layout, visual clarity)
- Pitfall #7: Tile coordinate calculation errors (debug visualization mode)

**Duration:** 2 weeks
**Risk level:** MEDIUM (UX testing needed to validate navigability)

---

### Phase 6: Interaction System & Content Integration
**Why sixth:** Connect game interactions to academic content. Requires both world design and content structure.

**Addresses:**
- Interaction prompts ("Press E to enter")
- Dialog system for NPC conversations
- Content overlays showing publications/research
- Building-to-content mapping

**Avoids:**
- Anti-Pattern #4: God object (separate Interaction module)
- Pitfall #8: Missing attribution (implement Credits screen)

**Duration:** 2 weeks
**Risk level:** MEDIUM (content presentation UX critical for portfolio goal)

---

### Phase 7: Polish & Mobile Optimization
**Why seventh:** After core features work, optimize performance and add visual polish.

**Addresses:**
- Animated environment elements (water, trees)
- Loading screens with progress bars
- Smooth camera transitions
- Mobile performance testing (Android/iOS)
- Sprite sheet optimization (PNG compression, indexed color)

**Avoids:**
- Pitfall #2: Mobile performance regressions (re-test after visual effects)
- Pitfall #3: GitHub Pages size budget (track cumulative asset sizes)
- Pitfall #10: High-DPI display canvas sizing

**Duration:** 1 week
**Risk level:** LOW (polish, not core functionality)

---

### Phase 8: User Testing & Accessibility
**Why last:** Validate with real users (including non-gamers) before launch.

**Addresses:**
- Non-gamer testing (academic colleagues)
- Mobile device testing (Android + iOS)
- Keyboard accessibility audit
- Content discoverability testing ("find specific publication in <2 minutes")

**Avoids:**
- Pitfall #4: Discovery bottlenecks (validated through testing)
- Pitfall #13: Game mode accessibility (ensure normal mode parity)

**Duration:** 1 week
**Risk level:** LOW (validation phase)

---

## Phase Ordering Rationale

**Sequential dependencies:**
1. **Assets → Engine → Movement** - Can't render without sprites, can't move without engine
2. **Content Structure → Interaction System** - Interactions must connect to content data
3. **Map Design → Content Integration** - Buildings must exist before linking content to locations

**Parallel opportunities:**
- Normal website mode can be developed alongside game engine (both consume same content data)
- Mobile controls can be implemented in parallel with desktop controls (separate input handlers)

**Critical path:**
Assets (Phase 1) → Engine (Phase 2) → Movement (Phase 3) → Content (Phase 4) → Maps (Phase 5) → Interactions (Phase 6)

**Optional path:**
Polish (Phase 7) and Testing (Phase 8) are enhancements, not blockers for MVP.

---

## Research Flags for Phases

**Phase 1 (Asset Selection):** HIGH research need
- Must verify specific sprite library licenses before committing
- Aesthetic trade-off decisions require stakeholder input
- LPC vs Kenney vs custom sprite evaluation needed

**Phase 2 (Core Engine):** Standard patterns, unlikely to need research
- Phaser 3 documentation is comprehensive
- Fixed timestep, viewport culling are well-documented patterns

**Phase 3 (Player Movement):** Standard patterns, unlikely to need research
- WASD input, collision detection are textbook implementations
- Rex virtual joystick has complete documentation

**Phase 4 (Content Layer):** Minor research possible
- JSON schema design straightforward
- Hash routing patterns well-documented

**Phase 5 (Map Design):** MEDIUM research need
- Campus layout requires UX testing to validate navigability
- Building visual design may need iteration based on sprite library constraints

**Phase 6 (Interaction System):** Standard patterns, unlikely to need research
- Dialog systems are solved patterns in game dev
- Content overlay UX is standard modal pattern

**Phase 7 (Polish):** Minor research possible
- Performance profiling may reveal unexpected bottlenecks
- Mobile optimization techniques well-documented

**Phase 8 (Testing):** No research, pure validation
- User testing provides empirical data, not research questions

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Phaser 3.90 verified as current version (May 2025). Vite + TypeScript confirmed as official template. Sources: Phaser official site, GitHub releases, multiple 2026 tutorials. |
| Sprite Assets | MEDIUM | LPC/Kenney licenses verified via OpenGameArt and official sites. **Gap:** Specific sprite packs matching Pokemon FRLG aesthetic not found. Aesthetic compromise unavoidable with free legal assets. |
| Architecture | HIGH | Patterns verified via MDN Tilemaps docs, Game Programming Patterns book, and production portfolio examples (Bruno Simon). Clean separation, shared content layer is proven approach. |
| Pitfalls | MEDIUM | Mobile performance issues, sprite licensing, GitHub Pages limits verified via MDN and GitHub official docs. UX pitfalls based on game design sources cross-verified with portfolio best practices. |
| Features | MEDIUM | Table stakes (movement, collision, mobile controls) are HIGH confidence (standard patterns). Differentiators (Easter eggs, NPCs, quest system) are MEDIUM confidence (implementation-dependent). |
| Deployment | HIGH | GitHub Pages deployment verified via official docs and Phaser community examples. Hash routing workaround confirmed in multiple 2026 sources. SPA limitations well-documented. |

---

## Gaps to Address

### Critical Gaps (Must resolve before Phase 1)

**1. Sprite aesthetic mismatch**
- **Gap:** No free legal sprites match Pokemon Fire Red/Leaf Green visual style exactly
- **Impact:** Visual identity of portfolio differs from original vision
- **Options:**
  - Accept LPC style (top-down Western RPG)
  - Commission custom sprites ($500-2000 estimate)
  - Create own sprites with Aseprite (time investment)
- **Recommendation:** Accept LPC style for MVP, consider custom art post-launch if budget allows

**2. Content volume unknown**
- **Gap:** Research doesn't specify how many publications, talks, projects to showcase
- **Impact:** Affects building count, map size, interaction density
- **Resolution:** Count existing academic content, plan 1 building per content category (Publications, Talks, Media, Research, About = 5 buildings)

---

### Non-Critical Gaps (Address during implementation)

**3. Mobile performance benchmarks**
- **Gap:** Specific FPS thresholds for "acceptable" mobile performance unknown
- **Impact:** Optimization targets unclear
- **Resolution:** Test on mid-range Android device (Pixel 6a or equivalent) in Phase 2, establish 30fps minimum target

**4. Optimal map size**
- **Gap:** Ideal tile dimensions for Cambridge campus map not established
- **Impact:** Could lead to tedious navigation or cramped feeling
- **Resolution:** Prototype 3 sizes (20x30, 30x40, 40x50) in Phase 5, time-test navigation

**5. Attribution UX pattern**
- **Gap:** Best practice for displaying CC-BY sprite attribution in game unclear
- **Impact:** Legal compliance requires visible credits, but UX pattern not researched
- **Resolution:** Implement Credits button in main menu + /attributions.html page (both approaches)

**6. Content presentation format**
- **Gap:** How to display publication metadata in game dialog (title, authors, abstract, link) not designed
- **Impact:** Could result in wall-of-text dialogs
- **Resolution:** Design modal overlay pattern in Phase 6, test with actual publication data

---

## Recommended Next Steps

### Immediate (Before Roadmap Creation)

1. **Resolve sprite aesthetic trade-off**
   - Review LPC sprite generator output
   - Evaluate Kenney pixel art style
   - Decide: Accept compromise or budget for custom sprites?
   - Stakeholder decision required

2. **Inventory academic content**
   - Count publications, talks, media items
   - Estimate building count needed
   - Define content categories for organization

3. **Verify GitHub Pages workflow**
   - Test Phaser 3 Vite template deployment to GitHub Pages
   - Confirm hash routing works as expected
   - Validate build process

### Phase-Specific Research Flags

**Phase 1 Research:**
- Finalize specific sprite pack selections
- Download and verify licenses for chosen assets
- Create ATTRIBUTION.md file template

**Phase 5 Research:**
- Cambridge campus layout references (for authentic building design)
- Tile size testing (16x16 vs 32x32 for different sprite libraries)

**Phase 7 Research:**
- Mobile performance profiling tools
- PNG optimization tool evaluation

---

## Sources Summary

Research drew from three source tiers:

**Tier 1 (HIGH confidence):** Official documentation
- Phaser 3 official site, MDN Game Development docs, GitHub official docs
- Context: Authoritative technical specifications

**Tier 2 (MEDIUM confidence):** Verified community sources
- OpenGameArt FAQs, Game Programming Patterns book, Creative Commons licensing guides
- Context: Expert knowledge cross-verified across multiple sources

**Tier 3 (LOW confidence):** WebSearch findings requiring validation
- Sprite library listings on itch.io, portfolio examples, UX best practices articles
- Context: Directional guidance requiring hands-on verification

All critical technical claims (Phaser version, license types, GitHub Pages limits) were verified via Tier 1 or Tier 2 sources.

---

## Ready for Roadmap

Research is complete and comprehensive enough to structure a detailed roadmap with:
- Clear phase structure (8 phases)
- Dependency ordering
- Risk assessment per phase
- Critical decision points flagged
- Gap mitigation strategies defined

**Key constraint to communicate:** Pokemon Fire Red/Leaf Green aesthetic is not achievable with free legal sprites. Visual style will differ from original vision. This trade-off must be accepted or addressed with custom sprite budget.

**Primary blocker:** Sprite library selection (LPC vs Kenney vs custom) must be decided before Phase 1 implementation begins.

Otherwise, the technology stack is solid, architecture is proven, and implementation path is clear.
