/**
 * Content Formatting Utilities
 *
 * This module provides utilities for converting various content formats
 * (Markdown, Portable Text, MDX) to HTML for rendering in the Insights system.
 *
 * These utilities are designed to support future CMS integration while
 * maintaining consistent HTML output for the ArticleContent component.
 */

/**
 * Markdown to HTML converter
 *
 * This is a placeholder for future Markdown support.
 * When implementing, consider using libraries like:
 * - marked: Fast, lightweight Markdown parser
 * - remark: Pluggable Markdown processor
 * - markdown-it: Markdown parser with plugin support
 *
 * @param markdown - Raw Markdown content
 * @returns HTML string ready for rendering
 *
 * @example
 * ```typescript
 * const html = markdownToHtml('# Hello\n\nThis is **bold** text');
 * // Returns: '<h1>Hello</h1><p>This is <strong>bold</strong> text</p>'
 * ```
 */
export function markdownToHtml(markdown: string): string {
  // TODO: Implement Markdown parsing
  // For now, return as-is (assumes HTML input)
  return markdown;
}

/**
 * Portable Text to HTML converter
 *
 * Portable Text is Sanity's rich text format. This converter transforms
 * Portable Text blocks into semantic HTML.
 *
 * When implementing, use @portabletext/to-html or @portabletext/react
 *
 * @param portableText - Sanity Portable Text blocks
 * @returns HTML string ready for rendering
 *
 * @example
 * ```typescript
 * const blocks = [
 *   {
 *     _type: 'block',
 *     children: [{ _type: 'span', text: 'Hello world' }]
 *   }
 * ];
 * const html = portableTextToHtml(blocks);
 * ```
 */
interface PortableTextBlock {
  _type: string;
  style?: string;
  children?: Array<{ text: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export function portableTextToHtml(portableText: PortableTextBlock[]): string {
  // TODO: Implement Portable Text parsing
  // This will be needed when migrating to Sanity CMS

  // Placeholder implementation
  if (!Array.isArray(portableText)) {
    return '';
  }

  // Basic block-level conversion (expand as needed)
  return portableText
    .map(block => {
      if (block._type === 'block') {
        const text = block.children?.map(child => child.text).join('') || '';

        // Handle different block styles
        switch (block.style) {
          case 'h2':
            return `<h2>${text}</h2>`;
          case 'h3':
            return `<h3>${text}</h3>`;
          case 'h4':
            return `<h4>${text}</h4>`;
          default:
            return `<p>${text}</p>`;
        }
      }

      // Handle image blocks
      if (block._type === 'image') {
        const alt = block.alt || '';
        const caption = block.caption || '';
        // Note: Sanity image URLs need to be constructed with image builder
        return `<figure><img src="${block.url}" alt="${alt}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
      }

      return '';
    })
    .join('\n');
}

/**
 * MDX to HTML converter
 *
 * MDX combines Markdown with JSX components. This is useful for
 * interactive content with embedded React components.
 *
 * When implementing, consider using:
 * - @mdx-js/mdx: MDX compiler
 * - next-mdx-remote: MDX for Next.js with remote content
 *
 * @param mdx - MDX content string
 * @returns HTML string or React component
 *
 * @example
 * ```typescript
 * const mdx = '# Hello\n\n<CustomComponent prop="value" />';
 * const html = mdxToHtml(mdx);
 * ```
 */
export function mdxToHtml(mdx: string): string {
  // TODO: Implement MDX parsing
  // MDX requires compilation and may return React components
  // rather than pure HTML strings
  return mdx;
}

/**
 * Sanitize HTML content
 *
 * Removes potentially dangerous HTML elements and attributes
 * while preserving safe formatting elements.
 *
 * When implementing, use a library like:
 * - DOMPurify: Industry-standard HTML sanitizer
 * - sanitize-html: Configurable HTML sanitizer
 *
 * @param html - Raw HTML content
 * @returns Sanitized HTML safe for rendering
 *
 * @example
 * ```typescript
 * const unsafe = '<script>alert("xss")</script><p>Safe content</p>';
 * const safe = sanitizeHtml(unsafe);
 * // Returns: '<p>Safe content</p>'
 * ```
 */
export function sanitizeHtml(html: string): string {
  // TODO: Implement HTML sanitization
  // IMPORTANT: Always sanitize user-generated content before rendering

  // For now, return as-is (assumes trusted content)
  // In production, implement proper sanitization
  return html;
}

/**
 * Extract plain text from HTML
 *
 * Strips all HTML tags and returns plain text content.
 * Useful for generating excerpts, meta descriptions, or search indexing.
 *
 * @param html - HTML content
 * @returns Plain text without HTML tags
 *
 * @example
 * ```typescript
 * const html = '<h2>Title</h2><p>Content with <strong>bold</strong> text</p>';
 * const text = extractPlainText(html);
 * // Returns: 'Title Content with bold text'
 * ```
 */
export function extractPlainText(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Generate excerpt from content
 *
 * Creates a short excerpt from HTML content, truncating at word boundaries.
 *
 * @param html - HTML content
 * @param maxLength - Maximum character length (default: 160)
 * @returns Excerpt string with ellipsis if truncated
 *
 * @example
 * ```typescript
 * const html = '<p>This is a very long article about wellness...</p>';
 * const excerpt = generateExcerpt(html, 50);
 * // Returns: 'This is a very long article about wellness...'
 * ```
 */
export function generateExcerpt(html: string, maxLength: number = 160): string {
  const text = extractPlainText(html);

  if (text.length <= maxLength) {
    return text;
  }

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Validate HTML structure
 *
 * Checks if HTML content has proper structure and required elements.
 * Useful for content validation before publishing.
 *
 * @param html - HTML content to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = validateHtmlStructure('<p>Content</p>');
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateHtmlStructure(html: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty content
  if (!html || html.trim().length === 0) {
    errors.push('Content is empty');
  }

  // Check for proper heading hierarchy
  const headings = html.match(/<h[2-6][^>]*>/g) || [];
  if (headings.length === 0) {
    warnings.push('No headings found - consider adding section headings for better structure');
  }

  // Check for images without alt text
  const imagesWithoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/g) || [];
  if (imagesWithoutAlt.length > 0) {
    errors.push(`${imagesWithoutAlt.length} image(s) missing alt text`);
  }

  // Check for minimum content length
  const plainText = extractPlainText(html);
  if (plainText.length < 100) {
    warnings.push('Content is very short - consider adding more detail');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format content for different output targets
 *
 * Transforms content based on the target platform (web, email, PDF, etc.)
 *
 * @param html - Source HTML content
 * @param target - Output target format
 * @returns Formatted content for the target platform
 */
export function formatForTarget(html: string, target: 'web' | 'email' | 'pdf' | 'amp'): string {
  switch (target) {
    case 'email':
      // Email clients have limited CSS support
      // Convert to inline styles, remove unsupported elements
      return html; // TODO: Implement email-specific formatting

    case 'pdf':
      // PDF generation may need specific markup
      // Adjust image sizes, page breaks, etc.
      return html; // TODO: Implement PDF-specific formatting

    case 'amp':
      // AMP has strict HTML requirements
      // Convert to AMP-compatible markup
      return html; // TODO: Implement AMP-specific formatting

    case 'web':
    default:
      return html;
  }
}
