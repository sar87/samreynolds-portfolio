# Feature Landscape: Pixel-Art Academic Portfolio Game

**Domain:** Interactive pixel-art exploration game for academic portfolio
**Researched:** 2026-01-30
**Confidence:** MEDIUM (WebSearch findings cross-verified with UX best practices)

## Executive Summary

This research examines the feature landscape for pixel-art portfolio games, specifically Pokemon-style campus exploration games used as academic portfolios. The domain combines three distinct ecosystems: (1) retro pixel-art web games, (2) interactive portfolio websites, and (3) academic personal websites. Each has different expectations that must be balanced.

**Key insight:** The game mechanics must enhance, not obstruct, content discovery. Table-stakes features ensure the game feels complete and navigable, while differentiators create memorable experiences that make the portfolio stand out.

## Table Stakes

Features users expect. Missing these = product feels incomplete, broken, or confusing.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Arrow key / WASD movement** | Universal expectation in PC web games; Pokemon games use directional input | Low | Already implemented. Must work smoothly (125-200ms frame timing for responsive feel) |
| **Visual movement feedback** | Players need to see character walk animations to confirm input received | Medium | Walk cycles need 4+ frames for proper leg movement. Idle breathing animation (2-3 frames) when stationary |
| **Collision detection** | Fundamental to exploration games; walking through walls breaks immersion instantly | Low | Already implemented. Must be pixel-perfect at tile boundaries |
| **Interaction prompts** | Visual cue (e.g., "Press Z/Space" or icon) when player can interact with object | Low | Pokemon uses text box prompts. Critical for discoverability |
| **Building entrances/exits** | Players expect to enter buildings and return to campus map | Medium | Already implemented. Needs clear visual markers (doors, entrance tiles) |
| **Navigable UI in overlays** | When content panels open, keyboard navigation must work (Tab, Esc to close) | Medium | Screen reader compatibility requires this. WCAG 2026 standard |
| **Mobile touch controls** | 360-430px mobile viewports dominant in 2026; touch users need D-pad + action button | Medium | Already implemented. Buttons must be 44px+ minimum for easy tapping with spacing to prevent mis-taps |
| **Skip to content option** | Accessibility requirement; users relying on keyboards need way to bypass game and reach content | Low | "Skip to main content" link is WCAG standard. Must offer traditional navigation path |
| **Content accessibility fallback** | If game doesn't load (old browser, JS disabled), content must still be reachable | Medium | Progressive enhancement approach. HTML content exists, game enhances it |
| **Loading indicator** | Players need feedback while sprites/maps load | Low | Simple "Loading campus..." prevents confusion on slow connections |

## Differentiators

