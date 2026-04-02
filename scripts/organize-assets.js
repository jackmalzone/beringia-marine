#!/usr/bin/env node

/**
 * Sanity Asset Organization Script
 *
 * This script organizes uploaded assets in Sanity with proper naming,
 * tagging, and folder structure for easy management.
 *
 * Usage:
 *   node scripts/organize-assets.js [--dry-run] [--cleanup]
 *
 * Options:
 *   --dry-run      Show what would be organized without making changes
 *   --cleanup      Remove unused assets and fix naming issues
 *   --help         Show this help message
 */

const { createClient } = require('@sanity/client');

// Configuration
const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

// Asset organization rules
const ASSET_ORGANIZATION = {
  // Folder structure based on tags
  folders: {
    'service-images': ['service'],
    'seo-images': ['seo', 'social-media'],
    'hero-images': ['hero'],
    'background-images': ['background'],
    'texture-images': ['texture'],
    'brand-assets': ['logo', 'brand'],
  },

  // Naming conventions
  namingRules: {
    service: (asset, tags) => {
      const serviceTag = tags.find(tag =>
        [
          'cold-plunge',
          'infrared-sauna',
          'traditional-sauna',
          'compression-boots',
          'percussion-massage',
          'red-light-therapy',
        ].includes(tag)
      );
      const typeTag = tags.find(tag => ['hero', 'background', 'texture'].includes(tag));
      return serviceTag && typeTag ? `${serviceTag}-${typeTag}` : null;
    },
    seo: (asset, tags) => {
      const pageTag = tags.find(tag =>
        [
          'home',
          'services',
          'cold-plunge',
          'infrared-sauna',
          'traditional-sauna',
          'compression-boots',
          'percussion-massage',
          'red-light-therapy',
        ].includes(tag)
      );
      return pageTag ? `seo-${pageTag}-preview` : 'seo-preview';
    },
  },

  // Alt text generation rules
  altTextRules: {
    service: (asset, tags) => {
      const serviceTag = tags.find(tag =>
        [
          'cold-plunge',
          'infrared-sauna',
          'traditional-sauna',
          'compression-boots',
          'percussion-massage',
          'red-light-therapy',
        ].includes(tag)
      );
      const typeTag = tags.find(tag => ['hero', 'background', 'texture'].includes(tag));

      const serviceNames = {
        'cold-plunge': 'Cold Plunge',
        'infrared-sauna': 'Infrared Sauna',
        'traditional-sauna': 'Traditional Sauna',
        'compression-boots': 'Compression Boots',
        'percussion-massage': 'Percussion Massage',
        'red-light-therapy': 'Red Light Therapy',
      };

      const typeDescriptions = {
        hero: 'therapy at Vital Ice',
        background: 'therapy background image',
        texture: 'texture pattern',
      };

      if (serviceTag && typeTag) {
        return `${serviceNames[serviceTag]} ${typeDescriptions[typeTag]}`;
      }

      return asset.altText || asset.title || 'Vital Ice wellness service';
    },
    seo: (asset, tags) => {
      const pageTag = tags.find(tag =>
        [
          'home',
          'services',
          'cold-plunge',
          'infrared-sauna',
          'traditional-sauna',
          'compression-boots',
          'percussion-massage',
          'red-light-therapy',
        ].includes(tag)
      );

      const pageNames = {
        home: 'Vital Ice homepage',
        services: 'Vital Ice services',
        'cold-plunge': 'Cold plunge therapy',
        'infrared-sauna': 'Infrared sauna therapy',
        'traditional-sauna': 'Traditional sauna therapy',
        'compression-boots': 'Compression boot therapy',
        'percussion-massage': 'Percussion massage therapy',
        'red-light-therapy': 'Red light therapy',
      };

      return pageTag
        ? `${pageNames[pageTag]} social media preview`
        : 'Vital Ice social media preview';
    },
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

// Get all assets from Sanity
async function getAllAssets(client) {
  console.log('📁 Fetching all assets...');

  const assets = await client.fetch(`
    *[_type == "sanity.imageAsset"] {
      _id,
      _rev,
      originalFilename,
      title,
      altText,
      description,
      "tags": opt.media.tags,
      url,
      metadata {
        dimensions,
        hasAlpha,
        isOpaque
      },
      uploadId,
      path,
      sha1hash,
      size,
      mimeType
    }
  `);

  console.log(`   Found ${assets.length} assets`);
  return assets;
}

// Analyze asset organization
function analyzeAssetOrganization(assets) {
  console.log('\n🔍 Analyzing asset organization...');

  const analysis = {
    total: assets.length,
    withTags: 0,
    withoutTags: 0,
    withAltText: 0,
    withoutAltText: 0,
    withTitle: 0,
    withoutTitle: 0,
    byCategory: {},
    issues: [],
  };

  assets.forEach(asset => {
    // Count tags
    if (asset.tags && asset.tags.length > 0) {
      analysis.withTags++;

      // Categorize by primary tag
      const primaryTag = asset.tags[0];
      if (!analysis.byCategory[primaryTag]) {
        analysis.byCategory[primaryTag] = 0;
      }
      analysis.byCategory[primaryTag]++;
    } else {
      analysis.withoutTags++;
      analysis.issues.push({
        id: asset._id,
        filename: asset.originalFilename,
        issue: 'Missing tags',
      });
    }

    // Count alt text
    if (asset.altText) {
      analysis.withAltText++;
    } else {
      analysis.withoutAltText++;
      analysis.issues.push({
        id: asset._id,
        filename: asset.originalFilename,
        issue: 'Missing alt text',
      });
    }

    // Count titles
    if (asset.title) {
      analysis.withTitle++;
    } else {
      analysis.withoutTitle++;
      analysis.issues.push({
        id: asset._id,
        filename: asset.originalFilename,
        issue: 'Missing title',
      });
    }

    // Check naming conventions
    if (asset.originalFilename && asset.originalFilename.includes('Untitled')) {
      analysis.issues.push({
        id: asset._id,
        filename: asset.originalFilename,
        issue: 'Generic filename',
      });
    }
  });

  // Report analysis
  console.log(`   Total assets: ${analysis.total}`);
  console.log(
    `   With tags: ${analysis.withTags} (${Math.round((analysis.withTags / analysis.total) * 100)}%)`
  );
  console.log(
    `   With alt text: ${analysis.withAltText} (${Math.round((analysis.withAltText / analysis.total) * 100)}%)`
  );
  console.log(
    `   With titles: ${analysis.withTitle} (${Math.round((analysis.withTitle / analysis.total) * 100)}%)`
  );

  if (Object.keys(analysis.byCategory).length > 0) {
    console.log('   Categories:');
    Object.entries(analysis.byCategory).forEach(([category, count]) => {
      console.log(`     - ${category}: ${count} assets`);
    });
  }

  if (analysis.issues.length > 0) {
    console.log(`   Issues found: ${analysis.issues.length}`);
  }

  return analysis;
}

// Organize assets with proper naming and tagging
async function organizeAssets(client, assets, dryRun = false) {
  console.log('\n🗂️  Organizing assets...');

  const results = [];

  for (const asset of assets) {
    const updates = {};
    let hasUpdates = false;

    // Get current tags
    const tags = asset.tags || [];

    // Generate proper title if missing
    if (!asset.title && tags.length > 0) {
      const category = tags.find(tag => ['service', 'seo'].includes(tag));
      if (category && ASSET_ORGANIZATION.namingRules[category]) {
        const newTitle = ASSET_ORGANIZATION.namingRules[category](asset, tags);
        if (newTitle) {
          updates.title = newTitle;
          hasUpdates = true;
        }
      }
    }

    // Generate proper alt text if missing
    if (!asset.altText && tags.length > 0) {
      const category = tags.find(tag => ['service', 'seo'].includes(tag));
      if (category && ASSET_ORGANIZATION.altTextRules[category]) {
        const newAltText = ASSET_ORGANIZATION.altTextRules[category](asset, tags);
        if (newAltText) {
          updates.altText = newAltText;
          hasUpdates = true;
        }
      }
    }

    // Add description if missing
    if (!asset.description && asset.altText) {
      updates.description = asset.altText;
      hasUpdates = true;
    }

    // Apply updates
    if (hasUpdates) {
      if (dryRun) {
        console.log(`   ✓ Would update: ${asset.originalFilename}`);
        if (updates.title) console.log(`     - Title: "${updates.title}"`);
        if (updates.altText) console.log(`     - Alt text: "${updates.altText}"`);
        if (updates.description) console.log(`     - Description: "${updates.description}"`);

        results.push({
          success: true,
          action: 'would-update',
          id: asset._id,
          filename: asset.originalFilename,
          updates,
        });
      } else {
        try {
          await client.patch(asset._id).set(updates).commit();
          console.log(`   ✅ Updated: ${asset.originalFilename}`);

          results.push({
            success: true,
            action: 'updated',
            id: asset._id,
            filename: asset.originalFilename,
            updates,
          });
        } catch (error) {
          console.error(`   ❌ Failed to update ${asset.originalFilename}:`, error.message);

          results.push({
            success: false,
            action: 'failed',
            id: asset._id,
            filename: asset.originalFilename,
            error: error.message,
          });
        }
      }
    }
  }

  return results;
}

// Find and remove unused assets
async function cleanupUnusedAssets(client, dryRun = false) {
  console.log('\n🧹 Checking for unused assets...');

  // Get all image assets
  const assets = await client.fetch('*[_type == "sanity.imageAsset"]._id');

  // Get all references to image assets
  const references = await client.fetch(`
    *[references(*[_type == "sanity.imageAsset"]._id)] {
      _id,
      _type,
      "references": *[_type == "sanity.imageAsset" && _id in ^.*.asset._ref]._id
    }
  `);

  // Find referenced asset IDs
  const referencedAssets = new Set();
  references.forEach(doc => {
    if (doc.references) {
      doc.references.forEach(ref => referencedAssets.add(ref));
    }
  });

  // Find unused assets
  const unusedAssets = assets.filter(assetId => !referencedAssets.has(assetId));

  console.log(`   Total assets: ${assets.length}`);
  console.log(`   Referenced assets: ${referencedAssets.size}`);
  console.log(`   Unused assets: ${unusedAssets.length}`);

  if (unusedAssets.length === 0) {
    console.log('   ✅ No unused assets found');
    return { removed: 0, assets: [] };
  }

  // Get details of unused assets
  const unusedAssetDetails = await client.fetch(
    `
    *[_type == "sanity.imageAsset" && _id in $ids] {
      _id,
      originalFilename,
      title,
      "tags": opt.media.tags,
      size
    }
  `,
    { ids: unusedAssets }
  );

  if (dryRun) {
    console.log('   ✓ Would remove unused assets:');
    unusedAssetDetails.forEach(asset => {
      console.log(`     - ${asset.originalFilename} (${Math.round(asset.size / 1024)}KB)`);
    });
    return { removed: 0, assets: unusedAssetDetails };
  }

  // Remove unused assets (be very careful with this!)
  console.log('   ⚠️  Removing unused assets...');
  const removeResults = [];

  for (const asset of unusedAssetDetails) {
    try {
      await client.delete(asset._id);
      console.log(`   ✅ Removed: ${asset.originalFilename}`);
      removeResults.push({ success: true, asset });
    } catch (error) {
      console.error(`   ❌ Failed to remove ${asset.originalFilename}:`, error.message);
      removeResults.push({ success: false, asset, error: error.message });
    }
  }

  const successfulRemovals = removeResults.filter(r => r.success).length;
  console.log(`   Removed ${successfulRemovals}/${unusedAssets.length} unused assets`);

  return {
    removed: successfulRemovals,
    assets: unusedAssetDetails,
    results: removeResults,
  };
}

// Create asset usage report
async function createAssetUsageReport(client) {
  console.log('\n📊 Creating asset usage report...');

  const report = {
    totalAssets: 0,
    totalSize: 0,
    byType: {},
    byCategory: {},
    usage: {},
    recommendations: [],
  };

  // Get all assets with usage information
  const assets = await client.fetch(`
    *[_type == "sanity.imageAsset"] {
      _id,
      originalFilename,
      title,
      altText,
      "tags": opt.media.tags,
      size,
      mimeType,
      metadata,
      "usedIn": *[references(^._id)] {
        _type,
        _id,
        title
      }
    }
  `);

  report.totalAssets = assets.length;
  report.totalSize = assets.reduce((sum, asset) => sum + (asset.size || 0), 0);

  assets.forEach(asset => {
    // Count by MIME type
    const mimeType = asset.mimeType || 'unknown';
    if (!report.byType[mimeType]) {
      report.byType[mimeType] = { count: 0, size: 0 };
    }
    report.byType[mimeType].count++;
    report.byType[mimeType].size += asset.size || 0;

    // Count by category (tags)
    const primaryTag = asset.tags?.[0] || 'untagged';
    if (!report.byCategory[primaryTag]) {
      report.byCategory[primaryTag] = { count: 0, size: 0 };
    }
    report.byCategory[primaryTag].count++;
    report.byCategory[primaryTag].size += asset.size || 0;

    // Track usage
    const usageCount = asset.usedIn?.length || 0;
    if (!report.usage[usageCount]) {
      report.usage[usageCount] = 0;
    }
    report.usage[usageCount]++;

    // Generate recommendations
    if (!asset.altText) {
      report.recommendations.push(`Add alt text to ${asset.originalFilename}`);
    }
    if (!asset.tags || asset.tags.length === 0) {
      report.recommendations.push(`Add tags to ${asset.originalFilename}`);
    }
    if (usageCount === 0) {
      report.recommendations.push(`Consider removing unused asset: ${asset.originalFilename}`);
    }
    if (asset.size > 1024 * 1024) {
      // > 1MB
      report.recommendations.push(
        `Optimize large asset: ${asset.originalFilename} (${Math.round(asset.size / 1024 / 1024)}MB)`
      );
    }
  });

  // Display report
  console.log(`   Total assets: ${report.totalAssets}`);
  console.log(`   Total size: ${Math.round(report.totalSize / 1024 / 1024)}MB`);

  console.log('   By type:');
  Object.entries(report.byType).forEach(([type, data]) => {
    console.log(`     - ${type}: ${data.count} assets (${Math.round(data.size / 1024)}KB)`);
  });

  console.log('   By category:');
  Object.entries(report.byCategory).forEach(([category, data]) => {
    console.log(`     - ${category}: ${data.count} assets (${Math.round(data.size / 1024)}KB)`);
  });

  console.log('   Usage distribution:');
  Object.entries(report.usage).forEach(([usageCount, assetCount]) => {
    const usageLabel =
      usageCount === '0'
        ? 'unused'
        : `used in ${usageCount} document${usageCount === '1' ? '' : 's'}`;
    console.log(`     - ${assetCount} assets ${usageLabel}`);
  });

  if (report.recommendations.length > 0) {
    console.log(`   Recommendations (${report.recommendations.length}):`);
    report.recommendations.slice(0, 10).forEach(rec => {
      console.log(`     - ${rec}`);
    });
    if (report.recommendations.length > 10) {
      console.log(`     ... and ${report.recommendations.length - 10} more`);
    }
  }

  return report;
}

// Main organization function
async function runAssetOrganization(options = {}) {
  const { dryRun = false, cleanup = false } = options;

  console.log('🗂️  Starting Sanity asset organization...');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE ORGANIZATION'}`);
  console.log(`   Cleanup: ${cleanup ? 'YES' : 'NO'}`);
  console.log(`   Dataset: ${SANITY_CONFIG.dataset}`);

  // Validate environment
  validateEnvironment();

  // Create Sanity client
  const client = createSanityClient();

  // Get all assets
  const assets = await getAllAssets(client);

  if (assets.length === 0) {
    console.log('\n📭 No assets found to organize');
    return { success: true, assets: [] };
  }

  // Analyze current organization
  const analysis = analyzeAssetOrganization(assets);

  // Organize assets
  const organizeResults = await organizeAssets(client, assets, dryRun);

  // Cleanup unused assets if requested
  let cleanupResults = null;
  if (cleanup) {
    cleanupResults = await cleanupUnusedAssets(client, dryRun);
  }

  // Create usage report
  const usageReport = await createAssetUsageReport(client);

  // Summary
  const successfulUpdates = organizeResults.filter(r => r.success).length;
  const failedUpdates = organizeResults.filter(r => !r.success).length;

  console.log('\n📊 Asset Organization Summary:');
  console.log(`   Total assets: ${assets.length}`);
  console.log(`   Updated: ${successfulUpdates}`);
  console.log(`   Failed: ${failedUpdates}`);
  console.log(`   Issues found: ${analysis.issues.length}`);

  if (cleanupResults) {
    console.log(`   Unused assets removed: ${cleanupResults.removed}`);
  }

  const allSuccessful = failedUpdates === 0;
  console.log(`   Status: ${allSuccessful ? '✅ SUCCESS' : '❌ PARTIAL FAILURE'}`);

  if (!dryRun && allSuccessful) {
    console.log('\n🎉 Asset organization completed successfully!');
    console.log('   Next steps:');
    console.log('   1. Review assets in Sanity Studio');
    console.log('   2. Verify asset references in documents');
    console.log('   3. Test image rendering in your application');
  }

  return {
    success: allSuccessful,
    analysis,
    organizeResults,
    cleanupResults,
    usageReport,
  };
}

// CLI interface
function showHelp() {
  console.log(`
Sanity Asset Organization Script

Usage:
  node scripts/organize-assets.js [options]

Options:
  --dry-run         Show what would be organized without making changes
  --cleanup         Remove unused assets and fix naming issues
  --help           Show this help message

Examples:
  node scripts/organize-assets.js --dry-run
  node scripts/organize-assets.js --cleanup
  node scripts/organize-assets.js --dry-run --cleanup

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
    cleanup: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--cleanup') {
      options.cleanup = true;
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

  runAssetOrganization(options)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Asset organization failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAssetOrganization,
  analyzeAssetOrganization,
  organizeAssets,
  cleanupUnusedAssets,
  createAssetUsageReport,
};
