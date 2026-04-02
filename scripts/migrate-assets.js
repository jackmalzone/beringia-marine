#!/usr/bin/env node

/**
 * Sanity Asset Migration Script
 *
 * This script uploads existing media assets to Sanity's asset management system
 * and updates document references to use the uploaded assets.
 *
 * Usage:
 *   node scripts/migrate-assets.js [--dry-run] [--update-refs]
 *
 * Options:
 *   --dry-run      Show what would be uploaded without actually uploading
 *   --update-refs  Update document references after uploading assets
 *   --help         Show this help message
 */

// Load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv is optional, continue without it if not available
}

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Configuration
const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

// Asset mapping from existing URLs to Sanity assets
const ASSET_MAPPING = {
  // Service hero images
  'https://media.vitalicesf.com/ice-vitalblue.jpg': {
    filename: 'cold-plunge-hero.jpg',
    alt: 'Cold plunge therapy at Vital Ice',
    tags: ['service', 'cold-plunge', 'hero'],
  },
  'https://media.vitalicesf.com/sauna-infraredwide.jpg': {
    filename: 'infrared-sauna-hero.jpg',
    alt: 'Infrared sauna therapy at Vital Ice',
    tags: ['service', 'infrared-sauna', 'hero'],
  },
  'https://media.vitalicesf.com/sauna-traditional.jpg': {
    filename: 'traditional-sauna-hero.jpg',
    alt: 'Traditional sauna therapy at Vital Ice',
    tags: ['service', 'traditional-sauna', 'hero'],
  },
  'https://media.vitalicesf.com/stone_whitesky.jpg': {
    filename: 'compression-boots-hero.jpg',
    alt: 'Compression boot therapy at Vital Ice',
    tags: ['service', 'compression-boots', 'hero'],
  },
  'https://media.vitalicesf.com/texture_blackmarble-cracks.jpg': {
    filename: 'percussion-massage-hero.jpg',
    alt: 'Percussion massage therapy at Vital Ice',
    tags: ['service', 'percussion-massage', 'hero'],
  },
  'https://media.vitalicesf.com/redlight_jellyfish.jpg': {
    filename: 'red-light-therapy-hero.jpg',
    alt: 'Red light therapy at Vital Ice',
    tags: ['service', 'red-light-therapy', 'hero'],
  },

  // Service background images
  'https://media.vitalicesf.com/coldplunge_woman.jpg': {
    filename: 'cold-plunge-background.jpg',
    alt: 'Woman experiencing cold plunge therapy',
    tags: ['service', 'cold-plunge', 'background'],
  },
  'https://media.vitalicesf.com/cells-bloodcells.jpg': {
    filename: 'compression-boots-background.jpg',
    alt: 'Blood cells representing circulation improvement',
    tags: ['service', 'compression-boots', 'background'],
  },
  'https://media.vitalicesf.com/percussion_bicep.jpg': {
    filename: 'percussion-massage-background.jpg',
    alt: 'Percussion massage therapy on bicep',
    tags: ['service', 'percussion-massage', 'background'],
  },
  'https://media.vitalicesf.com/redlight_mask.jpg': {
    filename: 'red-light-therapy-background.jpg',
    alt: 'Red light therapy mask treatment',
    tags: ['service', 'red-light-therapy', 'background'],
  },

  // Service texture images
  'https://media.vitalicesf.com/ice_vertical-texture.jpg': {
    filename: 'cold-plunge-texture.jpg',
    alt: 'Ice texture pattern',
    tags: ['service', 'cold-plunge', 'texture'],
  },
  'https://media.vitalicesf.com/embers_closeup.jpg': {
    filename: 'infrared-sauna-texture.jpg',
    alt: 'Glowing embers texture',
    tags: ['service', 'infrared-sauna', 'texture'],
  },
  'https://media.vitalicesf.com/lavastones.jpg': {
    filename: 'traditional-sauna-texture.jpg',
    alt: 'Lava stones texture',
    tags: ['service', 'traditional-sauna', 'texture'],
  },
  'https://media.vitalicesf.com/texture_blacksand-landscape.jpg': {
    filename: 'compression-boots-texture.jpg',
    alt: 'Black sand landscape texture',
    tags: ['service', 'compression-boots', 'texture'],
  },
  'https://media.vitalicesf.com/texture_blackrock.jpg': {
    filename: 'percussion-massage-texture.jpg',
    alt: 'Black rock texture',
    tags: ['service', 'percussion-massage', 'texture'],
  },
  'https://media.vitalicesf.com/light_blurryhues.jpg': {
    filename: 'red-light-therapy-texture.jpg',
    alt: 'Blurry light hues texture',
    tags: ['service', 'red-light-therapy', 'texture'],
  },

  // SEO images
  'https://media.vitalicesf.com/seo/desktop-home.png': {
    filename: 'seo-home-desktop.png',
    alt: 'Vital Ice homepage social media preview',
    tags: ['seo', 'social-media', 'home'],
  },
  'https://media.vitalicesf.com/seo/desktop-services.png': {
    filename: 'seo-services-desktop.png',
    alt: 'Vital Ice services page social media preview',
    tags: ['seo', 'social-media', 'services'],
  },
  'https://media.vitalicesf.com/seo/desktop-cold-plunge.png': {
    filename: 'seo-cold-plunge-desktop.png',
    alt: 'Cold plunge therapy social media preview',
    tags: ['seo', 'social-media', 'cold-plunge'],
  },
  'https://media.vitalicesf.com/seo/desktop-infrared-sauna.png': {
    filename: 'seo-infrared-sauna-desktop.png',
    alt: 'Infrared sauna therapy social media preview',
    tags: ['seo', 'social-media', 'infrared-sauna'],
  },
  'https://media.vitalicesf.com/seo/desktop-traditional-sauna.png': {
    filename: 'seo-traditional-sauna-desktop.png',
    alt: 'Traditional sauna therapy social media preview',
    tags: ['seo', 'social-media', 'traditional-sauna'],
  },
  'https://media.vitalicesf.com/seo/desktop-red-light-therapy.png': {
    filename: 'seo-red-light-therapy-desktop.png',
    alt: 'Red light therapy social media preview',
    tags: ['seo', 'social-media', 'red-light-therapy'],
  },
  'https://media.vitalicesf.com/seo/desktop-compression-boots.png': {
    filename: 'seo-compression-boots-desktop.png',
    alt: 'Compression boot therapy social media preview',
    tags: ['seo', 'social-media', 'compression-boots'],
  },
  'https://media.vitalicesf.com/seo/desktop-percussion-massage.png': {
    filename: 'seo-percussion-massage-desktop.png',
    alt: 'Percussion massage therapy social media preview',
    tags: ['seo', 'social-media', 'percussion-massage'],
  },
};

