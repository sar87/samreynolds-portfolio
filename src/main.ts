// Import styles
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';
import './styles/game.css';

// Import router and pages
import { router } from './lib/router';

// Import game
import { Game } from './game/Game';
import { renderHeader, initMobileNav } from './components/Header/Header';
import { renderHomePage } from './pages/HomePage';
import { renderPublicationDetail } from './pages/PublicationDetail';
import { renderTalkDetail } from './pages/TalkDetail';
import { renderMediaDetail } from './pages/MediaDetail';

// Get app container
const app = document.getElementById('app');
if (!app) throw new Error('App container not found');

// Render function that updates app content
async function render(content: string | Promise<string>): Promise<void> {
  const html = await content;
  // Keep header persistent, only update main content
  const headerHtml = renderHeader();
  app!.innerHTML = `${headerHtml}<div id="content">${html}</div>`;
  initMobileNav();

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

// Register routes
router.add('/', async () => {
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
let game: Game | null = null;

/**
 * Enter game mode - hide website, show game canvas
 */
function enterGameMode(): void {
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

  // Start game
  game = new Game(container);
  game.start();
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
  enterGameMode();
});

// Keyboard shortcut for game mode toggle (G key)
document.addEventListener('keydown', (e) => {
  // Only toggle on G key when not typing in input/textarea
  if (
    (e.key === 'g' || e.key === 'G') &&
    !(e.target instanceof HTMLInputElement) &&
    !(e.target instanceof HTMLTextAreaElement)
  ) {
    if (game) {
      exitGameMode();
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

// Initialize router
router.init();
