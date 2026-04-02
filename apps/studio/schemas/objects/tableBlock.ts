import { defineType, defineField, defineArrayMember } from 'sanity';
import { ThListIcon } from '@sanity/icons';

/**
 * Table block for article/blog content.
 * Rows are arrays of cells (plain text). First row is rendered as header by default.
 */
export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  description: 'Add a table to display structured data. First row is used as the header.',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'Each row contains cells. The first row will be styled as the table header.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'row',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: { cells?: string[] }) {
              const text = Array.isArray(cells) ? cells.join(' | ') : 'Empty row';
              return {
                title: text.length > 50 ? `${text.slice(0, 50)}…` : text || 'Empty row',
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'caption',
      title: 'Table Caption',
      type: 'string',
      description: 'Optional caption below the table (good for accessibility and SEO)',
    }),
    defineField({
      name: 'useFirstRowAsHeader',
      title: 'Use first row as header',
      type: 'boolean',
      description: 'Style the first row as a header row (recommended for most tables)',
      initialValue: true,
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare({ rows }: { rows?: Array<{ cells?: string[] }> }) {
      const rowCount = Array.isArray(rows) ? rows.length : 0;
      const firstRow = Array.isArray(rows) && rows[0]?.cells ? rows[0].cells.join(', ') : '';
      return {
        title: 'Table',
        subtitle: rowCount > 0 ? `${rowCount} row(s) — ${firstRow.slice(0, 40)}${firstRow.length > 40 ? '…' : ''}` : 'Add rows',
      };
    },
  },
});
