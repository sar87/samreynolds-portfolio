/**
 * Header Component
 *
 * Sticky header with responsive navigation.
 * Desktop: horizontal nav links
 * Mobile: hamburger menu with slide-down panel
 */

import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Talks', href: '#talks' },
  { label: 'Media', href: '#media' },
];

// Game controller SVG icon for mode toggle button
const GAME_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="17" cy="10" r="1"></circle><circle cx="15" cy="12" r="1"></circle></svg>`;

export function renderHeader(): string {
  const navLinks = NAV_ITEMS.map(
    (item) => `<a href="${item.href}" class="${styles.navLink}">${item.label}</a>`
  ).join('');

  const mobileNavLinks = NAV_ITEMS.map(
    (item) =>
      `<li><a href="${item.href}" class="${styles.mobileNavLink}">${item.label}</a></li>`
  ).join('');

  return `
    <header class="${styles.header}">
      <div class="${styles.headerInner}">
        <a href="#/" class="${styles.logo}">Sam Reynolds</a>
        <nav class="${styles.nav}" aria-label="Main navigation">
          ${navLinks}
        </nav>
        <button class="${styles.modeToggle}" aria-label="Play game">
          ${GAME_ICON}
          <span>Play Game</span>
        </button>
        <button
          class="${styles.menuButton}"
          aria-expanded="false"
          aria-controls="mobile-nav"
          aria-label="Menu"
        >
          <span class="${styles.menuIcon}"></span>
        </button>
      </div>
      <nav id="mobile-nav" class="${styles.mobileNav}" hidden aria-label="Mobile navigation">
        <ul class="${styles.mobileNavList}">
          ${mobileNavLinks}
        </ul>
      </nav>
    </header>
  `;
}

export function initMobileNav(): void {
  const menuButton = document.querySelector<HTMLButtonElement>(
    `.${styles.menuButton}`
  );
  const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');

  if (!menuButton || !mobileNav) return;

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;

    // Focus first link when opening
    if (!isExpanded) {
      mobileNav.querySelector<HTMLAnchorElement>('a')?.focus();
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.hidden) {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      menuButton.focus();
    }
  });
}

/**
 * Initialize mode toggle button in header
 * Dispatches custom event for mode switching - handled by main.ts
 */
export function initModeToggle(): void {
  const modeToggle = document.querySelector<HTMLButtonElement>(
    `.${styles.modeToggle}`
  );

  if (!modeToggle) return;

  modeToggle.addEventListener('click', () => {
    window.dispatchEvent(
      new CustomEvent('mode-switch', { detail: { mode: 'game' } })
    );
  });
}
