# Requirements: Sam Reynolds Academic Website

**Defined:** 2026-01-30
**Core Value:** Visitors discover academic work through engaging pixel-art Cambridge exploration, with traditional website as alternative

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Landing Experience

- [ ] **LAND-01**: Landing splash displays mode choice: "Explore Campus" or "View Website"
- [ ] **LAND-02**: Landing includes brief intro text about Sam Reynolds
- [ ] **LAND-03**: Landing shows animated pixel art campus preview
- [ ] **LAND-04**: Landing provides skip-to-content links (Publications, Talks, Research, About)

### Game Navigation

- [ ] **NAV-01**: Player can move with arrow keys / WASD
- [ ] **NAV-02**: Player can move with touch D-pad on mobile
- [ ] **NAV-03**: Collision detection prevents walking through walls/objects
- [ ] **NAV-04**: Player can enter buildings by walking to doors
- [ ] **NAV-05**: Player can exit buildings to return to campus
- [ ] **NAV-06**: Camera smoothly follows player movement
- [ ] **NAV-07**: Character displays walk cycle animation when moving

### Game Interactions

- [ ] **INT-01**: Interaction prompts appear near interactive objects ("Press ENTER")
- [ ] **INT-02**: Interacting with objects opens content panel overlay
- [ ] **INT-03**: Panel overlays display formatted academic content (publications, talks, etc.)
- [ ] **INT-04**: Panels can be closed to return to exploration
- [ ] **INT-05**: Location indicator in HUD shows current building name
- [ ] **INT-06**: Context-aware dialog recognizes returning visitors ("Welcome back!")

### Campus & Buildings

- [ ] **MAP-01**: Cambridge campus map with paths, grass, trees, water (River Cam)
- [ ] **MAP-02**: Pembroke College building (About Me content)
- [ ] **MAP-03**: University Library building (Publications content)
- [ ] **MAP-04**: Research Laboratory building (Research Interests content)
- [ ] **MAP-05**: TV/Radio Station building (Media Appearances content)
- [ ] **MAP-06**: Lecture Theatre building (Talks content)
- [ ] **MAP-07**: Each building has distinct exterior design
- [ ] **MAP-08**: Building interiors themed to their content (books in library, equipment in lab)

### Visual Style

- [ ] **VIS-01**: Consistent LPC/Kenney pixel art style throughout
- [ ] **VIS-02**: 16x16 tile-based rendering with appropriate scale
- [ ] **VIS-03**: Player character sprite with 4 directional walk cycles
- [ ] **VIS-04**: Animated environment elements (water ripples, tree sway)
- [ ] **VIS-05**: Interactive objects visually distinct from background

### Website Mode

- [ ] **WEB-01**: Professional academic portfolio layout
- [ ] **WEB-02**: About section with bio, education, contact links
- [ ] **WEB-03**: Publications section listing all 15 papers with links
- [ ] **WEB-04**: Talks section listing all 19 invited talks
- [ ] **WEB-05**: Media section with podcast, panels, video appearances
- [ ] **WEB-06**: Research section describing current interests
- [ ] **WEB-07**: Mobile responsive design
- [ ] **WEB-08**: Smooth animated transition between game and website modes

### Content Data

- [ ] **DATA-01**: All content stored in structured JSON files
- [ ] **DATA-02**: Publications include title, authors, journal, year, DOI, abstract
- [ ] **DATA-03**: Talks include title, venue, date, description
- [ ] **DATA-04**: Media includes type (podcast/panel/video), title, venue, date, link
- [ ] **DATA-05**: Research includes topic, description, related publications
- [ ] **DATA-06**: About includes bio, education, contact links

### Technical

- [ ] **TECH-01**: Works on GitHub Pages (static hosting)
- [ ] **TECH-02**: Runs smoothly on mobile devices (30+ FPS)
- [ ] **TECH-03**: All sprite assets are CC-licensed with proper attribution
- [ ] **TECH-04**: Loading screen shows progress while assets load
- [ ] **TECH-05**: Credits/attribution accessible from game menu

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Game Features

- **V2-01**: NPCs that provide additional context about research
- **V2-02**: Day/night cycle affecting campus appearance
- **V2-03**: Weather effects (rain, snow)
- **V2-04**: Easter eggs and hidden content
- **V2-05**: Achievement system for exploration milestones

### Content Management

- **V2-06**: Admin interface for adding publications
- **V2-07**: Preview mode before publishing changes
- **V2-08**: Markdown support for content entries

### Analytics

- **V2-09**: Track which buildings visitors explore
- **V2-10**: Track mode preference (game vs website)
- **V2-11**: Engagement metrics dashboard

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Combat/battle system | Not a game, it's a portfolio - interactions should reveal content, not gameplay |
| Puzzles blocking content | All academic content must be directly accessible |
| User accounts/login | Informational site only, no personalization needed |
| Real-time multiplayer | Static hosting, no server infrastructure |
| Auto-playing music | Common anti-pattern, annoys visitors |
| Backend/database | GitHub Pages constraint - static files only |
| Custom sprite creation | Using CC-licensed LPC/Kenney assets for quality and speed |
| Pokemon-style sprites | Nintendo copyright makes this legally risky for academic portfolio |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAND-01 | TBD | Pending |
| LAND-02 | TBD | Pending |
| LAND-03 | TBD | Pending |
| LAND-04 | TBD | Pending |
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| NAV-05 | TBD | Pending |
| NAV-06 | TBD | Pending |
| NAV-07 | TBD | Pending |
| INT-01 | TBD | Pending |
| INT-02 | TBD | Pending |
| INT-03 | TBD | Pending |
| INT-04 | TBD | Pending |
| INT-05 | TBD | Pending |
| INT-06 | TBD | Pending |
| MAP-01 | TBD | Pending |
| MAP-02 | TBD | Pending |
| MAP-03 | TBD | Pending |
| MAP-04 | TBD | Pending |
| MAP-05 | TBD | Pending |
| MAP-06 | TBD | Pending |
| MAP-07 | TBD | Pending |
| MAP-08 | TBD | Pending |
| VIS-01 | TBD | Pending |
| VIS-02 | TBD | Pending |
| VIS-03 | TBD | Pending |
| VIS-04 | TBD | Pending |
| VIS-05 | TBD | Pending |
| WEB-01 | TBD | Pending |
| WEB-02 | TBD | Pending |
| WEB-03 | TBD | Pending |
| WEB-04 | TBD | Pending |
| WEB-05 | TBD | Pending |
| WEB-06 | TBD | Pending |
| WEB-07 | TBD | Pending |
| WEB-08 | TBD | Pending |
| DATA-01 | TBD | Pending |
| DATA-02 | TBD | Pending |
| DATA-03 | TBD | Pending |
| DATA-04 | TBD | Pending |
| DATA-05 | TBD | Pending |
| DATA-06 | TBD | Pending |
| TECH-01 | TBD | Pending |
| TECH-02 | TBD | Pending |
| TECH-03 | TBD | Pending |
| TECH-04 | TBD | Pending |
| TECH-05 | TBD | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 0
- Unmapped: 44 (pending roadmap creation)

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-01-30 after initial definition*
