import { defineType } from 'sanity';

export const textSection = defineType({
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional section title/heading',
      validation: Rule => Rule.max(100),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Rich text content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: Rule =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional image caption',
            },
          ],
        },
      ],
      validation: Rule => Rule.required(),
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Contained', value: 'contained' },
          { title: 'Narrow', value: 'narrow' },
        ],
      },
      initialValue: 'contained',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Optional background color for this section',
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
      initialValue: 'left',
    },
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare({ title, content }) {
      const block = (content || []).find((item: any) => item._type === 'block');
      const textContent = block?.children?.map((child: any) => child.text).join('') || '';

      return {
        title: `Text: ${title || 'Untitled Section'}`,
        subtitle: textContent ? `${textContent.slice(0, 60)}...` : 'No content',
      };
    },
  },
});
