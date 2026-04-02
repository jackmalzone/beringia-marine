import { defineType } from 'sanity';

export const serviceGrid = defineType({
  name: 'serviceGrid',
  title: 'Service Grid',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Title for the services section',
      validation: Rule => Rule.max(100),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Optional subtitle or description',
      validation: Rule => Rule.max(300),
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Select services to display in this grid',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
        },
      ],
      validation: Rule => Rule.min(1).max(12),
    },
    {
      name: 'layout',
      title: 'Grid Layout',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: 'grid-2' },
          { title: '3 Columns', value: 'grid-3' },
          { title: '4 Columns', value: 'grid-4' },
          { title: 'Auto (Responsive)', value: 'auto' },
        ],
      },
      initialValue: 'auto',
    },
    {
      name: 'showExcerpts',
      title: 'Show Service Excerpts',
      type: 'boolean',
      description: 'Display service descriptions in the grid',
      initialValue: true,
    },
    {
      name: 'showImages',
      title: 'Show Service Images',
      type: 'boolean',
      description: 'Display service hero images in the grid',
      initialValue: true,
    },
    {
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'ctaButton',
      description: 'Optional button below the service grid',
    },
  ],
  preview: {
    select: {
      title: 'title',
      services: 'services',
    },
    prepare({ title, services }) {
      const serviceCount = services ? services.length : 0;

      return {
        title: `Service Grid: ${title || 'Untitled'}`,
        subtitle: `${serviceCount} service${serviceCount !== 1 ? 's' : ''} selected`,
      };
    },
  },
});
