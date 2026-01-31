# Roadmap: Sam Reynolds Academic Website

## Overview

Building a dual-mode academic portfolio website that offers visitors a choice between exploring a pixel-art Cambridge campus as a game or navigating a traditional professional website. The journey begins with legally-safe sprite selection, establishes shared content infrastructure, builds parallel game and website experiences, then connects them through interactions and a polished landing experience optimized for mobile devices.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Asset Selection** - Legal sprite licensing and development setup
- [x] **Phase 2: Content Data Layer** - Structured JSON content for all academic material
- [x] **Phase 3: Website Mode** - Traditional academic portfolio layout
- [ ] **Phase 4: Core Game Engine** - Rendering, movement, camera, collision
- [ ] **Phase 5: Campus & Buildings** - Cambridge map design and building interiors
- [ ] **Phase 6: Interactions & Content Integration** - Connect game objects to academic content
- [ ] **Phase 7: Landing & Mode Switching** - Splash screen and seamless mode transitions
- [ ] **Phase 8: Polish & Mobile Optimization** - Animations, performance, final touches

## Phase Details

### Phase 1: Foundation & Asset Selection
**Goal**: Development environment ready with legally-verified sprite assets and attribution system
**Depends on**: Nothing (first phase)
**Requirements**: TECH-03, VIS-01
**Success Criteria** (what must be TRUE):
  1. All sprite assets have verified CC0 or CC-BY-SA licenses with documentation saved
  2. Attribution file created listing all asset sources and license requirements
  3. Development environment (Vite + TypeScript) builds and serves locally
  4. Sample sprite renders correctly at target scale (32x32 tiles at 2x scale)
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md - Dev environment setup + LPC asset collection with attribution
- [x] 01-02-PLAN.md - Sprite integration and visual verification

### Phase 2: Content Data Layer
**Goal**: All academic content structured in JSON files ready for both game and website modes
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06
**Success Criteria** (what must be TRUE):
  1. Publications JSON contains all 15 papers with title, authors, journal, year, DOI, abstract
  2. Talks JSON contains all 19 invited talks with title, venue, date
  3. Media JSON contains podcast, panel, video appearances with type, title, venue, date, link
  4. Research JSON contains topics with descriptions and related publications
  5. About JSON contains bio, education, contact links
  6. Content files validate against defined JSON schema (structure is consistent)
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md - Install Ajv and create JSON schemas for all content types
- [x] 02-02-PLAN.md - Create publications.json and talks.json
- [x] 02-03-PLAN.md - Create media.json and about.json
- [x] 02-04-PLAN.md - Create research.json and validation script

### Phase 3: Website Mode
**Goal**: Professional academic portfolio website displays all content in traditional layout
**Depends on**: Phase 2
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05, WEB-06, WEB-07
**Success Criteria** (what must be TRUE):
  1. About section displays bio, education, contact links from content data
  2. Publications section lists all 15 papers with accessible links
  3. Talks section lists all 19 invited talks with venue and date
  4. Media section shows podcast, panels, video appearances with links
  5. Research section displays topics and descriptions
  6. Website layout is mobile responsive (readable and navigable on phone)
  7. Website renders correctly on desktop browsers (Chrome, Firefox, Safari)
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md - Foundation: Design system, TypeScript types, hash router
- [x] 03-02-PLAN.md - Components: Header, Section, and Card components
- [x] 03-03-PLAN.md - Pages: HomePage and detail pages
- [x] 03-04-PLAN.md - Integration and visual verification

### Phase 4: Core Game Engine
**Goal**: Player can move around a simple test map with smooth camera and collision detection
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-03, NAV-06, VIS-02
**Success Criteria** (what must be TRUE):
  1. Player character moves with arrow keys and WASD
  2. Camera smoothly follows player keeping them centered in viewport
  3. Collision detection prevents player walking through walls and obstacles
  4. 32x32 tile-based rendering displays at consistent scale (2x)
  5. Game loop runs at stable framerate (30+ FPS on development machine)
**Plans**: 4 plans

