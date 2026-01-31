/**
 * Content Loading Utilities
 *
 * Async functions to fetch and cache content from JSON data files
 */

import type {
  Publication,
  Talk,
  MediaItem,
  ResearchTopic,
  About,
} from '../types/content';

// Module-level cache to avoid refetching
const cache: {
  publications?: Publication[];
  talks?: Talk[];
  media?: MediaItem[];
  research?: ResearchTopic[];
  about?: About;
} = {};

/**
 * Load all publications
 */
export async function loadPublications(): Promise<Publication[]> {
  if (cache.publications) {
    return cache.publications;
  }

  const response = await fetch('/data/publications.json');
  const data: { publications: Publication[] } = await response.json();
  cache.publications = data.publications;
  return cache.publications;
}

/**
 * Load all talks
 */
export async function loadTalks(): Promise<Talk[]> {
  if (cache.talks) {
    return cache.talks;
  }

  const response = await fetch('/data/talks.json');
  const data: { talks: Talk[] } = await response.json();
  cache.talks = data.talks;
  return cache.talks;
}

/**
 * Load all media items
 */
export async function loadMedia(): Promise<MediaItem[]> {
  if (cache.media) {
    return cache.media;
  }

  const response = await fetch('/data/media.json');
  const data: { media: MediaItem[] } = await response.json();
  cache.media = data.media;
  return cache.media;
}

/**
 * Load all research topics
 */
export async function loadResearch(): Promise<ResearchTopic[]> {
  if (cache.research) {
    return cache.research;
  }

  const response = await fetch('/data/research.json');
  const data: { researchTopics: ResearchTopic[] } = await response.json();
  cache.research = data.researchTopics;
  return cache.research;
}

/**
 * Load about information
 */
export async function loadAbout(): Promise<About> {
  if (cache.about) {
    return cache.about;
  }

  const response = await fetch('/data/about.json');
  const data: About = await response.json();
  cache.about = data;
  return cache.about;
}

/**
 * Get a specific publication by ID
 */
export async function getPublicationById(
  id: string
): Promise<Publication | undefined> {
  const publications = await loadPublications();
  return publications.find((pub) => pub.id === id);
}

/**
 * Get a specific talk by ID
 */
export async function getTalkById(id: string): Promise<Talk | undefined> {
  const talks = await loadTalks();
  return talks.find((talk) => talk.id === id);
}

/**
 * Get a specific media item by ID
 */
export async function getMediaById(id: string): Promise<MediaItem | undefined> {
  const media = await loadMedia();
  return media.find((item) => item.id === id);
}

/**
 * Get a specific research topic by ID
 */
export async function getResearchById(
  id: string
): Promise<ResearchTopic | undefined> {
  const research = await loadResearch();
  return research.find((topic) => topic.id === id);
}

/**
 * Clear the cache (useful for testing or forced refresh)
 */
export function clearCache(): void {
  cache.publications = undefined;
  cache.talks = undefined;
  cache.media = undefined;
  cache.research = undefined;
  cache.about = undefined;
}
