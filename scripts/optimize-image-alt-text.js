#!/usr/bin/env node

/**
 * Image Alt Text Optimization Script
 *
 * This script audits and optimizes alt text for all images across the Vital Ice website.
 * It identifies images with missing or suboptimal alt text and provides SEO-optimized alternatives.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// SEO-optimized alt text mappings
const OPTIMIZED_ALT_TEXT = {
  // Service Images
  'coldplunge_woman.jpg':
    'Woman experiencing cold plunge therapy for recovery and wellness at Vital Ice San Francisco',
  'ice-vitalblue.jpg':
    'Blue ice texture representing cold plunge therapy benefits at Vital Ice Marina District',
  'ice_vertical-texture.jpg':
    'Vertical ice formation texture for cold therapy wellness center San Francisco',

  'sauna-infraredwide.jpg':
    'Infrared sauna interior with warm cedar panels for heat therapy at Vital Ice San Francisco',
  'embers_closeup.jpg': 'Glowing embers texture representing infrared sauna heat therapy benefits',

  'sauna-traditional.jpg':
    'Traditional Finnish sauna with steam and hot stones for wellness therapy San Francisco',
  'lavastones.jpg':
    'Hot lava stones for traditional sauna heat therapy at Vital Ice Marina District',

  'redlight_mask.jpg':
    'Red light therapy mask for photobiomodulation treatment at Vital Ice San Francisco',
  'redlight_jellyfish.jpg':
    'Red light therapy wavelengths visualization for cellular regeneration wellness',
  'light_blurryhues.jpg': 'Red light therapy spectrum for anti-aging and recovery at Vital Ice',

  'cells-bloodcells.jpg':
    'Blood circulation enhancement through compression boot therapy at Vital Ice San Francisco',
  'stone_whitesky.jpg': 'Natural stone representing grounding and recovery therapy benefits',
  'texture_blacksand-landscape.jpg':
    'Black sand landscape texture for wellness and recovery therapy ambiance',

  'percussion_bicep.jpg':
    'Percussion massage therapy device on bicep for deep tissue recovery San Francisco',
  'texture_blackmarble-cracks.jpg':
    'Black marble texture representing strength and recovery therapy',
  'texture_blackrock.jpg': 'Natural black rock texture for grounding wellness therapy experience',

  // Background and Texture Images
  'vision-forest.jpg':
    'Serene forest landscape representing natural wellness and recovery philosophy',
  'texture_blacksand.jpg': 'Black volcanic sand texture background for wellness center ambiance',
  'hero-ambient-water.jpg': 'Ambient water surface for cold plunge therapy demonstration',
  'indusValley.png': 'Ancient Indus Valley landscape representing timeless wellness traditions',

  // Founder Images (dynamic - handled in component)
  'founder-sean.png': 'Sean, Co-Founder of Vital Ice wellness center San Francisco',
  'founder-stephen.jpg': 'Stephen, Co-Founder of Vital Ice recovery center Marina District',
  'founder-barry.jpg': 'Barry, Co-Founder of Vital Ice wellness and recovery center',

  // Logo Images
  'logo-dark.png':
    'Vital Ice logo - Premier wellness and recovery center in San Francisco Marina District',
  'logo-emblem-white.png':
    'Vital Ice emblem logo for wellness and cold therapy center San Francisco',

  // Benefits Section Optimizations
  'sunset-redhorizon.jpg':
    'Red light therapy wavelengths for cellular regeneration and anti-aging benefits',

  // Gallery Images (sample optimizations)
  'calm_volcanic-lake-shore.jpg':
    'Volcanic lake shore representing natural cold therapy and wellness recovery',
  'ice_morninglight.jpg':
    'Morning ice formation showcasing cold plunge therapy benefits and natural recovery',
  'water_lava-red-lighting.jpg':
    'Lava-heated water representing contrast therapy between hot and cold wellness treatments',
  'cold_arctic-mountains.jpg':
    'Arctic mountain landscape inspiring cold therapy and mental resilience training',
  'lava_aerial-volcanic-cauldron.jpg':
    'Aerial volcanic cauldron representing heat therapy and sauna wellness benefits',
  'ice_stunning-glacier.jpg':
    'Stunning glacier formation representing cold plunge therapy and natural recovery',
  'embers_vertical.jpg': 'Vertical glowing embers for traditional sauna and heat therapy wellness',
  'moon_above-iceberg.jpg':
    'Moon above iceberg representing balance in hot and cold therapy wellness',
};

// Service-specific keyword mappings
const SERVICE_KEYWORDS = {
  coldplunge: ['cold plunge therapy', 'ice bath', 'cold water immersion', 'recovery'],
  sauna: ['sauna therapy', 'heat therapy', 'detoxification', 'wellness'],
  redlight: ['red light therapy', 'photobiomodulation', 'LED therapy', 'anti-aging'],
  compression: ['compression therapy', 'circulation', 'lymphatic drainage', 'recovery'],
  percussion: ['percussion massage', 'deep tissue', 'muscle recovery', 'massage therapy'],
};

// Location keywords for local SEO
const LOCATION_KEYWORDS = ['San Francisco', 'Marina District', 'SF wellness', 'Bay Area'];

/**
 * Extract image filename from URL or path
 */
