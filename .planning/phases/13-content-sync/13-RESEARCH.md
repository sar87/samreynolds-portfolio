# Phase 13: Content Sync - Research

**Researched:** 2026-02-04
**Domain:** Content population from authoritative source (samreynolds.org)
**Confidence:** HIGH

## Summary

This phase is a content population task, not a feature implementation. The existing website infrastructure (TypeScript + JSON data files) is complete. The work involves:

1. **Replacing JSON data** in `/data/*.json` files with real content from samreynolds.org
2. **Extending MediaItem schema** to support embedded players (YouTube, Spotify)
3. **Updating MediaDetail component** to render embedded content inline

The codebase already handles: reverse-chronological sorting, author highlighting, DOI link formatting, and card-based display. No new libraries needed. The challenge is accurate data entry and embed implementation.

**Primary recommendation:** Update JSON data files to match samreynolds.org exactly, add `embedUrl` field to MediaItem type for embedded players, and enhance MediaDetail.ts to render responsive iframes.

## Standard Stack

### Core (Already in Place)
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| TypeScript | existing | Type-safe data handling | Already configured |
| JSON | - | Data storage | Static site, no backend needed |
| CSS Modules | existing | Styling | Already configured |

### Supporting (No New Dependencies)
| Technology | Purpose | When to Use |
|------------|---------|-------------|
| Native iframe | Video/podcast embedding | YouTube, Spotify embeds |
| CSS aspect-ratio | Responsive embeds | 16:9 video containers |

### Alternatives Considered
| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| iframe embeds | JavaScript SDKs | Complexity overkill for 3-4 media items |
| Static JSON | CMS/API | Out of scope, existing system works |
| Open-access PDF hosting | Local PDF storage | External DOI links sufficient per CONTEXT.md |

**No installation needed** - purely data population and minor component updates.

## Architecture Patterns

### Recommended Data Update Approach
```
data/
├── publications.json  # Replace with 15 papers from samreynolds.org
├── media.json         # Replace with 4 items (CIEEM, COP30, Wildscreen, Cambridge)
├── about.json         # Update bio to lead with AI + Conservation
└── research.json      # Update to match samreynolds.org structure
```

### Pattern 1: Embedded Media URLs
**What:** Add `embedUrl` field to MediaItem for inline players
**When to use:** For media items that should play directly on page (videos, podcasts)
**Example:**
```typescript
// src/types/content.ts - extend MediaItem
export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  venue: string;
  date: string;
  link?: string;
  description?: string;
  embedUrl?: string;  // NEW: For inline iframe embedding
}
```

