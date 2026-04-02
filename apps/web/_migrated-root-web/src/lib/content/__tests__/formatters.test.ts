/**
 * Tests for Content Formatting Utilities
 */

import {
  extractPlainText,
  generateExcerpt,
  validateHtmlStructure,
  portableTextToHtml,
} from '../formatters';

describe('Content Formatters', () => {
  describe('extractPlainText', () => {
    it('should remove HTML tags', () => {
      const html = '<h2>Title</h2> <p>Content here</p>';
      const text = extractPlainText(html);
      expect(text).toBe('Title Content here');
    });

    it('should decode HTML entities', () => {
      const html = '<p>This &amp; that &lt;tag&gt; &quot;quoted&quot;</p>';
      const text = extractPlainText(html);
      expect(text).toBe('This & that <tag> "quoted"');
    });

    it('should normalize whitespace', () => {
      const html = '<p>Multiple    spaces\n\nand   newlines</p>';
      const text = extractPlainText(html);
      expect(text).toBe('Multiple spaces and newlines');
    });

    it('should handle empty content', () => {
      const html = '';
      const text = extractPlainText(html);
      expect(text).toBe('');
    });

    it('should handle complex nested HTML', () => {
      const html = `
        <div>
          <h2>Title</h2>
          <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      const text = extractPlainText(html);
      expect(text).toContain('Title');
      expect(text).toContain('bold');
      expect(text).toContain('italic');
      expect(text).toContain('Item 1');
    });
  });

  describe('generateExcerpt', () => {
    it('should truncate long text at word boundary', () => {
      const html =
        '<p>This is a very long article about wellness and recovery practices that goes on for quite some time.</p>';
      const excerpt = generateExcerpt(html, 50);

      expect(excerpt.length).toBeLessThanOrEqual(54); // 50 + "..."
      expect(excerpt).toMatch(/\.\.\.$/);
      expect(excerpt).not.toContain('<');
    });

    it('should not truncate short text', () => {
      const html = '<p>Short text</p>';
      const excerpt = generateExcerpt(html, 50);

      expect(excerpt).toBe('Short text');
      expect(excerpt).not.toContain('...');
    });

    it('should use default max length of 160', () => {
      const longText = 'a'.repeat(200);
      const html = `<p>${longText}</p>`;
      const excerpt = generateExcerpt(html);

      expect(excerpt.length).toBeLessThanOrEqual(163); // 160 + "..."
    });

    it('should handle HTML with multiple elements', () => {
      const html = '<h2>Title</h2><p>First paragraph.</p><p>Second paragraph.</p>';
      const excerpt = generateExcerpt(html, 30);

      expect(excerpt).toContain('Title');
      expect(excerpt).toMatch(/\.\.\.$/);
    });

    it('should handle empty content', () => {
      const html = '';
      const excerpt = generateExcerpt(html);

      expect(excerpt).toBe('');
    });
  });

  describe('validateHtmlStructure', () => {
    it('should validate correct HTML structure', () => {
      const html = `
        <h2>Introduction</h2>
        <p>Content here.</p>
        <figure>
          <img src="test.jpg" alt="Test image" />
          <figcaption>Caption</figcaption>
        </figure>
      `;

      const result = validateHtmlStructure(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should error on empty content', () => {
      const html = '';
      const result = validateHtmlStructure(html);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Content is empty');
    });

    it('should error on images without alt text', () => {
      const html = '<p>Content</p><img src="test.jpg" />';
      const result = validateHtmlStructure(html);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('missing alt text');
    });

    it('should warn on missing headings', () => {
      const html = '<p>Just a paragraph without any headings.</p>';
      const result = validateHtmlStructure(html);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('No headings found');
    });

    it('should warn on very short content', () => {
      const html = '<p>Short</p>';
      const result = validateHtmlStructure(html);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('very short'))).toBe(true);
    });

    it('should handle multiple images without alt text', () => {
      const html = `
        <p>Content</p>
        <img src="test1.jpg" />
        <img src="test2.jpg" />
        <img src="test3.jpg" />
      `;
      const result = validateHtmlStructure(html);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('3 image(s) missing alt text');
    });

    it('should pass with proper structure and sufficient content', () => {
      const html = `
        <h2>Introduction</h2>
        <p>This is a well-structured article with proper headings and sufficient content to meet the minimum length requirements.</p>
        <h3>Subsection</h3>
        <p>More detailed information here with proper structure and formatting.</p>
        <img src="test.jpg" alt="Descriptive alt text" />
      `;

      const result = validateHtmlStructure(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('portableTextToHtml', () => {
    it('should convert basic paragraph blocks', () => {
      const portableText = [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Hello world' }],
        },
      ];

      const html = portableTextToHtml(portableText);

      expect(html).toContain('<p>Hello world</p>');
    });

    it('should convert heading blocks', () => {
      const portableText = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Main Title' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Subtitle' }],
        },
      ];

      const html = portableTextToHtml(portableText);

      expect(html).toContain('<h2>Main Title</h2>');
      expect(html).toContain('<h3>Subtitle</h3>');
    });

    it('should handle empty arrays', () => {
      const portableText: Array<Record<string, unknown>> = [];
      const html = portableTextToHtml(portableText);

      expect(html).toBe('');
    });

    it('should handle image blocks', () => {
      const portableText = [
        {
          _type: 'image',
          url: 'https://example.com/image.jpg',
          alt: 'Test image',
          caption: 'Image caption',
        },
      ];

      const html = portableTextToHtml(portableText);

      expect(html).toContain('<figure>');
      expect(html).toContain('<img');
      expect(html).toContain('alt="Test image"');
      expect(html).toContain('<figcaption>Image caption</figcaption>');
    });

    it('should handle image blocks without caption', () => {
      const portableText = [
        {
          _type: 'image',
          url: 'https://example.com/image.jpg',
          alt: 'Test image',
        },
      ];

      const html = portableTextToHtml(portableText);

      expect(html).toContain('<figure>');
      expect(html).toContain('<img');
      expect(html).not.toContain('<figcaption>');
    });

    it('should handle mixed content types', () => {
      const portableText = [
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Title' }],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Paragraph text' }],
        },
        {
          _type: 'image',
          url: 'https://example.com/image.jpg',
          alt: 'Image',
        },
      ];

      const html = portableTextToHtml(portableText);

      expect(html).toContain('<h2>Title</h2>');
      expect(html).toContain('<p>Paragraph text</p>');
      expect(html).toContain('<figure>');
    });

    it('should handle invalid input gracefully', () => {
      const invalidInput = 'not an array';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html = portableTextToHtml(invalidInput as any);

      expect(html).toBe('');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete article workflow', () => {
      const html = `
        <h2>The Science of Recovery</h2>
        <p>Recovery is an essential component of any training program. This article explores the science behind effective recovery strategies.</p>
        <h3>Key Benefits</h3>
        <ul>
          <li>Reduced inflammation</li>
          <li>Improved performance</li>
          <li>Better sleep quality</li>
        </ul>
        <figure>
          <img src="recovery.jpg" alt="Person using recovery equipment" />
          <figcaption>Modern recovery techniques</figcaption>
        </figure>
      `;

      // Validate structure
      const validation = validateHtmlStructure(html);
      expect(validation.valid).toBe(true);

      // Extract plain text
      const plainText = extractPlainText(html);
      expect(plainText).toContain('Recovery is an essential component');
      expect(plainText).toContain('Reduced inflammation');

      // Generate excerpt
      const excerpt = generateExcerpt(html, 100);
      expect(excerpt.length).toBeLessThanOrEqual(103);
      expect(excerpt).toContain('Recovery');
    });

    it('should catch common content issues', () => {
      const problematicHtml = `
        <p>Short content</p>
        <img src="image.jpg" />
      `;

      const validation = validateHtmlStructure(problematicHtml);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('missing alt text'))).toBe(true);
      expect(validation.warnings.some(w => w.includes('No headings'))).toBe(true);
      expect(validation.warnings.some(w => w.includes('very short'))).toBe(true);
    });
  });
});
