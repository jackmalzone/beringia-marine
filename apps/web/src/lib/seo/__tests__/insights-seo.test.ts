/**
 * Tests for Insights SEO metadata and structured data
 */

import {
  generateArticleSchema,
  generateArticleBreadcrumb,
  generateBlogSchema,
  generateStructuredData,
} from '../structured-data';
import { ArticleData } from '@/types/insights';

describe('Insights SEO - Article Schema', () => {
  const mockArticle: ArticleData = {
    id: '1',
    title: 'Template Article: Service Operations',
    subtitle: 'How premium studios document repeatable client journeys',
    abstract:
      'Placeholder abstract for schema tests—replace with production copy when articles go live.',
    content: '<h2>Introduction</h2><p>Template insights content for structured data validation.</p>',
    category: 'Research Summary',
    author: 'Editorial Team',
    publishDate: '2025-01-15',
    status: 'published',
    coverImage: 'https://example.org/insights/cover.jpg',
    tags: ['Operations', 'Client Experience', 'Template'],
    slug: 'science-behind-cold-plunge-therapy',
    seo: {
      title: 'Template Article | Premium Service Business Insights',
      description: 'Placeholder SEO description for automated schema checks.',
      ogImage: 'https://example.org/insights/og.png',
    },
  };

  test('generateArticleSchema creates valid Article schema', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe(mockArticle.title);
    expect(schema.description).toBe(mockArticle.abstract);
    expect(schema.image).toBe(mockArticle.seo?.ogImage);
    expect(schema.datePublished).toBe(mockArticle.publishDate);
  });

  test('generateArticleSchema includes author information', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Editorial Team',
    });
  });

  test('generateArticleSchema includes publisher information', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.publisher).toHaveProperty('@type', 'Organization');
    expect(schema.publisher).toHaveProperty('name', 'Premium Service Business');
    expect(schema.publisher).toHaveProperty('logo');
  });

  test('generateArticleSchema includes mainEntityOfPage', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `http://localhost:3000/insights/${mockArticle.slug}`,
    });
  });

  test('generateArticleSchema includes keywords from tags', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.keywords).toBe('Operations, Client Experience, Template');
  });

  test('generateArticleSchema includes article section (category)', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.articleSection).toBe('Research Summary');
  });

  test('generateArticleSchema calculates word count', () => {
    const schema = generateArticleSchema(mockArticle);

    expect(schema.wordCount).toBeGreaterThan(0);
    expect(typeof schema.wordCount).toBe('number');
  });

  test('generateArticleSchema handles Author object', () => {
    const articleWithAuthorObject: ArticleData = {
      ...mockArticle,
      author: {
        name: 'Dr. Jane Smith',
        bio: 'Wellness expert',
        avatar: 'https://example.com/avatar.jpg',
      },
    };

    const schema = generateArticleSchema(articleWithAuthorObject);

    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Dr. Jane Smith',
    });
  });

  test('generateArticleSchema falls back to coverImage when no ogImage', () => {
    const articleWithoutOgImage: ArticleData = {
      ...mockArticle,
      seo: undefined,
    };

    const schema = generateArticleSchema(articleWithoutOgImage);

    expect(schema.image).toBe(mockArticle.coverImage);
  });
});

describe('Insights SEO - Breadcrumb Schema', () => {
  test('generateArticleBreadcrumb creates valid BreadcrumbList schema', () => {
    const breadcrumb = generateArticleBreadcrumb('Test Article', 'test-article');

    expect(breadcrumb['@context']).toBe('https://schema.org');
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement).toHaveLength(3);
  });

  test('generateArticleBreadcrumb includes correct hierarchy', () => {
    const breadcrumb = generateArticleBreadcrumb('Test Article', 'test-article');

    expect(breadcrumb.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'http://localhost:3000',
    });

    expect(breadcrumb.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Insights',
      item: 'http://localhost:3000/insights',
    });

    expect(breadcrumb.itemListElement[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'Test Article',
      item: 'http://localhost:3000/insights/test-article',
    });
  });
});

