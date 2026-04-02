import { defineType } from 'sanity';

export const businessInfo = defineType({
  name: 'businessInfo',
  title: 'Business Information',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Business Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Business Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of your business',
      validation: Rule => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short, memorable phrase that describes your business',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'zipCode',
          title: 'ZIP/Postal Code',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'United States',
          validation: Rule => Rule.required(),
        },
      ],
    },
    {
      name: 'coordinates',
      title: 'GPS Coordinates',
      type: 'object',
      description: 'Exact location coordinates for maps and local SEO',
      fields: [
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          validation: Rule => Rule.required().min(-90).max(90),
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          validation: Rule => Rule.required().min(-180).max(180),
        },
      ],
    },
    {
      name: 'hours',
      title: 'Business Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  { title: 'Monday', value: 'Monday' },
                  { title: 'Tuesday', value: 'Tuesday' },
                  { title: 'Wednesday', value: 'Wednesday' },
                  { title: 'Thursday', value: 'Thursday' },
                  { title: 'Friday', value: 'Friday' },
                  { title: 'Saturday', value: 'Saturday' },
                  { title: 'Sunday', value: 'Sunday' },
                ],
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'open',
              title: 'Opening Time',
              type: 'string',
              description: 'Format: HH:MM (24-hour format, e.g., 09:00)',
              validation: Rule =>
                Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                  name: 'time',
                  invert: false,
                }).error('Please use HH:MM format (e.g., 09:00)'),
            },
            {
              name: 'close',
              title: 'Closing Time',
              type: 'string',
              description: 'Format: HH:MM (24-hour format, e.g., 17:00)',
              validation: Rule =>
                Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                  name: 'time',
                  invert: false,
                }).error('Please use HH:MM format (e.g., 17:00)'),
            },
            {
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              description: 'Check if closed on this day',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              day: 'day',
              open: 'open',
              close: 'close',
              closed: 'closed',
            },
            prepare({ day, open, close, closed }) {
              return {
                title: day,
                subtitle: closed ? 'Closed' : `${open} - ${close}`,
              };
            },
          },
        },
      ],
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Main website URL',
    },
    {
      name: 'services',
      title: 'Services Offered',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of services offered by the business',
    },
    {
      name: 'businessCategories',
      title: 'Business Categories',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Categories that describe the business (for SEO and structured data)',
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'Price range indicator (e.g., $, $$, $$$, $$$$)',
    },
    {
      name: 'paymentMethods',
      title: 'Payment Methods',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Accepted payment methods',
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Facility amenities and features',
    },
    {
      name: 'foundedYear',
      title: 'Founded Year',
      type: 'number',
      description: 'Year the business was founded',
      validation: Rule => Rule.min(1800).max(2100),
    },
    {
      name: 'employeeCount',
      title: 'Employee Count',
      type: 'string',
      description: 'Number of employees (e.g., "2-10", "11-50")',
    },
    {
      name: 'areaServed',
      title: 'Area Served',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Geographic areas served (for local SEO)',
    },
  ],
  preview: {
    select: {
      name: 'name',
      phone: 'phone',
    },
    prepare({ name, phone }) {
      return {
        title: name,
        subtitle: phone,
      };
    },
  },
});
