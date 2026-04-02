import { defineType } from 'sanity';

export const testimonials = defineType({
  name: 'testimonials',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Title for the testimonials section',
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
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Customer testimonials and reviews',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Customer Name',
              type: 'string',
              validation: Rule => Rule.required().max(100),
            },
            {
              name: 'title',
              title: 'Customer Title/Company',
              type: 'string',
              description: 'Job title, company, or other identifier',
              validation: Rule => Rule.max(100),
            },
            {
              name: 'text',
              title: 'Testimonial Text',
              type: 'text',
              rows: 4,
              description: 'The testimonial content',
              validation: Rule => Rule.required().max(500),
            },
            {
              name: 'rating',
              title: 'Rating',
              type: 'number',
              description: 'Star rating (1-5)',
              validation: Rule => Rule.min(1).max(5).integer(),
            },
            {
              name: 'image',
              title: 'Customer Photo',
              type: 'image',
              description: 'Optional customer photo',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'featured',
              title: 'Featured Testimonial',
              type: 'boolean',
              description: 'Highlight this testimonial',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              name: 'name',
              text: 'text',
              rating: 'rating',
              image: 'image',
            },
            prepare({ name, text, rating, image }) {
              const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';

              return {
                title: name || 'Anonymous',
                subtitle: `${stars} ${text ? text.slice(0, 50) + '...' : ''}`,
                media: image,
              };
            },
          },
        },
      ],
      validation: Rule => Rule.min(1).max(20),
    },
    {
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel/Slider', value: 'carousel' },
          { title: 'Masonry', value: 'masonry' },
        ],
      },
      initialValue: 'grid',
    },
    {
      name: 'showRatings',
      title: 'Show Star Ratings',
      type: 'boolean',
      description: 'Display star ratings with testimonials',
      initialValue: true,
    },
    {
      name: 'showPhotos',
      title: 'Show Customer Photos',
      type: 'boolean',
      description: 'Display customer photos with testimonials',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      testimonials: 'testimonials',
    },
    prepare({ title, testimonials }) {
      const count = testimonials ? testimonials.length : 0;

      return {
        title: `Testimonials: ${title || 'Untitled'}`,
        subtitle: `${count} testimonial${count !== 1 ? 's' : ''}`,
      };
    },
  },
});
