/**
 * Convert insight body HTML into Sanity Portable Text blocks.
 *
 * Handles:
 *   - <h2>, <h3>, <h4>, <p>, <blockquote>
 *   - <ul>/<ol> with <li>
 *   - inline <strong>/<em>/<code> decorators
 *   - <a href="..."> link annotations
 *   - <div class="article__figure"> containing <img> + <p.article__figure-caption> →
 *     custom `figure` Portable Text block (image asset is uploaded ahead of time
 *     and referenced by the resolved asset _id).
 */
import { randomUUID } from 'node:crypto';
import { JSDOM } from 'jsdom';

import { uploadImageAsset, imageRef } from './assets';

const STYLE_MAP: Record<string, string> = {
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  P: 'normal',
  BLOCKQUOTE: 'blockquote',
};

const DECORATOR_MAP: Record<string, string> = {
  STRONG: 'strong',
  B: 'strong',
  EM: 'em',
  I: 'em',
  CODE: 'code',
  U: 'underline',
};

type MarkDef = { _key: string; _type: 'link'; href: string; openInNewTab?: boolean };

interface BlockBuilder {
  _type: 'block';
  _key: string;
  style: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children: Array<{ _key: string; _type: 'span'; text: string; marks: string[] }>;
  markDefs: MarkDef[];
}

function emptyBlock(style: string, listItem?: 'bullet' | 'number'): BlockBuilder {
  return {
    _type: 'block',
    _key: randomUUID(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [],
    markDefs: [],
  };
}

function flushChildren(block: BlockBuilder, text: string, marks: string[]): void {
  if (!text) return;
  block.children.push({ _key: randomUUID(), _type: 'span', text, marks });
}

function walkInline(node: ChildNode, block: BlockBuilder, marks: string[]): void {
  if (node.nodeType === 3 /* TEXT_NODE */) {
    flushChildren(block, node.textContent || '', marks);
    return;
  }
  if (node.nodeType !== 1 /* ELEMENT_NODE */) return;

  const el = node as Element;
  const tag = el.tagName;

  if (tag === 'BR') {
    flushChildren(block, '\n', marks);
    return;
  }

  if (tag === 'A') {
    const href = el.getAttribute('href') || '';
    const target = el.getAttribute('target');
    const markDef: MarkDef = {
      _key: randomUUID(),
      _type: 'link',
      href,
      ...(target === '_blank' ? { openInNewTab: true } : {}),
    };
    block.markDefs.push(markDef);
    const nextMarks = [...marks, markDef._key];
    el.childNodes.forEach((child) => walkInline(child, block, nextMarks));
    return;
  }

  const decorator = DECORATOR_MAP[tag];
  const nextMarks = decorator ? [...marks, decorator] : marks;
  el.childNodes.forEach((child) => walkInline(child, block, nextMarks));
}

async function buildFigureBlock(div: Element): Promise<BlockBuilder | null> {
  const img = div.querySelector('img');
  if (!img) return null;
  const src = img.getAttribute('src');
  const alt = img.getAttribute('alt') || '';
  if (!src) return null;

  const asset = await uploadImageAsset(src);
  if (!asset) {
    console.warn(`[html-to-pt] skipped figure (could not upload ${src})`);
    return null;
  }

  const captionEl = div.querySelector('.article__figure-caption');
  const captionRaw = captionEl?.textContent?.trim() || '';
  // Strip a leading "Figure N:" since the editor can re-add it if desired, but
  // many of the legacy captions hard-code numbering that won't survive reorders.
  const caption = captionRaw.replace(/^figure\s*\d+:\s*/i, '').trim() || undefined;

  return {
    // Wrap in a block envelope so the array stays uniform — Sanity treats this
    // as a custom-type entry in the body array.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...({
      _type: 'figure',
      _key: randomUUID(),
      image: imageRef(asset._id, alt),
      ...(caption ? { caption } : {}),
    } as any),
  };
}

async function processList(
  list: Element,
  out: BlockBuilder[],
  type: 'bullet' | 'number'
): Promise<void> {
  for (const item of Array.from(list.children)) {
    if (item.tagName !== 'LI') continue;
    const block = emptyBlock('normal', type);
    item.childNodes.forEach((child) => walkInline(child, block, []));
    if (block.children.length > 0) out.push(block);
  }
}

/** Top-level conversion. Walks the body element and produces Portable Text. */
export async function htmlToPortableText(html: string): Promise<BlockBuilder[]> {
  const dom = new JSDOM(`<!doctype html><body>${html}</body>`);
  const body = dom.window.document.body;
  const blocks: BlockBuilder[] = [];

  for (const node of Array.from(body.childNodes)) {
    if (node.nodeType !== 1) continue;
    const el = node as Element;
    const tag = el.tagName;

    if (tag === 'DIV' && el.classList?.contains('article__figure')) {
      const figure = await buildFigureBlock(el);
      if (figure) blocks.push(figure);
      continue;
    }

    if (tag === 'UL') {
      await processList(el, blocks, 'bullet');
      continue;
    }
    if (tag === 'OL') {
      await processList(el, blocks, 'number');
      continue;
    }

    if (STYLE_MAP[tag]) {
      const block = emptyBlock(STYLE_MAP[tag]);
      el.childNodes.forEach((child) => walkInline(child, block, []));
      if (block.children.length > 0) blocks.push(block);
      continue;
    }
    // Unknown element: drop into a normal block so we don't lose its text.
    const fallback = emptyBlock('normal');
    el.childNodes.forEach((child) => walkInline(child, fallback, []));
    if (fallback.children.length > 0) blocks.push(fallback);
  }

  return blocks;
}
