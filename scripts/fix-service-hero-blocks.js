#!/usr/bin/env node

/**
 * Fix Service Hero Blocks Script
 *
 * This script fixes hero blocks on service pages by adding headline and subheadline
 * from the corresponding service documents.
 *
 * Usage:
 *   node scripts/fix-service-hero-blocks.js
 */

// Load environment variables
const envPaths = ['apps/web/.env.local', 'apps/studio/.env.local', '.env.local'];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath, override: true });
    if (process.env.SANITY_API_TOKEN) {
      break;
    }
  } catch (e) {
    // Continue to next path
  }
}

const { createClient } = require('@sanity/client');

// Configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.trim() : undefined,
  useCdn: false,
});

// Service slug to service ID mapping
const serviceSlugToId = {
  'cold-plunge': 'service-cold-plunge',
  'infrared-sauna': 'service-infrared-sauna',
  'traditional-sauna': 'service-traditional-sauna',
  'red-light-therapy': 'service-red-light-therapy',
  'compression-boots': 'service-compression-boots',
  'percussion-massage': 'service-percussion-massage',
};

// Fix hero blocks on service pages
async function fixServiceHeroBlocks() {
  console.log('🔧 Fixing hero blocks on service pages...\n');

  let fixedCount = 0;

  for (const [slug, serviceId] of Object.entries(serviceSlugToId)) {
    try {
      // Get the service page
      const page = await client.fetch(`*[_type == "page" && slug.current == "${slug}"][0]`);

      if (!page) {
        console.log(`   ⚠️  Page ${slug} not found`);
        continue;
      }

      // Get the service document
      const service = await client.fetch(`*[_id == "${serviceId}"][0]`);

      if (!service) {
        console.log(`   ⚠️  Service ${serviceId} not found`);
        continue;
      }

      // Find the hero block in the content array
      const heroBlockIndex = page.content?.findIndex(block => block._type === 'hero');

      if (heroBlockIndex === -1 || heroBlockIndex === undefined) {
        console.log(`   ⚠️  No hero block found on page ${slug}`);
        continue;
      }

      const heroBlock = page.content[heroBlockIndex];

      // Check if headline is already set
      if (heroBlock.headline) {
        console.log(`   ✓ Page ${slug} already has headline: "${heroBlock.headline}"`);
        continue;
      }

      // Update the hero block with service title and subtitle
      const updatedContent = [...page.content];
      updatedContent[heroBlockIndex] = {
        ...heroBlock,
        headline: service.title || 'Untitled',
        subheadline: service.subtitle || '',
      };

      // Update the page
      await client.patch(page._id).set({ content: updatedContent }).commit();

      console.log(
        `   ✅ Updated ${slug}: headline="${service.title}", subheadline="${service.subtitle}"`
      );
      fixedCount++;
    } catch (error) {
      console.error(`   ❌ Error updating ${slug}:`, error.message);
    }
  }

  console.log(`\n   ✅ Fixed ${fixedCount} service pages`);
  return fixedCount;
}

// Main function
async function main() {
  console.log('🚀 Starting service hero block fixes...\n');

  // Validate environment
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN in environment variables');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables');
    process.exit(1);
  }

  try {
    const fixedCount = await fixServiceHeroBlocks();

    console.log('\n📊 Summary:');
    console.log(`   Service pages fixed: ${fixedCount}`);

    console.log('\n✅ Fixes completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
