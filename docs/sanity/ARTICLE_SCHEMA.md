# Article Schema Documentation

## Overview

The `article` schema provides a comprehensive content management system for blog posts and insights articles. It uses **Portable Text** (Sanity's rich text format) to enable flexible, structured content editing with headings, formatting, images, and more.

## Key Features

### Rich Text Content (Portable Text)

The article content field uses Portable Text, which provides:

#### Text Formatting

- **Headings**: H1, H2, H3, H4
- **Text Styles**: Normal, Blockquote
- **Lists**: Bullet points, Numbered lists
- **Text Marks**:
  - **Strong** (bold)
  - **Emphasis** (italic)
  - **Underline**
  - **Strike-through**
  - **Code** (inline code)

#### Links

- Internal links (relative URLs)
- External links (http/https)
- Email links (mailto:)
- Phone links (tel:)
- Option to open in new tab

#### Images

- Inline images with alt text and captions
- Figure blocks with captions
- Hotspot editing for responsive images

### Article Metadata

- **Title & Subtitle**: Main headline and supporting text
- **Abstract**: Summary for listings and meta descriptions
- **Slug**: URL-friendly identifier
- **Category**: Wellness Article, Recovery Guide, Research Summary, Community Story
- **Author**: Name, role, bio, avatar, social links
- **Tags**: Flexible tagging system
- **Status**: Draft, Published, Scheduled, Archived
- **Publish Dates**: Date and optional scheduled time
- **Reading Time**: Estimated minutes (auto-calculated if not set)

### Images

- **Cover Image**: Main image for listings and social sharing (required)
- **Hero Image**: Optional hero image at top of article
- **Split Hero Images**: Left/right split layout option
- All images support:
  - Hotspot editing
  - Alt text (required for accessibility)
  - Captions

### SEO Settings

Full SEO configuration including:

- SEO title and description
- Keywords
- Open Graph (social media) settings
- Twitter Card settings
- Canonical URLs
- No-index option

## Usage in Sanity Studio

### Creating a New Article

1. Click "Create new" → "Article"
2. Fill in required fields:
   - Title
   - Slug (auto-generated from title)
   - Cover Image
   - Category
   - Author
   - Publish Date
   - Content (at least one block)

### Editing Content

The content field uses a rich text editor where you can:

1. **Type text** and format it using the toolbar
2. **Add headings** using the style dropdown (H1-H4)
3. **Format text** using bold, italic, underline buttons
4. **Create lists** using bullet or number buttons
5. **Add links** by selecting text and clicking the link button
6. **Insert images** by clicking the image icon
7. **Add figures** (images with captions) from the block menu

### Content Structure Example

```
H1: Main Article Title
Normal: Introduction paragraph with some bold text and a link.

H2: Section Heading
Normal: More content here...

Image: [Cover image with alt text and caption]

H3: Subsection
Bullet List:
  - Item 1
  - Item 2 with bold text

H2: Another Section
Blockquote: Important quote here

Normal: More content...
```

## Migration Notes

When migrating existing HTML content:

1. **HTML to Portable Text**: Existing HTML articles need conversion
   - Use a library like `@portabletext/to-html` in reverse
   - Or manually recreate content in Sanity Studio
   - The migration script creates placeholder content

2. **Images**:
   - Images need to be uploaded to Sanity first
   - Asset references will be updated after upload
   - Use the asset migration script

3. **Links**:
   - Internal links should use relative paths (e.g., `/services/cold-plunge`)
   - External links use full URLs

## Best Practices

### SEO

- Use descriptive H1 and H2 headings
- Include keywords naturally in headings
- Write compelling abstracts (150-160 characters)
- Add alt text to all images
- Use descriptive slugs

### Content Structure

- Start with H1 for main title (if not using article title)
- Use H2 for major sections
- Use H3-H4 for subsections
- Keep paragraphs concise (3-4 sentences)
- Use lists for scannable content
- Add images to break up text

### Accessibility

- Always provide alt text for images
- Use proper heading hierarchy (H1 → H2 → H3)
- Ensure sufficient color contrast
- Write descriptive link text

## Schema Location

- **Definition**: `lib/sanity/schemas/documents/article.ts`
- **Studio**: `apps/studio/schemas/documents/article.ts`
- **Export**: Both locations export to their respective schema indexes

## Related Schemas

- `seoSettings`: SEO metadata configuration
- `textSection`: Similar Portable Text structure for page content blocks
- `page`: General page schema (articles are separate for better organization)
