# SEO Plugin Migration Notes

## Current Setup

We've installed `sanity-plugin-seo` which provides enhanced SEO fields with live preview. However, we're currently using a custom `seoSettings` schema that works well.

## Two Options

### Option 1: Keep Custom seoSettings (Recommended for Now)

**Pros:**

- Already working
- Full control over structure
- No migration needed
- Compatible with existing queries

**Cons:**

- No live preview in Studio
- Manual validation

**Current Implementation:**

```typescript
defineField({
  name: 'seo',
  type: 'seoSettings', // Custom schema
});
```

### Option 2: Migrate to SEO Plugin Field Type

**Pros:**

- Live preview in Studio
- Built-in validation
- Better UX for SEO agency
- SEO score suggestions

**Cons:**

- Requires migration
- Different field structure
- Need to update frontend queries

**Plugin Implementation:**

```typescript
defineField({
  name: 'seo',
  type: 'seo', // Plugin field type
});
```

## Recommendation

**For Now:** Keep using `seoSettings` (custom schema)

- Everything is working
- No breaking changes
- Can migrate later if needed

**Future:** Consider migrating to SEO plugin if:

- SEO agency requests live preview
- You want built-in SEO scoring
- You need more advanced SEO features

## Hybrid Approach (Best of Both)

You can actually use both! The SEO plugin provides utilities that work with any schema:

1. Keep `seoSettings` schema
2. Use SEO plugin's preview components
3. Get benefits without migration

## Testing the SEO Plugin

Even with custom `seoSettings`, the SEO plugin is installed and can be used for:

- Preview components (if you add them)
- SEO utilities
- Future migration path

## Migration Script (If Needed Later)

If you decide to migrate from `seoSettings` to SEO plugin's field type:

```javascript
// Migration script
const articles = await client.fetch('*[_type == "article"]');

for (const article of articles) {
  if (article.seoSettings && !article.seo) {
    await client
      .patch(article._id)
      .set({
        seo: {
          _type: 'seo',
          seo: {
            title: article.seoSettings.title,
            description: article.seoSettings.description,
            // ... map other fields
          },
        },
      })
      .commit();
  }
}
```

## Current Status

✅ SEO plugin installed
✅ Orderable list configured
✅ Preview kit installed
⏳ Using custom `seoSettings` (working well)
⏳ Can migrate to plugin field type later if needed
