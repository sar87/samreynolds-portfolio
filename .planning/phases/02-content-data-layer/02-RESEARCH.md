# Phase 2: Content Data Layer - Research

**Researched:** 2026-01-30
**Domain:** JSON data structures and schema validation for academic content
**Confidence:** HIGH

## Summary

This phase structures all academic content (publications, talks, media, research, about) into JSON files that both game and website modes will consume. The research focused on industry-standard approaches to JSON data modeling, schema validation, and academic content structuring.

**Key findings:**
- Ajv is the industry-standard JSON Schema validator (50M+ weekly downloads, HIGH confidence)
- ISO 8601 date format is the universal standard for dates in JSON
- Schema.org provides ScholarlyArticle vocabulary that aligns well with publication requirements
- Denormalized structure (flat JSON files per content type) is appropriate for read-heavy static sites
- Built-in JSON Schema formats handle common validation needs (date, uri, email)

**Primary recommendation:** Use separate JSON files per content type (publications.json, talks.json, etc.) with Ajv-validated JSON Schema 2020-12 schemas. Structure follows Schema.org vocabulary where applicable, with denormalized data optimized for frontend consumption.

## Standard Stack

The established libraries/tools for JSON data validation and academic content:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Ajv | 8.x (latest) | JSON Schema validation | Industry standard with 50M+ weekly npm downloads, fastest validator, supports JSON Schema 2020-12 |
| JSON Schema | 2020-12 | Schema definition standard | Current official spec, widely supported, includes format validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Schema.org vocabulary | Latest | Academic content semantics | Provides standard property names for publications, authors, dates |
| ISO 8601 / RFC 3339 | Standard | Date/time formatting | Universal date representation, sortable, human-readable |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Ajv | Zod | Zod is TypeScript-first but requires runtime dependency; Ajv is pure JSON Schema and faster |
| Ajv | jsonschema (npm) | Older library, slower, less feature-complete |
| Multiple files | Single file | Single file harder to maintain, merge conflicts, less granular loading |
| Denormalized | Normalized with refs | Normalized adds complexity for static site with no write operations |

**Installation:**
```bash
npm install ajv
```

## Architecture Patterns

### Recommended Project Structure
```
data/
├── publications.json       # 15 academic papers with full metadata
├── talks.json             # 19 invited talks with venue/date
├── media.json             # Podcast/panel/video appearances
├── research.json          # Research topics with pub references
├── about.json             # Bio, education, contact
└── schemas/
    ├── publication.schema.json
    ├── talk.schema.json
    ├── media.schema.json
    ├── research.schema.json
    └── about.schema.json
```

### Pattern 1: Denormalized Content Files

**What:** Each JSON file contains complete data for its domain with no cross-file references (except research → publications by ID/DOI).

**When to use:** Static sites with read-heavy access patterns and infrequent updates.

**Why it works:**
- No JOIN operations needed in frontend
- Files can be loaded independently
- Simpler to reason about and maintain
- Optimal for GitHub Pages static hosting
- Source: [Normalization vs Denormalization Trade-offs](https://celerdata.com/glossary/normalization-vs-denormalization-the-trade-offs-you-need-to-know), [JSON file-backed storage analysis](https://mozilla.github.io/firefox-browser-architecture/text/0012-jsonfile.html)

**Example:**
```json
{
  "publications": [
    {
      "id": "reynolds-2025-nature",
      "title": "AI-enabled evidence synthesis for conservation",
      "authors": [
        {
          "name": "Sam Reynolds",
          "isSamReynolds": true
        },
        {
          "name": "Jane Smith",
          "isSamReynolds": false
        }
      ],
      "journal": "Nature",
      "year": 2025,
      "date": "2025-03-15",
      "doi": "10.1038/example123",
      "abstract": "Full abstract text here..."
    }
  ]
}
```

### Pattern 2: Schema-First Development

**What:** Define JSON Schema first, then validate all data files against schemas during build/test.

**When to use:** Always. Schemas serve as documentation and prevent structural errors.

**Example:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "publication.schema.json",
  "type": "object",
  "required": ["publications"],
  "properties": {
    "publications": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "authors", "journal", "year", "doi"],
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "authors": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "isSamReynolds"],
              "properties": {
                "name": { "type": "string" },
                "isSamReynolds": { "type": "boolean" }
              }
            }
          },
          "journal": { "type": "string" },
          "year": {
            "type": "integer",
            "minimum": 1900,
            "maximum": 2100
          },
          "date": {
            "type": "string",
            "format": "date"
          },
          "doi": { "type": "string" },
          "abstract": { "type": "string" }
        }
      }
    }
  }
}
```

### Pattern 3: DOI URL Construction

**What:** Store only DOI identifier, construct URL dynamically when needed.

**When to use:** All publication links. DOI.org guarantees persistence.

**Example:**
```javascript
// Stored in JSON
"doi": "10.1038/example123"

