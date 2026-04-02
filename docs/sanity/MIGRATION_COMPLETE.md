# Sanity Articles Migration - Complete ✅

## What Was Done

### 1. ✅ Created Sanity Query Functions

- **File:** `apps/web/src/lib/sanity/queries/articles.ts`
- **Functions:**
  - `fetchAllArticles()` - Get all published articles
  - `fetchArticleBySlug()` - Get single article by slug
  - `fetchArticlesByCategory()` - Get articles by category
  - `searchArticles()` - Search articles

### 2. ✅ Created Article Transformer

- **File:** `apps/web/src/lib/sanity/transformers/articles.ts`
- **Functions:**
  - `transformArticle()` - Convert Sanity article to ArticleData format
  - `transformArticles()` - Convert array of Sanity articles
- **Features:**
  - Converts Portable Text to HTML using `@portabletext/to-html`
  - Handles images with Sanity image builder
  - Handles links (internal and external)
  - Transforms author data (object or string)
  - Maps SEO metadata

### 3. ✅ Updated Data Fetching

- **File:** `apps/web/src/lib/data/insights.ts`
- **Changes:**
  - All functions now async and fetch from Sanity
  - Fallback to mock data if Sanity fetch fails
  - Maintained backward compatibility with sync versions (deprecated)

### 4. ✅ Updated Pages

- **Insights List Page:** `apps/web/src/app/insights/page.tsx`
  - Now fetches articles server-side
  - Passes initial articles to client component
- **Article Detail Page:** `apps/web/src/app/insights/[slug]/page.tsx`
  - Fetches article from Sanity
  - Updated `generateStaticParams` and `generateMetadata`

- **Client Components:**
  - `InsightsPageClient` - Accepts initial articles prop
  - `SearchBar` - Uses async search function

## Installation Required

You need to install the Portable Text package:

```bash
cd apps/web
pnpm add @portabletext/to-html
```

## How It Works

1. **Server-Side Fetching:**
   - Pages fetch articles from Sanity at build time (SSG) or request time (ISR)
   - ISR revalidates every hour (`revalidate = 3600`)

2. **Fallback Strategy:**
   - If Sanity fetch fails, falls back to mock data
   - Ensures site continues working even if Sanity is unavailable

3. **Portable Text Conversion:**
   - Sanity content (Portable Text) is converted to HTML
   - Images use Sanity image builder for optimization
   - Links are properly formatted

## Testing

1. **Install the package:**

   ```bash
   cd apps/web && pnpm add @portabletext/to-html
   ```

2. **Create a test article in Sanity Studio:**
   - Set status to "published"
   - Click "Publish"

3. **Check the website:**
   - Visit `/insights` - should see your article
   - Visit `/insights/[slug]` - should see full article

## Next Steps (Optional)

### ✅ Set Up Webhooks for Instant Updates (COMPLETE)

**The webhook API route has been created!** ✅

**File:** `apps/web/src/app/api/revalidate/route.ts`

**Features:**

- ✅ Secret-based authentication
- ✅ Automatic revalidation of insights pages
- ✅ Revalidation of specific article pages
- ✅ Support for pages, services, and global settings
- ✅ GET endpoint for testing (development only)
- ✅ Comprehensive error handling

**Setup Steps:**

1. **Add to `.env.local`:**

   ```env
   REVALIDATION_SECRET=your-random-secret-here
   ```

   Generate a secure secret: `openssl rand -hex 32` (hex encoding avoids `=` characters)

2. **Configure webhook in Sanity Studio:**
   - Go to Project Settings → API → Webhooks
   - Click "Create webhook"
   - **URL:** `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - **Dataset:** production (or your dataset)
   - **Trigger on:**
     - ✅ Document published
     - ✅ Document unpublished
     - ✅ Document created
     - ✅ Document deleted
   - **Filter:** `_type == "article"` (optional)
   - **HTTP method:** POST

3. **Test:**
   - Publish an article in Sanity Studio
   - Article should appear immediately on the website
   - Check server logs for revalidation confirmation

**With webhooks configured, articles appear instantly when published!**

## Known Issues / Notes

1. **Package Installation:** You need to manually install `@portabletext/to-html`
2. **Image URLs:** Make sure Sanity image URLs are properly configured
3. **Author References:** If author is a reference, ensure it's properly resolved in GROQ query
4. **Category References:** Same for category references

## Migration Status

- ✅ Queries created
- ✅ Transformers created
- ✅ Data fetching updated
- ✅ Pages updated
- ✅ Search updated
- ⚠️ Package installation needed
- ⚠️ Webhooks setup (optional)

## Rollback

If you need to rollback, all functions have sync versions with `Sync` suffix that use mock data:

- `getAllArticlesSync()`
- `getArticleBySlugSync()`
- `getArticlesByCategorySync()`
- `searchArticlesSync()`
