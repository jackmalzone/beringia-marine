import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

const HIDDEN_FROM_DEFAULT_LIST = ['siteSettings', 'insight', 'partner', 'media.tag'];

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings')
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'insight',
        title: 'Insights',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'partner',
        title: 'Partners',
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !HIDDEN_FROM_DEFAULT_LIST.includes(listItem.getId() ?? '')
      ),
    ]);
