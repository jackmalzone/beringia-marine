import { defineType } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      description: 'The name of this service (e.g., "Red Light Therapy"). This title will be used in the format "{Title} at Vital Ice" in additional content sections. Ensure it matches the service name in the content file.',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this service (e.g., "cold-plunge")',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Brief description or tagline for the service',
      validation: Rule => Rule.required().max(200),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      description: 'Detailed description of the service and its background',
      validation: Rule => Rule.required().max(2000),
    },
    {
      name: 'heroImage',
      title: 'Hero Image (Above the fold)',
      type: 'image',
      description: 'Primary image displayed prominently on service page. Alternatively, use heroImageUrl for external URLs.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.custom((value, context) => {
        const parent = context.parent as { heroImageUrl?: string } | undefined;
        if (!value && !parent?.heroImageUrl) {
          return 'Either Hero Image or Hero Image URL is required';
        }
        return true;
      }),
    },
    {
      name: 'heroImageUrl',
      title: 'Hero Image URL (Alternative)',
      type: 'url',
      description: 'External URL for hero image (e.g., https://media.vitalicesf.com/image.jpg). Used if no image is uploaded.',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'backgroundImage',
      title: 'Background Image (Hero section)',
      type: 'image',
      description: 'Background image for the hero section. Alternatively, use backgroundImageUrl for external URLs.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.custom((value, context) => {
        const parent = context.parent as { backgroundImageUrl?: string } | undefined;
        if (!value && !parent?.backgroundImageUrl) {
          return 'Either Background Image or Background Image URL is required';
        }
        return true;
      }),
    },
    {
      name: 'backgroundImageUrl',
      title: 'Background Image URL (Alternative)',
      type: 'url',
      description: 'External URL for background image (e.g., https://media.vitalicesf.com/image.jpg). Used if no image is uploaded.',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'textureImage',
      title: 'Texture Image (Optional)',
      type: 'image',
      description: 'Optional texture or pattern image for design elements. Alternatively, use textureImageUrl for external URLs.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
    },
    {
      name: 'textureImageUrl',
      title: 'Texture Image URL (Alternative)',
      type: 'url',
      description: 'External URL for texture image (e.g., https://media.vitalicesf.com/image.jpg). Used if no texture image is uploaded.',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'accentColor',
      title: 'Accent Color',
      type: 'color',
      description: 'Primary brand color for this service',
      validation: Rule => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Memorable tagline or motto for this service',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      description: 'Key benefits of this service',
      of: [{ type: 'benefit' }],
      validation: Rule => Rule.min(1).max(8),
    },
    {
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      description: 'Step-by-step process for this service',
      of: [{ type: 'processStep' }],
      validation: Rule => Rule.min(1).max(10),
    },
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      description: 'Call to action section at the bottom of the service page',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          description: 'Headline for the call to action section',
          validation: Rule => Rule.required().max(100),
        },
        {
          name: 'text',
          title: 'CTA Text',
          type: 'text',
          rows: 2,
          description: 'Supporting text for the call to action',
          validation: Rule => Rule.required().max(300),
        },
        {
          name: 'button',
          title: 'CTA Button',
          type: 'ctaButton',
          description: 'Primary action button',
        },
      ],
      validation: Rule => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoSettings',
      description: 'SEO metadata for this service page',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this service appears in listings (lower numbers first)',
      validation: Rule => Rule.integer().min(0),
      initialValue: 0,
    },
    {
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      description: 'Highlight this service in featured sections',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Service Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Maintenance', value: 'maintenance' },
          { title: 'Discontinued', value: 'discontinued' },
        ],
      },
      initialValue: 'active',
    },
    {
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      description: 'Optional pricing details for this service',
      fields: [
        {
          name: 'singleSession',
          title: 'Single Session Price',
          type: 'number',
          description: 'Price for a single session (in dollars)',
        },
        {
          name: 'packageDeals',
          title: 'Package Deals',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'sessions',
                  title: 'Number of Sessions',
                  type: 'number',
                  validation: Rule => Rule.required().integer().min(1),
                },
                {
                  name: 'price',
                  title: 'Package Price',
                  type: 'number',
                  validation: Rule => Rule.required().min(0),
                },
                {
                  name: 'savings',
                  title: 'Savings Amount',
                  type: 'number',
                  description: 'How much customers save with this package',
                },
              ],
            },
          ],
        },
        {
          name: 'membershipDiscount',
          title: 'Membership Discount',
          type: 'number',
          description: 'Percentage discount for members (0-100)',
          validation: Rule => Rule.min(0).max(100),
        },
      ],
    },
    {
      name: 'duration',
      title: 'Session Duration',
      type: 'object',
      description: 'Typical session duration information',
      fields: [
        {
          name: 'typical',
          title: 'Typical Duration (minutes)',
          type: 'number',
          validation: Rule => Rule.integer().min(1),
        },
        {
          name: 'range',
          title: 'Duration Range',
          type: 'string',
          description: 'e.g., "15-30 minutes", "1-3 minutes"',
        },
      ],
    },
    {
      name: 'contraindications',
      title: 'Contraindications & Safety',
      type: 'array',
      description: 'Important safety information and contraindications',
      of: [{ type: 'string' }],
      options: {
        layout: 'list',
      },
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      status: 'status',
      order: 'order',
      heroImage: 'heroImage',
      accentColor: 'accentColor.hex',
    },
    prepare({ title, subtitle, status, order, heroImage, accentColor }) {
      const statusEmoji: Record<string, string> = {
        active: '✅',
        'coming-soon': '🚧',
        maintenance: '⚠️',
        discontinued: '❌',
      };

      return {
        title: `${statusEmoji[status] || '❓'} ${title || 'Untitled Service'}`,
        subtitle: `#${order || 0} • ${subtitle || 'No subtitle'}`,
        media: heroImage,
      };
    },
  },
});
