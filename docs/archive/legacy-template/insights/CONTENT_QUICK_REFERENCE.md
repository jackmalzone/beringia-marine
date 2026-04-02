# Content Quick Reference

A quick reference guide for content authors working with the Vital Ice Insights blog system.

## Article Structure Template

```typescript
{
  id: "unique-id",
  title: "Your Compelling Title (50-70 chars)",
  subtitle: "Expand on the title (70-100 chars)",
  abstract: "2-3 sentence summary that hooks readers (150-200 chars)",
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
  category: "Wellness Article", // or Recovery Guide, Research Summary, Community Story
  author: "Author Name",
  publishDate: "2025-01-20",
  status: "published", // or draft, scheduled
  coverImage: "https://media.vitalicesf.com/insights/image.jpg",
  tags: ["Tag1", "Tag2", "Tag3"],
  slug: "url-friendly-slug",
}
```

## HTML Elements Cheat Sheet

### Headings

```html
<h2>Main Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
```

**Rule:** Never skip levels (h2 → h3 → h4)

### Paragraphs

```html
<p>Each paragraph should convey one main idea.</p>
```

### Lists

```html
<!-- Unordered -->
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>

<!-- Ordered -->
<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>
```

### Emphasis

```html
<strong>Important text</strong> <em>Emphasized text</em>
```

### Links

```html
<!-- Internal -->
<a href="/services/cold-plunge">cold plunge therapy</a>

<!-- External -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">external link</a>
```

### Images

```html
<figure>
  <img src="image-url.jpg" alt="Descriptive alt text" />
  <figcaption>Caption text</figcaption>
</figure>
```

**Required:** Always include alt text!

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### Blockquotes

```html
<blockquote>
  <p>"Quote text here"</p>
  <cite>— Source Name</cite>
</blockquote>
```

## Categories

### Wellness Article

- **Focus:** Practical, actionable advice
- **Tone:** Conversational, approachable
- **Length:** 800-1200 words
- **Example:** "Building a Daily Sauna Practice"

### Recovery Guide

- **Focus:** Step-by-step instructions
- **Tone:** Clear, instructional
- **Length:** 1000-1500 words
- **Example:** "Complete Guide to Contrast Therapy"

### Research Summary

- **Focus:** Science-backed information
- **Tone:** Authoritative, educational
- **Length:** 1200-2000 words
- **Example:** "The Science Behind Cold Plunge Therapy"

### Community Story

- **Focus:** Personal experiences
- **Tone:** Authentic, inspirational
- **Length:** 1000-1500 words
- **Example:** "My Journey to Recovery"

## SEO Checklist

- [ ] Title includes primary keyword (50-70 chars)
- [ ] Subtitle expands on title (70-100 chars)
- [ ] Abstract is compelling (150-200 chars)
- [ ] 3-6 relevant tags selected
- [ ] Primary keyword in first paragraph
- [ ] Headings use descriptive text
- [ ] Internal links to related content
- [ ] External links to authoritative sources

## Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Links have descriptive text (no "click here")
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Tables have proper structure
- [ ] Color is not the only indicator
- [ ] Content is readable without CSS

## Image Guidelines

### Cover Image

- **Size:** 1200x630px (1.91:1 ratio)
- **Format:** WebP with JPEG fallback
- **File size:** Under 200KB
- **Alt text:** Required

### In-Content Images

- **Size:** Minimum 800px width
- **Format:** WebP preferred
- **Placement:** After relevant paragraphs
- **Alt text:** Required
- **Caption:** Recommended

## Common Mistakes to Avoid

❌ **Don't:**

- Skip heading levels (h2 → h4)
- Use generic link text ("click here")
- Forget alt text on images
- Use images for text content
- Create walls of text (break into paragraphs)
- Use all caps for emphasis
- Overuse exclamation points!!!

✅ **Do:**

- Use proper heading hierarchy
- Write descriptive link text
- Include alt text on all images
- Use semantic HTML
- Break content into readable chunks
- Use `<strong>` and `<em>` for emphasis
- Keep tone professional yet approachable

## Content Length Guidelines

| Content Type | Minimum   | Optimal        | Maximum    |
| ------------ | --------- | -------------- | ---------- |
| Title        | 40 chars  | 50-70 chars    | 80 chars   |
| Subtitle     | 60 chars  | 70-100 chars   | 120 chars  |
| Abstract     | 120 chars | 150-200 chars  | 250 chars  |
| Article      | 500 words | 800-1500 words | 2500 words |

## Tag Selection

**Good Tags:**

- Specific: "Cold Therapy", "Infrared Sauna"
- Actionable: "Recovery Tips", "Training Guide"
- Topical: "Mental Health", "Performance"

**Bad Tags:**

- Too generic: "Health", "Wellness"
- Too many: More than 6 tags
- Redundant: "Recovery" and "Recovery Tips"

## Publishing Workflow

1. **Draft:** Write content, add images
2. **Review:** Check structure, accessibility, SEO
3. **Validate:** Run validation checks
4. **Preview:** Review in staging environment
5. **Publish:** Set status to "published"
6. **Monitor:** Track performance and engagement

## Validation Before Publishing

```typescript
import { validateHtmlStructure } from '@/lib/content/formatters';

const result = validateHtmlStructure(content);

if (!result.valid) {
  console.error('Fix these errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Consider addressing:', result.warnings);
}
```

## Need Help?

- **Full Guide:** [Content Formatting Guide](./CONTENT_FORMATTING_GUIDE.md)
- **CMS Migration:** [Sanity Migration Guide](./SANITY_MIGRATION.md)
- **Examples:** Check existing published articles
- **Support:** Contact the development team

## Quick Tips

💡 **Write for humans first, search engines second**

💡 **Use active voice and clear language**

💡 **Break up long paragraphs (3-5 sentences max)**

💡 **Add visual breaks with images and lists**

💡 **Include actionable takeaways**

💡 **Proofread before publishing**

💡 **Update content regularly to keep it fresh**

---

Last updated: 2025-01-20
