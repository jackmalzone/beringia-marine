require('@swc-node/register');

jest.mock('@portabletext/to-html', () => ({
  toHTML: jest.fn(
    () =>
      '<script>alert(1)</script><p>Safe text</p><a href="javascript:alert(1)" target="_blank">Click</a>'
  ),
}));

const { transformArticle } = require('../articles.ts');

describe('transformArticle sanitization', () => {
  it('removes script tags and unsafe javascript href values', () => {
    const transformed = transformArticle({
      _id: 'test-id',
      title: 'Sanitization Test',
      abstract: 'Abstract',
      content: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'hello' }] }],
      publishDate: '2026-01-01',
      status: 'published',
      slug: 'sanitization-test',
      tags: [],
    });

    expect(transformed.content).toContain('<p>Safe text</p>');
    expect(transformed.content).not.toMatch(/<script/i);
    expect(transformed.content).not.toMatch(/javascript:/i);
    expect(transformed.content).toMatch(/<a[^>]*target="_blank"/i);
    expect(transformed.content).toMatch(/rel="noopener noreferrer"/i);
  });
});
