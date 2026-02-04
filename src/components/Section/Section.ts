/**
 * Section Component
 *
 * Reusable section wrapper with heading and content.
 * Includes scroll-margin-top for sticky header offset.
 */

import styles from './Section.module.css';

interface SectionProps {
  id: string;
  title: string;
  children: string;
}

export function renderSection({ id, title, children }: SectionProps): string {
  return `
    <section id="${id}" class="${styles.section} scroll-reveal" aria-labelledby="${id}-heading">
      <div class="${styles.container}">
        <h2 id="${id}-heading" class="${styles.heading}">${title}</h2>
        ${children}
      </div>
    </section>
  `;
}
