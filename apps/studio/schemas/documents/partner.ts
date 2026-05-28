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
      name: 'logo',
      type: 'image',
      description: 'Partner wordmark / logo (shown in the overview header, separate from the hero image).',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string' }),
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
                defineField({
                  name: 'link',
                  type: 'url',
                  description: 'Optional product/spec page. The selling-point title links here.',
                }),
                defineField({
                  name: 'documentation',
                  type: 'object',
                  description: 'Optional document buttons shown on the selling-point card.',
                  fields: [
                    defineField({
                      name: 'specs',
                      type: 'string',
                      title: 'Specs (URL or /assets path)',
                    }),
                    defineField({
                      name: 'manual',
                      type: 'url',
                      title: 'Manual (URL)',
                    }),
                    defineField({
                      name: 'benthicSurvey',
                      type: 'string',
                      title: 'Evaluation / reference (URL or /assets path)',
                    }),
                  ],
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
      name: 'mediaLinks',
      title: 'Media links',
      description: 'External links shown in the "Connect with us" section.',
      type: 'object',
      fields: [
        defineField({ name: 'website', type: 'url' }),
        defineField({ name: 'email', type: 'string', validation: (Rule) => Rule.email() }),
        defineField({ name: 'linkedin', type: 'url' }),
        defineField({ name: 'youtube', type: 'url' }),
        defineField({ name: 'sketchfab', type: 'url' }),
      ],
    }),
    defineField({
      name: 'sketchfabModelId',
      title: 'Sketchfab model ID',
      type: 'string',
      description: 'ID of the Sketchfab model for the interactive 3D section (e.g. "11c4619cc5e44045b1df5fd4abdcb586").',
    }),
    defineField({
      name: 'interactiveCopy',
      title: 'Interactive 3D copy',
      type: 'object',
      description: 'Heading + blurb shown above the 3D model embed.',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'demo',
      title: 'Demo video',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
        defineField({
          name: 'videoUrl',
          type: 'string',
          description: 'Video source — an external URL or a /assets/... path under apps/web/public.',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', type: 'string' })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { media: 'image', title: 'image.alt' },
            prepare: ({ media, title }) => ({ media, title: title || 'Image' }),
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'gallerySketchfab',
          title: 'Sketchfab model',
          fields: [
            defineField({
              name: 'modelId',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'alt', type: 'string', title: 'Label' }),
          ],
          preview: {
            select: { title: 'alt', subtitle: 'modelId' },
            prepare: ({ title, subtitle }) => ({ title: title || '3D model', subtitle }),
          },
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
              type: 'url',
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
