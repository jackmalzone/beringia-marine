import { defineType, defineField, defineArrayMember } from 'sanity';

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  description: 'Articles, white papers, case studies, and field reports.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Editorial category surfaced in listings and on the article hero.',
      options: {
        list: [
          { title: 'Article', value: 'Article' },
          { title: 'White Paper', value: 'White Paper' },
          { title: 'Case Study', value: 'Case Study' },
          { title: 'Field Report', value: 'Field Report' },
          { title: 'Research Summary', value: 'Research Summary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      title: 'Content type',
      type: 'string',
      description: 'How the content renders: full prose article, formal white paper, or hybrid (prose + downloadable report).',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'White Paper', value: 'white-paper' },
          { title: 'Hybrid', value: 'hybrid' },
        ],
        layout: 'radio',
      },
      initialValue: 'article',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 4,
      description: 'One-paragraph summary used in listings and meta descriptions.',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'deck',
      type: 'string',
      description: 'Subhead / dek shown beneath the title in the article hero.',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'author',
      type: 'string',
      description: 'Free-text author line (e.g. "Chris Malzone, Principal Consultant / Beringia Marine, Inc").',
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'Article content. Use H2/H3 for section headings; insert figures and tables inline.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'string',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                        allowRelative: true,
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'figure',
          title: 'Figure',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              description: 'Shown beneath the image, e.g. "Figure 1: …".',
            }),
          ],
          preview: {
            select: { image: 'image', caption: 'caption' },
            prepare: ({ image, caption }) => ({
              title: caption || 'Figure',
              media: image,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(120),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF download URL',
      type: 'url',
      description: 'Optional. Either a local /assets/... path or an external R2/S3 URL.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: true }),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Surface prominently on the /insights index.',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      type: 'seoSettings',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order rank',
      type: 'string',
      hidden: true,
      description: 'Auto-managed by @sanity/orderable-document-list for drag-sort.',
    }),
  ],
  orderings: [
    {
      title: 'Published date (newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title (A→Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare({ title, category, publishedAt, featured, media }) {
      const star = featured ? '★ ' : '';
      const subtitle = [category, publishedAt].filter(Boolean).join(' • ');
      return {
        title: `${star}${title || 'Untitled insight'}`,
        subtitle: subtitle || 'No metadata',
        media,
      };
    },
  },
});