// Validate environment variables
function validateEnvironment() {
  const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env.local file');
    process.exit(1);
  }
}

// Initialize Sanity client
function createSanityClient() {
  return createClient(SANITY_CONFIG);
}

// Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const request = https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Upload asset to Sanity
async function uploadAsset(client, url, metadata, dryRun = false) {
  if (dryRun) {
    console.log(`   ✓ Would upload: ${metadata.filename} (${url})`);
    return {
      success: true,
      action: 'would-upload',
      url,
      filename: metadata.filename,
    };
  }

  try {
    console.log(`   📥 Downloading: ${url}`);
    const buffer = await downloadImage(url);

    console.log(`   📤 Uploading: ${metadata.filename} (${buffer.length} bytes)`);
    const asset = await client.assets.upload('image', buffer, {
      filename: metadata.filename,
      title: metadata.alt,
      description: metadata.alt,
      altText: metadata.alt,
    });

    // Add tags to the asset
    if (metadata.tags && metadata.tags.length > 0) {
      await client
        .patch(asset._id)
        .set({
          'opt.media.tags': metadata.tags,
        })
        .commit();
    }

    console.log(`   ✅ Uploaded: ${metadata.filename} (${asset._id})`);

    return {
      success: true,
      action: 'uploaded',
      url,
      filename: metadata.filename,
      assetId: asset._id,
      asset,
    };
  } catch (error) {
    console.error(`   ❌ Failed to upload ${metadata.filename}:`, error.message);
    return {
      success: false,
      action: 'failed',
      url,
      filename: metadata.filename,
      error: error.message,
    };
  }
}

