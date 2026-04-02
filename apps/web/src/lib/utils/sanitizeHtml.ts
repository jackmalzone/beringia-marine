import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS: string[] = [
  'p',
  'br',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'blockquote',
  'code',
  'pre',
  'a',
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'title', 'rel', 'target'],
};

const ALLOWED_SCHEMES: string[] = ['http', 'https', 'mailto', 'tel'];

/**
 * Sanitize CMS-provided HTML with a strict allowlist policy.
 */
export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowProtocolRelative: false,
    // Strip unknown tags instead of escaping so output remains clean semantic HTML.
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target === '_blank' ? '_blank' : undefined;
        const relParts = new Set(
          String(attribs.rel || '')
            .split(/\s+/)
            .map((value) => value.trim())
            .filter(Boolean)
        );

        if (target === '_blank') {
          relParts.add('noopener');
          relParts.add('noreferrer');
        }

        const href = typeof attribs.href === 'string' ? attribs.href : undefined;
        const nextAttribs: Record<string, string> = {};
        if (href) nextAttribs.href = href;
        if (attribs.title) nextAttribs.title = attribs.title;
        if (target) nextAttribs.target = target;
        if (relParts.size) nextAttribs.rel = Array.from(relParts).join(' ');

        return {
          tagName,
          attribs: nextAttribs,
        };
      },
    },
  });
}
