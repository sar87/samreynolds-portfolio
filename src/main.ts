// Import styles
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';
import './styles/game.css';
import './components/Landing/Landing.css';
import './components/Landing/LoadingScreen.css';

// Import router and pages
import { router } from './lib/router';

// Import game (CampusGame wraps the vanilla JS Phase 5 implementation)
import { CampusGame } from './game/CampusGame';
import { renderHeader, initMobileNav, initModeToggle } from './components/Header/Header';
import { renderHomePage } from './pages/HomePage';
import { renderPublicationDetail } from './pages/PublicationDetail';
import { renderTalkDetail } from './pages/TalkDetail';
import { renderMediaDetail } from './pages/MediaDetail';
import { renderLanding, initLanding } from './components/Landing/Landing';
import { showLoadingScreen, hideLoadingScreen } from './components/Landing/LoadingScreen';

// Get app container
const app = document.getElementById('app');
if (!app) throw new Error('App container not found');

// Session tracking for landing page
const landingShown = sessionStorage.getItem('landing-shown') === 'true';
let currentMode: 'landing' | 'website' | 'game' = landingShown ? 'website' : 'landing';

// Landing cleanup function
let cleanupLanding: (() => void) | null = null;

// Render function that updates app content
async function render(content: string | Promise<string>): Promise<void> {
  const html = await content;
  // Keep header persistent, only update main content
  const headerHtml = renderHeader();
  app!.innerHTML = `${headerHtml}<div id="content">${html}</div>`;
  initMobileNav();
  initModeToggle();

  // Scroll to top on route change (unless it's a hash anchor)
  if (!window.location.hash.includes('#/') || window.location.hash === '#/') {
    window.scrollTo(0, 0);
  }
}

// Save scroll position before navigating away from home
let homeScrollPosition = 0;
function saveScrollPosition(): void {
  if (router.getCurrentPath() === '/' || router.getCurrentPath() === '') {
    homeScrollPosition = window.scrollY;
  }
}

/**
 * Transition from landing to website or game mode
 * Handles expand/fade animation and mode switching
 */
async function transitionToMode(mode: 'website' | 'game', skipSection?: string): Promise<void> {
  // Clean up landing preview animation
  if (cleanupLanding) {
    cleanupLanding();
    cleanupLanding = null;
  }

  // Add transition class to landing container
  const landing = document.querySelector('.landing');
  landing?.classList.add('transitioning');

  // Add expanding class to chosen half, fading to other
  const chosen = document.querySelector(`.landing-half--${mode}`);
  const other = document.querySelector(`.landing-half--${mode === 'website' ? 'game' : 'website'}`);

  chosen?.classList.add('expanding');
  other?.classList.add('fading');

  // Wait for animation (250ms)
  await new Promise(r => setTimeout(r, 250));

  // Mark landing as shown for this session
  sessionStorage.setItem('landing-shown', 'true');
  currentMode = mode;

  if (mode === 'game') {
    showLoadingScreen();
    await enterGameMode();
    hideLoadingScreen();
  } else {
    await render(renderHomePage());
    if (skipSection) {
      // Scroll to section after render
      setTimeout(() => {
        const section = document.getElementById(skipSection);
        section?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}

/**
 * Render the landing page and set up event handlers
 */
async function renderLandingPage(): Promise<void> {
  // Render landing HTML directly (no header)
  app!.innerHTML = await renderLanding();

  // Initialize preview animation
  cleanupLanding = initLanding();

  // Mode button clicks
  document.querySelectorAll<HTMLElement>('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') as 'website' | 'game';
      transitionToMode(mode);
    });
  });

  // Skip link clicks
  document.querySelectorAll<HTMLElement>('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      transitionToMode('website', section || undefined);
    });
  });
}

// Register routes
router.add('/', async () => {
  // Show landing on first visit in session
  if (currentMode === 'landing') {
    await renderLandingPage();
    return;
  }

  // Returning visitors go directly to website
  await render(renderHomePage());
  // Restore scroll position if returning to home
  if (homeScrollPosition > 0) {
    window.scrollTo(0, homeScrollPosition);
    homeScrollPosition = 0;
  }
});

router.add('/publication/:id', async (params) => {
  saveScrollPosition();
  await render(renderPublicationDetail(params.id));
});

router.add('/talk/:id', async (params) => {
  saveScrollPosition();
  await render(renderTalkDetail(params.id));
});

router.add('/media/:id', async (params) => {
  saveScrollPosition();
  await render(renderMediaDetail(params.id));
});

// Game mode state
let game: CampusGame | null = null;

/**
 * Enter game mode - hide website, show game canvas
 */
async function enterGameMode(): Promise<void> {
  // Hide website content
  const content = document.getElementById('content');
  if (content) content.style.display = 'none';

  // Hide header
  const header = document.querySelector('header');
  if (header) (header as HTMLElement).style.display = 'none';

  // Create game container
  let container = document.getElementById('game-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
  }

  // Start game (loads vanilla JS scripts and initializes)
  game = new CampusGame(container);
  await game.start();
}

/**
 * Exit game mode - destroy game, restore website
 */
function exitGameMode(): void {
  if (game) {
    game.destroy();
    game = null;
  }

  // Remove game container
  const container = document.getElementById('game-container');
  if (container) container.remove();

  // Show website content
  const content = document.getElementById('content');
  if (content) content.style.display = '';

  // Show header
  const header = document.querySelector('header');
  if (header) (header as HTMLElement).style.display = '';
}

// Game mode route
router.add('/game', async () => {
  currentMode = 'game';
  await enterGameMode();
});

// Keyboard shortcut for game mode toggle (G key)
document.addEventListener('keydown', (e) => {
  // Only toggle on G key when not typing in input/textarea
  if (
    (e.key === 'g' || e.key === 'G') &&
    !(e.target instanceof HTMLInputElement) &&
    !(e.target instanceof HTMLTextAreaElement)
  ) {
    // Handle G key from landing page
    if (currentMode === 'landing') {
      transitionToMode('game');
      return;
    }

    // Toggle between game and website modes
    if (game) {
      exitGameMode();
      currentMode = 'website';
      router.navigate('/');
    } else {
      router.navigate('/game');
    }
  }
});

// Handle anchor navigation on home page
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const link = target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Handle section anchors (e.g., #about, #publications)
  if (href.startsWith('#') && !href.startsWith('#/')) {
    // If we're on home page, smooth scroll
    if (router.getCurrentPath() === '/' || router.getCurrentPath() === '') {
      e.preventDefault();
      const sectionId = href.slice(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        // Update URL without triggering route change
        history.pushState(null, '', href);
      }
    } else {
      // If on detail page, navigate home then scroll
      e.preventDefault();
      router.navigate('/');
      // Wait for render then scroll
      setTimeout(() => {
        const sectionId = href.slice(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
});

// Mode switch event listener (for header and game HUD toggle buttons)
window.addEventListener('mode-switch', ((e: CustomEvent) => {
  const targetMode = e.detail.mode as 'website' | 'game';

  // Handle from landing page
  if (currentMode === 'landing') {
    transitionToMode(targetMode);
    return;
  }

  if (targetMode === 'game' && !game) {
    // From website to game
    showLoadingScreen();
    enterGameMode().then(() => hideLoadingScreen());
    currentMode = 'game';
  } else if (targetMode === 'website' && game) {
    // From game to website - render directly (router won't fire since hash is already '/')
    exitGameMode();
    currentMode = 'website';
    render(renderHomePage());
  }
}) as EventListener);

// Initialize router
router.init();
