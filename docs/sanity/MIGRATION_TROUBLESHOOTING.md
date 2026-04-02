# Migration Troubleshooting Guide

## Permission Errors

### Error: "Insufficient permissions; permission 'create' required"

**Problem:** Your `SANITY_API_TOKEN` doesn't have write permissions.

**Solution:**

1. **Go to Sanity Management Console:**
   - Visit: https://www.sanity.io/manage
   - Select your project: `u2atn42r`

2. **Create a New Token with Write Permissions:**
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name it: `Migration Token` or `Content Migration`
   - **Permissions:** Select **Editor** (or **Admin** for full access)
   - Click **Save**

3. **Update Your `.env.local`:**

   ```bash
   SANITY_API_TOKEN=your-new-token-here
   ```

4. **Re-run Migration:**
   ```bash
   node scripts/migrate-to-sanity.js
   ```

## Missing \_id Fields

### Error: "createOrReplace() requires that the document contains an ID"

**Status:** ✅ **FIXED** - Services now include `_id` fields

The script has been updated to include `_id` fields for all documents:

- Services: `service-{slug}`
- Pages: `page-{slug}`
- Global Settings: `globalSettings`

## Testing Migration

### Step 1: Dry Run (Safe)

```bash
node scripts/migrate-to-sanity.js --dry-run
```

This shows what would be migrated without making changes.

### Step 2: Migrate Specific Types

```bash
# Just services
node scripts/migrate-to-sanity.js --type=services

# Just business info
node scripts/migrate-to-sanity.js --type=business

# Just SEO metadata
node scripts/migrate-to-sanity.js --type=seo
```

### Step 3: Full Migration

```bash
node scripts/migrate-to-sanity.js
```

## Migration Order

If you encounter dependency issues, migrate in this order:

1. **Business Info** (foundation)

   ```bash
   node scripts/migrate-to-sanity.js --type=business
   ```

2. **Services** (core content)

   ```bash
   node scripts/migrate-to-sanity.js --type=services
   ```

3. **SEO Metadata** (pages)

   ```bash
   node scripts/migrate-to-sanity.js --type=seo
   ```

4. **FAQ** (depends on pages)

   ```bash
   node scripts/migrate-to-sanity.js --type=faq
   ```

5. **Testimonials** (depends on homepage)

   ```bash
   node scripts/migrate-to-sanity.js --type=testimonials
   ```

6. **About Page**

   ```bash
   node scripts/migrate-to-sanity.js --type=about
   ```

7. **Server-Side SEO** (depends on pages existing)
   ```bash
   node scripts/migrate-to-sanity.js --type=server-seo
   ```

## Verifying Migration

### Check in Sanity Studio

1. Open: https://studio.vitalicesf.com
2. Navigate to each content type
3. Verify documents were created

### Check via GROQ (Vision Tool)

```groq
// Count services
count(*[_type == "service"])

// Count pages
count(*[_type == "page"])

// Check global settings
*[_type == "globalSettings"][0]
```

## Common Issues

### Images Not Showing

**Problem:** Images use placeholder references.

**Solution:** Run asset migration script after content migration:

```bash
node scripts/migrate-assets.js
```

### Server-Side SEO Failing

**Problem:** Tries to update pages that don't exist yet.

**Solution:** Run SEO metadata migration first, then server-side SEO:

```bash
node scripts/migrate-to-sanity.js --type=seo
node scripts/migrate-to-sanity.js --type=server-seo
```

### Insights Articles Not Migrating

**Problem:** TypeScript parser not implemented.

**Solution:**

- Articles need manual migration OR
- Implement TypeScript parser OR
- Export articles to JSON first

## Next Steps After Migration

1. ✅ Verify content in Sanity Studio
2. ⏳ Upload images using asset migration script
3. ⏳ Update image references in documents
4. ⏳ Test content rendering in Next.js app
5. ⏳ Manually migrate insights articles (or implement parser)
