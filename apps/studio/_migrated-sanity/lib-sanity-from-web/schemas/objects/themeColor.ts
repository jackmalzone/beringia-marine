import { defineType } from 'sanity';

export const themeColor = defineType({
  name: 'themeColor',
  title: 'Theme Color',
  type: 'object',
  fields: [
    {
      name: 'hex',
      title: 'Color',
      type: 'color',
      description: 'Primary theme color for this content',
      validation: Rule => Rule.required(),
    },
    {
      name: 'name',
      title: 'Color Name',
      type: 'string',
      description: 'Optional name for this color (e.g., "Brand Blue", "Accent Red")',
      validation: Rule => Rule.max(50),
    },
  ],
  preview: {
    select: {
      hex: 'hex.hex',
      name: 'name',
    },
    prepare({ hex, name }) {
      return {
        title: name || 'Theme Color',
        subtitle: hex || 'No color selected',
      };
    },
  },
});
