import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { lookup as lookupMime } from 'mime-types';

import { sanity } from './client';

const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..');
const WEB_PUBLIC = resolve(REPO_ROOT, 'apps/web/public');

interface AssetUploadOptions {
  filename?: string;
  contentType?: string;
}

interface UploadedAsset {
  _id: string;
  url?: string;
}

const memo = new Map<string, UploadedAsset>();

/**
 * Resolve a source string (URL, /-rooted public path, or bare relative path) into a Buffer.
 * Returns `null` if the source can't be resolved (so callers can warn and skip).
 */
async function readSource(source: string): Promise<{ data: Buffer; filename: string; contentType?: string } | null> {
  if (!source) return null;

  if (source.startsWith('http://') || source.startsWith('https://')) {
    try {
      const res = await fetch(source);
      if (!res.ok) {
        console.warn(`[assets] fetch ${source} → ${res.status}`);
        return null;
      }
      const arrayBuf = await res.arrayBuffer();
      const url = new URL(source);
      const filename = decodeURIComponent(basename(url.pathname)) || 'asset';
      const contentType = res.headers.get('content-type') || lookupMime(filename) || undefined;
      return { data: Buffer.from(arrayBuf), filename, contentType: contentType ?? undefined };
    } catch (error) {
      console.warn(`[assets] fetch ${source} failed:`, error);
      return null;
    }
  }

  // Treat as path under apps/web/public/
  const rel = source.startsWith('/') ? source.slice(1) : source;
  const absolutePath = resolve(WEB_PUBLIC, rel);
  if (!existsSync(absolutePath)) {
    console.warn(`[assets] local path not found: ${absolutePath}`);
    return null;
  }
  const data = readFileSync(absolutePath);
  const filename = basename(absolutePath);
  const contentType = lookupMime(filename) || undefined;
  return { data, filename, contentType: contentType ?? undefined };
}

/** Upload (or return cached) an image asset and return its `_id`. */
export async function uploadImageAsset(
  source: string | undefined | null,
  options: AssetUploadOptions = {}
): Promise<UploadedAsset | null> {
  if (!source) return null;
  const cacheKey = `image:${source}`;
  if (memo.has(cacheKey)) return memo.get(cacheKey) ?? null;

  const file = await readSource(source);
  if (!file) return null;

  const uploaded = await sanity.assets.upload('image', file.data, {
    filename: options.filename || file.filename,
    contentType: options.contentType || file.contentType,
  });
  const asset: UploadedAsset = { _id: uploaded._id, url: uploaded.url };
  memo.set(cacheKey, asset);
  return asset;
}

/** Upload (or return cached) a file asset (e.g. PDF). */
export async function uploadFileAsset(
  source: string | undefined | null,
  options: AssetUploadOptions = {}
): Promise<UploadedAsset | null> {
  if (!source) return null;
  const cacheKey = `file:${source}`;
  if (memo.has(cacheKey)) return memo.get(cacheKey) ?? null;

  const file = await readSource(source);
  if (!file) return null;

  const uploaded = await sanity.assets.upload('file', file.data, {
    filename: options.filename || file.filename,
    contentType: options.contentType || file.contentType,
  });
  const asset: UploadedAsset = { _id: uploaded._id, url: uploaded.url };
  memo.set(cacheKey, asset);
  return asset;
}

/** Build a Sanity image reference object (no asset upload — assumes you already have an _id). */
export function imageRef(assetId: string, alt?: string) {
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}
