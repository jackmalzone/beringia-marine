# Insights Blog Implementation Index

This document provides a comprehensive overview of the insights blog implementation, including architecture, data structure, and how to add new posts.

## Architecture Overview

### File Structure

```
src/
├── app/
│   └── insights/
│       ├── page.tsx                    # Main blog listing page (server component)
│       ├── InsightsPageClient.tsx      # Client component for listing page
│       ├── page.module.css              # Styles for listing page
│       ├── [slug]/
│       │   ├── page.tsx                # Individual article page (server component)
│       │   ├── ArticlePageClient.tsx   # Client component for article page
│       │   └── page.module.css         # Styles for article page
│       └── layout.tsx                  # Layout wrapper
├── components/
│   └── insights/
│       ├── ArticleCard/                # Card component for article previews
│       ├── ArticleContent/             # Component for rendering article HTML
│       ├── ArticleHero/                # Hero section for individual articles
│       ├── ArticleCardSkeleton/       # Loading skeleton for article cards
│       ├── AuthorCard/                 # Author information display
│       ├── CategoryFilter/             # Category filtering component
│       ├── SearchBar/                  # Search functionality
│       └── InsightsHero/               # Hero section for listing page
├── lib/
│   └── data/
│       └── insights.ts                 # Data layer - article storage and retrieval
├── types/
│   └── insights.ts                     # TypeScript type definitions
└── docs/
    └── insights/
        ├── CONTENT_QUICK_REFERENCE.md   # Quick reference for content authors
        └── CONTENT_FORMATTING_GUIDE.md # Detailed formatting guide
```

## Data Layer

### Article Storage

Articles are stored in `src/lib/data/insights.ts` as a `mockArticles` array. Each article follows the `ArticleData` interface.

**Location:** `src/lib/data/insights.ts`

### Data Functions

- `getAllArticles()` - Returns all published articles, sorted by date (newest first)
- `getArticleBySlug(slug)` - Returns a single article by slug
- `getArticlesByCategory(category)` - Filters articles by category
- `getActiveCategories()` - Returns categories that have published articles
- `searchArticles(query)` - Searches articles by title, abstract, or tags
- `calculateReadingTime(content)` - Calculates estimated reading time

## Type Definitions

### ArticleData Interface

```typescript
interface ArticleData {
  id: string;                    // Unique identifier
  title: string;                 // Article title (50-70 chars recommended)
  subtitle: string;               // Brief subtitle (70-100 chars)
  abstract: string;              // 2-3 sentence summary (150-200 chars)
  content: string;               // Full HTML content
  category: ArticleCategory;     // One of: Wellness Article, Recovery Guide, Research Summary, Community Story
  author: string | Author;       // Author name or full Author object
  publishDate: string;           // ISO date format (YYYY-MM-DD)
  status: ArticleStatus;         // 'draft' | 'published' | 'scheduled'
  coverImage: string;            // URL to cover image
  tags: string[];                // 3-6 relevant tags
  slug: string;                  // URL-friendly identifier
  
  // Optional fields
  publishAt?: string;            // Scheduled publish date/time (ISO 8601)
  heroImage?: string;             // Optional hero background image
  heroImageSplit?: {              // Optional split hero images
    left: string;
    right: string;
  };
  pdfUrl?: string;                // Link to downloadable PDF
  readingTime?: number;           // Estimated reading time in minutes
  seo?: ArticleSEO;               // Custom SEO metadata
}
```

### ArticleCategory

```typescript
type ArticleCategory =
  | 'Wellness Article'
  | 'Recovery Guide'
  | 'Research Summary'
  | 'Community Story';
```

### ArticleStatus

```typescript
type ArticleStatus = 'draft' | 'published' | 'scheduled';
```

### ArticleSEO

```typescript
interface ArticleSEO {
  title?: string;        // Custom SEO title (override default)
  description?: string;  // Custom meta description
  ogImage?: string;      // Custom Open Graph image
  keywords?: string[];   // Additional keywords
}
```

## Routing

### URL Structure

- **Listing Page:** `/insights`
- **Individual Article:** `/insights/[slug]`

### Static Generation

- Articles are statically generated at build time via `generateStaticParams()`
- ISR (Incremental Static Regeneration) with 1-hour revalidation
- Draft articles are excluded from static generation
- Scheduled articles are only generated after their `publishAt` date

## Components

### Page Components

1. **InsightsPageClient** (`src/app/insights/InsightsPageClient.tsx`)
   - Manages article listing, filtering, and search
   - Handles loading states and error boundaries
   - Implements category filtering and search functionality

2. **ArticlePageClient** (`src/app/insights/[slug]/ArticlePageClient.tsx`)
   - Renders individual article pages
   - Uses ArticleHero and ArticleContent components

### Display Components

1. **ArticleCard** - Displays article previews in the grid
2. **ArticleContent** - Renders the full HTML content
3. **ArticleHero** - Hero section for individual articles
4. **AuthorCard** - Author information display
5. **CategoryFilter** - Category filtering UI
6. **SearchBar** - Search functionality
7. **InsightsHero** - Hero section for listing page

## SEO Implementation

### Metadata Generation

- Server-side metadata generation in `page.tsx` files
- Dynamic Open Graph and Twitter Card support
- JSON-LD structured data for articles and breadcrumbs

