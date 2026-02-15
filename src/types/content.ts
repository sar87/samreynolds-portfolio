/**
 * Content Types
 *
 * TypeScript interfaces matching JSON schema definitions
 * from data/schemas/*.schema.json
 */

// Publication types
export interface Author {
  name: string;
  isSamReynolds: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  journal: string;
  year: number;
  date: string;
  doi?: string;
  url?: string;
  abstract?: string;
  image?: string;
}

// Talk types
export interface Talk {
  id: string;
  title: string;
  venue: string;
  date: string;
  slides?: string;
  video?: string;
  description?: string;
}

// Media types
export type MediaType = 'podcast' | 'video' | 'panel' | 'interview';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  venue: string;
  date: string;
  link?: string;
  description?: string;
  embedUrl?: string;
  image?: string;
}

// Research types
export interface ResearchTopic {
  id: string;
  name: string;
  description: string;
  relatedPublications?: string[];
}

// About types
export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface AboutLinks {
  github?: string;
  scholar?: string;
  twitter?: string;
  linkedin?: string;
  researchgate?: string;
  department?: string;
}

export interface About {
  name: string;
  title: string;
  affiliation: string;
  email: string;
  bio: string[];
  education: Education[];
  links?: AboutLinks;
}
