import { defineType } from 'sanity';

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main headline text',
      validation: Rule => Rule.required().max(120),
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the headline',
      validation: Rule => Rule.max(300),
    },
    {
      name: 'backgroundVideo',
      title: 'Background Video URL',
      type: 'url',
      description: 'URL to background video (optional)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Background image (used if no video or as fallback)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'ctaButton',
      description: 'Primary action button',
    },
    {
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'ctaButton',
      description: 'Optional secondary action button',
    },
    {
      name: 'textAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'center',
    },
    {
      name: 'overlay',
      title: 'Background Overlay',
      type: 'object',
      description: 'Overlay settings for better text readability',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Overlay',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'opacity',
          title: 'Overlay Opacity',
          type: 'number',
          description: 'Overlay opacity (0-1)',
          validation: Rule => Rule.min(0).max(1),
          initialValue: 0.4,
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'color',
          title: 'Overlay Color',
          type: 'color',
          initialValue: { hex: '#000000' },
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
    },
  ],
  preview: {
    select: {
      headline: 'headline',
      subheadline: 'subheadline',
      backgroundImage: 'backgroundImage',
    },
    prepare({ headline, subheadline, backgroundImage }) {
      return {
        title: `Hero: ${headline || 'Untitled'}`,
        subtitle: subheadline ? `${subheadline.slice(0, 60)}...` : 'No subheadline',
        media: backgroundImage,
      };
    },
  },
});