describe('Insights SEO - Blog Schema', () => {
  test('generateBlogSchema creates valid Blog schema', () => {
    const schema = generateBlogSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Blog');
    expect(schema.name).toBe('Premium Service Business Insights');
    expect(schema.description).toContain('Articles');
    expect(schema.url).toBe('http://localhost:3000/insights');
  });

  test('generateBlogSchema includes publisher information', () => {
    const schema = generateBlogSchema();

    expect(schema.publisher).toHaveProperty('@type', 'Organization');
    expect(schema.publisher).toHaveProperty('name', 'Premium Service Business');
    expect(schema.publisher).toHaveProperty('logo');
  });
});

describe('Insights SEO - Structured Data Generation', () => {
  test('generateStructuredData converts object to JSON string', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article',
    };

    const result = generateStructuredData(data);

    expect(typeof result).toBe('string');
    expect(JSON.parse(result)).toEqual(data);
  });

  test('generateStructuredData handles arrays', () => {
    const data = [
      { '@type': 'Article', headline: 'Article 1' },
      { '@type': 'Article', headline: 'Article 2' },
    ];

    const result = generateStructuredData(data);

    expect(typeof result).toBe('string');
    expect(JSON.parse(result)).toEqual(data);
  });

  test('generateStructuredData produces valid JSON-LD', () => {
    const article: ArticleData = {
      id: '1',
      title: 'Test Article',
      subtitle: 'Test Subtitle',
      abstract: 'Test abstract',
      content: '<p>Test content</p>',
      category: 'Wellness Article',
      author: 'Test Author',
      publishDate: '2025-01-15',
      status: 'published',
      coverImage: 'https://example.com/image.jpg',
      tags: ['test'],
      slug: 'test-article',
    };

    const schema = generateArticleSchema(article);
    const jsonLd = generateStructuredData(schema);

    // Should be valid JSON
    expect(() => JSON.parse(jsonLd)).not.toThrow();

    // Should contain required schema.org properties
    const parsed = JSON.parse(jsonLd);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('Article');
  });
});

describe('Insights SEO - Integration', () => {
  test('Article schema can be embedded in HTML', () => {
    const article: ArticleData = {
      id: '1',
      title: 'Integration Test Article',
      subtitle: 'Testing HTML embedding',
      abstract: 'This tests if the schema can be safely embedded in HTML',
      content: '<p>Content with <strong>HTML</strong> tags</p>',
      category: 'Wellness Article',
      author: 'Test Author',
      publishDate: '2025-01-15',
      status: 'published',
      coverImage: 'https://example.com/image.jpg',
      tags: ['test', 'integration'],
      slug: 'integration-test-article',
    };

    const schema = generateArticleSchema(article);
    const jsonLd = generateStructuredData(schema);

    // Should not contain characters that would break HTML
    expect(jsonLd).not.toContain('</script>');
    expect(jsonLd).not.toContain('<script>');

    // Should be valid JSON that can be parsed
    const parsed = JSON.parse(jsonLd);
    expect(parsed.headline).toBe(article.title);
  });

  test('Multiple schemas can be generated for a page', () => {
    const article: ArticleData = {
      id: '1',
      title: 'Multi-Schema Test',
      subtitle: 'Testing multiple schemas',
      abstract: 'Testing if multiple schemas work together',
      content: '<p>Test content</p>',
      category: 'Research Summary',
      author: 'Test Author',
      publishDate: '2025-01-15',
      status: 'published',
      coverImage: 'https://example.com/image.jpg',
      tags: ['test'],
      slug: 'multi-schema-test',
    };

    const articleSchema = generateArticleSchema(article);
    const breadcrumbSchema = generateArticleBreadcrumb(article.title, article.slug);

    const articleJsonLd = generateStructuredData(articleSchema);
    const breadcrumbJsonLd = generateStructuredData(breadcrumbSchema);

    // Both should be valid JSON
    expect(() => JSON.parse(articleJsonLd)).not.toThrow();
    expect(() => JSON.parse(breadcrumbJsonLd)).not.toThrow();

    // Both should have correct types
    const parsedArticle = JSON.parse(articleJsonLd);
    const parsedBreadcrumb = JSON.parse(breadcrumbJsonLd);

    expect(parsedArticle['@type']).toBe('Article');
    expect(parsedBreadcrumb['@type']).toBe('BreadcrumbList');
  });
});
