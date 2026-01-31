/**
 * Publication Detail Page
 *
 * Displays full information for a single publication:
 * title, authors (with Sam highlighted), journal, year, abstract, and DOI link.
 */

import { getPublicationById } from '../lib/content';
import styles from './DetailPage.module.css';

export async function renderPublicationDetail(id: string): Promise<string> {
  const pub = await getPublicationById(id);

  if (!pub) {
    return `
      <main class="${styles.container}">
        <a href="#/" class="${styles.backLink}">&larr; Back</a>
        <h1>Publication not found</h1>
      </main>
    `;
  }

  const authorStr = pub.authors
    .map((a) => (a.isSamReynolds ? `<strong>${a.name}</strong>` : a.name))
    .join(', ');

  const doiUrl = `https://doi.org/${pub.doi}`;

  // Abstract is optional in the schema
  const abstractSection = pub.abstract
    ? `
        <section class="${styles.abstract}">
          <h2>Abstract</h2>
          <p>${pub.abstract}</p>
        </section>
      `
    : '';

  return `
    <main class="${styles.container}">
      <a href="#/" class="${styles.backLink}">&larr; Back to Home</a>
      <article class="${styles.detail}">
        <header class="${styles.detailHeader}">
          <h1 class="${styles.title}">${pub.title}</h1>
          <p class="${styles.authors}">${authorStr}</p>
          <p class="${styles.meta}">
            <span>${pub.journal}</span>
            <span class="${styles.separator}">&middot;</span>
            <span>${pub.year}</span>
          </p>
        </header>
        ${abstractSection}
        <footer class="${styles.links}">
          <a href="${doiUrl}" class="${styles.primaryLink}" target="_blank" rel="noopener">
            View Publication &rarr;
          </a>
        </footer>
      </article>
    </main>
  `;
}
