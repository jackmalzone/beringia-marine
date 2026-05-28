import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure } from './lib/structure';

const SINGLETON_TYPES = new Set(['siteSettings']);
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

/**
 * Normalize env values: NEXT_PUBLIC_* vars are inlined at build time, and
 * dashboard-pasted values often pick up surrounding quotes or whitespace —
 * which fail Sanity's `projectId` validation. Strip both defensively.
 */
const readEnv = (value: string | undefined): string =>
  (value ?? '').trim().replace(/^['"]+|['"]+$/g, '');

const projectId = readEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const dataset = readEnv(process.env.NEXT_PUBLIC_SANITY_DATASET);

export default defineConfig({
  name: 'beringia-studio',
  title: 'Beringia Marine CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2025-02-19' }),
  ],

  schema: {
    types: schemaTypes,
    // Hide singleton document types from the global "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // Singletons can only be edited (publish / discard / restore), not duplicated or deleted.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
});