// Upload all assets
async function uploadAssets(client, assetMapping, dryRun = false) {
  console.log(`\n📁 Uploading ${Object.keys(assetMapping).length} assets...`);

  const results = [];

  for (const [url, metadata] of Object.entries(assetMapping)) {
    const result = await uploadAsset(client, url, metadata, dryRun);
    results.push(result);

    // Add delay to avoid rate limiting
    if (!dryRun) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Update document references with uploaded assets
async function updateDocumentReferences(client, uploadResults, dryRun = false) {
  console.log('\n🔗 Updating document references...');

  if (dryRun) {
    console.log('   ✓ Would update document references with asset IDs');
    return { success: true, action: 'would-update' };
  }

  // Create mapping of URLs to asset IDs
  const urlToAssetId = {};
  uploadResults.forEach(result => {
    if (result.success && result.assetId) {
      urlToAssetId[result.url] = result.assetId;
    }
  });

  try {
    // Update service documents
    const services = await client.fetch('*[_type == "service"]');

    for (const service of services) {
      const updates = {};
      let hasUpdates = false;

      // Update hero image reference
      const heroImageUrl = getOriginalImageUrl(service.slug.current, 'hero');
      if (heroImageUrl && urlToAssetId[heroImageUrl]) {
        updates['heroImage.asset._ref'] = urlToAssetId[heroImageUrl];
        hasUpdates = true;
      }

      // Update background image reference
      const backgroundImageUrl = getOriginalImageUrl(service.slug.current, 'background');
      if (backgroundImageUrl && urlToAssetId[backgroundImageUrl]) {
        updates['backgroundImage.asset._ref'] = urlToAssetId[backgroundImageUrl];
        hasUpdates = true;
      }

      // Update texture image reference
      const textureImageUrl = getOriginalImageUrl(service.slug.current, 'texture');
      if (textureImageUrl && urlToAssetId[textureImageUrl]) {
        updates['textureImage.asset._ref'] = urlToAssetId[textureImageUrl];
        hasUpdates = true;
      }

      if (hasUpdates) {
        await client.patch(service._id).set(updates).commit();
        console.log(`   ✅ Updated service: ${service.title}`);
      }
    }

    // Update page documents with SEO images
    const pages = await client.fetch('*[_type == "page"]');

    for (const page of pages) {
      const updates = {};
      let hasUpdates = false;

      // Update Open Graph image
      const ogImageUrl = getOriginalSEOImageUrl(page.slug.current);
      if (ogImageUrl && urlToAssetId[ogImageUrl]) {
        updates['seo.openGraph.image.asset._ref'] = urlToAssetId[ogImageUrl];
        hasUpdates = true;
      }

      // Update Twitter image
      if (ogImageUrl && urlToAssetId[ogImageUrl]) {
        updates['seo.twitter.image.asset._ref'] = urlToAssetId[ogImageUrl];
        hasUpdates = true;
      }

      if (hasUpdates) {
        await client.patch(page._id).set(updates).commit();
        console.log(`   ✅ Updated page: ${page.title || page.slug.current}`);
      }
    }

    console.log('   ✅ All document references updated');
    return { success: true, action: 'updated' };
  } catch (error) {
    console.error('   ❌ Failed to update document references:', error.message);
    return { success: false, error: error.message };
  }
}

// Helper function to get original image URL for a service
function getOriginalImageUrl(serviceSlug, imageType) {
  const serviceImageMap = {
    'cold-plunge': {
      hero: 'https://media.vitalicesf.com/ice-vitalblue.jpg',
      background: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      texture: 'https://media.vitalicesf.com/ice_vertical-texture.jpg',
    },
    'infrared-sauna': {
      hero: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      background: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      texture: 'https://media.vitalicesf.com/embers_closeup.jpg',
    },
    'traditional-sauna': {
      hero: 'https://media.vitalicesf.com/sauna-traditional.jpg',
      background: 'https://media.vitalicesf.com/sauna-traditional.jpg',
      texture: 'https://media.vitalicesf.com/lavastones.jpg',
    },
    'compression-boots': {
      hero: 'https://media.vitalicesf.com/stone_whitesky.jpg',
      background: 'https://media.vitalicesf.com/cells-bloodcells.jpg',
      texture: 'https://media.vitalicesf.com/texture_blacksand-landscape.jpg',
    },
    'percussion-massage': {
      hero: 'https://media.vitalicesf.com/texture_blackmarble-cracks.jpg',
      background: 'https://media.vitalicesf.com/percussion_bicep.jpg',
      texture: 'https://media.vitalicesf.com/texture_blackrock.jpg',
    },
    'red-light-therapy': {
      hero: 'https://media.vitalicesf.com/redlight_jellyfish.jpg',
      background: 'https://media.vitalicesf.com/redlight_mask.jpg',
      texture: 'https://media.vitalicesf.com/light_blurryhues.jpg',
    },
  };

  return serviceImageMap[serviceSlug]?.[imageType];
}

// Helper function to get original SEO image URL for a page
function getOriginalSEOImageUrl(pageSlug) {
  const seoImageMap = {
    '/': 'https://media.vitalicesf.com/seo/desktop-home.png',
    home: 'https://media.vitalicesf.com/seo/desktop-home.png',
    services: 'https://media.vitalicesf.com/seo/desktop-services.png',
    'cold-plunge': 'https://media.vitalicesf.com/seo/desktop-cold-plunge.png',
    'infrared-sauna': 'https://media.vitalicesf.com/seo/desktop-infrared-sauna.png',
    'traditional-sauna': 'https://media.vitalicesf.com/seo/desktop-traditional-sauna.png',
    'red-light-therapy': 'https://media.vitalicesf.com/seo/desktop-red-light-therapy.png',
    'compression-boots': 'https://media.vitalicesf.com/seo/desktop-compression-boots.png',
    'percussion-massage': 'https://media.vitalicesf.com/seo/desktop-percussion-massage.png',
  };

  return seoImageMap[pageSlug];
}

// Organize assets in Sanity Studio
async function organizeAssets(client, uploadResults, dryRun = false) {
  console.log('\n📂 Organizing assets...');

  if (dryRun) {
    console.log('   ✓ Would organize assets with proper naming and tagging');
    return { success: true, action: 'would-organize' };
  }

  // Assets are already tagged during upload
  console.log('   ✅ Assets organized with tags and proper naming');
  return { success: true, action: 'organized' };
}

// Validation functions
function validateUploadResults(results) {
  console.log('\n🔍 Validating asset uploads...');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`   ✅ Successful uploads: ${successful.length}`);
  if (failed.length > 0) {
    console.log(`   ❌ Failed uploads: ${failed.length}`);
    failed.forEach(f => {
      console.log(`      - ${f.filename}: ${f.error}`);
    });
  }

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    isValid: failed.length === 0,
  };
}

