/**
 * Input - Keyboard state tracking for movement keys
 *
 * Features:
 * - Uses event.code for layout independence (AZERTY, QWERTZ support)
 * - Supports both WASD and arrow keys
 * - Prevents default on arrow keys to stop page scrolling
 * - 4-directional only (no diagonal movement)
 */
export class Input {
    private keys: Map<string, boolean> = new Map();
    private keydownHandler: (e: KeyboardEvent) => void;
    private keyupHandler: (e: KeyboardEvent) => void;

    // Movement key codes for WASD and arrows
    private static readonly MOVEMENT_KEYS = new Set([
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ]);

    // Arrow keys that should prevent default (stop page scrolling)
    private static readonly ARROW_KEYS = new Set([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ]);

    constructor() {
        this.keydownHandler = (e: KeyboardEvent) => {
            if (Input.ARROW_KEYS.has(e.code)) {
                e.preventDefault();
            }
            if (Input.MOVEMENT_KEYS.has(e.code)) {
                this.keys.set(e.code, true);
            }
        };

        this.keyupHandler = (e: KeyboardEvent) => {
            if (Input.MOVEMENT_KEYS.has(e.code)) {
                this.keys.set(e.code, false);
            }
        };

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }

    /**
     * Check if a specific key is currently pressed
     */
    isKeyPressed(code: string): boolean {
        return this.keys.get(code) === true;
    }

    /**
     * Get movement direction based on currently pressed keys
     * Returns { x: -1|0|1, y: -1|0|1 }
     * 4-directional only: vertical movement takes priority over horizontal
     */
    getMovementDirection(): { x: number; y: number } {
        // Check vertical movement first (priority for 4-directional)
        if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) {
            return { x: 0, y: -1 };
        }
        if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) {
            return { x: 0, y: 1 };
        }

        // Then check horizontal movement
        if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) {
            return { x: -1, y: 0 };
        }
        if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) {
            return { x: 1, y: 0 };
        }

        // No movement
        return { x: 0, y: 0 };
    }

    /**
     * Check if any movement key is currently pressed
     * Useful for snap-to-grid logic
     */
    isAnyMovementKeyPressed(): boolean {
        for (const key of Input.MOVEMENT_KEYS) {
            if (this.keys.get(key) === true) {
                return true;
            }
        }
        return false;
    }

    /**
     * Remove event listeners - call when cleaning up
     */
    destroy(): void {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
        this.keys.clear();
    }
}
