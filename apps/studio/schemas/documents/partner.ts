import { defineType, defineField, defineArrayMember } from 'sanity';

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  description:
    'A solution partner profile (Anchorbot, Mission Robotics, Advanced Navigation, etc.). Each Partner becomes a page at /solutions/<slug> and a card on the Solutions index. Fields are grouped into tabs: Overview, Features, Media, and Settings.',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'features', title: 'Features' },
    { name: 'media', title: 'Media & links' },
    { name: 'settings', title: 'Settings & SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Partner name',
      type: 'string',
      group: 'overview',
      description: 'The company / product name, e.g. "Anchorbot Marine". Shown as the page title and on the Solutions card.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'overview',
      description:
        'The web address segment: beringia-marine.com/solutions/THIS-PART. Click "Generate" from the name. ⚠️ Avoid changing it after the page is live — existing links will break.',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'overview',
      description: 'A one-line elevator pitch shown on the Solutions index card beneath the name. Max 240 characters.',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'overview',
      description:
        'WHERE: a small, uppercase line above the hero headline, over the header image. ROLE: a short positioning phrase that sets up the headline (e.g. "Trusted AI for critical missions"). DIMENSIONS: 2–6 words. TIP: optional — leave blank if it would just repeat the logo/company name. Rendered in caps automatically, so type it in normal case.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      group: 'overview',
      description:
        'WHERE: the large headline (H1) in the hero, over the header image, beneath the logo. ROLE: the single strongest statement of what this partner delivers — their marketing voice, adapted for the Beringia partnership. DIMENSIONS: 4–10 words; one line reads best. TIP: sentence case is fine — it renders in caps. If blank, the hero falls back to the logo (or the partner name) alone.',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 3,
      group: 'overview',
      description:
        'WHERE: the supporting sentence directly under the hero headline. ROLE: one or two sentences expanding on the headline — the "why it matters". DIMENSIONS: 1–2 sentences, max ~280 characters. TIP: this sits above the longer Overview paragraph; keep it punchy and distinct from it.',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'headerImage',
      title: 'Header image',
      type: 'image',
      group: 'overview',
      description: 'The large hero image at the top of the partner page. Landscape works best (roughly 16:9 or 3:2). Without it, the hero/overview section does not render.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe what the image shows, for screen readers and SEO.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'overview',
      description: 'The partner wordmark / logo, shown in the overview header next to the hero. A transparent PNG or SVG looks best.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternative text', type: 'string', description: 'e.g. "Mission Robotics logo".' }),
      ],
    }),
    defineField({
      name: 'logoTreatment',
      title: 'Logo color treatment',
      type: 'string',
      group: 'overview',
      description:
        'The partner page header is dark navy. If the logo is a dark or single-colour mark that does not read well on it (e.g. a blue wordmark), choose "Force white" to render the logo as a clean white version. Leave on "Use uploaded colours" for logos that already look right on a dark background.',
      options: {
        list: [
          { title: 'Use uploaded colours', value: 'default' },
          { title: 'Force white (for dark/coloured logos on the dark header)', value: 'white' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'overview',
      title: 'Overview section',
      type: 'object',
      group: 'overview',
      description: 'The intro block at the top of the page — who this partner is and what they do.',
      fields: [
        defineField({
          name: 'title',
          title: 'Heading',
          type: 'string',
          description: 'Usually the partner name. Shown as the section heading.',
        }),
        defineField({
          name: 'description',
          title: 'Intro paragraph',
          type: 'text',
          rows: 4,
          description: '2–4 sentences introducing the partner. Also used as a fallback for the search/social description. Max 800 characters.',
          validation: (Rule) => Rule.max(800),
        }),
      ],
    }),
    defineField({
      name: 'sellingPoints',
      title: 'Selling points (Core Technology)',
      type: 'object',
      group: 'features',
      description: 'The "Core Technology" cards — the key capabilities or products this partner offers.',
      fields: [
        defineField({
          name: 'title',
          title: 'Section heading',
          type: 'string',
          description: 'Heading above the cards, e.g. "Core Technology".',
        }),
        defineField({
          name: 'points',
          title: 'Cards',
          type: 'array',
          description: 'Add one card per capability/product. Drag to reorder.',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'sellingPoint',
              title: 'Selling point',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Card title',
                  type: 'string',
                  description: 'Name of the capability/product, e.g. "Vehicle OS & Control Software".',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Card description',
                  type: 'text',
                  rows: 3,
                  description: 'A sentence or two explaining this capability.',
                }),
                defineField({
                  name: 'features',
                  title: 'Feature bullets',
                  type: 'array',
                  of: [{ type: 'string' }],
                  description: 'A bullet list of specifics shown when the card expands. Type a line and press Enter.',
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'image',
                  description: 'Optional small icon for the card. A simple square PNG/SVG works best.',
                  options: { hotspot: true },
                }),
                defineField({
                  name: 'link',
                  title: 'Title link',
                  type: 'url',
                  description: 'Optional. If set, the card title becomes a clickable link to this product/spec page.',
                }),
                defineField({
                  name: 'documentation',
                  title: 'Document buttons',
                  type: 'object',
                  description: 'Optional buttons on the card linking to docs. Fill only the ones that exist; blanks are hidden.',
                  fields: [
                    defineField({
                      name: 'specs',
                      title: 'Specs',
                      type: 'string',
                      description: 'Link to a spec sheet — a full https:// URL or a /assets/... path. Shows a "Specs" button.',
                    }),
                    defineField({
                      name: 'manual',
                      title: 'Manual',
                      type: 'url',
                      description: 'Link to a manual / docs page. Shows a "Manual" link.',
                    }),
                    defineField({
                      name: 'benthicSurvey',
                      title: 'Evaluation / reference',
                      type: 'string',
                      description: 'Link to an evaluation or reference doc — URL or /assets/... path. Shows an "Evaluation" button.',
                    }),
                  ],
                }),
              ],
              preview: {
                select: { title: 'title', media: 'icon' },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'useCases',
      title: 'Use cases (Applications)',
      type: 'object',
      group: 'features',
      description: 'The industries / scenarios where this partner is applied.',
      fields: [
        defineField({ name: 'title', title: 'Section heading', type: 'string', description: 'e.g. "Applications".' }),
        defineField({ name: 'description', title: 'Section intro', type: 'text', rows: 3, description: 'Optional sentence introducing the use cases.' }),
        defineField({
          name: 'cases',
          title: 'Use-case cards',
          type: 'array',
          description: 'One card per application. Drag to reorder.',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'useCase',
              title: 'Use case',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description: 'Name of the application, e.g. "Aquaculture".',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, description: 'A sentence or two about this application.' }),
                defineField({
                  name: 'keyPoints',
                  title: 'Key points',
                  type: 'array',
                  of: [{ type: 'string' }],
                  description: 'Bullet highlights for this use case. Type a line and press Enter.',
                }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'valueProposition',
      title: 'Value proposition (Why choose…)',
      type: 'object',
      group: 'features',
      description: 'The "Why choose this partner" section — the headline benefits.',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', description: 'e.g. "Why Choose Anchorbot Marine".' }),
        defineField({ name: 'description', title: 'Intro', type: 'text', rows: 3, description: 'Optional sentence introducing the highlights.' }),
        defineField({
          name: 'highlights',
          title: 'Highlight bullets',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Short, punchy benefits — e.g. "Cost-effective", "Reduced environmental impact". Type a line and press Enter.',
        }),
      ],
    }),
    defineField({
      name: 'mediaLinks',
      title: 'Connect-with-us links',
      type: 'object',
      group: 'media',
      description: 'External links shown as buttons in the "Connect with us" section. Fill what exists; blanks are skipped.',
      fields: [
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        defineField({ name: 'email', title: 'Email', type: 'string', description: 'A contact email — shows an "Email" button.', validation: (Rule) => Rule.email() }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
        defineField({ name: 'sketchfab', title: 'Sketchfab', type: 'url' }),
      ],
    }),
    defineField({
      name: 'sketchfabModelId',
      title: 'Sketchfab 3D model ID',
      type: 'string',
      group: 'media',
      description:
        'Only for partners with a public 3D model. Paste just the model ID from the Sketchfab URL (the string after the last slash, e.g. "11c4619cc5e44045b1df5fd4abdcb586") — not the whole URL. This powers the interactive 3D section.',
    }),
    defineField({
      name: 'interactiveCopy',
      title: '3D section heading + blurb',
      type: 'object',
      group: 'media',
      description: 'The heading and short text shown above the interactive 3D model. Only relevant when a Sketchfab model ID is set.',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string' }),
        defineField({ name: 'description', title: 'Blurb', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'demo',
      title: 'Demo video',
      type: 'object',
      group: 'media',
      description: 'An optional video section with a player. Leave blank if there is no demo video.',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', description: 'e.g. "How Anchorbot Works".' }),
        defineField({ name: 'description', title: 'Blurb', type: 'text', rows: 2, description: 'A sentence describing the video.' }),
        defineField({
          name: 'videoUrl',
          title: 'Video link',
          type: 'string',
          description: 'The video file address — a full https:// URL or a /assets/... path to a file stored in the site.',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      description:
        'A grid of images (and optionally 3D models) shown lower on the page. Click "Add item" → choose Image (upload + alt text) or Sketchfab model (paste a model ID). Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryImage',
          title: 'Image',
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
                  description: 'Describe the image — also used as the caption under the thumbnail.',
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { media: 'image', title: 'image.alt' },
            prepare: ({ media, title }) => ({ media, title: title || 'Image' }),
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'gallerySketchfab',
          title: 'Sketchfab model',
          fields: [
            defineField({
              name: 'modelId',
              title: 'Sketchfab model ID',
              type: 'string',
              description: 'Just the model ID, not the full URL.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'alt', title: 'Label', type: 'string', description: 'Short caption shown under the model.' }),
          ],
          preview: {
            select: { title: 'alt', subtitle: 'modelId' },
            prepare: ({ title, subtitle }) => ({ title: title || '3D model', subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      group: 'media',
      description: 'Downloadable PDFs / spec sheets listed in the partner sidebar. Add one row per document.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnerDocument',
          title: 'Document',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The text shown for the download link, e.g. "Datasheet (PDF)".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'File link',
              type: 'url',
              description: 'A full https:// URL or a /assets/... path to the file.',
              validation: (Rule) =>
                Rule.uri({ scheme: ['http', 'https'], allowRelative: true }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'externalLinks',
      title: 'Other external links',
      type: 'array',
      group: 'media',
      description: 'Any additional outbound links beyond the Connect-with-us set. Optional.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'externalLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The clickable text.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Address',
              type: 'url',
              description: 'A full https:// URL.',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'settings',
      description:
        'Controls visibility. "Active" = live on the Solutions page. "Draft" = work in progress, hidden from the index. "Archived" = retired, hidden from the index.',
      options: {
        list: [
          { title: 'Active — live on the site', value: 'active' },
          { title: 'Draft — hidden, work in progress', value: 'draft' },
          { title: 'Archived — hidden, retired', value: 'archived' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'settings',
      description: 'Turn ON to highlight this partner prominently. Use sparingly.',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & social sharing',
      type: 'seoSettings',
      group: 'settings',
      description: 'Optional overrides for how this page looks in Google and when shared. Leave blank to use the name, tagline, and header image automatically.',
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
    select: {
      title: 'name',
      tagline: 'tagline',
      status: 'status',
      featured: 'featured',
      media: 'headerImage',
    },
    prepare({ title, tagline, status, featured, media }) {
      const star = featured ? '★ ' : '';
      const statusBadge = status && status !== 'active' ? ` [${status}]` : '';
      return {
        title: `${star}${title || 'Untitled partner'}${statusBadge}`,
        subtitle: tagline || '',
        media,
      };
    },
  },
});