Features that set product apart. Not expected, but valued when present. These create memorable experiences.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Context-aware interaction text** | NPCs or objects give different dialogue based on what player has already discovered | High | "You've already read this paper" vs first-time discovery. Makes exploration feel dynamic |
| **Building exterior detail** | Authentic Cambridge architecture (Gothic/Tudor details, stone textures, courtyards) | Medium | Creates emotional connection for Cambridge community. Differentiates from generic pixel campus |
| **Easter eggs / hidden areas** | Secret interactions reward thorough exploration (e.g., rowing on River Cam, hidden garden) | Low-Medium | Common in Pokemon games. Delights curious visitors. Must not hide core content |
| **Animated environment** | Subtle animations (flowing water, waving flags, rustling trees) bring campus to life | Medium | Idle animations at 200ms/frame. Small file size impact but high perceived polish |
| **Progressive disclosure of campus** | Campus reveals buildings gradually (fog of war) or all at once based on design choice | Medium | Tutorial approach: start at Pembroke, other buildings appear as you explore. Guides first-time visitors |
| **Sound effects on interaction** | Audio feedback (footsteps, door opening, page turn) enhances immersion | Low | Optional; must have mute toggle. WebAudio API. Small OGG files |
| **Day/night cycle** | Campus appearance changes with real-world time or visitor's local time | Medium | Adds realism but non-essential. Could confuse if too dark. Consider time-of-day greetings instead |
| **Character customization** | Player chooses avatar sprite (different hairstyles, colors, outfits) | Medium | Increases engagement but adds sprite management complexity. Pokemon style: 4-8 preset options |
| **Breadcrumb trail / exploration tracker** | Visual indicator of which buildings/content areas player has visited | Low | "You've visited 3 of 5 buildings" or checkmarks. Encourages completionism |
| **Smooth camera transitions** | Camera follow with easing, smooth pan when entering buildings | Medium | Already partially implemented. Easing functions make movement feel professional |
| **Multi-modal content reveal** | Content overlays include images, videos, slides (not just text) | Medium | Publications could show paper thumbnails; talks could embed video clips. Richer than plain text |
| **Social sharing hooks** | "Share my campus exploration" or screenshot feature | Low | Viral potential. "I just explored @samreynolds' Cambridge campus" with preview card |

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain that hurt user experience.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Complex combat/battle system** | This is a portfolio site, not a game. Battles distract from content and create confusion about purpose | Use simple interactions (talk to object → content appears). No HP, no level-up mechanics |
| **Inventory management** | Adds cognitive load without serving portfolio goals. Players shouldn't collect/manage items | If collecting is needed (e.g., "papers collected"), make it automatic and non-interactive |
| **Grinding or forced repetition** | Making users repeat actions to unlock content is hostile to professionals seeking quick information | All content should be discoverable in single playthrough. No required backtracking |
| **Puzzles blocking core content** | Obscuring publications/CV behind riddles frustrates recruiters and collaborators | Puzzles acceptable for easter eggs only. Core content: zero barriers |
| **Auto-playing music** | Looping background music is intrusive and violates modern web UX norms (especially on mobile) | Offer optional sound toggle. Default: off. If included, ambient only, not melodic loops |
| **Unskippable intro/cutscenes** | Forcing long animations before content access alienates returning visitors | Splash screen choice ("Explore Campus" vs "View Website") must appear instantly. No forced 10-second logo animation |
| **Random encounters** | Pokemon-style random battles would be infuriating in a portfolio context | Campus should feel peaceful and explorable, not hostile. No interruptions while walking |
| **Level-gated content** | "Reach level 5 to view publications" is absurd for academic content | All content available immediately upon interaction with relevant object |
| **Currency/economy system** | Pokemon Dollars, shops, buying items — utterly irrelevant to portfolio goals | No money, no shops. This isn't Animal Crossing |
| **Save system** | Portfolio sites don't need save states. Adds complexity without value | Stateless experience. LocalStorage only for tracking "visited buildings" if implementing breadcrumbs |
| **Leaderboards or competitive elements** | "High score for exploring portfolio" is meaningless and gamifies the wrong behavior | Focus on discovery and learning, not competition |
| **Overdone particle effects** | Excessive visual effects (sparkles, screen shake, bloom) distract from content and hurt performance | Subtle environmental animations only. Keep effects minimal and purposeful |

## Feature Dependencies

Core dependencies that dictate build order:

```
Sprite System → Character Movement
                  ↓
              Collision Detection → Building Entrance/Exit System
                                         ↓
                                    Interior Maps → Interaction System
                                                         ↓
                                                    Content Overlays
                                                         ↓
                                                    Keyboard Navigation in Overlays
                                                         ↓
                                                    Accessibility (Skip Links, Focus Management)

Mobile Controls (parallel path, independent)
Normal Website Mode (parallel path, consumes same JSON content)
```

**Critical path:** Sprites → Movement → Collision → Buildings → Interactions → Content Display → Accessibility

**Parallel work:** Mobile controls can be built alongside desktop. Normal website mode shares JSON data structure.

## Portfolio-Specific Considerations

This is an **academic portfolio disguised as a game**, not a game featuring academic content. The distinction matters:

### What Visitors Actually Want

**Academic colleagues:** Quick access to publications, CV, contact info. They'll likely choose "View Website" mode. Game mode is a curiosity.

**Students/recruiters:** Will explore game mode briefly (30-60 seconds), then want specific information quickly. Must not trap them in extended gameplay.

**General public/press:** Most likely to fully explore game mode. Creates shareable moments ("Check out this cool academic website!").

### Discoverability Balance

