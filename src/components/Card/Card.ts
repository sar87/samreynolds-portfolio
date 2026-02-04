/**
 * Card Components
 *
 * Publication, Talk, and Media card variants.
 * Linear.app-inspired minimal design with hover states.
 */

import type { Publication, Talk, MediaItem } from '../../types/content';
import styles from './Card.module.css';

export function renderPublicationCard(pub: Publication): string {
  const authorStr = pub.authors.map((a) => a.name).join(', ');
  const imageHtml = pub.image
    ? `<div class="${styles.cardImageWrapper}">
        <img src="${pub.image}" alt="${pub.title}" class="${styles.cardImage}" loading="lazy" />
      </div>`
    : '';

  return `
    <article class="${styles.card}${pub.image ? ` ${styles.cardWithImage}` : ''} scroll-reveal">
      <a href="#/publication/${pub.id}" class="${styles.cardLink}">
        ${imageHtml}
        <div class="${styles.cardBody}">
          <h3 class="${styles.title}">${pub.title}</h3>
          <p class="${styles.meta}">${authorStr}</p>
          <p class="${styles.secondary}">${pub.journal} &middot; ${pub.year}</p>
        </div>
      </a>
    </article>
  `;
}

export function renderTalkCard(talk: Talk): string {
  const date = new Date(talk.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `
    <article class="${styles.card} scroll-reveal">
      <a href="#/talk/${talk.id}" class="${styles.cardLink}">
        <h3 class="${styles.title}">${talk.title}</h3>
        <p class="${styles.meta}">${talk.venue}</p>
        <p class="${styles.secondary}">${date}</p>
      </a>
    </article>
  `;
}

export function renderMediaCard(media: MediaItem): string {
  const date = new Date(media.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
  });
  const typeLabel = media.type.charAt(0).toUpperCase() + media.type.slice(1);
  const imageHtml = media.image
    ? `<div class="${styles.cardImageWrapper}">
        <img src="${media.image}" alt="${media.title}" class="${styles.cardImage}" loading="lazy" />
      </div>`
    : '';

  return `
    <article class="${styles.card}${media.image ? ` ${styles.cardWithImage}` : ''} scroll-reveal">
      <a href="#/media/${media.id}" class="${styles.cardLink}">
        ${imageHtml}
        <div class="${styles.cardBody}">
          <span class="${styles.badge}">${typeLabel}</span>
          <h3 class="${styles.title}">${media.title}</h3>
          <p class="${styles.meta}">${media.venue}</p>
          <p class="${styles.secondary}">${date}</p>
        </div>
      </a>
    </article>
  `;
}

export function renderCardGrid(cards: string[]): string {
  return `<div class="${styles.cardGrid}" data-stagger>${cards.join('')}</div>`;
}
