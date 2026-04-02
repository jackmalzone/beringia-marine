# When Will Sanity Articles Appear on the Website?

## Current Status: ✅ **CONNECTED AND WORKING**

**The insights/blog page is now fully connected to Sanity CMS!**

The migration is complete:

- ✅ `apps/web/src/lib/sanity/queries/articles.ts` - GROQ queries for fetching articles
- ✅ `apps/web/src/lib/sanity/transformers/articles.ts` - Portable Text to HTML conversion
- ✅ `apps/web/src/lib/data/insights.ts` - Fetches from Sanity with fallback to mock data
- ✅ `apps/web/src/app/insights/page.tsx` - Server-side fetching with ISR
- ✅ `apps/web/src/app/insights/[slug]/page.tsx` - Individual article pages from Sanity
- ✅ `apps/web/src/app/insights/InsightsPageClient.tsx` - Client component with server-fetched data

## How It Works Now

### 1. **Articles Fetch from Sanity** ✅

All article queries now fetch from Sanity CMS:

- `getAllArticles()` - Fetches all published articles
- `getArticleBySlug()` - Fetches individual articles
- `getArticlesByCategory()` - Fetches by category
- `searchArticles()` - Searches articles

**Fallback:** If Sanity is unavailable, the system gracefully falls back to mock data to ensure the site continues working.

### 2. **Publish Articles in Sanity Studio**

To make articles appear on the website:

1. Create articles in Sanity Studio
2. **Set status to "published"** (not "draft")
3. **Publish the document** (click the "Publish" button in Sanity Studio)

### 3. **How Updates Will Work**

Articles update based on your revalidation strategy:

#### Option A: Time-Based ISR (Current Default)

```typescript
// apps/web/src/app/insights/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

**This means:**

- Pages are statically generated at build time
- After 1 hour, the next request will trigger a revalidation
- New articles will appear within 1 hour of publishing (or on next request after the hour)

#### Option B: On-Demand Revalidation via Webhooks ✅ (Recommended - Now Available!)

**The webhook API route is now set up!** Articles can appear **immediately** when published.

**Setup Steps:**

1. **Add environment variable to `.env.local`:**

   ```env
   REVALIDATION_SECRET=your-random-secret-here
   ```

   Generate a secure random string: `openssl rand -hex 32` (hex encoding avoids `=` characters that can conflict with .env formatting)

2. **Configure webhook in Sanity Studio:**
   - Go to Sanity Project Settings → API → Webhooks
   - Click "Create webhook"
   - **URL:** `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - **Dataset:** production (or your dataset name)
   - **Trigger on:**
     - ✅ Document published
     - ✅ Document unpublished
     - ✅ Document created
     - ✅ Document deleted
   - **Filter:** `_type == "article"` (optional, to only trigger for articles)
   - **HTTP method:** POST
   - **API version:** 2024-01-01 (or your API version)

3. **Test the webhook:**
   - Publish an article in Sanity Studio
   - Check your website - the article should appear immediately
   - Check server logs for revalidation confirmation

**With webhooks configured:**

- ✅ Articles appear **immediately** when you publish in Sanity Studio
- ✅ No waiting for ISR revalidation period
- ✅ Better user experience
- ✅ Automatic revalidation of specific article pages

## Migration Checklist

- [x] Update `apps/web/src/lib/data/insights.ts` to fetch from Sanity ✅
- [x] Update `InsightsPageClient.tsx` to handle async data fetching ✅
- [x] Update article detail page to fetch from Sanity ✅
- [x] Create GROQ queries for articles ✅
- [x] Create Portable Text transformer ✅
- [x] Test with published articles ✅
- [x] Set up webhook API route for on-demand revalidation ✅
- [ ] Configure webhook in Sanity Studio (see setup steps above)
- [ ] Remove mock data (optional - currently used as fallback)

## Quick Test

1. Create a test article in Sanity Studio
2. Set status to "published"
3. Click "Publish" button
4. **With webhooks:** Article appears immediately
5. **Without webhooks:** Article appears within 1 hour (or on next request after hour)
6. Check `/insights` page - should see the article
7. Check `/insights/[slug]` - should see the full article

## Current Behavior

**Articles from Sanity Studio now appear on the website!**

- ✅ Code fetches from Sanity CMS
- ✅ Sanity queries are executed on every page load
- ✅ Migration is complete and working
- ✅ Fallback to mock data if Sanity is unavailable (ensures site stays up)

## Data Source Verification

In development mode, you'll see console logs indicating the data source:

- `✅ Using Sanity data: X articles` - Articles are from Sanity
- `⚠️ Using mock data fallback` - Falling back to mock data (Sanity unavailable)

## Next Steps

1. **Publish articles** in Sanity Studio (set status to "published" and click Publish)
2. **Set up webhooks** for instant updates (see setup steps above) - Recommended!
3. **Monitor logs** to verify Sanity is being used (development mode)

See `docs/sanity/MIGRATION_COMPLETE.md` for complete migration details.
