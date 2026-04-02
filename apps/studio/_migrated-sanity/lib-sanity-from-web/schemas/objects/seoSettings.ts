import { defineType } from 'sanity';

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      description: 'Title that appears in search results and browser tabs',
      validation: Rule =>
        Rule.max(60).warning('Titles over 60 characters may be truncated in search results'),
    },
    {
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Brief description that appears in search results',
      validation: Rule =>
        Rule.max(160).warning(
          'Descriptions over 160 characters may be truncated in search results'
        ),
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords for SEO (optional, modern SEO focuses more on content quality)',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'openGraph',
      title: 'Open Graph (Social Media)',
      type: 'object',
      description: 'How this content appears when shared on social media',
      fields: [
        {
          name: 'title',
          title: 'OG Title',
          type: 'string',
          description: 'Title for social media sharing (falls back to SEO title if empty)',
        },
        {
          name: 'description',
          title: 'OG Description',
          type: 'text',
          rows: 2,
          description:
            'Description for social media sharing (falls back to meta description if empty)',
        },
        {
          name: 'image',
          title: 'OG Image',
          type: 'image',
          description: 'Image for social media sharing (1200x630px recommended)',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'twitter',
      title: 'Twitter Card',
      type: 'object',
      description: 'Twitter-specific social media settings',
      fields: [
        {
          name: 'title',
          title: 'Twitter Title',
          type: 'string',
          description: 'Title for Twitter cards (falls back to OG title if empty)',
        },
        {
          name: 'description',
          title: 'Twitter Description',
          type: 'text',
          rows: 2,
          description: 'Description for Twitter cards (falls back to OG description if empty)',
        },
        {
          name: 'image',
          title: 'Twitter Image',
          type: 'image',
          description: 'Image for Twitter cards (1200x600px recommended)',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description:
        'The preferred URL for this content (optional, used to prevent duplicate content issues)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({ title, description }) {
      return {
        title: title || 'SEO Settings',
        subtitle: description ? `${description.slice(0, 50)}...` : 'No description',
      };
    },
  },
});