// Constructed at runtime
const url = `https://doi.org/${publication.doi}`;
// Result: https://doi.org/10.1038/example123
```

**Source:** [DOI Resolution Documentation](https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation), [DataCite DOI Display Guidelines](https://support.datacite.org/docs/datacite-doi-display-guidelines)

### Pattern 4: ISO 8601 Date Formatting

**What:** Use ISO 8601 format (YYYY-MM-DD) for dates, full ISO 8601 with time (YYYY-MM-DDTHH:mm:ss.sssZ) only when time matters.

**When to use:** All date fields in JSON.

**Why:**
- Human-readable
- Sortable lexicographically
- Supported by JSON Schema "date" and "date-time" formats
- JavaScript Date.prototype.toISOString() produces this format
- Source: [JSON Date Format Best Practices](https://sqlpey.com/javascript/json-date-formats-best-practices/), [ISO 8601 vs RFC 3339 Guide](https://toolshref.com/iso-8601-vs-rfc-3339-json-api-dates/)

**Example:**
```json
{
  "date": "2025-03-15",           // Talk or publication date
  "lastUpdated": "2026-01-30T15:30:00.000Z"  // If timestamp needed
}
```

### Anti-Patterns to Avoid

- **Excessive nesting:** Don't nest arrays of objects within objects multiple levels deep. Keep structure flat where possible. [Source](https://www.linkedin.com/advice/1/how-do-you-keep-your-json-data-models-consistent)

- **Inconsistent naming conventions:** Pick one (camelCase recommended for JavaScript consumption) and stick to it across all files. [Source](https://jsonlint.com/mastering-json-format)

- **String dates without ISO 8601:** Formats like "03/15/2025" or "15 Mar 2025" are not sortable and cause parsing issues. [Source](https://jsoneditoronline.org/indepth/parse/json-date-format/)

- **Manual schema maintenance:** Don't skip schema validation assuming data is correct. Schemas catch errors early. [Source](https://www.devzery.com/post/json-schema-tests-best-practices-implementation-and-tools)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON validation | Custom validator functions | Ajv with JSON Schema | Handles edge cases, nested validation, format checking, error messages |
| Date parsing | String manipulation | ISO 8601 + JavaScript Date API | Timezone handling, leap years, edge cases are complex |
| Author name parsing | String split logic | Structured objects with name fields | Handles multi-word names, suffixes, international names correctly |
| Schema generation | Manual JSON writing | Write schema first, validate data against it | Schemas serve as documentation and prevent drift |
| DOI validation | Regex patterns | JSON Schema with custom format or pattern | DOI format has specific rules (prefix starts with 10., structure requirements) |

**Key insight:** Academic metadata has many edge cases (100+ author papers, complex author names, retracted publications, preprints). Standards like Schema.org and JSON Schema have solved these problems. Use them.

## Common Pitfalls

### Pitfall 1: Not Specifying Required Fields in Schemas

**What goes wrong:** Optional fields that should be mandatory lead to incomplete data that breaks UI rendering.

**Why it happens:** Developer assumes all fields will be populated but doesn't enforce it in schema.

**How to avoid:**
- Always specify `"required": ["field1", "field2"]` in schemas
- Required fields should be at the correct object level
- Source: [JSON Schema Validation Best Practices](https://www.devzery.com/post/json-schema-tests-best-practices-implementation-and-tools)

**Warning signs:**
- Frontend crashes with "Cannot read property X of undefined"
- Inconsistent rendering where some items show partial data

### Pitfall 2: Compiling Schemas on Every Validation

**What goes wrong:** Schema compilation is slow. Compiling on every validation call kills performance.

**Why it happens:** Not understanding that Ajv compilation is separate from validation.

**How to avoid:**
```javascript
// WRONG: Compiling every time
function validateData(data) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);  // Slow!
  return validate(data);
}

