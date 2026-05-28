import { defineType, defineField, defineArrayMember } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  description:
    'A person on the Beringia team. Used on the About page and selectable as the author of an Insight (via the "Author (link a team member)" field).',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      description: 'The person’s full name as it should appear publicly.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'Job title shown under the name, e.g. "Principal Consultant".',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Auto-generate from the name. Reserved for future individual profile pages — set it now so links are ready later.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'A headshot. Square or portrait orientation works best for team cards.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the photo, e.g. "Chris Malzone, Principal Consultant".',
        }),
      ],
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: 'One or two sentences used on team cards and as an author byline. Max 400 characters.',
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'bio',
      title: 'Full bio',
      type: 'array',
      description: 'The longer biography for the team / profile section. Supports paragraphs, bold/italic, and links.',
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
      title: 'Email',
      type: 'string',
      description: 'Optional public contact email.',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      description: 'Optional LinkedIn profile URL.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Optional personal or company website.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order rank',
      type: 'string',
      hidden: true,
      description: 'Auto-managed by the drag-to-reorder feature. You never edit this directly.',
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
