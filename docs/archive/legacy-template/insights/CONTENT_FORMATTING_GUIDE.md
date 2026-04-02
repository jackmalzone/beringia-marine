# Content Formatting Guide for Insights

This guide provides comprehensive instructions for creating and formatting content for the Vital Ice Insights blog system. Whether you're writing directly in HTML, using Markdown, or working with a CMS, these guidelines ensure consistent, accessible, and SEO-optimized content.

## Table of Contents

1. [Content Structure](#content-structure)
2. [HTML Formatting Standards](#html-formatting-standards)
3. [Markdown Support](#markdown-support)
4. [Accessibility Requirements](#accessibility-requirements)
5. [SEO Best Practices](#seo-best-practices)
6. [Visual Content Guidelines](#visual-content-guidelines)
7. [CMS Integration](#cms-integration)
8. [Content Validation](#content-validation)

---

## Content Structure

### Required Article Fields

Every article must include the following fields:

```typescript
{
  id: string;              // Unique identifier
  title: string;           // Article title (50-70 characters recommended)
  subtitle: string;        // Brief subtitle (70-100 characters)
  abstract: string;        // 2-3 sentence summary (150-200 characters)
  content: string;         // Full HTML content
  category: ArticleCategory; // One of: Wellness Article, Recovery Guide, Research Summary, Community Story
  author: string | Author; // Author name or full author object
  publishDate: string;     // ISO date format (YYYY-MM-DD)
  status: string;          // 'draft', 'published', or 'scheduled'
  coverImage: string;      // URL to cover image
  tags: string[];          // 3-6 relevant tags
  slug: string;            // URL-friendly identifier
}
```

### Optional Fields

```typescript
{
  publishAt?: string;      // Scheduled publish date/time (ISO 8601)
  pdfUrl?: string;         // Link to downloadable PDF version
  readingTime?: number;    // Estimated reading time in minutes (auto-calculated if omitted)
  seo?: {
    title?: string;        // Custom SEO title (override default)
    description?: string;  // Custom meta description
    ogImage?: string;      // Custom Open Graph image
  }
}
```

---

## HTML Formatting Standards

### Heading Hierarchy

Always use proper heading hierarchy. The article title is `<h1>` (automatically rendered), so content should start with `<h2>`.

```html
<!-- ✅ CORRECT -->
<h2>Main Section</h2>
<p>Content...</p>

<h3>Subsection</h3>
<p>More content...</p>

<h4>Sub-subsection</h4>
<p>Even more content...</p>

<!-- ❌ INCORRECT - Skipping heading levels -->
<h2>Main Section</h2>
<h4>Subsection</h4>
<!-- Don't skip h3 -->
```

### Paragraphs

Use `<p>` tags for all body text. Keep paragraphs focused and readable (3-5 sentences).

```html
<p>This is a well-structured paragraph that conveys a single idea clearly and concisely.</p>

<p>Each new idea gets its own paragraph for better readability and comprehension.</p>
```

### Lists

Use semantic list elements for better structure and accessibility.

**Unordered Lists** (for items without specific order):

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

**Ordered Lists** (for sequential steps or ranked items):

```html
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
```

### Text Emphasis

Use semantic HTML for emphasis:

```html
<!-- Strong importance -->
<p>This is <strong>very important</strong> information.</p>

<!-- Emphasis/stress -->
<p>This is <em>emphasized</em> text.</p>

<!-- Combine when needed -->
<p>
  This is <strong><em>critically important</em></strong
  >.
</p>
```

### Links

Always provide descriptive link text and indicate external links:

```html
<!-- ✅ GOOD - Descriptive link text -->
<p>Learn more about <a href="/services/cold-plunge">cold plunge therapy</a>.</p>

<!-- ❌ BAD - Generic link text -->
<p>To learn more, <a href="/services/cold-plunge">click here</a>.</p>

<!-- External links (optional target="_blank") -->
<p>
  Read the
  <a href="https://example.com/study" target="_blank" rel="noopener noreferrer">research study</a>.
</p>
```

### Images and Figures

Always use the `<figure>` element with `<figcaption>` for images:

```html
<figure>
  <img
    src="https://media.vitalicesf.com/insights/cold-plunge-science.jpg"
    alt="Person practicing cold plunge therapy in an ice bath"
  />
  <figcaption>Cold plunge therapy activates multiple physiological systems</figcaption>
</figure>
```

**Image Requirements:**

- Always include descriptive `alt` text
- Use high-quality images (minimum 1200px width)
- Optimize images before uploading (WebP format preferred)
- Include captions that add context or information

### Tables

Use tables for tabular data only (not for layout):

```html
<table>
  <thead>
    <tr>
      <th>Goal</th>
      <th>Best Time</th>
      <th>Frequency</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Energy & Focus</td>
      <td>Morning (6-9 AM)</td>
      <td>3-4x per week</td>
    </tr>
    <tr>
      <td>Recovery</td>
      <td>Post-workout</td>
      <td>4-5x per week</td>
    </tr>
  </tbody>
</table>
```

**Table Best Practices:**

- Always include `<thead>` and `<tbody>`
- Use `<th>` for header cells
- Keep tables simple and readable on mobile
- Consider using lists for simple data on mobile

### Blockquotes

Use blockquotes for quotations or callouts:

```html
<blockquote>
  <p>
    "Recovery is not passive; it's an active practice that deserves the same attention as training."
  </p>
  <cite>— Dr. Sarah Chen, Sports Medicine Specialist</cite>
</blockquote>
```

---

## Markdown Support

The system supports Markdown conversion to HTML for easier content authoring. Use the `markdownToHtml()` utility when implementing.

### Basic Markdown Syntax

```markdown
# This becomes <h2> (h1 is reserved for article title)

## This becomes <h3>

### This becomes <h4>

Regular paragraph text.

**Bold text** becomes <strong>

_Italic text_ becomes <em>

[Link text](https://example.com) becomes <a>

![Alt text](image-url.jpg) becomes <img>

- Unordered list item
- Another item

1. Ordered list item
2. Another item

> Blockquote text
```

### Extended Markdown Features

When implementing Markdown support, consider these extensions:

- **Tables**: GitHub-flavored Markdown table syntax
- **Code blocks**: Syntax highlighting for code examples
- **Footnotes**: For references and citations
- **Definition lists**: For glossary-style content

---

## Accessibility Requirements

All content must meet WCAG 2.1 Level AA standards.

### Images

```html
<!-- ✅ GOOD - Descriptive alt text -->
<img src="sauna.jpg" alt="Person relaxing in an infrared sauna with wooden interior" />

<!-- ❌ BAD - Generic or missing alt text -->
<img src="sauna.jpg" alt="image" />
<img src="sauna.jpg" />
```

### Color and Contrast

- Don't rely solely on color to convey information
- Ensure text has sufficient contrast (4.5:1 for body text, 3:1 for large text)
- Use additional indicators (icons, text) alongside color

### Link Text

```html
<!-- ✅ GOOD - Context is clear -->
<a href="/services">Explore our recovery services</a>

<!-- ❌ BAD - No context -->
<a href="/services">Click here</a>
```

### Heading Structure

- Never skip heading levels (h2 → h3 → h4)
- Use headings to create a logical document outline
- Don't use headings for styling (use CSS instead)

### Tables

```html
<!-- Always include proper table structure -->
<table>
  <caption>
    Sauna Session Recommendations by Goal
  </caption>
  <thead>
    <tr>
      <th scope="col">Goal</th>
      <th scope="col">Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Relaxation</td>
      <td>15-20 minutes</td>
    </tr>
  </tbody>
</table>
```

---

## SEO Best Practices

### Title Optimization

- **Article Title**: 50-70 characters, include primary keyword
- **Subtitle**: 70-100 characters, expand on title
- **SEO Title** (optional): Customize for search results

```typescript
// Example
{
  title: "The Science Behind Cold Plunge Therapy",
  subtitle: "Understanding the physiological benefits of cold exposure",
  seo: {
    title: "Cold Plunge Therapy Benefits: Science-Backed Research | Vital Ice"
  }
}
```

### Meta Description

- **Abstract**: 150-200 characters, compelling summary
- **SEO Description** (optional): Customize for search snippets

```typescript
{
  abstract: "Discover how cold plunge therapy triggers powerful physiological responses that enhance recovery, boost mental clarity, and build resilience.",
  seo: {
    description: "Learn the science-backed benefits of cold plunge therapy for recovery, mental health, and performance. Expert insights from Vital Ice."
  }
}
```

### Content Structure for SEO

1. **Use descriptive headings** with relevant keywords
2. **Front-load important information** in the first paragraph
3. **Include internal links** to related content
4. **Add external links** to authoritative sources
5. **Use semantic HTML** for better crawlability

### Keywords and Tags

- Choose 3-6 relevant tags per article
- Use specific, descriptive tags
- Include both broad and niche terms

```typescript
// ✅ GOOD
tags: ['Cold Therapy', 'Recovery', 'Science', 'Mental Health'];

// ❌ BAD - Too generic or too many
tags: ['Health', 'Wellness', 'Fitness', 'Recovery', 'Science', 'Research', 'Tips', 'Guide'];
```

---

## Visual Content Guidelines

### Cover Images

- **Dimensions**: Minimum 1200x630px (1.91:1 aspect ratio)
- **Format**: WebP with JPEG fallback
- **File size**: Under 200KB (optimized)
- **Content**: High-quality, relevant to article topic
- **Text overlay**: Avoid text in images (use HTML instead)

### In-Content Images

- **Dimensions**: Minimum 800px width
- **Format**: WebP preferred
- **Placement**: After relevant paragraphs, not mid-sentence
- **Frequency**: 1-2 images per 500 words (don't overdo it)

### Image Optimization Checklist

- [ ] Descriptive filename (e.g., `cold-plunge-therapy.jpg` not `IMG_1234.jpg`)
- [ ] Compressed and optimized
- [ ] Descriptive alt text
- [ ] Appropriate dimensions
- [ ] Hosted on CDN (Cloudflare R2)

---

## CMS Integration

### Sanity CMS (Recommended)

When migrating to Sanity, content will use Portable Text format:

```typescript
// Portable Text structure
{
  _type: 'block',
  style: 'normal', // or 'h2', 'h3', etc.
  children: [
    {
      _type: 'span',
      text: 'Your content here',
      marks: ['strong'] // for bold, 'em' for italic
    }
  ]
}
```

The `portableTextToHtml()` utility will convert this to HTML automatically.

### MDX Support

For interactive content with React components:

```mdx
# Article Title

Regular Markdown content here.

<CustomComponent prop="value" />

More Markdown content.
```

Use the `mdxToHtml()` utility for MDX conversion.

### Content Validation

Before publishing, all content goes through validation:

```typescript
import { validateHtmlStructure } from '@/lib/content/formatters';

const result = validateHtmlStructure(content);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

**Validation Checks:**

- Content is not empty
- Images have alt text
- Proper heading hierarchy
- Minimum content length
- No broken HTML tags

---

## Content Validation

### Pre-Publish Checklist

Before publishing any article, verify:

#### Content Quality

- [ ] Title is clear and compelling (50-70 characters)
- [ ] Subtitle adds context (70-100 characters)
- [ ] Abstract is concise and engaging (150-200 characters)
- [ ] Content is well-structured with clear sections
- [ ] Minimum 500 words (aim for 800-1500 for depth)
- [ ] Proper heading hierarchy (h2 → h3 → h4)
- [ ] No spelling or grammar errors

#### Accessibility

- [ ] All images have descriptive alt text
- [ ] Links have descriptive text (no "click here")
- [ ] Color is not the only way information is conveyed
- [ ] Tables have proper structure with headers
- [ ] Content is readable without CSS

#### SEO

- [ ] Primary keyword in title and first paragraph
- [ ] Meta description is compelling
- [ ] 3-6 relevant tags selected
- [ ] Internal links to related content
- [ ] External links to authoritative sources
- [ ] Proper heading structure for featured snippets

#### Technical

- [ ] Cover image is optimized and high-quality
- [ ] All images are hosted on CDN
- [ ] No broken links
- [ ] HTML validates without errors
- [ ] Reading time is accurate (or auto-calculated)

#### Legal/Compliance

- [ ] Proper attribution for quotes and images
- [ ] Medical/health claims are backed by research
- [ ] No copyright violations
- [ ] Privacy considerations for member stories

---

## Examples

### Complete Article Structure

```html
<h2>Introduction</h2>
<p>Opening paragraph that hooks the reader and introduces the topic.</p>

<h2>Main Section</h2>
<p>Content that explores the topic in depth.</p>

<h3>Subsection</h3>
<p>More detailed information about a specific aspect.</p>

<figure>
  <img src="https://media.vitalicesf.com/insights/example.jpg" alt="Descriptive alt text" />
  <figcaption>Caption that adds context or information</figcaption>
</figure>

<h3>Another Subsection</h3>
<p>Additional information with proper structure.</p>

<ul>
  <li>Key point one</li>
  <li>Key point two</li>
  <li>Key point three</li>
</ul>

<h2>Practical Application</h2>
<p>How readers can apply this information.</p>

<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<h2>Conclusion</h2>
<p>Summary and call to action.</p>
```

### Category-Specific Guidelines

#### Wellness Article

- Focus on practical, actionable advice
- Include personal anecdotes or examples
- Conversational, approachable tone
- 800-1200 words

#### Recovery Guide

- Step-by-step instructions
- Clear protocols and timelines
- Safety considerations
- Visual aids (images, tables)
- 1000-1500 words

#### Research Summary

- Cite sources and studies
- Explain complex concepts clearly
- Include data and statistics
- More formal, authoritative tone
- 1200-2000 words

#### Community Story

- First-person narrative
- Authentic, personal voice
- Include transformation details
- Inspirational and relatable
- 1000-1500 words

---

## Tools and Utilities

### Available Formatters

```typescript
import {
  markdownToHtml,
  portableTextToHtml,
  mdxToHtml,
  sanitizeHtml,
  extractPlainText,
  generateExcerpt,
  validateHtmlStructure,
  formatForTarget,
} from '@/lib/content/formatters';
```

### Usage Examples

```typescript
// Convert Markdown to HTML
const html = markdownToHtml(markdownContent);

// Generate excerpt for preview
const excerpt = generateExcerpt(html, 160);

// Validate before publishing
const validation = validateHtmlStructure(html);
if (!validation.valid) {
  throw new Error(`Content validation failed: ${validation.errors.join(', ')}`);
}

// Sanitize user-generated content
const safeHtml = sanitizeHtml(userContent);
```

---

## Future Enhancements

### Planned Features

1. **Rich Text Editor**: WYSIWYG editor for non-technical authors
2. **Content Templates**: Pre-built structures for each category
3. **AI-Assisted Writing**: Suggestions for SEO optimization
4. **Version Control**: Track content changes and revisions
5. **Collaborative Editing**: Multiple authors working together
6. **Content Scheduling**: Advanced publishing workflows
7. **A/B Testing**: Test different titles and abstracts
8. **Analytics Integration**: Track content performance

### CMS Migration Timeline

See [SANITY_MIGRATION.md](./SANITY_MIGRATION.md) for detailed migration plans.

---

## Support and Questions

For questions about content formatting or to report issues:

1. Check this guide first
2. Review existing articles for examples
3. Consult the [SANITY_MIGRATION.md](./SANITY_MIGRATION.md) for CMS-specific questions
4. Contact the development team

---

## Changelog

- **2025-01-20**: Initial content formatting guide created
- Future updates will be documented here
