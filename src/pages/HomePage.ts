/**
 * Home Page
 *
 * Main scrollable page with all content sections:
 * About, Research, Publications, Talks, Media
 */

import { renderSection } from '../components/Section/Section';
import {
  renderPublicationCard,
  renderTalkCard,
  renderMediaCard,
  renderCardGrid,
} from '../components/Card/Card';
import {
  loadPublications,
  loadTalks,
  loadMedia,
  loadResearch,
  loadAbout,
} from '../lib/content';
import type {
  Publication,
  Talk,
  MediaItem,
  ResearchTopic,
  About,
} from '../types/content';
import styles from './HomePage.module.css';

export async function renderHomePage(): Promise<string> {
  // Load all content in parallel
  const [publications, talks, media, research, about] = await Promise.all([
    loadPublications(),
    loadTalks(),
    loadMedia(),
    loadResearch(),
    loadAbout(),
  ]);

  return `
    <main class="${styles.main}">
      ${renderAboutSection(about)}
      ${renderShowcase()}
      ${renderResearchSection(research)}
      ${renderPublicationsSection(publications)}
      ${renderTalksSection(talks)}
      ${renderMediaSection(media)}
    </main>
  `;
}

function renderAboutSection(about: About): string {
  const bioHtml = about.bio.map((p) => `<p>${p}</p>`).join('');
  const educationHtml = about.education
    .map(
      (e) =>
        `<li><strong>${e.degree}</strong> - ${e.institution}, ${e.year}</li>`
    )
    .join('');

  // Build links safely, checking for optional properties
  const linkItems: string[] = [];
  linkItems.push(
    `<a href="mailto:${about.email}" class="${styles.link}">Email</a>`
  );

  if (about.links?.github) {
    linkItems.push(
      `<a href="${about.links.github}" class="${styles.link}" target="_blank" rel="noopener">GitHub</a>`
    );
  }
  if (about.links?.scholar) {
    linkItems.push(
      `<a href="${about.links.scholar}" class="${styles.link}" target="_blank" rel="noopener">Scholar</a>`
    );
  }
  if (about.links?.twitter) {
    linkItems.push(
      `<a href="${about.links.twitter}" class="${styles.link}" target="_blank" rel="noopener">Twitter</a>`
    );
  }

  const content = `
    <div class="${styles.aboutGrid}">
      <div class="${styles.aboutContent}">
        <h1 class="${styles.name}">${about.name}</h1>
        <p class="${styles.title}">${about.title}</p>
        <p class="${styles.affiliation}">${about.affiliation}</p>
        <div class="${styles.bio}">${bioHtml}</div>
        <div class="${styles.links}">${linkItems.join('')}</div>
      </div>
      <div class="${styles.aboutSidebar}">
        <img src="/images/profile.jpg" alt="${about.name}" class="${styles.profilePhoto}" />
        <div class="${styles.aboutEducation}">
          <h3>Education</h3>
          <ul>${educationHtml}</ul>
        </div>
      </div>
    </div>
  `;

  return `
    <section id="about" class="scroll-reveal" aria-label="About">
      <div class="${styles.aboutContainer}">
        ${content}
      </div>
    </section>
  `;
}

function renderShowcase(): string {
  return `
    <div class="${styles.showcase} scroll-reveal">
      <div class="${styles.showcaseInner}">
        <div class="${styles.showcaseCard} ${styles.showcasePrimary}">
          <img src="/images/nature-reviews.jpg" alt="AI is poisoning evidence synthesis — Nature illustration" />
        </div>
        <div class="${styles.showcaseCard} ${styles.showcaseSecondary}">
          <img src="/images/nature-comment.png" alt="Will AI speed up literature reviews or derail them entirely? — Nature Comment" />
        </div>
      </div>
      <p class="${styles.showcaseCaption}">
        Featured in <a href="https://www.nature.com/articles/d41586-025-00956-2" target="_blank" rel="noopener">Nature</a> — AI and the future of evidence synthesis in conservation
      </p>
    </div>
  `;
}

function renderResearchSection(research: ResearchTopic[]): string {
  const topicsHtml = research
    .map(
      (topic) => `
      <div class="${styles.researchTopic}">
        <h3 class="${styles.topicName}">${topic.name}</h3>
        <p class="${styles.topicDescription}">${topic.description}</p>
      </div>
    `
    )
    .join('');

  return renderSection({
    id: 'research',
    title: 'Research',
    children: `<div class="${styles.researchGrid}">${topicsHtml}</div>`,
  });
}

function renderPublicationsSection(publications: Publication[]): string {
  // Sort by date descending (most recent first)
  const sorted = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const cards = sorted.map(renderPublicationCard);

  return renderSection({
    id: 'publications',
    title: 'Publications',
    children: renderCardGrid(cards),
  });
}

function renderTalksSection(talks: Talk[]): string {
  // Sort by date descending (most recent first)
  const sorted = [...talks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const cards = sorted.map(renderTalkCard);

  return renderSection({
    id: 'talks',
    title: 'Talks',
    children: renderCardGrid(cards),
  });
}

function renderMediaSection(media: MediaItem[]): string {
  // Sort by date descending (most recent first)
  const sorted = [...media].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const cards = sorted.map(renderMediaCard);

  return renderSection({
    id: 'media',
    title: 'Media',
    children: renderCardGrid(cards),
  });
}
