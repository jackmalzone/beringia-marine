import { defineType, defineField, defineArrayMember } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  description: 'People on the Beringia team — used on the About page and as insight authors.',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'e.g. "Principal Consultant".',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Used if individual team/author pages are added later.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string' }),
      ],
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: 'One or two sentences for cards and bylines.',
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'bio',
      title: 'Full bio',
      type: 'array',
      description: 'Longer biography shown on the team / profile section.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
    }),
    defineField({
      name: 'website',
      type: 'url',
    }),
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
      description: 'Auto-managed by @sanity/orderable-document-list for drag-sort.',
    }),
  ],
  orderings: [
    {
      title: 'Name (A→Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
