import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure } from './lib/structure';

const SINGLETON_TYPES = new Set(['siteSettings']);
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'beringia-studio',
  title: 'Beringia Marine CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

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
