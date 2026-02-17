/**
 * Media Detail Page
 *
 * Displays full information for a single media item:
 * type badge, title, venue, date, description, and optional external link.
 */

import { getMediaById } from '../lib/content';
import styles from './DetailPage.module.css';

export async function renderMediaDetail(id: string): Promise<string> {
  const media = await getMediaById(id);

  if (!media) {
    return `
      <main class="${styles.container}">
        <a href="#/" class="${styles.backLink}">&larr; Back</a>
        <h1>Media not found</h1>
      </main>
    `;
  }

  const date = new Date(media.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
  });
  const typeLabel = media.type.charAt(0).toUpperCase() + media.type.slice(1);

  // Description is optional in the schema
  const descriptionSection = media.description
    ? `
        <section class="${styles.description}">
          ${media.description.split('\n\n').map(p => `<p>${p}</p>`).join('\n          ')}
        </section>
      `
    : '';

  // Embed section for YouTube/Spotify players or direct audio files
  let embedSection = '';
  if (media.embedUrl) {
    const isAudio = media.embedUrl.endsWith('.mp3') || media.embedUrl.endsWith('.wav') || media.embedUrl.endsWith('.ogg');
    if (isAudio) {
      embedSection = `
        <section class="${styles.audioContainer}">
          <audio controls preload="metadata">
            <source src="${media.embedUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </section>
      `;
    } else {
      embedSection = `
        <section class="${styles.embedContainer}${media.type === 'podcast' ? ` ${styles['embedContainer--podcast']}` : ''}">
          <iframe
            src="${media.embedUrl}"
            title="${media.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </section>
      `;
    }
  }

  // Link is optional in the schema
  const linkHtml = media.link
    ? `
        <footer class="${styles.links}">
          <a href="${media.link}" class="${styles.primaryLink}" target="_blank" rel="noopener">
            View ${typeLabel} &rarr;
          </a>
        </footer>
      `
    : '';

  return `
    <main class="${styles.container}">
      <a href="#/" class="${styles.backLink}">&larr; Back to Home</a>
      <article class="${styles.detail}">
        <header class="${styles.detailHeader}">
          <span class="${styles.badge}">${typeLabel}</span>
          <h1 class="${styles.title}">${media.title}</h1>
          <p class="${styles.meta}">
            <span>${media.venue}</span>
            <span class="${styles.separator}">&middot;</span>
            <span>${date}</span>
          </p>
        </header>
        ${descriptionSection}
        ${embedSection}
        ${linkHtml}
      </article>
    </main>
  `;
}
