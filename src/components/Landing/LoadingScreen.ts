/**
 * LoadingScreen Component
 *
 * Full-screen overlay with pixel-themed spinner for game mode transitions.
 * Provides visual feedback while game assets are loading.
 */

// Import styles (Vite will handle CSS modules)
import './LoadingScreen.css';

// CSS class names
const LOADING_SCREEN_CLASS = 'loading-screen';
const SPINNER_CLASS = 'pixel-spinner';
const TEXT_CLASS = 'loading-text';

/**
 * Shows the loading screen overlay
 * Creates and appends a full-screen overlay with spinner
 */
export function showLoadingScreen(): void {
  // Don't create duplicate loading screens
  if (document.querySelector(`.${LOADING_SCREEN_CLASS}`)) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = LOADING_SCREEN_CLASS;
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-label', 'Loading game');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Simple text-only loading indicator for reduced motion
    overlay.innerHTML = `
      <div class="${TEXT_CLASS}">Loading...</div>
    `;
  } else {
    // Animated spinner with text
    overlay.innerHTML = `
      <div class="${SPINNER_CLASS}" aria-hidden="true"></div>
      <div class="${TEXT_CLASS}">Loading...</div>
    `;
  }

  document.body.appendChild(overlay);
}

/**
 * Hides the loading screen overlay
 * Removes the loading screen element from DOM
 * Includes safety check - no-op if element doesn't exist
 */
export function hideLoadingScreen(): void {
  const overlay = document.querySelector(`.${LOADING_SCREEN_CLASS}`);

  if (overlay) {
    overlay.remove();
  }
  // If element doesn't exist, this is a no-op (safe fallback)
}

/**
 * Hides loading screen with timeout fallback
 * Ensures loading screen is removed even if called prematurely
 * @param maxWaitMs Maximum time to wait before forcing removal (default: 5000ms)
 */
export function hideLoadingScreenWithFallback(maxWaitMs: number = 5000): void {
  // Try immediate removal
  hideLoadingScreen();

  // Set fallback timeout to ensure removal
  setTimeout(() => {
    hideLoadingScreen();
  }, maxWaitMs);
}
