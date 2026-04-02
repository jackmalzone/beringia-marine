import { defineType } from 'sanity';

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter Signup',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Title for the newsletter section',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Description of what subscribers will receive',
      validation: Rule => Rule.required().max(300),
    },
    {
      name: 'placeholder',
      title: 'Email Placeholder Text',
      type: 'string',
      description: 'Placeholder text for email input field',
      initialValue: 'Enter your email address',
      validation: Rule => Rule.max(50),
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the subscribe button',
      initialValue: 'Subscribe',
      validation: Rule => Rule.required().max(30),
    },
    {
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      description: 'Message shown after successful subscription',
      initialValue: 'Thank you for subscribing!',
      validation: Rule => Rule.max(100),
    },
    {
      name: 'privacyText',
      title: 'Privacy Notice',
      type: 'text',
      rows: 2,
      description: 'Privacy notice or terms text',
      initialValue: 'We respect your privacy and will never share your email address.',
      validation: Rule => Rule.max(200),
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
      description: 'Background color for the newsletter section',
    },
    {
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Inline Form', value: 'inline' },
          { title: 'Stacked Form', value: 'stacked' },
          { title: 'Card Style', value: 'card' },
        ],
      },
      initialValue: 'inline',
    },
    {
      name: 'integrationSettings',
      title: 'Integration Settings',
      type: 'object',
      description: 'Newsletter service integration settings',
      fields: [
        {
          name: 'service',
          title: 'Newsletter Service',
          type: 'string',
          options: {
            list: [
              { title: 'Mailchimp', value: 'mailchimp' },
              { title: 'ConvertKit', value: 'convertkit' },
              { title: 'Custom API', value: 'custom' },
            ],
          },
          initialValue: 'custom',
        },
        {
          name: 'listId',
          title: 'List/Audience ID',
          type: 'string',
          description: 'ID of the mailing list or audience',
        },
        {
          name: 'tags',
          title: 'Subscriber Tags',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Tags to apply to new subscribers',
          options: {
            layout: 'tags',
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({ title, description }) {
      return {
        title: `Newsletter: ${title || 'Untitled'}`,
        subtitle: description ? `${description.slice(0, 60)}...` : 'No description',
      };
    },
  },
});
