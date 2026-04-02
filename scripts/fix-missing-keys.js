#!/usr/bin/env node

/**
 * Fix Missing Keys Script
 *
 * This script fixes missing _key properties in Sanity documents.
 * It adds _key to all array items that are missing them.
 *
 * Usage:
 *   node scripts/fix-missing-keys.js
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

// Function to add _key to array items
function addKeysToArray(arr, prefix = 'item') {
  if (!Array.isArray(arr)) return arr;

  return arr.map((item, index) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      // If it's an object and doesn't have a _key, add one
      if (!item._key) {
        const key = `${prefix}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        // Recursively fix nested arrays in this object
        const fixedItem = fixKeysInObject(item, `${prefix}-${index}`);
        return {
          ...fixedItem,
          _key: key,
        };
      } else {
        // Even if it has a key, recursively fix nested arrays
        return fixKeysInObject(item, `${prefix}-${index}`);
      }
    }
    return item;
  });
}

// Function to recursively fix keys in an object
function fixKeysInObject(obj, path = '') {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const fixed = { ...obj };

  for (const [key, value] of Object.entries(fixed)) {
    if (Array.isArray(value)) {
      // Check if array items are objects that need _key
      const needsKeys = value.some(
        item => typeof item === 'object' && item !== null && !Array.isArray(item) && !item._key
      );

      if (needsKeys) {
        fixed[key] = addKeysToArray(value, `${path ? path + '-' : ''}${key}`);
      } else {
        // Even if items have keys, recursively fix nested arrays
        fixed[key] = value.map((item, index) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
            ? fixKeysInObject(item, `${path ? path + '-' : ''}${key}-${index}`)
            : item
        );
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively fix nested objects
      fixed[key] = fixKeysInObject(value, `${path ? path + '-' : ''}${key}`);
    }
  }

  return fixed;
}

// Fix pages
async function fixPages() {
  console.log('🔧 Fixing pages...');

  try {
    const pages = await client.fetch('*[_type == "page"]');
    let fixedCount = 0;

    for (const page of pages) {
      const fixed = fixKeysInObject(page);
      const needsUpdate = JSON.stringify(fixed) !== JSON.stringify(page);

      if (needsUpdate) {
        await client.patch(page._id).set(fixed).commit();
        console.log(`   ✅ Fixed page: ${page.title || page._id}`);
        fixedCount++;
      }
    }

    console.log(`   ✅ Fixed ${fixedCount} of ${pages.length} pages`);
    return fixedCount;
  } catch (error) {
    console.error('   ❌ Error fixing pages:', error.message);
    return 0;
  }
}

// Fix global settings
async function fixGlobalSettings() {
  console.log('\n🔧 Fixing global settings...');

  try {
    const settings = await client.fetch('*[_type == "globalSettings"]');
    let fixedCount = 0;

    for (const setting of settings) {
      const fixed = fixKeysInObject(setting);
      const needsUpdate = JSON.stringify(fixed) !== JSON.stringify(setting);

      if (needsUpdate) {
        await client.patch(setting._id).set(fixed).commit();
        console.log(`   ✅ Fixed global settings: ${setting._id}`);
        fixedCount++;
      }
    }

    console.log(`   ✅ Fixed ${fixedCount} of ${settings.length} global settings`);
    return fixedCount;
  } catch (error) {
    console.error('   ❌ Error fixing global settings:', error.message);
    return 0;
  }
}

// Fix services
async function fixServices() {
  console.log('\n🔧 Fixing services...');

  try {
    const services = await client.fetch('*[_type == "service"]');
    let fixedCount = 0;

    for (const service of services) {
      const fixed = fixKeysInObject(service);
      const needsUpdate = JSON.stringify(fixed) !== JSON.stringify(service);

      if (needsUpdate) {
        await client.patch(service._id).set(fixed).commit();
        console.log(`   ✅ Fixed service: ${service.title || service._id}`);
        fixedCount++;
      }
    }

    console.log(`   ✅ Fixed ${fixedCount} of ${services.length} services`);
    return fixedCount;
  } catch (error) {
    console.error('   ❌ Error fixing services:', error.message);
    return 0;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting fix for missing _key properties...\n');

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
    const pagesFixed = await fixPages();
    const settingsFixed = await fixGlobalSettings();
    const servicesFixed = await fixServices();

    console.log('\n📊 Summary:');
    console.log(`   Pages fixed: ${pagesFixed}`);
    console.log(`   Global settings fixed: ${settingsFixed}`);
    console.log(`   Services fixed: ${servicesFixed}`);
    console.log(`   Total fixed: ${pagesFixed + settingsFixed + servicesFixed}`);

    console.log('\n✅ Fix completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
