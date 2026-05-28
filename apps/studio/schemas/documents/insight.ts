import { defineType, defineField, defineArrayMember } from 'sanity';

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  description:
    'A single piece of published content — an article, white paper, case study, field report, or research summary. Each Insight becomes its own page at /insights/<slug> and a card on the Insights index.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Details & metadata' },
    { name: 'seo', title: 'SEO & sharing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description:
        'The headline of the piece. Appears as the page <h1>, on the index card, in the browser tab, and as the default search-result title. Aim for something specific and scannable. Max 160 characters.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description:
        'The last part of the web address: beringia-marine.com/insights/THIS-PART. Click "Generate" to create it from the title. ⚠️ Once the article is published and shared, avoid changing this — old links will break.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      description:
        'The editorial label shown on the index card and the article hero, and used by the category filter on the Insights page. Pick the one that best describes the piece.',
      options: {
        list: [
          { title: 'Article', value: 'Article' },
          { title: 'White Paper', value: 'White Paper' },
          { title: 'Case Study', value: 'Case Study' },
          { title: 'Field Report', value: 'Field Report' },
          { title: 'Research Summary', value: 'Research Summary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      title: 'Content type (layout)',
      type: 'string',
      group: 'content',
      description:
        'Controls how the page is laid out. "Article" = prose-first read. "White Paper" = formal report styling. "Hybrid" = prose plus emphasis on a downloadable report. If unsure, choose Article.',
      options: {
        list: [
          { title: 'Article — prose-first read', value: 'article' },
          { title: 'White Paper — formal report styling', value: 'white-paper' },
          { title: 'Hybrid — prose + downloadable report', value: 'hybrid' },
        ],
        layout: 'radio',
      },
      initialValue: 'article',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / summary',
      type: 'text',
      rows: 4,
      group: 'content',
      description:
        'A one-paragraph summary in plain language. This does triple duty: the blurb on the Insights index card, the lead paragraph in the article hero, AND the description Google shows in search results. Write it for a reader who has not opened the article yet. Max 600 characters.',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'deck',
      title: 'Deck (subhead)',
      type: 'string',
      group: 'content',
      description:
        'An optional single sentence shown directly under the title in the hero — like a magazine subhead that expands on the headline. Leave blank if the title stands on its own. Max 240 characters.',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'author',
      title: 'Author (free text)',
      type: 'string',
      group: 'content',
      description:
        'The byline shown on the article, typed out exactly as you want it to read — e.g. "Chris Malzone, Principal Consultant / Beringia Marine, Inc". Use this OR link a Team member below; the linked Team member wins if both are set.',
    }),
    defineField({
      name: 'authorRef',
      title: 'Author (link a team member)',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'content',
      description:
        'Optional alternative to the free-text byline above. Pick a person from the Team list and the site uses their name, role, and photo. Takes precedence over the free-text Author when both are filled.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      description:
        'The main image for this piece — used on the Insights index card AND as the full-width hero at the top of the article. Landscape orientation works best (roughly 16:9). Required.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description:
            'Describe what the image shows, in a few words, for screen readers and SEO — e.g. "AnchorBot ROV pulling a helical anchor at Sequim Bay". Do not start with "image of".',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      description:
        'The article itself. Type like a document. Use the style dropdown for section headings (H2 for main sections, H3 for sub-sections — H1 is reserved for the title). Highlight text to bold/italic/link it. Click the + button to insert a Figure (image with caption).',
      of: [
        defineArrayMember({
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
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Link address',
                    type: 'url',
                    description:
                      'Where the link goes. Use a full https:// address for external sites, a /path for pages on this site (e.g. /solutions), mailto: for email, or tel: for phone.',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                        allowRelative: true,
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in a new tab',
                    type: 'boolean',
                    description: 'Recommended ON for links to other websites, OFF for links within beringia-marine.com.',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'figure',
          title: 'Figure (image + caption)',
          description: 'An image placed inline within the article body, rendered full-width with an optional caption below.',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                  description: 'Describe what the figure shows, for screen readers and SEO.',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional text shown beneath the image — e.g. "Figure 1: Pull-test results at the Sequim Bay site".',
            }),
          ],
          preview: {
            select: { image: 'image', caption: 'caption' },
            prepare: ({ image, caption }) => ({
              title: caption || 'Figure',
              media: image,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'meta',
      description:
        'Topic keywords shown as pills under the article hero (e.g. "AnchorBot", "Helical anchors", "Sequim"). Type a tag and press Enter. Keep them short and reusable across articles.',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      group: 'meta',
      description: 'Estimated read time shown in the hero meta line, e.g. "10 min read". A rough number is fine (~200 words per minute).',
      validation: (Rule) => Rule.min(1).max(120),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'date',
      group: 'meta',
      description: 'The date shown on the article and used to sort the Insights index (newest first). Use the real publication date.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated date',
      type: 'date',
      group: 'meta',
      description: 'Optional. Set this when you revise an already-published piece so the "modified" date stays accurate for SEO.',
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF download link',
      type: 'url',
      group: 'meta',
      description:
        'Optional. If there is a downloadable PDF version, paste its address here and a "Download full report" button appears on the article. Use a full https:// link (e.g. an R2/S3 URL) or a /assets/... path for a file stored in the site.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: true }),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the Insights page',
      type: 'boolean',
      group: 'meta',
      description: 'Turn ON to highlight this piece prominently at the top of the Insights index. Use sparingly — feature your best/most current work.',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & social sharing',
      type: 'seoSettings',
      group: 'seo',
      description: 'Optional overrides for how this page looks in Google and when shared on social media. Leave blank to use the title, excerpt, and cover image automatically.',
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
      title: 'Published date (newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title (A→Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare({ title, category, publishedAt, featured, media }) {
      const star = featured ? '★ ' : '';
      const subtitle = [category, publishedAt].filter(Boolean).join(' • ');
      return {
        title: `${star}${title || 'Untitled insight'}`,
        subtitle: subtitle || 'No metadata',
        media,
      };
    },
  },
});