// RIGHT: Compile once, reuse
const ajv = new Ajv();
const validate = ajv.compile(schema);  // Once at startup

function validateData(data) {
  return validate(data);  // Fast!
}
```

**Source:** [Ajv Getting Started Guide](https://ajv.js.org/guide/getting-started.html), [JSON Schema Tests Best Practices](https://www.devzery.com/post/json-schema-tests-best-practices-implementation-and-tools)

**Warning signs:**
- Slow build times
- Validation taking 100ms+ on small files

### Pitfall 3: Not Handling Validation Errors Property

**What goes wrong:** Ajv overwrites the `errors` property on each validation call. Accessing `validate.errors` later gives wrong errors or null.

**Why it happens:** Misunderstanding Ajv's error handling model.

**How to avoid:**
```javascript
// WRONG: Accessing errors later
const isValid = validate(data);
doSomethingElse();
console.log(validate.errors);  // May be overwritten!

// RIGHT: Copy errors immediately
const isValid = validate(data);
const errors = validate.errors ? [...validate.errors] : null;
console.log(errors);  // Safe copy
```

**Source:** [Ajv Getting Started Guide](https://ajv.js.org/guide/getting-started.html)

**Warning signs:**
- Intermittent error reporting
- Errors showing data from wrong validation call

### Pitfall 4: Using Non-ISO Date Formats

**What goes wrong:** Dates stored as "March 15, 2025" or "15/03/2025" can't be sorted, break Date parsing, cause timezone issues.

**Why it happens:** Writing dates in human-friendly format without considering machine consumption.

**How to avoid:**
- Always use ISO 8601: "YYYY-MM-DD" for dates, "YYYY-MM-DDTHH:mm:ss.sssZ" for timestamps
- Use JSON Schema `"format": "date"` or `"format": "date-time"` to validate
- Source: [JSON Date Format Best Practices](https://sqlpey.com/javascript/json-date-formats-best-practices/)

**Warning signs:**
- Sorting publications/talks shows wrong order
- Date parsing errors in different locales

### Pitfall 5: Storing Derived Data Instead of Source Data

**What goes wrong:** Storing "https://doi.org/10.1038/example" instead of "10.1038/example" makes data harder to migrate if DOI resolver URL changes.

**Why it happens:** Storing URLs "ready to use" feels convenient.

**How to avoid:**
- Store source identifiers (DOI, not URL)
- Construct derived values (URLs) at runtime
- Keep data portable and future-proof

**Warning signs:**
- Dead links when external services change
- Difficulty migrating to new URL schemes

### Pitfall 6: Inconsistent Author Name Handling

**What goes wrong:** Some authors stored as "Smith, Jane" others as "Jane Smith", some as objects, some as strings.

**Why it happens:** Copying data from different sources without standardizing.

**How to avoid:**
- Use structured objects: `{ "name": "Jane Smith", "isSamReynolds": false }`
- Schema enforces consistent structure
- Store full names in display order (Western convention: "Given Family")
- Source: [Schema.org author property](https://schema.org/author), [Author Schema Markup Guide](https://www.positional.com/blog/author-schema)

**Warning signs:**
- Author names display inconsistently
- Difficulty filtering for Sam Reynolds' contributions

## Code Examples

Verified patterns from official sources:

### Ajv Setup and Validation

```javascript
// Source: https://ajv.js.org/guide/getting-started.html
import Ajv from "ajv";
import addFormats from "ajv-formats";  // For "date", "uri", etc.

