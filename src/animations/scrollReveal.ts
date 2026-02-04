/**
 * Scroll Reveal Animation Module
 *
 * Uses Intersection Observer API to detect when elements enter viewport
 * and applies reveal animations. Supports staggered animations for card grids.
 */

/**
 * Initialize scroll reveal animations for all .scroll-reveal elements.
 * Adds 'revealed' class when element enters viewport (15% visible).
 * Each element is unobserved after reveal (one-time animation).
 */
export function initScrollReveal(): void {
  const revealElements = document.querySelectorAll<HTMLElement>('.scroll-reveal');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // Use viewport
      rootMargin: '0px',
      threshold: 0.15, // Trigger when 15% visible
    }
  );

  // Set alternating slide direction for sections
  let sectionIndex = 0;
  revealElements.forEach((element: HTMLElement) => {
    // Only apply alternating direction to section-level elements
    if (element.tagName === 'SECTION' || element.classList.contains('section')) {
      const direction = sectionIndex % 2 === 0 ? 'left' : 'right';
      element.setAttribute('data-slide-from', direction);
      sectionIndex++;
    }

    observer.observe(element);
  });
}

/**
 * Initialize staggered animations for card grids.
 * Sets --animation-order CSS custom property on each card
 * to enable sequential reveal timing via CSS calc().
 *
 * Usage: Add data-stagger attribute to the parent container
 * <div data-stagger>
 *   <div class="card scroll-reveal">...</div>
 *   <div class="card scroll-reveal">...</div>
 * </div>
 */
export function initStaggeredCards(): void {
  const staggerContainers = document.querySelectorAll<HTMLElement>('[data-stagger]');

  staggerContainers.forEach((container: HTMLElement) => {
    // Find all scroll-reveal elements within this container
    const cards = container.querySelectorAll<HTMLElement>('.scroll-reveal');

    cards.forEach((card: HTMLElement, index: number) => {
      card.style.setProperty('--animation-order', index.toString());
    });
  });
}