Plans:
- [ ] 04-01-PLAN.md - Core systems: GameLoop, Input, Camera
- [ ] 04-02-PLAN.md - Map and collision: TileMap, Collision, test map data
- [ ] 04-03-PLAN.md - Player and Renderer with viewport culling
- [ ] 04-04-PLAN.md - Game integration and verification

### Phase 5: Campus & Buildings
**Goal**: Complete Cambridge campus map with five explorable building interiors
**Depends on**: Phase 4
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-06, MAP-07, MAP-08
**Success Criteria** (what must be TRUE):
  1. Campus map includes paths, grass, trees, water (River Cam) with cohesive aesthetic
  2. Player can walk to and enter all five buildings (Pembroke, Library, Lab, TV Station, Theatre)
  3. Each building has distinct exterior design recognizable from campus view
  4. Building interiors are themed to content (books in library, equipment in lab, etc.)
  5. Player can exit buildings to return to campus map
  6. Navigation between buildings takes less than 30 seconds (map is appropriately sized)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD during phase planning

### Phase 6: Interactions & Content Integration
**Goal**: Interactive objects in buildings display academic content in panel overlays
**Depends on**: Phase 5, Phase 2
**Requirements**: INT-01, INT-02, INT-03, INT-04, INT-05, INT-06
**Success Criteria** (what must be TRUE):
  1. Interaction prompts appear when player is near interactive objects (e.g., "Press ENTER")
  2. Interacting with bookcase displays publication list in panel overlay
  3. Interacting with lab equipment displays research interests in panel overlay
  4. Interacting with TV/radio displays media appearances in panel overlay
  5. Interacting with podium displays talks list in panel overlay
  6. Panels can be closed with key/button to return to exploration
  7. Location indicator shows current building name in HUD
**Plans**: TBD

Plans:
- [ ] 06-01: TBD during phase planning

### Phase 7: Landing & Mode Switching
**Goal**: Visitors choose between game and website modes via polished landing screen
**Depends on**: Phase 3, Phase 6
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, WEB-08, TECH-04
**Success Criteria** (what must be TRUE):
  1. Landing splash displays clear choice: "Explore Campus" or "View Website"
  2. Landing includes brief intro text about Sam Reynolds
  3. Landing shows animated pixel art campus preview
  4. Skip-to-content links provide direct access (Publications, Talks, Research, About)
  5. Choosing "Explore Campus" loads game mode smoothly
  6. Choosing "View Website" loads traditional website smoothly
  7. Transition between game and website modes is animated and seamless
  8. Loading screen shows progress while game assets load
**Plans**: TBD

Plans:
- [ ] 07-01: TBD during phase planning

### Phase 8: Polish & Mobile Optimization
**Goal**: Game runs smoothly on mobile devices with touch controls and polished animations
**Depends on**: Phase 7
**Requirements**: NAV-02, NAV-07, VIS-03, VIS-04, VIS-05, TECH-01, TECH-02, TECH-05
**Success Criteria** (what must be TRUE):
  1. Player can move with touch D-pad on mobile devices
  2. Character displays walk cycle animation when moving (4 directions)
  3. Interactive objects are visually distinct from background tiles
  4. Environment has animated elements (water ripples, tree sway)
  5. Game runs at 30+ FPS on mid-range Android device (Pixel 6a or similar)
  6. Game runs at 30+ FPS on iPhone (recent model)
  7. Site deploys successfully to GitHub Pages with all assets
  8. Credits/attribution accessible from game menu showing sprite licenses
**Plans**: TBD

Plans:
- [ ] 08-01: TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Asset Selection | 2/2 | Complete | 2026-01-30 |
| 2. Content Data Layer | 4/4 | Complete | 2026-01-31 |
| 3. Website Mode | 4/4 | Complete | 2026-01-31 |
| 4. Core Game Engine | 0/4 | Planned | - |
| 5. Campus & Buildings | 0/? | Not started | - |
| 6. Interactions & Content Integration | 0/? | Not started | - |
| 7. Landing & Mode Switching | 0/? | Not started | - |
| 8. Polish & Mobile Optimization | 0/? | Not started | - |
