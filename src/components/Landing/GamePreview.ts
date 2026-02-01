/**
 * GamePreview Component
 *
 * Animated canvas preview showing a simplified pixel-art campus scene.
 * Used on landing page to tease the game mode without loading actual sprites.
 * Runs at 8 FPS for subtle, non-distracting animation.
 */

// Colors for the simplified campus scene
const COLORS = {
  sky: '#87CEEB',       // Light blue sky
  grass: '#90EE90',     // Light green grass
  path: '#808080',      // Gray cobblestone path
  building: '#8B4513',  // Saddle brown buildings
  roof: '#654321',      // Dark brown roofs
  window: '#FFE4B5',    // Moccasin for lit windows
  player: '#0d9488',    // Teal accent (matches site theme)
};

// Canvas dimensions (320x240 for retro feel)
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;

// Animation settings
const FRAME_INTERVAL = 125; // 8 FPS = 125ms per frame

// Player animation state
interface PlayerState {
  x: number;
  y: number;
  direction: 1 | -1;
}

/**
 * Creates HTML string for the canvas element
 */
export function createGamePreview(): string {
  return `
    <canvas
      class="game-preview-canvas"
      width="${CANVAS_WIDTH}"
      height="${CANVAS_HEIGHT}"
      aria-hidden="true"
    ></canvas>
  `;
}

/**
 * Draws the static campus scene (background that doesn't change)
 */
function drawScene(ctx: CanvasRenderingContext2D): void {
  // Sky (top portion)
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 100);

  // Grass (bottom portion)
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 100, CANVAS_WIDTH, CANVAS_HEIGHT - 100);

  // Main path from bottom center going up
  ctx.fillStyle = COLORS.path;
  ctx.fillRect(140, 150, 40, 90);

  // Horizontal path connecting buildings
  ctx.fillRect(60, 150, 200, 24);

  // Building 1 (left) - traditional style
  drawBuilding(ctx, 40, 70, 60, 80);

  // Building 2 (center) - larger library
  drawBuilding(ctx, 130, 50, 60, 100);

  // Building 3 (right) - modern lab
  drawBuilding(ctx, 220, 80, 50, 70);
}

/**
 * Draws a simple building silhouette
 */
function drawBuilding(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Building body
  ctx.fillStyle = COLORS.building;
  ctx.fillRect(x, y, width, height);

  // Pitched roof (triangle)
  ctx.fillStyle = COLORS.roof;
  ctx.beginPath();
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x + width / 2, y - 20);
  ctx.lineTo(x + width + 4, y);
  ctx.closePath();
  ctx.fill();

  // Windows (2x2 grid)
  ctx.fillStyle = COLORS.window;
  const windowSize = 10;
  const windowGap = 8;
  const startX = x + (width - windowSize * 2 - windowGap) / 2;
  const startY = y + 15;

  // Top row
  ctx.fillRect(startX, startY, windowSize, windowSize);
  ctx.fillRect(startX + windowSize + windowGap, startY, windowSize, windowSize);

  // Bottom row
  ctx.fillRect(startX, startY + windowSize + windowGap, windowSize, windowSize);
  ctx.fillRect(startX + windowSize + windowGap, startY + windowSize + windowGap, windowSize, windowSize);

  // Door
  ctx.fillStyle = COLORS.roof;
  ctx.fillRect(x + width / 2 - 8, y + height - 24, 16, 24);
}

/**
 * Draws the animated player character
 */
function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(player.x, player.y, 16, 16);

  // Simple "walking" effect: alternate between two states
  const frame = Math.floor(Date.now() / FRAME_INTERVAL) % 2;
  if (frame === 0) {
    // Frame 1: small "legs"
    ctx.fillRect(player.x + 2, player.y + 16, 4, 2);
    ctx.fillRect(player.x + 10, player.y + 16, 4, 2);
  } else {
    // Frame 2: legs together
    ctx.fillRect(player.x + 4, player.y + 16, 8, 2);
  }
}

/**
 * Updates player position for animation
 */
function updatePlayer(player: PlayerState): void {
  player.x += player.direction * 2; // Move 2 pixels per frame

  // Bounce at path edges
  if (player.x >= 240) {
    player.direction = -1;
  } else if (player.x <= 60) {
    player.direction = 1;
  }
}

/**
 * Starts the preview animation on the provided canvas
 * @returns Interval ID for cleanup
 */
export function startPreviewAnimation(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize player state
  const player: PlayerState = {
    x: 150,
    y: 156, // On the path
    direction: 1,
  };

  // Draw initial scene
  drawScene(ctx);

  if (prefersReducedMotion) {
    // For reduced motion: draw static scene with stationary player
    drawPlayer(ctx, player);
    return 0; // No animation interval
  }

  // Animation loop
  const intervalId = setInterval(() => {
    // Clear and redraw scene
    drawScene(ctx);

    // Update and draw player
    updatePlayer(player);
    drawPlayer(ctx, player);
  }, FRAME_INTERVAL);

  return intervalId as unknown as number;
}

/**
 * Stops the preview animation
 */
export function stopPreviewAnimation(intervalId: number): void {
  if (intervalId) {
    clearInterval(intervalId);
  }
}
