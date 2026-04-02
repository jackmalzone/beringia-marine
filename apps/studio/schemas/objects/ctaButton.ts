import { defineType } from 'sanity';

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Call to Action Button',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Button Text',
      type: 'string',
      description: 'Text that appears on the button',
      validation: Rule => Rule.required().max(50),
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'URL or path where the button should link (e.g., /contact, https://example.com)',
      validation: Rule => Rule.required(),
    },
    {
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
        ],
      },
      initialValue: 'primary',
    },
    {
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      description: 'Open the link in a new browser tab',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      text: 'text',
      link: 'link',
      style: 'style',
    },
    prepare({ text, link, style }) {
      return {
        title: text,
        subtitle: `${style} button → ${link}`,
      };
    },
  },
});
