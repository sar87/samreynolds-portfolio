/**
 * Landing Component
 *
 * Renders a vertical split layout for mode selection:
 * - Left half: Traditional website mode
 * - Right half: Pixel-art game mode
 */

import { createGamePreview, startPreviewAnimation, stopPreviewAnimation } from './GamePreview';

// About data loaded via fetch at runtime (matches content.ts pattern)
interface AboutData {
  name: string;
  title: string;
  bio: string[];
}

let aboutDataCache: AboutData | null = null;

async function loadAboutData(): Promise<AboutData> {
  if (aboutDataCache) return aboutDataCache;
  const response = await fetch('/data/about.json');
  aboutDataCache = await response.json();
  return aboutDataCache!;
}

/**
 * Extract a brief intro from the about data
 * Uses first sentence of first bio paragraph
 */
function getIntroText(aboutData: AboutData): string {
  const firstParagraph = aboutData.bio[0];
  // Get first sentence (up to first period followed by space or end)
  const match = firstParagraph.match(/^[^.]+\./);
  return match
    ? match[0]
    : "Conservation biologist and AI researcher at Cambridge.";
}

/**
 * SVG icons for skip links (simple inline icons)
 */
const SKIP_LINK_ICONS: Record<string, string> = {
  publications: `<svg class="skip-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"/></svg>`,
  talks: `<svg class="skip-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path fill="currentColor" d="m8 16 5-4-5-4z"/></svg>`,
  media: `<svg class="skip-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 6h-5.586l-1-1H8.414l-1 1H2v14h18zM4 18V8h4l1-1h6l1 1h4v10z"/><circle fill="currentColor" cx="12" cy="13" r="3"/></svg>`,
  research: `<svg class="skip-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2h-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2zm0-18h2v3h10V4h2l.001 16H5V4z"/><path fill="currentColor" d="M10 10h4v2h-4zm-3 4h10v2H7zm0 4h10v2H7z"/></svg>`,
  about: `<svg class="skip-link-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"/></svg>`,
};

/**
 * Render skip-to-content links for direct section navigation
 */
function renderSkipLinks(): string {
  const links = [
    { id: 'publications', label: 'Publications' },
    { id: 'talks', label: 'Talks' },
    { id: 'media', label: 'Media' },
    { id: 'research', label: 'Research' },
    { id: 'about', label: 'About' },
  ];

  return links.map(link => `
    <a href="#${link.id}" class="skip-link" data-section="${link.id}">
      ${SKIP_LINK_ICONS[link.id]}
      <span class="skip-link-text">${link.label}</span>
    </a>
  `).join('');
}

/**
 * Render the landing page with split layout
 */
export async function renderLanding(): Promise<string> {
  const aboutData = await loadAboutData();
  const intro = getIntroText(aboutData);

  return `
    <div class="landing">
      <div class="landing-intro">
        <h1 class="landing-intro-name">${aboutData.name}</h1>
        <p class="landing-intro-title">${aboutData.title}</p>
        <p class="landing-intro-bio">${intro}</p>
      </div>

      <div class="landing-split">
        <div class="landing-half landing-half--website">
          <div class="landing-half-content">
            <h2 class="landing-half-title">Traditional Website</h2>
            <p class="landing-half-tagline">Browse publications, talks, and research in a clean academic layout</p>
            <div class="landing-preview" aria-hidden="true">
              <span class="landing-preview-text">Website Preview</span>
            </div>
            <button class="landing-button" data-mode="website" type="button">
              Enter Website
            </button>
          </div>
        </div>

        <div class="landing-half landing-half--game">
          <div class="landing-half-content">
            <h2 class="landing-half-title">Explore Campus</h2>
            <p class="landing-half-tagline">Walk through a pixel-art Cambridge campus and discover content</p>
            <div class="landing-preview landing-preview--game" aria-hidden="true">
              ${createGamePreview()}
            </div>
            <button class="landing-button landing-button--game" data-mode="game" type="button">
              Enter Game
            </button>
          </div>
        </div>
      </div>

      <div class="landing-footer">
        <nav class="skip-links" aria-label="Skip to section">
          ${renderSkipLinks()}
        </nav>
      </div>
    </div>
  `;
}

/**
 * Initialize landing page after render
 * Starts the game preview animation
 * @returns Cleanup function that stops animation
 */
export function initLanding(): () => void {
  const canvas = document.querySelector('.game-preview-canvas') as HTMLCanvasElement | null;

  if (!canvas) {
    return () => {}; // No-op cleanup if canvas not found
  }

  const intervalId = startPreviewAnimation(canvas);

  return () => {
    stopPreviewAnimation(intervalId);
  };
}
