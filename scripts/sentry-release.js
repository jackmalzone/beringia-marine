#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from package.json or use git commit hash
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = process.env.VERSION || process.env.GITHUB_SHA || packageJson.version;

console.log(`Creating Sentry release: ${version}`);

try {
  // Create a new release
  execSync(`npx @sentry/cli releases new ${version}`, { stdio: 'inherit' });

  // Set commits for the release
  execSync(`npx @sentry/cli releases set-commits ${version} --auto`, { stdio: 'inherit' });

  // Upload source maps
  console.log('Uploading source maps...');
  execSync(
    `npx @sentry/cli releases files ${version} upload-sourcemaps .next --url-prefix '~/_next'`,
    { stdio: 'inherit' }
  );

  // Finalize the release
  execSync(`npx @sentry/cli releases finalize ${version}`, { stdio: 'inherit' });

  console.log(`✅ Sentry release ${version} created successfully!`);
} catch (error) {
  console.error('❌ Failed to create Sentry release:', error.message);
  process.exit(1);
}