function extractImageFilename(imagePath) {
  return path.basename(imagePath);
}

/**
 * Generate SEO-optimized alt text
 */
function generateOptimizedAltText(filename, currentAlt = '', context = '') {
  // Check if we have a predefined optimized alt text
  if (OPTIMIZED_ALT_TEXT[filename]) {
    return OPTIMIZED_ALT_TEXT[filename];
  }

  // If current alt text is good, enhance it
  if (currentAlt && currentAlt.length > 10 && !isGenericAltText(currentAlt)) {
    return enhanceAltText(currentAlt, context);
  }

  // Generate new alt text based on filename and context
  return generateFromFilename(filename, context);
}

/**
 * Check if alt text is generic or poor quality
 */
function isGenericAltText(altText) {
  const genericTerms = ['image', 'photo', 'picture', 'graphic', 'img'];
  const lowerAlt = altText.toLowerCase();
  return genericTerms.some(term => lowerAlt.includes(term)) || altText.length < 10;
}

/**
 * Enhance existing alt text with SEO keywords
 */
function enhanceAltText(currentAlt, context) {
  let enhanced = currentAlt;

  // Add location if missing
  if (
    !enhanced.toLowerCase().includes('san francisco') &&
    !enhanced.toLowerCase().includes('marina district')
  ) {
    enhanced += ' at Vital Ice San Francisco';
  }

  // Add service context if missing
  if (
    context &&
    !enhanced.toLowerCase().includes('therapy') &&
    !enhanced.toLowerCase().includes('wellness')
  ) {
    enhanced += ' wellness therapy';
  }

  return enhanced;
}

/**
 * Generate alt text from filename
 */
function generateFromFilename(filename, context) {
  let altText = filename
    .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  // Capitalize first letter
  altText = altText.charAt(0).toUpperCase() + altText.slice(1);

  // Add context-specific enhancements
  if (context.includes('service')) {
    altText += ' therapy for wellness and recovery';
  }

  // Add location for local SEO
  altText += ' at Vital Ice San Francisco';

  return altText;
}

/**
 * Scan file for image usage and alt text
 */
function scanFileForImages(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const images = [];

    // Find Next.js Image components
    const imageRegex = /<Image[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const src = match[1];
      const alt = match[2];
      const filename = extractImageFilename(src);

      images.push({
        filePath,
        src,
        alt,
        filename,
        line: content.substring(0, match.index).split('\n').length,
        fullMatch: match[0],
      });
    }

    // Find img tags
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/g;
    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      const alt = match[2];
      const filename = extractImageFilename(src);

      images.push({
        filePath,
        src,
        alt,
        filename,
        line: content.substring(0, match.index).split('\n').length,
        fullMatch: match[0],
      });
    }

    return images;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }

  return files;
}

/**
 * Analyze image usage across the codebase
 */
