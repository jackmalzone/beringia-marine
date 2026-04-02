import { defineType } from 'sanity';

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    {
      name: 'businessInfo',
      title: 'Business Information',
      type: 'businessInfo',
      description: 'Core business details used throughout the website',
      validation: Rule => Rule.required(),
    },
    {
      name: 'seoDefaults',
      title: 'Default SEO Settings',
      type: 'seoSettings',
      description: 'Default SEO settings that apply to all pages (can be overridden per page)',
    },
    {
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'socialMedia',
      description: 'Social media profiles and links',
    },
    {
      name: 'contactSettings',
      title: 'Contact Settings',
      type: 'object',
      description: 'Contact form and communication preferences',
      fields: [
        {
          name: 'contactEmail',
          title: 'Contact Form Email',
          type: 'string',
          description: 'Email address where contact form submissions are sent',
          validation: Rule => Rule.email(),
        },
        {
          name: 'autoReplyEnabled',
          title: 'Enable Auto-Reply',
          type: 'boolean',
          description: 'Send automatic confirmation emails to form submitters',
          initialValue: true,
        },
        {
          name: 'autoReplyMessage',
          title: 'Auto-Reply Message',
          type: 'text',
          rows: 4,
          description: 'Message sent in auto-reply emails',
          hidden: ({ parent }) => !parent?.autoReplyEnabled,
        },
      ],
    },
    {
      name: 'analyticsSettings',
      title: 'Analytics & Tracking',
      type: 'object',
      description: 'Analytics and tracking configuration',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Google Analytics measurement ID (e.g., G-XXXXXXXXXX)',
          validation: Rule =>
            Rule.regex(/^G-[A-Z0-9]+$/, {
              name: 'Google Analytics ID',
              invert: false,
            }).warning('Should be in format G-XXXXXXXXXX'),
        },
        {
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Google Tag Manager container ID (e.g., GTM-XXXXXXX)',
          validation: Rule =>
            Rule.regex(/^GTM-[A-Z0-9]+$/, {
              name: 'Google Tag Manager ID',
              invert: false,
            }).warning('Should be in format GTM-XXXXXXX'),
        },
        {
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string',
          description: 'Facebook Pixel ID for conversion tracking',
        },
      ],
    },
    {
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'object',
      description: 'Site maintenance and status settings',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Maintenance Mode',
          type: 'boolean',
          description: 'Show maintenance page to visitors',
          initialValue: false,
        },
        {
          name: 'message',
          title: 'Maintenance Message',
          type: 'text',
          rows: 3,
          description: 'Message to display during maintenance',
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'estimatedCompletion',
          title: 'Estimated Completion',
          type: 'datetime',
          description: 'When maintenance is expected to be complete',
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
    },
  ],
  preview: {
    select: {
      businessName: 'businessInfo.name',
      phone: 'businessInfo.phone',
    },
    prepare({ businessName, phone }) {
      return {
        title: 'Global Settings',
        subtitle: businessName ? `${businessName} • ${phone}` : 'Configure site-wide settings',
      };
    },
  },
});