### Pattern 2: Responsive iframe Container
**What:** CSS wrapper for 16:9 aspect ratio embeds
**When to use:** YouTube videos, Spotify podcast players
**Example:**
```css
/* Responsive embed container */
.embedContainer {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.embedContainer iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```
**Source:** Standard responsive iframe pattern from [Yoast](https://yoast.com/how-to-make-youtube-videos-responsive/)

### Pattern 3: Spotify Episode Embed
**What:** Spotify provides embed URLs for podcast episodes
**Format:** `https://open.spotify.com/embed/episode/{episode-id}`
**Note:** CIEEM podcast is on Spotify at `https://open.spotify.com/show/4her6ylV6YFWjwiiLjAqwF`
**Source:** [Spotify Embeds Documentation](https://developer.spotify.com/documentation/embeds)

### Pattern 4: YouTube Embed
**What:** Standard YouTube embed URL format
**Format:** `https://www.youtube.com/embed/{video-id}`
**Example:** COP30 video: `https://www.youtube.com/embed/210uVXwX1iE`

### Anti-Patterns to Avoid
- **Hard-coded dimensions:** Use CSS aspect-ratio, not fixed width/height attributes
- **Missing rel="noopener":** Always include on external links
- **Unescaped HTML in JSON:** Descriptions are plain text, render as text content

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Video embedding | Custom player | YouTube iframe | Handles all playback, buffering, mobile |
| Podcast embedding | Audio player component | Spotify iframe | Handles playback, mobile app redirect |
| Citation formatting | Custom parser | DOI.org URLs | DOI handles resolution to publisher |
| Responsive iframes | JavaScript resize | CSS aspect-ratio | Native, performant, no JS needed |

**Key insight:** Embedding is solved by platform providers. YouTube and Spotify iframes handle all edge cases (mobile, buffering, accessibility). Custom players add complexity without benefit.

## Common Pitfalls

### Pitfall 1: Incorrect Author Order
**What goes wrong:** Copying author names in wrong order from citations
**Why it happens:** Different citation styles reorder names
**How to avoid:** Use EXACTLY the order shown on samreynolds.org or DOI page
**Warning signs:** "Reynolds, S" appears in unexpected position

### Pitfall 2: DOI Format Inconsistency
**What goes wrong:** Some DOIs include "https://doi.org/", others don't
**Why it happens:** Different sources format DOIs differently
**How to avoid:** Store DOI without prefix (schema enforces pattern `^10\.\d{4,}/`)
**Warning signs:** URLs like `https://doi.org/https://doi.org/10.1234/...`

### Pitfall 3: Future-Dated Content
**What goes wrong:** Including content with dates in the future (Nov 2025 for COP30)
**Why it happens:** samreynolds.org may list upcoming events
**How to avoid:** Note that COP30 is Nov 2025 - verify if video is available now
**Warning signs:** Media items appearing before they exist

### Pitfall 4: Missing Embed Episode IDs
**What goes wrong:** Having Spotify show URL but not specific episode URL
**Why it happens:** CIEEM episode featuring Sam Reynolds needs specific episode lookup
**How to avoid:** Find exact episode on Spotify, extract episode ID
**Warning signs:** Embed plays wrong episode or show overview

### Pitfall 5: Stale Placeholder Content
**What goes wrong:** Leaving placeholder publications that aren't real
**Why it happens:** Current JSON has synthetic data for 15 publications
**How to avoid:** Complete replacement of entire JSON arrays, don't merge
**Warning signs:** Mix of real and placeholder titles

## Code Examples

### MediaDetail with Embedded Player
```typescript
// In renderMediaDetail function
const embedSection = media.embedUrl
  ? `
      <section class="${styles.embedContainer}">
        <iframe
          src="${media.embedUrl}"
          title="${media.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </section>
    `
  : '';
```

### Publication Card with Author Formatting
```typescript
// Format: Bold "Reynolds, S" when not first author
// Format: "Reynolds et al." when first with multiple co-authors
function formatAuthors(authors: Author[]): string {
  const samIndex = authors.findIndex(a => a.isSamReynolds);

  if (samIndex === 0 && authors.length > 2) {
    // First author with multiple co-authors: "Reynolds et al."
    return '<strong>Reynolds et al.</strong>';
  }

  return authors.map((a, i) => {
    if (a.isSamReynolds && i !== 0) {
      // Not first author: bold "Reynolds, S"
      return `<strong>${a.name}</strong>`;
    }
    return a.name;
  }).join(', ');
}
```

### YouTube Embed URL
```typescript
// COP30 video
const embedUrl = 'https://www.youtube.com/embed/210uVXwX1iE';
```

### Spotify Episode Embed URL
```typescript
// CIEEM episode - needs episode ID lookup
// Show URL: https://open.spotify.com/show/4her6ylV6YFWjwiiLjAqwF
// Episode embed format: https://open.spotify.com/embed/episode/{episode-id}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Fixed-dimension iframes | CSS aspect-ratio | 2021+ | Native responsive, no wrapper needed |
| Flash embeds | HTML5 iframe | 2020 (Flash EOL) | Modern players only |
| Direct MP3 hosting | Spotify/platform embeds | - | Platform handles streaming |

**Current (not deprecated):**
- YouTube iframe API - stable, well-supported
- Spotify oEmbed - official, maintained
- DOI resolution via doi.org - industry standard

## Content Mapping: samreynolds.org to JSON

### Publications (15 papers, 2019-2025)

Based on WebFetch of samreynolds.org/recent-talks-and-publications/:

| samreynolds.org | Year | Status |
|-----------------|------|--------|
| AI-assisted Living Evidence Databases | 2025 | Published (Cambridge Open Engage) |
| AI is poisoning evidence synthesis | 2025 | Nature |
| Steps towards an Ecology for the Internet | 2025 | Aarhus Conference |
| Conservation changed but not divided | 2025 | TREE |
| The potential for AI to revolutionise conservation | 2025 | TREE |
| Careful design of LLM pipelines | 2025 | PlosOne |
| Eel Conservation in Inland Habitats | 2024 | Conservation Evidence |
| Spartina invasive management | 2023 | OSF (featured in Science) |
| Gambusia spp. Management | 2022 | IUCN |
| Parasitism and freshwater mussels | 2022 | Functional Ecology |
| Global impacts on shallow lakes | 2021 | Global Change Biology |
| Impacts of invasive quagga mussels | 2021 | Water Research |
| Embracing Allelopathic Potential | 2021 | Frontiers |
| Harnessing Synthetic Ecology | 2019 | Scientific Reports |
| (Plus 1 in preparation - may exclude) | 2025 | Biological Invasions |

**Note:** Current JSON has synthetic placeholder content that must be replaced entirely.

### Media (4 key items from requirements)

| Item | Type | Date | Embed Source |
|------|------|------|--------------|
| CIEEM Nature in a Nutshell podcast | podcast | June 2025 | Spotify (needs episode ID) |
| COP30 video | video | Nov 2025 | YouTube (210uVXwX1iE) |
| Wildscreen panel "AI, an Altruist's Guide" | panel | March 2025 | Link only (no embed) |
| Cambridge feature "AI for Nature: Embrace with Caution" | interview | May 2025 | Link (cam.ac.uk) |

### Research Areas

| Current | samreynolds.org |
|---------|-----------------|
| 6 topics (AI-focused) | 2 main areas: Conservation+AI, PhD (invasive species) |

**Decision needed:** Simplify to match samreynolds.org's 2-area structure, or keep granular.

### Bio/About

| Field | Current | samreynolds.org |
|-------|---------|-----------------|
| Title | "AI, Conservation & Ecology Researcher" | Similar |
| Email | sam@samreynolds.org | sar87@cam.ac.uk |
| Bio emphasis | Generic AI + conservation | Lead with AI evidence synthesis |
| Education | PhD 2023, MSc 2019, BSc 2018 | PhD Zoology Cambridge, MSc+BSc Warwick |

## Open Questions

1. **CIEEM Spotify Episode ID**
   - What we know: CIEEM podcast is on Spotify (show/4her6ylV6YFWjwiiLjAqwF)
   - What's unclear: Exact episode ID for Sam Reynolds interview (June 25, 2025)
   - Recommendation: Search Spotify for "Nature in a Nutshell Sam Reynolds" to find episode ID

2. **COP30 Video Availability**
   - What we know: Link exists (youtube.com/watch?v=210uVXwX1iE)
   - What's unclear: COP30 is November 2025 - video may be announcement or pre-recorded
   - Recommendation: Verify video is publicly available before embedding

3. **Research Section Granularity**
   - What we know: samreynolds.org has 2 areas, current site has 6
   - What's unclear: User preference on structure
   - Recommendation: Match samreynolds.org structure per CONTEXT.md decisions

4. **Photos for About Section**
   - What we know: samreynolds.org has profile headshots and field photos
   - What's unclear: Exact photos to include, image hosting approach
   - Recommendation: Add photos field to About schema if images needed

## Sources

### Primary (HIGH confidence)
- samreynolds.org (WebFetch 2026-02-04) - authoritative source for all content
- Existing codebase (`/data/*.json`, `/src/types/content.ts`) - data structure
- JSON schemas (`/data/schemas/*.schema.json`) - field constraints

### Secondary (MEDIUM confidence)
- [Spotify Embeds Documentation](https://developer.spotify.com/documentation/embeds) - embed format
- [Yoast Responsive YouTube Guide](https://yoast.com/how-to-make-youtube-videos-responsive/) - CSS patterns
- [CIEEM Podcast Page](https://cieem.net/i-am/nature-in-a-nutshell-podcast/) - platform info

### Tertiary (LOW confidence)
- WebSearch results for embed best practices - general patterns, not verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, existing system verified
- Architecture: HIGH - minor extension to existing patterns
- Pitfalls: MEDIUM - based on common data entry errors, not verified failures
- Content mapping: MEDIUM - WebFetch of samreynolds.org, manual verification needed

**Research date:** 2026-02-04
**Valid until:** 2026-03-04 (30 days - content changes, structure stable)
