/**
 * Environment Variable Validation
 * Uses Zod to validate and type-safe environment variables
 */

import { z } from 'zod';

// Load .env.local files from both root and apps/web directories
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { config } = require('dotenv');
    const { resolve, dirname } = require('path');
    const { existsSync } = require('fs');

    let projectRoot = process.cwd();
    let currentDir = projectRoot;
    for (let i = 0; i < 5; i++) {
      if (
        existsSync(resolve(currentDir, 'pnpm-workspace.yaml')) ||
        (existsSync(resolve(currentDir, 'package.json')) && existsSync(resolve(currentDir, 'apps')))
      ) {
        projectRoot = currentDir;
        break;
      }
      currentDir = dirname(currentDir);
    }

    const possiblePaths = [
      resolve(projectRoot, '.env.local'),
      resolve(projectRoot, 'apps/web/.env.local'),
      resolve(process.cwd(), '.env.local'),
      resolve(process.cwd(), 'apps/web/.env.local'),
    ];

    possiblePaths.forEach(envPath => {
      if (existsSync(envPath)) {
        config({ path: envPath, override: true });
      }
    });
  } catch {
    // dotenv not available or files don't exist
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),

  /** Where SMTP contact mail is delivered (defaults to TEMPLATE_BUSINESS.email) */
  CONTACT_INBOX_EMAIL: z.string().optional(),

  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_INBOX_EMAIL: process.env.CONTACT_INBOX_EMAIL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  };

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Invalid environment variables:\n${missingVars}`);
    }
    throw error;
  }
}

let cachedEnv: Env | null = null;

function getEnvValue(): Env {
  if (!cachedEnv) {
    cachedEnv = getEnv();
  }
  return cachedEnv;
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return getEnvValue()[prop];
  },
  ownKeys() {
    return Object.keys(getEnvValue());
  },
  getOwnPropertyDescriptor(_target, prop: keyof Env) {
    return {
      enumerable: true,
      configurable: true,
      value: getEnvValue()[prop],
    };
  },
});
