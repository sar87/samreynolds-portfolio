# Phase 2: Content Data Layer - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Structure all academic content (publications, talks, media, research, about) into JSON files that both game and website modes will consume. This phase creates the data layer — display and interaction are handled in Phases 3 and 6.

</domain>

<decisions>
## Implementation Decisions

### Publication structure
- Full author list stored in order, with a flag indicating which author is Sam Reynolds
- DOI only for links — construct URLs dynamically, no hosting PDFs or multiple link types
- Abstract handling and citation metrics: Claude's discretion

### Talk metadata
- Title only — no description or abstract per talk
- Include slide deck URLs and video links where available
- No categories or tags — chronological list only
- Venue structure: Claude's discretion on detail level

### Media organization
- Categorize by format: podcast, video, panel, interview as separate types
- Use metadata already available at www.samreynolds.org as source
- Generic icons for media types (podcast icon, video icon, etc.) — not outlet-specific logos
- Host icons locally rather than external URLs

### Content relationships
- Research topics reference their related publications (topics → papers direction)
- Flat list of research topics, not hierarchical
- Talks exist standalone — no cross-references to papers
- About section linking to featured work: Claude's discretion

### Claude's Discretion
- Abstract length and format (full vs summary)
- Whether to include citation counts (considering maintenance burden)
- Venue detail level for talks
- Whether About section highlights featured publications/talks

</decisions>

<specifics>
## Specific Ideas

- Use www.samreynolds.org as the source of truth for content and metadata
- Generic media type icons (podcast, video, panel) rather than outlet logos

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-data-layer*
*Context gathered: 2026-01-30*
