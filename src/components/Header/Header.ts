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
