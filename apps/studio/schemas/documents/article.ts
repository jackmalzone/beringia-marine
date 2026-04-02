import { defineType, defineField, defineArrayMember } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  description: 'Blog posts and insights articles for the Vital Ice website',
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      description: 'The main headline of the article',
      validation: Rule => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this article (e.g., "red-light-therapy-benefits")',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Brief subtitle or tagline that appears below the title',
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract / Summary',
      type: 'text',
      rows: 4,
      description: 'Short summary of the article (used in listings and meta descriptions)',
      validation: Rule => Rule.max(500),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main image displayed in article listings and social sharing',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Optional hero image displayed at the top of the article (if different from cover)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'heroImageSplit',
      title: 'Split Hero Images',
      type: 'object',
      description: 'Optional split hero layout (left and right images)',
      fields: [
        defineField({
          name: 'left',
          title: 'Left Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        }),
        defineField({
          name: 'right',
          title: 'Right Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'array',
      description: 'Main article content with rich text formatting, headings, images, and more',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
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
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    validation: Rule =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                        allowRelative: true,
                      }),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image',
            }),
          ],
        }),
        defineArrayMember({
          type: 'tableBlock',
          title: 'Table',
        }),
        defineArrayMember({
          type: 'object',
          name: 'figure',
          title: 'Figure with Caption',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Caption displayed below the image',
            }),
          ],
          preview: {
            select: {
              image: 'image',
              caption: 'caption',
            },
            prepare({ image, caption }) {
              return {
                title: caption || 'Figure',
                media: image,
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Article category for organization and filtering',
      options: {
        list: [
          { title: 'Wellness Article', value: 'Wellness Article' },
          { title: 'Recovery Guide', value: 'Recovery Guide' },
          { title: 'Research Summary', value: 'Research Summary' },
          { title: 'Community Story', value: 'Community Story' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      description: 'Article author information',
      fields: [
        defineField({
          name: 'name',
          title: 'Author Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'role',
          title: 'Role/Title',
          type: 'string',
          description: 'Author role or professional title',
        }),
        defineField({
          name: 'bio',
          title: 'Bio',
          type: 'text',
          rows: 3,
          description: 'Brief author biography',
        }),
        defineField({
          name: 'avatar',
          title: 'Avatar',
          type: 'image',
          description: 'Author profile picture',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'social',
          title: 'Social Media',
          type: 'object',
          fields: [
            defineField({
              name: 'twitter',
              title: 'Twitter',
              type: 'url',
            }),
            defineField({
              name: 'linkedin',
              title: 'LinkedIn',
              type: 'url',
            }),
            defineField({
              name: 'website',
              title: 'Website',
              type: 'url',
            }),
          ],
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for categorization and search',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Publication status of the article',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      description: 'Date when the article was or will be published',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishAt',
      title: 'Scheduled Publish Time',
      type: 'datetime',
      description: 'Exact date and time for scheduled publication (optional)',
      hidden: ({ document }) => document?.status !== 'scheduled',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes (auto-calculated if not set)',
      validation: Rule => Rule.min(1).max(60),
    }),
    // SEO Settings - using custom seoSettings schema
    // Note: sanity-plugin-seo is installed but we're using custom schema for now
    // Can migrate to plugin's seoMetaFields later if needed
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoSettings', // Custom schema (working)
      description: 'SEO metadata for this article',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Feature this article prominently on the insights page',
      initialValue: false,
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF Download URL',
      type: 'url',
      description: 'Optional PDF version of the article for download',
    }),
    // OrderRank field required by @sanity/orderable-document-list
    defineField({
      name: 'orderRank',
      type: 'string',
      title: 'Order Rank',
      description: 'Used for drag-and-drop ordering (auto-managed)',
      hidden: true, // Hide from editors - managed automatically
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      category: 'category',
      status: 'status',
      coverImage: 'coverImage',
      publishDate: 'publishDate',
    },
    prepare({ title, subtitle, category, status, coverImage, publishDate }) {
      const statusEmoji: Record<string, string> = {
        draft: '📝',
        published: '✅',
        scheduled: '⏰',
        archived: '📦',
      };
      return {
        title: title || 'Untitled Article',
        subtitle: `${statusEmoji[status as string] || ''} ${category || ''} • ${publishDate || 'No date'}`,
        media: coverImage,
      };
    },
  },
  orderings: [
    {
      title: 'Publish Date (Newest)',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Publish Date (Oldest)',
      name: 'publishDateAsc',
      by: [{ field: 'publishDate', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});

