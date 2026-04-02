# Content Formatting Utilities

This module provides utilities for converting various content formats to HTML for the Insights blog system.

## Overview

The content formatters support multiple input formats and provide a consistent HTML output that works with the `ArticleContent` component. This design allows for flexible content authoring while maintaining a single rendering pipeline.

## Supported Formats

### Current Support

- **HTML**: Direct HTML content (current implementation)
- **Plain Text Extraction**: Convert HTML to plain text
- **Excerpt Generation**: Create summaries from content
- **Content Validation**: Ensure content meets quality standards

### Future Support

- **Markdown**: Convert Markdown to HTML
- **Portable Text**: Sanity CMS's rich text format
- **MDX**: Markdown with embedded React components

## Usage

### Basic HTML Validation

```typescript
import { validateHtmlStructure } from '@/lib/content/formatters';

const content = '<h2>Title</h2><p>Content here</p>';
const result = validateHtmlStructure(content);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

### Generate Excerpts

```typescript
import { generateExcerpt } from '@/lib/content/formatters';

const html = '<p>This is a long article about wellness and recovery...</p>';
const excerpt = generateExcerpt(html, 100);
// Returns: "This is a long article about wellness and recovery..."
```

### Extract Plain Text

```typescript
import { extractPlainText } from '@/lib/content/formatters';

const html = '<h2>Title</h2><p>Content with <strong>bold</strong> text</p>';
const text = extractPlainText(html);
// Returns: "Title Content with bold text"
```

### Markdown Conversion (Future)

```typescript
import { markdownToHtml } from '@/lib/content/formatters';

const markdown = `
# Introduction

This is **bold** text and this is *italic* text.

- List item 1
- List item 2
`;

const html = markdownToHtml(markdown);
// Will convert to proper HTML structure
```

### Portable Text Conversion (Future)

```typescript
import { portableTextToHtml } from '@/lib/content/formatters';

const portableText = [
  {
    _type: 'block',
    style: 'h2',
    children: [{ _type: 'span', text: 'Introduction' }],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [
      { _type: 'span', text: 'This is ' },
      { _type: 'span', text: 'bold', marks: ['strong'] },
      { _type: 'span', text: ' text.' },
    ],
  },
];

const html = portableTextToHtml(portableText);
// Converts Sanity Portable Text to HTML
```

## Content Validation

The `validateHtmlStructure` function checks for:

- **Empty content**: Ensures content is not empty
- **Heading hierarchy**: Warns if no headings are present
- **Image accessibility**: Errors if images lack alt text
- **Content length**: Warns if content is too short

### Validation Response

```typescript
{
  valid: boolean;        // True if no errors
  errors: string[];      // Critical issues that must be fixed
  warnings: string[];    // Suggestions for improvement
}
```

## Content Sanitization

When implementing user-generated content, always sanitize HTML:

```typescript
import { sanitizeHtml } from '@/lib/content/formatters';

const userContent = '<script>alert("xss")</script><p>Safe content</p>';
const safeContent = sanitizeHtml(userContent);
// Returns: '<p>Safe content</p>'
```

**Note**: Current implementation is a placeholder. In production, use a library like DOMPurify or sanitize-html.

## Format Conversion Pipeline

```
┌─────────────┐
│   Markdown  │
│     or      │──┐
│ Portable Text│  │
└─────────────┘  │
                 │
                 ▼
         ┌──────────────┐
         │  Converter   │
         │  Functions   │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │     HTML     │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  Validation  │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │ Sanitization │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │   Render in  │
         │ ArticleContent│
         └──────────────┘