### Structured Data

- Article schema (Article type)
- Breadcrumb schema
- Organization schema
- Blog schema for listing page

## Content Formatting

### HTML Structure

- Content is stored as HTML strings
- Must follow proper heading hierarchy (h2 → h3 → h4)
- Images must use `<figure>` with `<figcaption>`
- All images require descriptive `alt` text
- Links should have descriptive text (no "click here")

### Supported HTML Elements

- Headings: `<h2>`, `<h3>`, `<h4>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Emphasis: `<strong>`, `<em>`
- Links: `<a>` (with `target="_blank" rel="noopener noreferrer"` for external)
- Images: `<figure>`, `<img>`, `<figcaption>`
- Tables: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- Blockquotes: `<blockquote>`, `<cite>`

## Adding a New Post

### Step-by-Step Process

1. **Open the data file:**
   ```bash
   src/lib/data/insights.ts
   ```

2. **Add your article to the `mockArticles` array:**
   - Use the template below
   - Ensure unique `id` and `slug`
   - Set `status: 'published'` when ready

3. **Verify the article appears:**
   - Visit `/insights` to see it in the listing
   - Visit `/insights/[your-slug]` to view the full article

### Article Template

```typescript
{
  id: 'unique-id', // Use next sequential number or UUID
  title: 'Your Compelling Title (50-70 chars)',
  subtitle: 'Expand on the title (70-100 chars)',
  abstract: '2-3 sentence summary that hooks readers (150-200 chars)',
  content: `
    <h2>Introduction</h2>
    <p>Opening paragraph...</p>

    <h2>Main Section</h2>
    <p>Content...</p>

    <h3>Subsection</h3>
    <p>More detail...</p>

    <figure>
      <img src="image-url.jpg" alt="Descriptive alt text" />
      <figcaption>Caption that adds context</figcaption>
    </figure>

    <h2>Conclusion</h2>
    <p>Summary and takeaway...</p>
  `,
  category: 'Wellness Article', // or Recovery Guide, Research Summary, Community Story
  author: 'Author Name', // or Author object
  publishDate: '2025-01-25', // YYYY-MM-DD format
  status: 'published', // or 'draft', 'scheduled'
  coverImage: 'https://media.vitalicesf.com/insights/image.jpg',
  tags: ['Tag1', 'Tag2', 'Tag3'], // 3-6 relevant tags
  slug: 'url-friendly-slug', // URL-friendly, lowercase, hyphens
  readingTime: 10, // Optional: estimated minutes (auto-calculated if omitted)
  seo: { // Optional: custom SEO metadata
    title: 'Custom SEO Title',
    description: 'Custom meta description',
    ogImage: 'https://media.vitalicesf.com/insights/og-image.jpg',
  },
}
```

## Image Guidelines

### Cover Images
- **Dimensions:** Minimum 1200x630px (1.91:1 aspect ratio)
- **Format:** WebP with JPEG fallback
- **File size:** Under 200KB (optimized)
- **Hosting:** CDN (Cloudflare R2) at `https://media.vitalicesf.com/`

### In-Content Images
- **Dimensions:** Minimum 800px width
- **Format:** WebP preferred
- **Placement:** After relevant paragraphs
- **Alt text:** Required, descriptive
- **Captions:** Recommended for context

## Category Guidelines

### Wellness Article
- **Focus:** Practical, actionable advice
- **Tone:** Conversational, approachable
- **Length:** 800-1200 words

### Recovery Guide
- **Focus:** Step-by-step instructions
- **Tone:** Clear, instructional
- **Length:** 1000-1500 words

### Research Summary
- **Focus:** Science-backed information
- **Tone:** Authoritative, educational
- **Length:** 1200-2000 words

### Community Story
- **Focus:** Personal experiences
- **Tone:** Authentic, inspirational
- **Length:** 1000-1500 words

## Status Management

### Draft
- Not visible on the site
- Excluded from static generation
- Use for work-in-progress content

### Published
- Visible immediately
- Included in static generation
- Appears in listings and search

### Scheduled
- Requires `publishAt` field (ISO 8601)
- Only visible after `publishAt` date/time
- Useful for timed releases

## Search Functionality

Articles are searchable by:
- Title (case-insensitive)
- Abstract (case-insensitive)
- Tags (case-insensitive)

Search is implemented client-side in the `SearchBar` component.

## Performance Optimizations

- Dynamic imports for client components
- Image preloading for first 3 articles
- Skeleton loading states
- Error boundaries for graceful error handling
- ISR with 1-hour revalidation
- Web Vitals tracking

## Testing

Test files are located in:
- `src/components/insights/**/__tests__/`
- `src/lib/data/__tests__/insights.test.ts`

## Documentation

- **Quick Reference:** `docs/insights/CONTENT_QUICK_REFERENCE.md`
- **Formatting Guide:** `docs/insights/CONTENT_FORMATTING_GUIDE.md`
- **This Index:** `docs/insights/IMPLEMENTATION_INDEX.md`

## Next Steps for Adding a Post

When you're ready to add a new post:

1. Share the post content with me
2. I'll format it according to the guidelines
3. I'll add it to the `mockArticles` array
4. I'll ensure proper HTML structure and accessibility
5. I'll verify SEO metadata and image requirements

The post will be ready to publish once added to the data file!

