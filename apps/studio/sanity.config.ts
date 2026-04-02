import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { colorInput } from '@sanity/color-input';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'vital-ice-studio',
  title: 'Vital Ice Content Management',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    deskTool({
      structure: (S: any, context: any) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Global Settings')
              .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
            S.divider(),
            // Orderable Articles list
            orderableDocumentListDeskItem({ type: 'article', title: 'Articles', S, context }),
            S.divider(),
            // Other document types
            ...S.documentTypeListItems().filter(
              (listItem: any) => !['globalSettings', 'article'].includes(listItem.getId()!)
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
    // Note: sanity-plugin-seo provides seoMetaFields (field type), not a plugin
    // It's used in schemas, not in plugins array
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      // Custom logo and navbar can be added here later
    },
  },
});
