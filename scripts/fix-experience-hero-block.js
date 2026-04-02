#!/usr/bin/env node

/**
 * Fix Experience Page Hero Block Script
 *
 * This script fixes the hero block on the experience page by adding headline and subheadline.
 *
 * Usage:
 *   node scripts/fix-experience-hero-block.js
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

// Fix hero block on experience page
async function fixExperienceHeroBlock() {
  console.log('🔧 Fixing hero block on experience page...\n');

  try {
    // Get the experience page
    const page = await client.fetch('*[_type == "page" && slug.current == "experience"][0]');

    if (!page) {
      console.log('   ⚠️  Experience page not found');
      return false;
    }

    // Find the hero block in the content array
    const heroBlockIndex = page.content?.findIndex(block => block._type === 'hero');

    if (heroBlockIndex === -1 || heroBlockIndex === undefined) {
      console.log('   ⚠️  No hero block found on experience page');
      return false;
    }

    const heroBlock = page.content[heroBlockIndex];

    // Check if headline is already set
    if (heroBlock.headline) {
      console.log(`   ✓ Experience page already has headline: "${heroBlock.headline}"`);
      return true;
    }

    // Update the hero block with appropriate content
    const updatedContent = [...page.content];
    updatedContent[heroBlockIndex] = {
      ...heroBlock,
      headline: 'Experience Vital Ice',
      subheadline: "State-of-the-art wellness facility in San Francisco's Marina District",
    };

    // Update the page
    await client.patch(page._id).set({ content: updatedContent }).commit();

    console.log('   ✅ Updated experience page hero block');
    console.log('      headline: "Experience Vital Ice"');
    console.log(
      '      subheadline: "State-of-the-art wellness facility in San Francisco\'s Marina District"'
    );
    return true;
  } catch (error) {
    console.error('   ❌ Error updating experience page:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting experience page hero block fix...\n');

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
    const success = await fixExperienceHeroBlock();

    console.log('\n📊 Summary:');
    console.log(`   Experience page fixed: ${success ? 'Yes' : 'No'}`);

    console.log('\n✅ Fix completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