// Setup (once at application startup)
const ajv = new Ajv();
addFormats(ajv);  // Adds built-in format validation

// Load schemas
import publicationSchema from './schemas/publication.schema.json';
import talksSchema from './schemas/talk.schema.json';

const validatePublication = ajv.compile(publicationSchema);
const validateTalks = ajv.compile(talksSchema);

// Validation
import publicationsData from './data/publications.json';

const isValid = validatePublication(publicationsData);

if (!isValid) {
  // Copy errors immediately
  const errors = [...validatePublication.errors];
  console.error("Validation failed:", errors);
  throw new Error(`Invalid publications data: ${ajv.errorsText(errors)}`);
}
```

### JSON Schema with Built-in Formats

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "doi": {
      "type": "string",
      "pattern": "^10\\.\\d{4,}/[-._;()/:a-zA-Z0-9]+$"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "url": {
      "type": "string",
      "format": "uri"
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  }
}
```

**Source:** [JSON Schema 2020-12 Validation Spec](https://json-schema.org/draft/2020-12/json-schema-validation)

Available formats: `date`, `date-time`, `time`, `duration`, `email`, `idn-email`, `hostname`, `idn-hostname`, `ipv4`, `ipv6`, `uri`, `uri-reference`, `iri`, `iri-reference`, `uuid`, `uri-template`, `json-pointer`, `relative-json-pointer`, `regex`

### DOI URL Construction

```javascript
// Source: https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation
function getPublicationUrl(publication) {
  // DOI stored as: "10.1038/nature12345"
  // Construct URL: "https://doi.org/10.1038/nature12345"
  return `https://doi.org/${publication.doi}`;
}

// Alternative resolver (dx.doi.org also works, redirects to doi.org)
// Both are maintained by IDF and guaranteed persistent
```

### Date Handling

```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
// Storing dates
const publicationDate = new Date('2025-03-15');
const isoDate = publicationDate.toISOString().split('T')[0];  // "2025-03-15"

// In JSON
{
  "date": "2025-03-15"  // ISO 8601 format
}

