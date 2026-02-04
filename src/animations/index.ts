/**
 * Animation Module Entry Point
 *
 * Single export for initializing all animation systems.
 * Call initAnimations() after DOM updates to attach observers.
 */

import { initScrollReveal, initStaggeredCards } from './scrollReveal';

/**
 * Initialize all animation systems.
 * Should be called after every render/route change.
 *
 * Initializes:
 * - Scroll reveal animations (Intersection Observer)
 * - Staggered card animations (CSS custom property timing)
 */
export function initAnimations(): void {
  // Order matters: set stagger indices before scroll reveal observes elements
  initStaggeredCards();
  initScrollReveal();
}

// Re-export individual functions for granular control if needed
export { initScrollReveal, initStaggeredCards };
