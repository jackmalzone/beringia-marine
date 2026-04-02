import { defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The title of this page',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this page (e.g., "about-us")',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoSettings',
      description: 'SEO metadata for this page',
    },
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      description: 'Flexible content blocks for this page',
      of: [
        { type: 'hero' },
        { type: 'textSection' },
        { type: 'serviceGrid' },
        { type: 'testimonials' },
        { type: 'newsletter' },
      ],
    },
    {
      name: 'status',
      title: 'Page Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this page was first published',
      hidden: ({ document }) => document?.status !== 'published',
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for this page (used in social sharing, etc.)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'excerpt',
      title: 'Page Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief description of this page (used in page listings, search results)',
      validation: Rule => Rule.max(300),
    },
    {
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Include this page in the main navigation menu',
      initialValue: false,
    },
    {
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation menu (lower numbers appear first)',
      hidden: ({ document }) => !document?.showInNavigation,
      validation: Rule => Rule.integer().min(0),
    },
    {
      name: 'serverSideSEO',
      title: 'Server-Side SEO Content',
      type: 'object',
      description: 'H1, H2 headings, internal links, and descriptive content for SEO',
      fields: [
        {
          name: 'h1',
          title: 'H1 Heading',
          type: 'string',
          description: 'Main heading for the page',
        },
        {
          name: 'h2',
          title: 'H2 Headings',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Secondary headings for the page',
        },
        {
          name: 'links',
          title: 'Internal Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'href',
                  title: 'Link URL',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
              ],
            },
          ],
          description: 'Internal links to include on the page for SEO',
        },
        {
          name: 'content',
          title: 'Descriptive Content',
          type: 'text',
          rows: 4,
          description: 'Descriptive text content for SEO purposes',
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Published Date (Newest)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Navigation Order',
      name: 'navigationOrder',
      by: [{ field: 'navigationOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      status: 'status',
      featuredImage: 'featuredImage',
    },
    prepare({ title, slug, status, featuredImage }) {
      const statusEmoji: Record<string, string> = {
        draft: '📝',
        published: '✅',
        archived: '📦',
      };

      return {
        title: `${statusEmoji[status] || '❓'} ${title || 'Untitled Page'}`,
        subtitle: slug ? `/${slug}` : 'No slug set',
        media: featuredImage,
      };
    },
  },
});
