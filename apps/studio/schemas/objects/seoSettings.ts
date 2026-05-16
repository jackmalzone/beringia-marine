import { defineType, defineField } from 'sanity';

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Used in the <title> tag and search results. Falls back to the document title if blank.',
      validation: (Rule) =>
        Rule.max(70).warning('Titles over 70 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(180).warning('Descriptions over 180 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Used for Open Graph and Twitter cards. 1200×630 recommended.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override the canonical URL (only set if this content is a duplicate of another).',
    }),
  ],
});
