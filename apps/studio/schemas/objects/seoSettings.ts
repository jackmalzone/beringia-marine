import { defineType, defineField } from 'sanity';

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO & sharing',
  type: 'object',
  description:
    'Controls how this page appears in Google search results and when its link is shared on LinkedIn, X, Slack, etc. Every field here is optional — leave blank and the site fills in sensible defaults from the title, excerpt, and cover image.',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Search title override',
      type: 'string',
      description:
        'The clickable blue headline in Google. Defaults to the page/document title — only set this if you want search results to read differently. Keep under ~60 characters or Google truncates it.',
      validation: (Rule) =>
        Rule.max(70).warning('Titles over 70 characters are usually truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Search description override',
      type: 'text',
      rows: 3,
      description:
        'The grey summary text under the title in Google. Defaults to the excerpt — set this only to tailor the search snippet. Aim for ~150 characters; write it to make someone click.',
      validation: (Rule) =>
        Rule.max(180).warning('Descriptions over 180 characters are usually truncated in search results.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'A few topic keywords. Google ignores these today, but some other engines still read them. Optional — tags on the document usually cover this.',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description:
        'The picture that shows when this link is pasted into LinkedIn, X, Slack, iMessage, etc. Defaults to the cover image. For a crisp preview, upload a 1200×630 px image.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Short description of the image for screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide this page from search engines',
      type: 'boolean',
      description:
        'Leave OFF for normal pages. Turn ON only if you want to keep this page out of Google entirely (e.g. a private or duplicate page).',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description:
        'Advanced — almost always leave blank. Only set this if the exact same content also lives at another URL and you want search engines to treat that other URL as the original.',
    }),
  ],
});
