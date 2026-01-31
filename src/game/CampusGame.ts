/**
 * CampusGame - Wrapper for the vanilla JS campus game engine
 *
 * Loads and manages the Phase 5 campus game implementation from /js/game/
 * This provides a clean TypeScript interface while leveraging the existing
 * vanilla JS game with all its sprites, buildings, and interiors.
 */

// Declare global types for vanilla JS game objects
declare global {
  interface Window {
    Sprites: {
      init(): Promise<void>;
      get(name: string): HTMLCanvasElement | null;
      getCharacterFrame(
        direction: string,
        frame: number
      ): { image: HTMLCanvasElement; sx: number; sy: number; sw: number; sh: number };
      tileSize: number;
      scale: number;
      cache: Record<string, HTMLCanvasElement>;
    };
    World: {
      init(): void;
      getCurrentMap(): { width: number; height: number };
      getTile(x: number, y: number, layer: string): number;
      getTileSprite(tileType: number): string | null;
      currentLocation: string;
      TILES: Record<string, number>;
    };
    Player: {
      init(x: number, y: number): void;
      update(dt: number): void;
      tileX: number;
      tileY: number;
      pixelX: number;
      pixelY: number;
    };
    Buildings: {
      init(): void;
    };
    Engine: {
      init(): Promise<void>;
      start(): void;
      stop(): void;
      running: boolean;
      loaded: boolean;
      canvas: HTMLCanvasElement | null;
    };
  }
}

export class CampusGame {
  private container: HTMLElement;
  private scriptsLoaded = false;
  private gameStarted = false;

  /** Script paths relative to site root */
  private static readonly SCRIPTS = [
    '/data/content.json.js', // SITE_CONTENT must load first
    '/js/game/sprites.js',
    '/js/game/player.js',
    '/js/game/world.js',
    '/js/game/buildings.js',
    '/js/game/engine.js',
  ];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Load a script dynamically
   */
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Load all game scripts in order
   */
  private async loadScripts(): Promise<void> {
    if (this.scriptsLoaded) return;

    for (const src of CampusGame.SCRIPTS) {
      await this.loadScript(src);
    }
    this.scriptsLoaded = true;
  }

  /**
   * Create the game DOM structure
   */
  private createGameDOM(): void {
    this.container.innerHTML = `
      <div id="game-mode" class="game-mode">
        <canvas id="game-canvas"></canvas>

        <!-- Game HUD -->
        <div id="game-hud" class="game-hud">
          <div class="location-indicator">
            <span id="current-location">Cambridge Campus</span>
          </div>
          <div class="controls-hint">
            <span class="desktop-hint">Arrow keys to move | ENTER to interact | G to exit</span>
          </div>
        </div>

        <!-- Dialog Box -->
        <div id="dialog-box" class="dialog-box hidden">
          <div class="dialog-content">
            <h3 id="dialog-title"></h3>
            <div id="dialog-text"></div>
          </div>
          <div class="dialog-footer">
            <span class="dialog-hint">Press ENTER or tap to continue</span>
          </div>
        </div>

        <!-- Loading Screen -->
        <div id="loading-screen" class="loading-screen">
          <div class="loading-content">
            <h2>Sam Reynolds</h2>
            <p>AI & Conservation Research</p>
            <div class="loading-bar">
              <div class="loading-progress"></div>
            </div>
            <p class="loading-text">Loading Cambridge...</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Start the game
   */
  async start(): Promise<void> {
    if (this.gameStarted) return;

    // Create DOM structure
    this.createGameDOM();

    // Load scripts
    try {
      await this.loadScripts();
      console.log('Scripts loaded successfully');
    } catch (error) {
      console.error('Failed to load scripts:', error);
      this.showError('Failed to load game scripts');
      return;
    }

    // Initialize and start the vanilla JS engine
    try {
      console.log('Initializing engine...');
      await window.Engine.init();
      console.log('Engine initialized, starting game loop...');
      window.Engine.start();
      console.log('Game started');

      // Force hide loading screen after a short delay
      setTimeout(() => {
        const loadingScreen = this.container.querySelector('.loading-screen');
        if (loadingScreen) {
          (loadingScreen as HTMLElement).style.display = 'none';
          console.log('Loading screen hidden');
        }
      }, 600);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.showError(`Game initialization failed: ${error}`);
      return;
    }

    this.gameStarted = true;
  }

  /**
   * Show an error message instead of loading screen
   */
  private showError(message: string): void {
    const loadingScreen = this.container.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="loading-content">
          <h2>Error</h2>
          <p style="color: #e74c3c;">${message}</p>
          <p>Check browser console for details</p>
        </div>
      `;
    }
  }

  /**
   * Stop the game
   */
  stop(): void {
    if (!this.gameStarted) return;

    if (window.Engine?.running) {
      window.Engine.stop();
    }
    this.gameStarted = false;
  }

  /**
   * Clean up and destroy the game
   */
  destroy(): void {
    this.stop();
    this.container.innerHTML = '';
  }
}
