# Archived Game Mode

This directory contains the pixel-art campus game mode from v0.9.
Archived on 2026-02-02 as part of v1.0 Professional Polish milestone.

## Why Archived

v1.0 focuses on a polished professional academic website. The game mode
is preserved here for potential future reuse but is not part of the
current site experience.

## Contents

| Directory | Original Location | Description |
|-----------|-------------------|-------------|
| src-game/ | src/game/ | TypeScript game engine (CampusGame, Game, core, entities, rendering, systems) |
| src-landing/ | src/components/Landing/ | Landing page with mode selection |
| src-styles/ | src/styles/game.css | Game-specific CSS styles |
| js-game/ | js/game/ | Vanilla JS game scripts (sprites, player, world, buildings, engine) |
| data-game/ | data/content.json.js | Game content and building data |
| assets-sprites/ | assets/sprites/ | Sprite sheets (buildings, characters, objects, terrain) |

## To Restore Game Mode

1. Move directories back to original locations:
   ```bash
   mkdir -p src/game src/components/Landing js/game assets/sprites
   mv _archived/src-game/* src/game/
   mv _archived/src-landing/* src/components/Landing/
   mv _archived/src-styles/game.css src/styles/
   mv _archived/js-game/* js/game/
   mv _archived/data-game/content.json.js data/
   mv _archived/assets-sprites/* assets/sprites/
   ```

2. Restore imports in main.ts:
   - Add game/landing CSS imports
   - Import CampusGame, Landing components, LoadingScreen
   - Restore mode switching logic and event handlers
   - Add /game route

3. Restore Header modeToggle:
   - Add GAME_ICON constant
   - Add modeToggle button to renderHeader()
   - Add initModeToggle() function
   - Add modeToggle CSS styles

4. Test: `npm run dev` and verify game mode works

## Original Functionality

- Landing page with website/game choice
- Keyboard shortcut (G key) to toggle modes
- Header "Play Game" button
- Pixel-art campus exploration game
- Building interactions and NPC dialogues
