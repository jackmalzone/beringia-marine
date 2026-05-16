import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'Singleton — there is only ever one siteSettings document.',
  fields: [
    defineField({
      name: 'businessInfo',
      title: 'Business info',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          initialValue: 'Beringia Marine',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'legalName', type: 'string' }),
        defineField({ name: 'tagline', type: 'string' }),
        defineField({
          name: 'email',
          type: 'string',
          validation: (Rule) => Rule.email(),
        }),
        defineField({ name: 'phone', type: 'string' }),
        defineField({
          name: 'address',
          type: 'text',
          rows: 3,
          description: 'Mailing / business address.',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', type: 'url' }),
        defineField({ name: 'github', type: 'url' }),
        defineField({ name: 'twitter', type: 'url' }),
        defineField({ name: 'youtube', type: 'url' }),
      ],
    }),
    defineField({
      name: 'seoDefaults',
      title: 'SEO defaults',
      type: 'seoSettings',
      description: 'Used as fallback for any page or document missing its own SEO.',
    }),
    defineField({
      name: 'analytics',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Format: G-XXXXXXXXXX',
        }),
        defineField({
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Format: GTM-XXXXXXX',
        }),
      ],
    }),
  ],
  preview: {
    select: { name: 'businessInfo.name' },
    prepare({ name }) {
      return {
        title: 'Site settings',
        subtitle: name || 'Beringia Marine',
      };
    },
  },
});
