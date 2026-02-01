/**
 * Landing Component
 *
 * Renders a vertical split layout for mode selection:
 * - Left half: Traditional website mode
 * - Right half: Pixel-art game mode
 */

import aboutData from '../../../data/about.json';

/**
 * Extract a brief intro from the about data
 * Uses first sentence of first bio paragraph
 */
function getIntroText(): string {
  const firstParagraph = aboutData.bio[0];
  // Get first sentence (up to first period followed by space or end)
  const match = firstParagraph.match(/^[^.]+\./);
  return match
    ? match[0]
    : "Conservation biologist and AI researcher at Cambridge.";
}

/**
 * Render the landing page with split layout
 */
export function renderLanding(): string {
  const intro = getIntroText();

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
              <span class="landing-preview-text">Game Preview</span>
            </div>
            <button class="landing-button landing-button--game" data-mode="game" type="button">
              Enter Game
            </button>
          </div>
        </div>
      </div>

      <div class="landing-footer">
        <!-- Skip links placeholder for Plan 03 -->
      </div>
    </div>
  `;
}
