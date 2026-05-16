import { defineType, defineField, defineArrayMember } from 'sanity';

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  description: 'Solution partner pages (Anchorbot, Mission Robotics, Advanced Navigation, etc.).',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'One-line elevator pitch, surfaced on the /solutions index cards.',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'headerImage',
      type: 'image',
      description: 'Hero image for the partner detail page.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'overview',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.max(800),
        }),
      ],
    }),
    defineField({
      name: 'sellingPoints',
      title: 'Selling points',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'points',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'sellingPoint',
              fields: [
                defineField({
                  name: 'title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'description', type: 'text', rows: 3 }),
                defineField({
                  name: 'features',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
                defineField({
                  name: 'icon',
                  type: 'image',
                  options: { hotspot: true },
                }),
              ],
              preview: {
                select: { title: 'title', media: 'icon' },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'useCases',
      title: 'Use cases',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 3 }),
        defineField({
          name: 'cases',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'useCase',
              fields: [
                defineField({
                  name: 'title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'description', type: 'text', rows: 3 }),
                defineField({
                  name: 'keyPoints',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'valueProposition',
      title: 'Value proposition',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 3 }),
        defineField({
          name: 'highlights',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      description: 'Downloadable PDFs / spec sheets shown in the partner sidebar.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnerDocument',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'string',
              description: 'Either a local /assets/... path or an external URL.',
              validation: (Rule) =>
                Rule.uri({ scheme: ['http', 'https'], allowRelative: true }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'externalLinks',
      title: 'External links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'externalLink',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      type: 'seoSettings',
    }),
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
      description: 'Auto-managed by @sanity/orderable-document-list for drag-sort.',
    }),
  ],
  orderings: [
    {
      title: 'Name (A→Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      tagline: 'tagline',
      status: 'status',
      featured: 'featured',
      media: 'headerImage',
    },
    prepare({ title, tagline, status, featured, media }) {
      const star = featured ? '★ ' : '';
      const statusBadge = status && status !== 'active' ? ` [${status}]` : '';
      return {
        title: `${star}${title || 'Untitled partner'}${statusBadge}`,
        subtitle: tagline || '',
        media,
      };
    },
  },
});
