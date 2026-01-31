# Phase 4: Core Game Engine - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Player can move around a simple test map with smooth camera and collision detection. This phase delivers: movement input handling, camera following, collision system, and tile-based rendering. Building interiors, interactions, mobile controls, and animations are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Movement feel
- Hybrid movement: smooth sub-tile movement while keys held, snap to nearest tile center when released
- 4-directional only (no diagonal movement)
- Moderate pace (~4 tiles/second) for balanced responsiveness
- Auto-align to grid when keys released (smooth slide to nearest tile center)

### Camera behavior
- Smooth lerp follow (camera catches up to player position)
- Quick catch-up (~0.2 seconds) for responsive but smooth feel
- Clamp to map edges (player may be off-center near boundaries, no void visible)
- Fixed 2x scale (32px tiles render at 64px) as established in Phase 1

### Collision feedback
- Hard stop on collision (no sliding along walls)
- Water (River Cam) is impassable — bridges required
- Visual/audio feedback on blocked movement: Claude's discretion

### Visual frame
- Medium viewport (~15x12 tiles visible at 2x scale)
- Fill browser window (more tiles visible on larger screens)
- Aspect ratio handling: Claude's discretion based on device testing

### Claude's Discretion
- Collision system approach (tile-based vs bounding box) based on LPC tileset compatibility
- Visual/audio feedback when movement blocked (subtle or none)
- Aspect ratio handling across different screen sizes
- Debug UI for development testing (FPS, coordinates if useful)

</decisions>

<specifics>
## Specific Ideas

No specific references — open to standard approaches for tile-based game engines.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-core-game-engine*
*Context gathered: 2026-01-31*