function analyzeImageUsage() {
  console.log(
    `${colors.blue}${colors.bright}🔍 Analyzing image usage across Vital Ice website...${colors.reset}\n`
  );

  const srcFiles = scanDirectory('./src');
  const allImages = [];
  const issues = [];
  const recommendations = [];

  for (const file of srcFiles) {
    const images = scanFileForImages(file);
    allImages.push(...images);
  }

  console.log(`${colors.cyan}📊 Found ${allImages.length} image references${colors.reset}\n`);

  // Analyze each image
  for (const image of allImages) {
    const analysis = analyzeImage(image);
    if (analysis.hasIssues) {
      issues.push(analysis);
    }
    if (analysis.recommendations.length > 0) {
      recommendations.push(analysis);
    }
  }

  return { allImages, issues, recommendations };
}

/**
 * Analyze individual image for SEO and accessibility issues
 */
function analyzeImage(image) {
  const analysis = {
    image,
    hasIssues: false,
    issues: [],
    recommendations: [],
    optimizedAlt: '',
  };

  // Check for missing alt text
  if (!image.alt || image.alt.trim().length === 0) {
    analysis.hasIssues = true;
    analysis.issues.push('Missing alt text');
  }

  // Check for generic alt text
  if (image.alt && isGenericAltText(image.alt)) {
    analysis.hasIssues = true;
    analysis.issues.push('Generic or poor quality alt text');
  }

  // Check alt text length
  if (image.alt && image.alt.length > 125) {
    analysis.recommendations.push('Alt text is too long (>125 characters)');
  } else if (image.alt && image.alt.length < 10) {
    analysis.recommendations.push('Alt text is too short (<10 characters)');
  }

  // Check for SEO keywords
  const hasWellnessKeywords =
    image.alt &&
    ['therapy', 'wellness', 'recovery', 'sauna', 'cold plunge', 'massage'].some(keyword =>
      image.alt.toLowerCase().includes(keyword)
    );

  if (!hasWellnessKeywords) {
    analysis.recommendations.push('Missing wellness/therapy keywords');
  }

  // Check for location keywords
  const hasLocationKeywords =
    image.alt &&
    ['san francisco', 'marina district', 'sf', 'bay area'].some(location =>
      image.alt.toLowerCase().includes(location)
    );

  if (!hasLocationKeywords) {
    analysis.recommendations.push('Missing location keywords for local SEO');
  }

  // Generate optimized alt text
  const context = image.filePath.includes('/services/')
    ? 'service'
    : image.filePath.includes('/about/')
      ? 'founder'
      : image.filePath.includes('Gallery')
        ? 'gallery'
        : '';

  analysis.optimizedAlt = generateOptimizedAltText(image.filename, image.alt, context);

  return analysis;
}

/**
 * Generate detailed report
 */
