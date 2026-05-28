import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description:
    'Site-wide settings used across every page. There is only ever ONE of these — you edit it, you never create or delete it. Fields here act as fallbacks and global values (business info, social links, default SEO, analytics).',
  groups: [
    { name: 'business', title: 'Business info', default: true },
    { name: 'social', title: 'Social links' },
    { name: 'seo', title: 'SEO defaults' },
    { name: 'analytics', title: 'Analytics' },
  ],
  fields: [
    defineField({
      name: 'businessInfo',
      title: 'Business info',
      type: 'object',
      group: 'business',
      description: 'Core identity and contact details, used in the footer, contact page, and search structured data.',
      fields: [
        defineField({
          name: 'name',
          title: 'Display name',
          type: 'string',
          initialValue: 'Beringia Marine',
          description: 'The brand name shown around the site, e.g. "Beringia Marine".',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'legalName',
          title: 'Legal name',
          type: 'string',
          description: 'The full legal entity name for the footer copyright, e.g. "Beringia Marine, Inc.".',
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          description: 'A short positioning line used in default SEO descriptions.',
        }),
        defineField({
          name: 'email',
          title: 'Contact email',
          type: 'string',
          description: 'The primary contact address shown on the site and in structured data.',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Optional contact phone number.',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
          description: 'Mailing / business address, shown in the footer and structured data.',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      group: 'social',
      description: 'Full profile URLs. Leave any blank that you do not have — empty ones are skipped on the site.',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
      ],
    }),
    defineField({
      name: 'seoDefaults',
      title: 'Default SEO & sharing',
      type: 'seoSettings',
      group: 'seo',
      description:
        'The fallback search/social settings used by any page that does not set its own. Individual Insights and Partners almost always override these, so this is mainly for the home and other top-level pages.',
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics IDs',
      type: 'object',
      group: 'analytics',
      description: 'Optional tracking IDs. If left blank, the site falls back to environment-variable values.',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Format: G-XXXXXXXXXX. Leave blank if not using GA.',
        }),
        defineField({
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Format: GTM-XXXXXXX. Leave blank if not using GTM.',
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
