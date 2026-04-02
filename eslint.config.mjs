import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  {
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Prevent console statements in production
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Prevent debugger statements in production
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Prevent alert statements
      'no-alert': 'error',
      // Prevent direct framer-motion imports - use @/lib/motion instead
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'framer-motion',
              message: "Use '@/lib/motion' instead for optimized imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/lib/motion.ts'],
    rules: {
      // Allow framer-motion imports only in the centralized motion file
      'no-restricted-imports': 'off',
    },
  },
  {
    files: [
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
    ],
    rules: {
      // Allow require imports in test files for mocking purposes
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
