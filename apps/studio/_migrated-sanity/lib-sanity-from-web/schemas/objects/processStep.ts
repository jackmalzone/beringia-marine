import { defineType } from 'sanity';

export const processStep = defineType({
  name: 'processStep',
  title: 'Process Step',
  type: 'object',
  fields: [
    {
      name: 'step',
      title: 'Step Number',
      type: 'string',
      description: 'Step identifier (e.g., "01", "Step 1", etc.)',
      validation: Rule => Rule.required().max(10),
    },
    {
      name: 'title',
      title: 'Step Title',
      type: 'string',
      description: 'Clear, action-oriented step title',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Detailed explanation of what happens in this step',
      validation: Rule => Rule.required().max(400),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji to represent this step',
      validation: Rule => Rule.max(50),
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'How long this step takes (optional)',
      validation: Rule => Rule.max(50),
    },
  ],
  preview: {
    select: {
      step: 'step',
      title: 'title',
      duration: 'duration',
      icon: 'icon',
    },
    prepare({ step, title, duration, icon }) {
      return {
        title: `${step}. ${icon ? icon + ' ' : ''}${title}`,
        subtitle: duration ? `Duration: ${duration}` : '',
      };
    },
  },
});
