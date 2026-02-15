/**
 * Talk Detail Page
 *
 * Displays full information for a single talk:
 * title, venue, date, and optional video/slides links.
 */

import { getTalkById } from '../lib/content';
import styles from './DetailPage.module.css';

export async function renderTalkDetail(id: string): Promise<string> {
  const talk = await getTalkById(id);

  if (!talk) {
    return `
      <main class="${styles.container}">
        <a href="#/" class="${styles.backLink}">&larr; Back</a>
        <h1>Talk not found</h1>
      </main>
    `;
  }

  const date = new Date(talk.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build links section only if video or slides exist
  let linksHtml = '';
  if (talk.video || talk.slides) {
    const linkItems: string[] = [];
    if (talk.video) {
      linkItems.push(
        `<a href="${talk.video}" class="${styles.primaryLink}" target="_blank" rel="noopener">Watch Video &rarr;</a>`
      );
    }
    if (talk.slides) {
      linkItems.push(
        `<a href="${talk.slides}" class="${styles.secondaryLink}" target="_blank" rel="noopener">View Slides</a>`
      );
    }
    linksHtml = `<footer class="${styles.links}">${linkItems.join('')}</footer>`;
  }

  return `
    <main class="${styles.container}">
      <a href="#/" class="${styles.backLink}">&larr; Back to Home</a>
      <article class="${styles.detail}">
        <header class="${styles.detailHeader}">
          <h1 class="${styles.title}">${talk.title}</h1>
          <p class="${styles.meta}">
            <span>${talk.venue}</span>
            <span class="${styles.separator}">&middot;</span>
            <span>${date}</span>
          </p>
        </header>
        ${talk.description ? `<section class="${styles.abstract}"><p>${talk.description}</p></section>` : ''}
        ${linksHtml}
      </article>
    </main>
  `;
}