**Table-stakes content must be obvious:**
- Each building should have clear exterior signage ("University Library")
- Interior objects should be visually distinct (bookcase ≠ table ≠ radio)
- First building (Pembroke) should have introductory text: "Welcome to my Cambridge campus. Explore buildings to discover my work."

**Easter eggs can be subtle:**
- Hidden garden area with no content, just aesthetic
- River Cam you can walk along
- Bicycle parked outside building (Cambridge culture nod)

## Feature Recommendations by Phase

### MVP (First Playable)

Prioritize core loop and one content type:

1. Arrow key movement with walk animation
2. Collision detection working
3. One building (Pembroke) with interior
4. One interactive object type (e.g., bookcase)
5. Content overlay panel with Esc to close
6. Mobile D-pad controls
7. Normal website mode with same About content

**Defer:** Sound, easter eggs, advanced animations, progressive disclosure

### Post-MVP Enhancement

Once core loop proves engaging:

1. All five buildings with themed interiors
2. All content types (publications, talks, media, research)
3. Animated environment elements (water, trees)
4. Smooth camera transitions
5. Exploration tracker ("3/5 buildings visited")
6. Context-aware dialogue

**Defer to v2:** Character customization, day/night cycle, social sharing, sound effects

## Mobile vs Desktop Feature Differences

| Context | Desktop | Mobile |
|---------|---------|--------|
| **Navigation** | Arrow keys / WASD | On-screen D-pad (44px+ buttons) |
| **Interaction** | Spacebar / Z key | Action button (bottom-right) |
| **Overlay navigation** | Tab key, Esc key | Touch gestures, visible close button |
| **Screen real estate** | More space for side-by-side campus + overlay | Overlay must fullscreen or mostly cover |
| **Performance** | Can handle more animations | Minimize animations, optimize sprite count |
| **Input precision** | Pixel-perfect with keyboard | Touch drift possible, larger hit areas needed |

**Design implication:** Test mobile-first for interactions, enhance for desktop. Invisible interaction zones (large touch targets) for mobile are acceptable.

## Accessibility Feature Requirements

For WCAG 2.1 AA compliance (2026 standard):

| Requirement | Implementation | Complexity |
|-------------|---------------|------------|
| Keyboard navigation | Arrow keys + Tab key through all interactive elements | Medium |
| Focus indicators | Visible outline on interactive objects when keyboard-focused | Low |
| Skip link | "Skip to content" link bypassing game mode | Low |
| Screen reader support | ARIA labels on overlay content, semantic HTML | Medium |
| Alt text | All interactive objects need descriptive labels ("Bookcase containing publications") | Low |
| Color contrast | Text overlays need 4.5:1 contrast minimum | Low |
| No flashing content | Avoid animations >3 flashes/second (seizure risk) | Low |
| Resize support | UI should work at 200% browser zoom | Medium |

**Critical:** The game mode is an enhancement. Base content must work without JavaScript for maximum accessibility.

## Confidence Assessment

| Topic | Confidence | Evidence |
|-------|-----------|----------|
| Pokemon-style game mechanics | HIGH | Classic patterns (movement, collision, interactions) well-documented across 20+ years |
| Web game UX best practices | MEDIUM | 2026 sources via WebSearch, cross-verified with UX principles. Some sources unverified |
| Academic portfolio expectations | MEDIUM | WebSearch findings on academic sites. Clear patterns emerged across sources |
| Accessibility requirements | HIGH | WCAG 2.1 standards well-established. 2026 testing guides confirm current practices |
| Mobile responsive considerations | MEDIUM | Screen resolution data for 2026 confirmed, touch control best practices from MDN and game dev sources |
| Gamification pitfalls | MEDIUM | Multiple sources agree on core anti-patterns. Portfolio-specific reasoning applied |

## Sources

