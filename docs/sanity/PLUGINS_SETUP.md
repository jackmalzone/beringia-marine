# Sanity Plugins Setup Guide

## ✅ Installed Plugins

### Must-Have (Installed)

- ✅ `@sanity/vision` - GROQ query playground
- ✅ `@sanity/desk-tool` - Main editing interface (built-in)
- ✅ `@sanity/image-url` - Optimized image URLs
- ✅ `sanity-plugin-seo` - First-class SEO fields with preview
- ✅ `@sanity/preview-kit` - Draft previews in Next.js
- ✅ `@sanity/orderable-document-list` - Drag-and-drop ordering

### Optional (Not Installed Yet)

- `@sanity/code-input` - Code blocks (add when needed)
- `sanity-plugin-table` - Tables in content (add when needed)
- `sanity-plugin-media` - Enhanced media library (add when needed)
- `@sanity/asset-source-unsplash` - Unsplash integration (add when needed)

## Configuration

### 1. SEO Plugin (sanity-plugin-seo)

**Note:** The `sanity-plugin-seo` package provides `seoMetaFields` (a field type), not a plugin. It's used in schemas, not in the plugins array.

**Current Setup:**
We're using a custom `seoSettings` schema that works well. The SEO plugin is installed and available if you want to use `seoMetaFields` instead.

**To Use SEO Plugin Field Type (Optional):**

1. Import in your schema:

```typescript
import { seoMetaFields } from 'sanity-plugin-seo';
```

2. Use in article schema:

```typescript
defineField({
  name: 'seo',
  title: 'SEO Settings',
  ...seoMetaFields({
    // Optional configuration
  }),
});
```

**Current Implementation:**
We're using custom `seoSettings` schema which provides:

- SEO title and description
- Keywords
- Open Graph settings
- Twitter Card settings
- Canonical URLs
- No-index option

**Features:**

- Live preview of search results
- Social media preview (OG, Twitter)
- Character count validation
- Focus keyword tracking
- SEO score suggestions

### 2. Orderable Document List

Articles can be reordered via drag-and-drop in the Studio:

```typescript
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

deskTool({
  structure: S =>
    S.list().items([
      // ... other items
      orderableDocumentListDeskItem({
        type: 'article',
        title: 'Articles',
        S,
      }),
    ]),
});
```

**Usage:**

- Drag articles to reorder
- Order is stored in `_order` field
- Use in queries: `order(_order asc)`

### 3. Preview Kit

Configured for draft previews in Next.js (requires frontend setup).

**Frontend Integration:**

```typescript
import { definePreview } from '@sanity/preview-kit';

const preview = definePreview({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
});
```

## SEO Plugin Benefits

### For SEO Agency

1. **Live Preview** - See exactly how content appears in search results
2. **Character Limits** - Visual feedback on title/description length
3. **Social Preview** - See how content looks when shared
4. **Focus Keywords** - Track target keywords per article
5. **SEO Score** - Get suggestions for improvement

### For Developers

1. **Structured Data** - Consistent SEO field structure
2. **Type Safety** - TypeScript types available
3. **Validation** - Built-in validation rules
4. **Extensibility** - Easy to customize

## Migration Notes

### From Custom seoSettings to SEO Plugin

If you want to migrate existing articles from `seoSettings` to the SEO plugin:

1. **Keep Both Temporarily:**

   ```typescript
   // Support both during migration
   defineField({
     name: 'seo',
     type: 'seo', // New plugin field
   }),
   defineField({
     name: 'seoSettings', // Old custom field
     type: 'seoSettings',
     hidden: true, // Hide but keep for migration
   }),
   ```

2. **Run Migration Script:**
   - Copy data from `seoSettings` to `seo`
   - Map fields appropriately
   - Remove old field after migration

3. **Update Frontend:**
   - Update queries to use new `seo` field structure
   - Test all pages

## Query Examples

### With Orderable List

```groq
*[_type == "article" && status == "published"] | order(_order asc, publishDate desc) {
  _id,
  title,
  slug,
  seo,
  _order
}
```

### With SEO Plugin

```groq
*[_type == "article"] {
  _id,
  title,
  "seoTitle": seo.seo.title,
  "seoDescription": seo.seo.description,
  "ogImage": seo.og.image.asset->url
}
```

## Next Steps

1. ✅ Plugins installed and configured
2. ⏳ Test SEO plugin in Studio
3. ⏳ Configure preview kit in Next.js frontend
4. ⏳ Test orderable list functionality
5. ⏳ Train SEO agency on new features

## Resources

- [SEO Plugin Docs](https://github.com/LiamMartens/sanity-plugin-seo)
- [Orderable List Docs](https://github.com/sanity-io/orderable-document-list)
- [Preview Kit Docs](https://www.sanity.io/docs/preview-kit)
- [Vision Tool Docs](https://www.sanity.io/docs/vision)