```

## Implementation Roadmap

### Phase 1: Current (HTML Only)

- ✅ Direct HTML content support
- ✅ Plain text extraction
- ✅ Excerpt generation
- ✅ Basic validation

### Phase 2: Markdown Support

- [ ] Install and configure Markdown parser (marked or remark)
- [ ] Implement `markdownToHtml()` function
- [ ] Add syntax highlighting for code blocks
- [ ] Support GitHub-flavored Markdown extensions

### Phase 3: Sanity CMS Integration

- [ ] Install @portabletext/to-html
- [ ] Implement `portableTextToHtml()` function
- [ ] Handle custom block types (callouts, embeds)
- [ ] Integrate with Sanity image builder

### Phase 4: MDX Support

- [ ] Install @mdx-js/mdx or next-mdx-remote
- [ ] Implement `mdxToHtml()` function
- [ ] Create custom MDX components
- [ ] Support interactive content

### Phase 5: Security & Optimization

- [ ] Implement HTML sanitization with DOMPurify
- [ ] Add content caching layer
- [ ] Optimize conversion performance
- [ ] Add comprehensive error handling

## Best Practices

### For Content Authors

1. **Use semantic HTML**: Proper heading hierarchy, lists, etc.
2. **Include alt text**: All images must have descriptive alt text
3. **Validate before publishing**: Run validation checks
4. **Keep it accessible**: Follow WCAG 2.1 AA guidelines

### For Developers

1. **Always validate**: Check content structure before rendering
2. **Sanitize user input**: Never trust user-generated content
3. **Handle errors gracefully**: Provide fallbacks for conversion failures
4. **Cache converted content**: Avoid re-converting on every request
5. **Test thoroughly**: Ensure all formats convert correctly

## Testing

```typescript
// Run tests
npm test src/lib/content/__tests__/formatters.test.ts

// Test coverage
npm run test:coverage -- src/lib/content
```

## Related Documentation

- [Content Formatting Guide](../../../docs/insights/CONTENT_FORMATTING_GUIDE.md) - Complete guide for content authors
- [Sanity Migration Guide](../../../docs/insights/SANITY_MIGRATION.md) - CMS migration documentation
- [ArticleContent Component](../../components/insights/ArticleContent/README.md) - Content rendering component

## API Reference

### `markdownToHtml(markdown: string): string`

Converts Markdown to HTML.

**Parameters:**

- `markdown` - Raw Markdown content

**Returns:** HTML string

**Status:** 🚧 Placeholder (to be implemented)

---

### `portableTextToHtml(portableText: any[]): string`

Converts Sanity Portable Text to HTML.

**Parameters:**

- `portableText` - Array of Portable Text blocks

**Returns:** HTML string

**Status:** 🚧 Placeholder (to be implemented)

---

### `mdxToHtml(mdx: string): string`

Converts MDX to HTML.

**Parameters:**

- `mdx` - MDX content string

**Returns:** HTML string or React component

**Status:** 🚧 Placeholder (to be implemented)

---

### `sanitizeHtml(html: string): string`

Sanitizes HTML content by removing dangerous elements.

**Parameters:**

- `html` - Raw HTML content

**Returns:** Sanitized HTML

**Status:** 🚧 Placeholder (to be implemented with DOMPurify)

---

### `extractPlainText(html: string): string`

Extracts plain text from HTML content.

**Parameters:**

- `html` - HTML content

**Returns:** Plain text without HTML tags

**Status:** ✅ Implemented

---

### `generateExcerpt(html: string, maxLength?: number): string`

Generates a short excerpt from HTML content.

**Parameters:**

- `html` - HTML content
- `maxLength` - Maximum character length (default: 160)

**Returns:** Excerpt string with ellipsis if truncated

**Status:** ✅ Implemented

---

### `validateHtmlStructure(html: string): ValidationResult`

Validates HTML content structure and accessibility.

**Parameters:**

- `html` - HTML content to validate

**Returns:** Object with `valid`, `errors`, and `warnings` properties

**Status:** ✅ Implemented

---

### `formatForTarget(html: string, target: string): string`

Formats content for different output targets.

**Parameters:**

- `html` - Source HTML content
- `target` - Output target ('web', 'email', 'pdf', 'amp')

**Returns:** Formatted content for the target platform

**Status:** 🚧 Placeholder (to be implemented)

## Contributing

When adding new formatters or improving existing ones:

1. Add comprehensive JSDoc comments
2. Include usage examples
3. Write unit tests
4. Update this README
5. Update the Content Formatting Guide

## License

Part of the Vital Ice Insights system.