### Game Mechanics & Interaction Patterns
- [Pixel Art Portfolio Examples - OnePageLove](https://onepagelove.com/tag/pixel-art) - Portfolio inspiration
- [1-bit Pixel Art Dev Portfolio - Awwwards](https://www.awwwards.com/sites/1-bit-pixel-art-dev-portfolio) - Notable example
- [Dialogue System - Games by Hyper](https://gamesbyhyper.com/docs/exploration-and-narrative/dialogue-system/) - Content trigger patterns
- [Gameplay Design Patterns for Game Dialogues - ResearchGate](https://www.researchgate.net/publication/255635177_Gameplay_Design_Patterns_for_Game_Dialogues) - Interaction design patterns
- [Walk Cycles Tutorial - SLYNYRD](https://www.slynyrd.com/blog/2018/8/19/pixelblog-8-intro-to-animation) - Animation standards
- [Pixel Art Character Animations Guide](https://www.sandromaglione.com/articles/pixel-art-character-animations-guide) - Frame timing guidance

### UX & Design Best Practices
- [Develop CSS/JS-Based Game Portfolio - Smashing Magazine](https://www.smashingmagazine.com/2012/05/develop-a-one-of-a-kind-cssjs-based-game-portfolio/) - Implementation guidance
- [Game Developer Portfolios 2026 - SiteBuilderReport](https://www.sitebuilderreport.com/inspiration/game-developer-portfolios) - Modern examples
- [Progressive Disclosure - Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/) - Information architecture
- [Game UI/UX Design Complete Guide](https://generalistprogrammer.com/game-ui-ux-design) - Interface design patterns
- [Retro Games UX - Medium](https://medium.com/design-bootcamp/when-nostalgia-meets-user-experience-how-ux-is-applied-in-retro-games-c8c4a0b4de77) - Retro design principles

### Academic Portfolio Standards
- [Making Your Academic Portfolio Website - GTF](https://gtf.fyi/posts/academic-portfolio/) - Academic site essentials
- [Sites for Scholars Portfolio](https://www.sitesforscholars.com/portfolio/) - Academic website examples
- [Academic Personal Website Templates](https://mobirise.com/website-templates/academic-personal-website-templates/) - Structure patterns
- [Best Website Builders for Academic Sites 2026](https://www.websiteplanet.com/blog/best-website-builders-for-personal-academic-sites/) - Feature expectations

### Accessibility & Mobile
- [Keyboard Navigation & Accessibility - Plan Left](https://planleft.com/blog/keyboard-navigation-website-accessibility/) - WCAG standards
- [Screen Reader Accessibility Guide - UserWay](https://userway.org/blog/screen-reader/) - Screen reader support
- [Mobile Touch Controls - MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Control_mechanisms/Mobile_touch) - Touch implementation
- [Responsive UI Design for Games](https://genieee.com/responsive-ui-design-for-games/) - Multi-device patterns
- [Mobile Screen Resolutions 2026](https://phone-simulator.com/blog/most-popular-mobile-screen-resolutions-in-2026) - Viewport data
- [Mobile Game UI Features](https://kreonit.com/testing-and-qa/mobile-game-ui/) - Touch control best practices

### Gamification Pitfalls
- [Why Gamification Fails 2026 - Medium](https://medium.com/design-bootcamp/why-gamification-fails-new-findings-for-2026-fff0d186722f) - Anti-patterns
- [Dark Side of Gamification](https://www.growthengineering.co.uk/dark-side-of-gamification/) - Common mistakes
- [Website Gamification Guide - Wix](https://www.wix.com/studio/blog/website-gamification) - When to use game mechanics
- [Gamification Pitfalls - CYPHER Learning](https://www.cypherlearning.com/resources/infographics/business/gamification-pitfalls-to-avoid-when-designing-online-training) - UX mistakes to avoid

## Notes on Research Gaps

**Low confidence areas needing validation:**
- Exact sprite library licensing (need to verify specific sources chosen for project)
- Performance benchmarks for sprite animation on mobile (need device testing)
- Optimal overlay size for mobile viewports (need A/B testing)

**Assumptions made:**
- Game mode is primary experience despite dual-mode offering (may need analytics to validate)
- 30-60 second exploration time for non-gaming visitors (educated guess, not data-backed)
- Pokemon Fire Red/Leaf Green aesthetic appeals to target audience (assumption based on nostalgia factor)

**Future research needed:**
- Sprite library evaluation (which free libraries best match GBA Pokemon aesthetic?)
- Performance profiling (how many animated sprites can run at 60fps on average mobile device?)
- Content presentation (best overlay layout for publications list — table? cards? accordion?)
