import { defineType } from 'sanity';

export const benefit = defineType({
  name: 'benefit',
  title: 'Benefit',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Benefit Title',
      type: 'string',
      description: 'Short, compelling benefit headline',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Detailed explanation of this benefit',
      validation: Rule => Rule.required().max(300),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji to represent this benefit',
      validation: Rule => Rule.max(50),
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      icon: 'icon',
    },
    prepare({ title, description, icon }) {
      return {
        title: `${icon ? icon + ' ' : ''}${title}`,
        subtitle: description ? `${description.slice(0, 60)}...` : '',
      };
    },
  },
});
