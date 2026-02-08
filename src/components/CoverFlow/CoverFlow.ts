/**
 * CoverFlow Carousel Component
 *
 * Apple-style 3D carousel for the Talks section.
 * Center card faces forward, side cards angle away with perspective.
 */

import type { Talk } from '../../types/content';
import styles from './CoverFlow.module.css';

const GRADIENTS = [
  'linear-gradient(135deg, #5b8db8 0%, #3d6d94 100%)',  // soft blue
  'linear-gradient(135deg, #7a9bb5 0%, #5a7f9a 100%)',  // muted steel
  'linear-gradient(135deg, #5a9aad 0%, #3f7d90 100%)',  // dusty ocean
  'linear-gradient(135deg, #4a6178 0%, #384d62 100%)',  // slate
  'linear-gradient(135deg, #7a7aaa 0%, #5c5c8a 100%)',  // lavender grey
  'linear-gradient(135deg, #5a9090 0%, #3f7272 100%)',  // sage teal
];

export function renderCoverFlow(talks: Talk[]): string {
  const slides = talks.map((talk, i) => {
    const gradient = GRADIENTS[i % GRADIENTS.length];
    const date = new Date(talk.date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const offset = i === 0 ? '0' : 'hidden';

    return `
      <div class="${styles.slide}" data-offset="${offset}" data-index="${i}">
        <div class="${styles.card}" style="--card-gradient: ${gradient}">
          <h3 class="${styles.cardTitle}">${talk.title}</h3>
          <p class="${styles.cardVenue}">${talk.venue}</p>
          <p class="${styles.cardDate}">${date}</p>
        </div>
      </div>
    `;
  }).join('');

  const dots = talks.map((_, i) => `
    <button
      class="${styles.dot}${i === 0 ? ` ${styles.dotActive}` : ''}"
      data-dot="${i}"
      aria-label="Go to talk ${i + 1}"
    ></button>
  `).join('');

  return `
    <div class="${styles.carousel}" data-coverflow aria-roledescription="carousel" aria-label="Talks carousel">
      <div class="${styles.track}">
        ${slides}
      </div>
      <div class="${styles.nav}">
        <button class="${styles.navButton}" data-coverflow-prev aria-label="Previous talk" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="${styles.dots}">
          ${dots}
        </div>
        <button class="${styles.navButton}" data-coverflow-next aria-label="Next talk"${talks.length <= 1 ? ' disabled' : ''}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  `;
}

export function initCoverFlow(): void {
  const carousel = document.querySelector<HTMLElement>('[data-coverflow]');
  if (!carousel) return;

  const slides = carousel.querySelectorAll<HTMLElement>(`.${styles.slide}`);
  const prevBtn = carousel.querySelector<HTMLButtonElement>('[data-coverflow-prev]');
  const nextBtn = carousel.querySelector<HTMLButtonElement>('[data-coverflow-next]');
  const dots = carousel.querySelectorAll<HTMLButtonElement>(`.${styles.dot}`);
  const total = slides.length;

  if (total === 0) return;

  let currentIndex = 0;

  function updateSlides(): void {
    slides.forEach((slide) => {
      const idx = Number(slide.dataset.index);
      const diff = idx - currentIndex;

      if (diff >= -2 && diff <= 2) {
        slide.setAttribute('data-offset', String(diff));
      } else {
        slide.setAttribute('data-offset', 'hidden');
      }
    });

    // Update buttons
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === total - 1;

    // Update dots
    dots.forEach((dot) => {
      const dotIdx = Number(dot.dataset.dot);
      dot.classList.toggle(styles.dotActive, dotIdx === currentIndex);
    });
  }

  function goTo(index: number): void {
    if (index < 0 || index >= total) return;
    currentIndex = index;
    updateSlides();
  }

  // Arrow button handlers
  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.dot);
      goTo(idx);
    });
  });

  // Click on side card navigates to it; click on center card follows link
  slides.forEach((slide) => {
    slide.addEventListener('click', (e) => {
      const idx = Number(slide.dataset.index);
      if (idx !== currentIndex) {
        e.preventDefault();
        goTo(idx);
      }
      // Center card: let default behavior through (no link on card itself,
      // but user can navigate via detail page if we add one later)
    });
  });

  // Keyboard navigation (scoped to carousel focus)
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = false;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      // Only activate horizontal swipe if horizontal movement dominates
      if (dx > dy && dx > 10) {
        isSwiping = true;
      }
    }
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (diff > threshold) {
      goTo(currentIndex + 1); // swipe left → next
    } else if (diff < -threshold) {
      goTo(currentIndex - 1); // swipe right → prev
    }
  }, { passive: true });

  // Trackpad / mouse wheel support
  let wheelCooldown = false;
  let wheelAccum = 0;
  let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
  const WHEEL_THRESHOLD = 120;
  const COOLDOWN_MS = 400;

  carousel.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum += delta;

    if (!wheelCooldown && Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
      if (wheelAccum > 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }
      wheelAccum = 0;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, COOLDOWN_MS);
    }

    // Reset accumulator after a pause
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => { wheelAccum = 0; }, 300);

    // Prevent page scroll while inside carousel
    if (currentIndex > 0 || delta > 0) {
      if (currentIndex < total - 1 || delta < 0) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Set initial state
  updateSlides();
}