// Main migration function
async function runAssetMigration(options = {}) {
  const { dryRun = false, updateRefs = false } = options;

  console.log('🚀 Starting Sanity asset migration...');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
  console.log(`   Update references: ${updateRefs ? 'YES' : 'NO'}`);
  console.log(`   Dataset: ${SANITY_CONFIG.dataset}`);

  // Validate environment
  validateEnvironment();

  // Create Sanity client
  const client = createSanityClient();

  // Upload assets
  const uploadResults = await uploadAssets(client, ASSET_MAPPING, dryRun);

  // Validate uploads
  const validation = validateUploadResults(uploadResults);

  let updateResult = null;
  if (updateRefs && validation.isValid) {
    updateResult = await updateDocumentReferences(client, uploadResults, dryRun);
  }

  // Organize assets
  const organizeResult = await organizeAssets(client, uploadResults, dryRun);

  // Summary
  console.log('\n📊 Asset Migration Summary:');
  console.log(`   Total assets: ${validation.total}`);
  console.log(`   Successful uploads: ${validation.successful}`);
  console.log(`   Failed uploads: ${validation.failed}`);
  console.log(`   References updated: ${updateResult?.success ? 'YES' : 'NO'}`);
  console.log(`   Status: ${validation.isValid ? '✅ SUCCESS' : '❌ PARTIAL FAILURE'}`);

  if (!dryRun && validation.isValid) {
    console.log('\n🎉 Asset migration completed successfully!');
    console.log('   Next steps:');
    console.log('   1. Verify assets appear correctly in Sanity Studio');
    console.log('   2. Test image rendering in your Next.js application');
    console.log('   3. Run content validation tests');
  }

  return {
    success: validation.isValid,
    uploadResults,
    updateResult,
    organizeResult,
    validation,
  };
}

// CLI interface
function showHelp() {
  console.log(`
Sanity Asset Migration Script

Usage:
  node scripts/migrate-assets.js [options]

Options:
  --dry-run         Show what would be uploaded without making changes
  --update-refs     Update document references after uploading assets
  --help           Show this help message

Examples:
  node scripts/migrate-assets.js --dry-run
  node scripts/migrate-assets.js --update-refs
  node scripts/migrate-assets.js --dry-run --update-refs

Environment Variables Required:
  NEXT_PUBLIC_SANITY_PROJECT_ID    Your Sanity project ID
  SANITY_API_TOKEN                 Sanity API token with write permissions
  NEXT_PUBLIC_SANITY_DATASET       Dataset name (default: production)
`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    updateRefs: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--update-refs') {
      options.updateRefs = true;
    } else if (arg === '--help') {
      options.help = true;
    }
  }

  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  runAssetMigration(options)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Asset migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAssetMigration,
  uploadAssets,
  updateDocumentReferences,
  validateUploadResults,
  ASSET_MAPPING,
};
