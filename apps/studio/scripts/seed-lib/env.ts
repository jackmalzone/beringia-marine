import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

// Load .env.local files in priority order: studio first (project ID), repo root last (token).
const candidates = [
  resolve(__dirname, '..', '..', '.env.local'),
  resolve(__dirname, '..', '..', '..', '..', '.env.local'),
];

for (const path of candidates) {
  if (existsSync(path)) {
    loadEnv({ path, override: false });
  }
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required env var ${key}. Checked .env.local at:\n  ${candidates.join('\n  ')}`
    );
  }
  return value;
}

export const SANITY_PROJECT_ID = required('NEXT_PUBLIC_SANITY_PROJECT_ID');
export const SANITY_DATASET = required('NEXT_PUBLIC_SANITY_DATASET');
export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19';
export const SANITY_WRITE_TOKEN = required('SANITY_API_WRITE_TOKEN');
