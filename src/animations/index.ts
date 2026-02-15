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
  initLazyVideos();
}

/**
 * Lazy-load banner videos when they enter the viewport.
 * Videos use data-lazy-video attribute with the source URL.
 */
function initLazyVideos(): void {
  const banners = document.querySelectorAll<HTMLElement>('[data-lazy-video]');
  if (!banners.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const container = entry.target as HTMLElement;
        const src = container.dataset.lazyVideo;
        const video = container.querySelector('video');
        if (!video || !src) continue;

        video.src = src;
        video.autoplay = true;
        video.load();
        observer.unobserve(container);
      }
    },
    { rootMargin: '200px' }
  );

  banners.forEach((el) => observer.observe(el));
}

// Re-export individual functions for granular control if needed
export { initScrollReveal, initStaggeredCards };
