// Import styles
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';

// Import router and pages
import { router } from './lib/router';
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
