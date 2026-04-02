import { defineType } from 'sanity';

export const socialMedia = defineType({
  name: 'socialMedia',
  title: 'Social Media Links',
  type: 'object',
  fields: [
    {
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      description: 'Full Instagram profile URL (e.g., https://instagram.com/username)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      description: 'Full Facebook page URL (e.g., https://facebook.com/pagename)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      description: 'Full LinkedIn profile/company URL (e.g., https://linkedin.com/company/name)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'twitter',
      title: 'Twitter/X',
      type: 'url',
      description: 'Full Twitter/X profile URL (e.g., https://twitter.com/username)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
      description: 'Full YouTube channel URL (e.g., https://youtube.com/channel/id)',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
  ],
  preview: {
    select: {
      instagram: 'instagram',
      facebook: 'facebook',
      linkedin: 'linkedin',
    },
    prepare({ instagram, facebook, linkedin }) {
      const platforms = [];
      if (instagram) platforms.push('Instagram');
      if (facebook) platforms.push('Facebook');
      if (linkedin) platforms.push('LinkedIn');

      return {
        title: 'Social Media Links',
        subtitle: platforms.length > 0 ? platforms.join(', ') : 'No links configured',
      };
    },
  },
});
