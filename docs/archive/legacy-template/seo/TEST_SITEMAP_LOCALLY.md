# Testing Sitemap Locally Before Deployment

**Issue**: Sitemap doesn't show blog URLs on production  
**Solution**: Test locally first, then deploy

---

## Quick Answer

**Yes, you need to deploy the changes**, but you can test locally first to verify it works.

---

## Step 1: Test Locally (5 minutes)

### Option A: Production Build Test (Recommended)

```bash
# 1. Build for production
cd apps/web
pnpm build

# 2. Start production server
pnpm start

# 3. Test sitemap
curl http://localhost:3000/sitemap.xml | grep insights
```

**Expected**: Should see insights URLs if articles are available

### Option B: Dev Mode Test

```bash
# 1. Start dev server
cd apps/web
pnpm dev

# 2. In another terminal, test sitemap
curl http://localhost:3000/sitemap.xml | grep insights
```

**Note**: Dev mode may not fully SSR, but sitemap should work.

---

## Step 2: Check Where Articles Come From

The sitemap fetches articles from two sources (in order):

1. **Sanity CMS** (if configured and available)
2. **Mock data** (fallback)

### Check Sanity Connection

```bash
# Check environment variables
cd apps/web
cat .env.local | grep SANITY
```

**Required variables**:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### Test Article Fetching

Create a test script:

```bash
# In apps/web directory
node -e "
const { getAllArticles } = require('./src/lib/data/insights.ts');
getAllArticles().then(articles => {
  console.log('Found', articles.length, 'articles');
  articles.forEach(a => console.log(' -', a.slug));
});
"
```

**Or test directly in dev console** when running the app.

---

## Step 3: Verify Sitemap Generation

### Check Sitemap Output

```bash
# After starting server (prod or dev)
curl http://localhost:3000/sitemap.xml > sitemap-local.xml

# Count insights URLs
grep -c "insights/" sitemap-local.xml

# Show insights URLs
grep "insights/" sitemap-local.xml
```

### Expected Output

Should see XML like:
```xml
<url>
  <loc>https://www.vitalicesf.com/insights/holiday-glow-red-light-therapy-christmas</loc>
  <lastmod>2025-01-25</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
```

---

## Step 4: Deploy Changes

Once verified locally:

```bash
# Commit changes
git add .
git commit -m "Update sitemap to include dynamic insights articles"

# Push and deploy
git push
```

**Deployment triggers**:
- Vercel: Auto-deploys on push
- Other platforms: Follow your deployment process

---

## Troubleshooting

### No Articles in Local Sitemap?

**Check 1**: Are articles published in Sanity?
- Go to Sanity Studio
- Check that articles have status "published"
- Verify articles are actually published (not just saved as drafts)

**Check 2**: Is Sanity connection working?
```bash
# Check environment variables are set
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET

# Test Sanity connection
# Check browser console for Sanity errors
```

**Check 3**: Mock data fallback
- The code falls back to mock data if Sanity fails
- Check `src/lib/data/insights.ts` for `mockArticles`
- Should still appear in sitemap

**Check 4**: Console errors
- Check terminal where server is running
- Look for errors like "Error fetching articles for sitemap"
- The code logs errors but continues with static pages

---

## Production Verification

After deploying:

1. **Wait for deployment** (usually 2-5 minutes)

2. **Check production sitemap**:
   ```
   https://www.vitalicesf.com/sitemap.xml
   ```

3. **Verify articles are included**:
   - Should see `/insights/[slug]` URLs
   - Should match number of published articles in Sanity

4. **Test with curl**:
   ```bash
   curl https://www.vitalicesf.com/sitemap.xml | grep -c "insights/"
   ```

---

## Quick Test Script

Save this as `test-sitemap.sh`:

```bash
#!/bin/bash

URL="http://localhost:3000"
if [ "$1" == "prod" ]; then
  URL="https://www.vitalicesf.com"
fi

echo "Testing sitemap at $URL/sitemap.xml"
echo ""

# Fetch sitemap
SITEMAP=$(curl -s "$URL/sitemap.xml")

# Count total URLs
TOTAL=$(echo "$SITEMAP" | grep -c "<url>")
echo "Total URLs: $TOTAL"

# Count insights URLs
INSIGHTS=$(echo "$SITEMAP" | grep -c "insights/")
echo "Insights URLs: $INSIGHTS"

# Show insights URLs
if [ "$INSIGHTS" -gt 0 ]; then
  echo ""
  echo "Insights articles:"
  echo "$SITEMAP" | grep "insights/" | sed 's/.*<loc>\(.*\)<\/loc>.*/\1/' | head -10
else
  echo ""
  echo "❌ No insights articles found in sitemap!"
fi
```

**Usage**:
```bash
# Test locally
./test-sitemap.sh

# Test production
./test-sitemap.sh prod
```

---

## Summary

1. ✅ **Test locally first** (production build recommended)
2. ✅ **Verify articles are being fetched** (from Sanity or mock data)
3. ✅ **Deploy changes** (git push)
4. ✅ **Verify production sitemap** after deployment

**Most likely issue**: Changes haven't been deployed yet. The updated `sitemap.ts` file needs to be on the production server.

---

**Last Updated**: January 2026