function generateReport(analysisResults) {
  const { allImages, issues, recommendations } = analysisResults;

  console.log(`${colors.green}${colors.bright}📋 IMAGE SEO AUDIT REPORT${colors.reset}`);
  console.log(`${colors.green}================================${colors.reset}\n`);

  // Summary statistics
  console.log(`${colors.cyan}📊 SUMMARY STATISTICS${colors.reset}`);
  console.log(`Total images found: ${colors.bright}${allImages.length}${colors.reset}`);
  console.log(`Images with issues: ${colors.red}${colors.bright}${issues.length}${colors.reset}`);
  console.log(
    `Images needing optimization: ${colors.yellow}${colors.bright}${recommendations.length}${colors.reset}`
  );
  console.log(
    `Compliance rate: ${colors.green}${colors.bright}${Math.round(((allImages.length - issues.length) / allImages.length) * 100)}%${colors.reset}\n`
  );

  // Critical issues
  if (issues.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 CRITICAL ISSUES${colors.reset}`);
    console.log(`${colors.red}==================${colors.reset}\n`);

    issues.forEach((analysis, index) => {
      console.log(`${colors.red}${index + 1}. ${analysis.image.filename}${colors.reset}`);
      console.log(`   File: ${analysis.image.filePath}:${analysis.image.line}`);
      console.log(`   Current alt: "${analysis.image.alt || 'MISSING'}"`);
      console.log(`   Issues: ${analysis.issues.join(', ')}`);
      console.log(`   ${colors.green}Suggested alt: "${analysis.optimizedAlt}"${colors.reset}\n`);
    });
  }

  // Optimization recommendations
  if (recommendations.length > 0) {
    console.log(`${colors.yellow}${colors.bright}💡 OPTIMIZATION RECOMMENDATIONS${colors.reset}`);
    console.log(`${colors.yellow}================================${colors.reset}\n`);

    recommendations.slice(0, 10).forEach((analysis, index) => {
      if (!analysis.hasIssues) {
        // Only show non-critical recommendations
        console.log(`${colors.yellow}${index + 1}. ${analysis.image.filename}${colors.reset}`);
        console.log(`   Current alt: "${analysis.image.alt}"`);
        console.log(`   ${colors.green}Optimized alt: "${analysis.optimizedAlt}"${colors.reset}`);
        console.log(`   Improvements: ${analysis.recommendations.join(', ')}\n`);
      }
    });

    if (recommendations.length > 10) {
      console.log(
        `   ${colors.cyan}... and ${recommendations.length - 10} more recommendations${colors.reset}\n`
      );
    }
  }

  // SEO Impact Analysis
  console.log(`${colors.magenta}${colors.bright}🎯 SEO IMPACT ANALYSIS${colors.reset}`);
  console.log(`${colors.magenta}=======================${colors.reset}\n`);

  const missingAltCount = issues.filter(i => i.issues.includes('Missing alt text')).length;
  const genericAltCount = issues.filter(i =>
    i.issues.includes('Generic or poor quality alt text')
  ).length;
  const missingKeywordsCount = recommendations.filter(r =>
    r.recommendations.includes('Missing wellness/therapy keywords')
  ).length;
  const missingLocationCount = recommendations.filter(r =>
    r.recommendations.includes('Missing location keywords for local SEO')
  ).length;

  console.log(
    `Images missing alt text: ${colors.red}${missingAltCount}${colors.reset} (Critical for accessibility)`
  );
  console.log(
    `Images with generic alt text: ${colors.red}${genericAltCount}${colors.reset} (Poor SEO value)`
  );
  console.log(
    `Images missing wellness keywords: ${colors.yellow}${missingKeywordsCount}${colors.reset} (SEO opportunity)`
  );
  console.log(
    `Images missing location keywords: ${colors.yellow}${missingLocationCount}${colors.reset} (Local SEO opportunity)\n`
  );

  // Next steps
  console.log(`${colors.blue}${colors.bright}🚀 NEXT STEPS${colors.reset}`);
  console.log(`${colors.blue}=============${colors.reset}\n`);
  console.log(
    `1. ${colors.bright}Fix critical issues${colors.reset}: Update ${issues.length} images with missing or poor alt text`
  );
  console.log(
    `2. ${colors.bright}Implement lazy loading${colors.reset}: Add lazy loading to non-critical images`
  );
  console.log(
    `3. ${colors.bright}Add WebP support${colors.reset}: Convert images to modern formats`
  );
  console.log(
    `4. ${colors.bright}Optimize for Core Web Vitals${colors.reset}: Implement responsive image sizing`
  );
  console.log(
    `5. ${colors.bright}Monitor performance${colors.reset}: Set up image performance tracking\n`
  );

  return {
    totalImages: allImages.length,
    criticalIssues: issues.length,
    optimizationOpportunities: recommendations.length,
    complianceRate: Math.round(((allImages.length - issues.length) / allImages.length) * 100),
  };
}

/**
 * Main execution function
 */
function main() {
  console.log(
    `${colors.cyan}${colors.bright}🖼️  Vital Ice Image SEO Optimization Tool${colors.reset}`
  );
  console.log(`${colors.cyan}==========================================${colors.reset}\n`);

  try {
    const analysisResults = analyzeImageUsage();
    const report = generateReport(analysisResults);

    // Save detailed report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: report,
      issues: analysisResults.issues,
      recommendations: analysisResults.recommendations,
      allImages: analysisResults.allImages,
    };

    fs.writeFileSync('./image-seo-audit-report.json', JSON.stringify(reportData, null, 2));

    console.log(
      `${colors.green}✅ Detailed report saved to: image-seo-audit-report.json${colors.reset}\n`
    );

    // Exit with appropriate code
    process.exit(analysisResults.issues.length > 0 ? 1 : 0);
  } catch (error) {
    console.error(`${colors.red}❌ Error during analysis:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  analyzeImageUsage,
  generateOptimizedAltText,
  OPTIMIZED_ALT_TEXT,
};