// Parsing dates
const date = new Date(publication.date);  // Parses ISO 8601
// Format for display
const displayDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// Result: "March 15, 2025"
```

### Research Topics Referencing Publications

```json
{
  "researchTopics": [
    {
      "id": "ai-conservation",
      "name": "AI-enabled Evidence Synthesis",
      "description": "Applying large language models...",
      "relatedPublications": [
        "reynolds-2025-nature",
        "reynolds-2024-tree"
      ]
    }
  ]
}
```

**Pattern:** Store publication IDs (matching `publications.json` IDs), resolve references at runtime. Denormalized for reads but maintains referential integrity via shared IDs.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JSON Schema draft-04 | JSON Schema 2020-12 | 2020 | More powerful validation, better format support |
| Custom date parsing | ISO 8601 standard | Ongoing standardization | Universal compatibility, JavaScript native support |
| Single monolithic JSON | Multiple focused files | Modern best practice | Easier maintenance, granular loading, better Git diffs |
| Manual validation | Ajv with schemas | Ajv v8 (2021) | Faster, more reliable, auto-generated docs |
| Normalized data with refs | Denormalized for static sites | Modern static site pattern | Simpler frontend, no runtime joins needed |

**Deprecated/outdated:**
- **JSON Schema draft-04/06/07:** Use 2020-12 (Ajv 8.x supports it)
- **Synchronous schema compilation in main thread:** Compile at build time or app startup, not on-demand
- **Storing full URLs instead of identifiers:** Store DOIs, construct URLs dynamically

## Open Questions

Things that couldn't be fully resolved:

1. **Citation counts and metrics**
   - What we know: Can be fetched from CrossRef API, Google Scholar, or Semantic Scholar
   - What's unclear: How to balance freshness vs maintenance burden
   - Recommendation: DEFER to later phase. Metrics go stale quickly and require API integration. Start without them, add in Phase 7 if desired.

2. **Abstract length handling**
   - What we know: Abstracts vary from 100-500 words
   - What's unclear: Whether to truncate for UI or store full text
   - Recommendation: Store full abstracts in JSON. Let UI layer handle truncation. Data layer should preserve complete source data.

3. **Media icon asset sourcing**
   - What we know: Need generic icons (podcast, video, panel, interview)
   - What's unclear: Whether to source from icon packs or create simple SVGs
   - Recommendation: OUT OF SCOPE for this phase. This is Phase 3 (UI Asset Integration). Note for later: recommend using free icon libraries like Heroicons or Font Awesome.

4. **Schema validation in build vs runtime**
   - What we know: Can validate during build (npm script) or runtime (in app)
   - What's unclear: Which provides better DX
   - Recommendation: BOTH. Validate in build step (fails CI if data invalid) AND runtime (dev mode only, for immediate feedback). Production skips runtime validation for performance.

## Sources

### Primary (HIGH confidence)
- [Ajv JSON Schema Validator](https://ajv.js.org/) - Official documentation
- [Ajv Getting Started Guide](https://ajv.js.org/guide/getting-started.html) - Installation and usage
- [JSON Schema 2020-12 Validation Spec](https://json-schema.org/draft/2020-12/json-schema-validation) - Format types and validation rules
- [Schema.org ScholarlyArticle](https://schema.org/ScholarlyArticle) - Academic publication vocabulary
- [DOI Resolution Documentation](https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation) - DOI URL construction
- [DataCite DOI Display Guidelines](https://support.datacite.org/docs/datacite-doi-display-guidelines) - DOI best practices
- [MDN Date.toISOString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) - JavaScript date handling

### Secondary (MEDIUM confidence)
- [JSON Date Format Best Practices](https://sqlpey.com/javascript/json-date-formats-best-practices/) - ISO 8601 guidance
- [ISO 8601 vs RFC 3339 Guide](https://toolshref.com/iso-8601-vs-rfc-3339-json-api-dates/) - Date format standards
- [Normalization vs Denormalization Trade-offs](https://celerdata.com/glossary/normalization-vs-denormalization-the-trade-offs-you-need-to-know) - Data structure decisions
- [JSON Schema Tests Best Practices](https://www.devzery.com/post/json-schema-tests-best-practices-implementation-and-tools) - Validation patterns
- [Schema.org author property](https://schema.org/author) - Author metadata structure
- [Mastering JSON Format](https://jsonlint.com/mastering-json-format) - General JSON best practices
- [Mozilla JSONFile Storage Analysis](https://mozilla.github.io/firefox-browser-architecture/text/0012-jsonfile.html) - File-based storage patterns
- [JSON Resume Schema](https://jsonresume.org/schema) - Academic CV JSON structure reference

### Tertiary (LOW confidence)
- Various Stack Overflow and Medium posts on JSON practices (used for pattern discovery, verified against authoritative sources)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Ajv is clearly dominant (50M+ weekly downloads), JSON Schema 2020-12 is current spec
- Architecture: HIGH - Denormalized structure is established pattern for static sites, verified across multiple sources
- Pitfalls: MEDIUM-HIGH - Common pitfalls documented in official Ajv docs (HIGH) and community best practices (MEDIUM)
- Code examples: HIGH - All examples sourced from official documentation (Ajv, JSON Schema, MDN)

**Research date:** 2026-01-30
**Valid until:** Approximately 6-12 months (March-September 2026). JSON Schema and Ajv are stable standards. Revalidate if:
- Ajv releases major version (v9+)
- JSON Schema releases new spec (beyond 2020-12)
- Project switches from static hosting to dynamic backend
