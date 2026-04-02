#!/usr/bin/env node

/**
 * Image Accessibility Validation Script
 *
 * This script validates that all images meet WCAG 2.1 AA accessibility standards
 * and provides recommendations for improvement.
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

// WCAG 2.1 AA Guidelines for images
const WCAG_GUIDELINES = {
  altText: {
    required: true,
    minLength: 5,
    maxLength: 125,
    shouldNotContain: ['image', 'photo', 'picture', 'graphic', 'img'],
    shouldContain: ['descriptive content about the image purpose'],
  },
  decorativeImages: {
    altText: '', // Empty alt for decorative images
    ariaHidden: true,
  },
  informativeImages: {
    altText: 'descriptive', // Must describe the image content and purpose
    context: 'must provide equivalent information',
  },
  functionalImages: {
    altText: 'action', // Must describe the function/action
    context: 'must describe what happens when activated',
  },
};

/**
 * Scan file for image usage and accessibility attributes
 */
function scanFileForImageAccessibility(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const images = [];

    // Enhanced regex to capture more attributes
    const imageRegex = /<Image[^>]*>/g;
    const imgRegex = /<img[^>]*>/g;

    let match;

    // Scan Next.js Image components
    while ((match = imageRegex.exec(content)) !== null) {
      const imageTag = match[0];
      const analysis = analyzeImageTag(imageTag, filePath, content, match.index);
      if (analysis) {
        images.push(analysis);
      }
    }

    // Scan regular img tags
    while ((match = imgRegex.exec(content)) !== null) {
      const imageTag = match[0];
      const analysis = analyzeImageTag(imageTag, filePath, content, match.index);
      if (analysis) {
        images.push(analysis);
      }
    }

    return images;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Analyze individual image tag for accessibility compliance
 */
function analyzeImageTag(imageTag, filePath, content, index) {
  const line = content.substring(0, index).split('\n').length;

  // Extract attributes
  const src = extractAttribute(imageTag, 'src');
  const alt = extractAttribute(imageTag, 'alt');
  const title = extractAttribute(imageTag, 'title');
  const ariaLabel = extractAttribute(imageTag, 'aria-label');
  const ariaHidden = extractAttribute(imageTag, 'aria-hidden');
  const role = extractAttribute(imageTag, 'role');
  const loading = extractAttribute(imageTag, 'loading');
  const priority = imageTag.includes('priority');

  if (!src) return null;

  return {
    filePath,
    line,
    src,
    alt: alt || '',
    title: title || '',
    ariaLabel: ariaLabel || '',
    ariaHidden: ariaHidden === 'true',
    role: role || '',
    loading: loading || (priority ? 'eager' : 'lazy'),
    priority,
    imageTag,
    filename: path.basename(src),
  };
}

/**
 * Extract attribute value from HTML tag
 */
function extractAttribute(tag, attributeName) {
  const regex = new RegExp(`${attributeName}=["']([^"']*)["']`, 'i');
  const match = tag.match(regex);
  return match ? match[1] : null;
}

/**
 * Validate image accessibility according to WCAG 2.1 AA
 */
function validateImageAccessibility(image) {
  const issues = [];
  const warnings = [];
  const recommendations = [];
  let score = 100;

  // 1. Alt text validation (WCAG 1.1.1 - Non-text Content)
  if (!image.alt && !image.ariaHidden) {
    issues.push('Missing alt text (WCAG 1.1.1 violation)');
    score -= 30;
  } else if (image.alt) {
    // Check alt text quality
    if (image.alt.length < WCAG_GUIDELINES.altText.minLength) {
      warnings.push('Alt text too short (less than 5 characters)');
      score -= 10;
    }

    if (image.alt.length > WCAG_GUIDELINES.altText.maxLength) {
      warnings.push('Alt text too long (over 125 characters)');
      score -= 5;
    }

    // Check for generic terms
    const hasGenericTerms = WCAG_GUIDELINES.altText.shouldNotContain.some(term =>
      image.alt.toLowerCase().includes(term.toLowerCase())
    );
    if (hasGenericTerms) {
      warnings.push('Alt text contains generic terms (image, photo, etc.)');
      score -= 15;
    }

    // Check for redundant information
    if (
      image.alt.toLowerCase().includes('image of') ||
      image.alt.toLowerCase().includes('picture of') ||
      image.alt.toLowerCase().includes('photo of')
    ) {
      warnings.push('Alt text contains redundant phrases');
      score -= 10;
    }
  }

  // 2. Decorative images validation
  if (isDecorativeImage(image)) {
    if (image.alt !== '' && !image.ariaHidden) {
      recommendations.push(
        'Consider using empty alt="" or aria-hidden="true" for decorative images'
      );
      score -= 5;
    }
  }

  // 3. Functional images validation
  if (isFunctionalImage(image)) {
    if (!image.alt || !describesToAction(image.alt)) {
      warnings.push('Functional image should describe the action, not appearance');
      score -= 20;
    }
  }

  // 4. Context and meaning validation (WCAG 1.3.1 - Info and Relationships)
  if (image.alt && !providesContext(image.alt, image.src)) {
    recommendations.push('Alt text should provide context about image purpose');
    score -= 5;
  }

  // 5. Performance and loading validation
  if (!image.loading || image.loading === 'auto') {
    recommendations.push('Consider explicit loading="lazy" for non-critical images');
  }

  // 6. SEO and local optimization
  if (!includesRelevantKeywords(image.alt)) {
    recommendations.push('Consider adding relevant wellness/therapy keywords');
  }

  if (!includesLocationKeywords(image.alt)) {
    recommendations.push('Consider adding location context for local SEO');
  }

  return {
    image,
    score: Math.max(0, score),
    issues,
    warnings,
    recommendations,
    isCompliant: issues.length === 0,
    grade: getAccessibilityGrade(score),
  };
}

/**
 * Determine if image is decorative
 */
function isDecorativeImage(image) {
  const decorativePatterns = ['background', 'texture', 'pattern', 'decoration', 'ornament'];

  return decorativePatterns.some(
    pattern =>
      image.src.toLowerCase().includes(pattern) || image.alt.toLowerCase().includes(pattern)
  );
}

/**
 * Determine if image is functional (clickable, interactive)
 */
function isFunctionalImage(image) {
  const functionalPatterns = ['logo', 'button', 'icon', 'link'];

  return functionalPatterns.some(
    pattern =>
      image.src.toLowerCase().includes(pattern) ||
      image.alt.toLowerCase().includes(pattern) ||
      image.filePath.includes('Button') ||
      image.filePath.includes('Logo')
  );
}

/**
 * Check if alt text describes action for functional images
 */
function describesToAction(altText) {
  const actionWords = [
    'click',
    'navigate',
    'go to',
    'visit',
    'contact',
    'book',
    'schedule',
    'logo',
    'home',
    'menu',
    'search',
    'submit',
  ];

  return actionWords.some(word => altText.toLowerCase().includes(word));
}

/**
 * Check if alt text provides meaningful context
 */
function providesContext(altText, src) {
  // Check if alt text relates to the business/service
  const contextKeywords = [
    'vital ice',
    'wellness',
    'therapy',
    'recovery',
    'sauna',
    'cold plunge',
    'massage',
    'san francisco',
    'marina district',
  ];

  return contextKeywords.some(keyword => altText.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Check if alt text includes relevant wellness keywords
 */
function includesRelevantKeywords(altText) {
  const wellnessKeywords = [
    'therapy',
    'wellness',
    'recovery',
    'sauna',
    'cold plunge',
    'massage',
    'infrared',
    'compression',
    'percussion',
    'red light',
  ];

  return wellnessKeywords.some(keyword => altText.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Check if alt text includes location keywords
 */
function includesLocationKeywords(altText) {
  const locationKeywords = ['san francisco', 'marina district', 'sf', 'bay area'];

  return locationKeywords.some(keyword => altText.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Get accessibility grade based on score
 */
function getAccessibilityGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
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
 * Generate comprehensive accessibility report
 */
function generateAccessibilityReport(validationResults) {
  console.log(`${colors.blue}${colors.bright}♿ IMAGE ACCESSIBILITY AUDIT REPORT${colors.reset}`);
  console.log(`${colors.blue}=====================================${colors.reset}\n`);

  const totalImages = validationResults.length;
  const compliantImages = validationResults.filter(r => r.isCompliant).length;
  const criticalIssues = validationResults.filter(r => r.issues.length > 0).length;
  const averageScore = validationResults.reduce((sum, r) => sum + r.score, 0) / totalImages;

  // Summary statistics
  console.log(`${colors.cyan}📊 ACCESSIBILITY SUMMARY${colors.reset}`);
  console.log(`Total images analyzed: ${colors.bright}${totalImages}${colors.reset}`);
  console.log(
    `WCAG 2.1 AA compliant: ${colors.green}${colors.bright}${compliantImages}${colors.reset} (${Math.round((compliantImages / totalImages) * 100)}%)`
  );
  console.log(`Critical violations: ${colors.red}${colors.bright}${criticalIssues}${colors.reset}`);
  console.log(
    `Average accessibility score: ${colors.bright}${averageScore.toFixed(1)}/100${colors.reset} (${getAccessibilityGrade(averageScore)})\n`
  );

  // Critical issues
  const criticalResults = validationResults.filter(r => r.issues.length > 0);
  if (criticalResults.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 CRITICAL ACCESSIBILITY VIOLATIONS${colors.reset}`);
    console.log(`${colors.red}====================================${colors.reset}\n`);

    criticalResults.forEach((result, index) => {
      console.log(
        `${colors.red}${index + 1}. ${result.image.filename}${colors.reset} (Score: ${result.score}/100)`
      );
      console.log(`   File: ${result.image.filePath}:${result.image.line}`);
      console.log(`   Alt text: "${result.image.alt || 'MISSING'}"`);
      console.log(`   ${colors.red}Issues:${colors.reset}`);
      result.issues.forEach(issue => console.log(`     • ${issue}`));
      if (result.warnings.length > 0) {
        console.log(`   ${colors.yellow}Warnings:${colors.reset}`);
        result.warnings.forEach(warning => console.log(`     • ${warning}`));
      }
      console.log();
    });
  }

  // Grade distribution
  console.log(
    `${colors.magenta}${colors.bright}📈 ACCESSIBILITY GRADE DISTRIBUTION${colors.reset}`
  );
  console.log(`${colors.magenta}===================================${colors.reset}\n`);

  const gradeDistribution = {};
  validationResults.forEach(result => {
    gradeDistribution[result.grade] = (gradeDistribution[result.grade] || 0) + 1;
  });

  Object.entries(gradeDistribution)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([grade, count]) => {
      const percentage = Math.round((count / totalImages) * 100);
      const color = grade.startsWith('A')
        ? colors.green
        : grade.startsWith('B')
          ? colors.yellow
          : grade.startsWith('C')
            ? colors.magenta
            : colors.red;
      console.log(`${color}${grade}:${colors.reset} ${count} images (${percentage}%)`);
    });

  console.log();

  // Recommendations
  const allRecommendations = validationResults.flatMap(r => r.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)];

  if (uniqueRecommendations.length > 0) {
    console.log(`${colors.cyan}${colors.bright}💡 ACCESSIBILITY RECOMMENDATIONS${colors.reset}`);
    console.log(`${colors.cyan}=================================${colors.reset}\n`);

    uniqueRecommendations.forEach((rec, index) => {
      const count = allRecommendations.filter(r => r === rec).length;
      console.log(`${index + 1}. ${rec} (${count} images)`);
    });
    console.log();
  }

  // WCAG 2.1 AA Compliance Checklist
  console.log(`${colors.green}${colors.bright}✅ WCAG 2.1 AA COMPLIANCE CHECKLIST${colors.reset}`);
  console.log(`${colors.green}===================================${colors.reset}\n`);

  const checks = [
    {
      criterion: '1.1.1 Non-text Content',
      description: 'All images have appropriate alt text',
      passed: validationResults.filter(r => !r.issues.some(i => i.includes('Missing alt text')))
        .length,
      total: totalImages,
    },
    {
      criterion: '1.3.1 Info and Relationships',
      description: 'Alt text provides meaningful context',
      passed: validationResults.filter(r => r.score >= 80).length,
      total: totalImages,
    },
    {
      criterion: '2.4.4 Link Purpose',
      description: 'Functional images describe their purpose',
      passed: validationResults.filter(r => !isFunctionalImage(r.image) || r.score >= 75).length,
      total: totalImages,
    },
  ];

  checks.forEach(check => {
    const percentage = Math.round((check.passed / check.total) * 100);
    const status =
      percentage >= 100
        ? `${colors.green}✅ PASS${colors.reset}`
        : percentage >= 80
          ? `${colors.yellow}⚠️  WARN${colors.reset}`
          : `${colors.red}❌ FAIL${colors.reset}`;

    console.log(`${check.criterion}: ${status} (${check.passed}/${check.total} - ${percentage}%)`);
    console.log(`   ${check.description}\n`);
  });

  // Next steps
  console.log(`${colors.blue}${colors.bright}🚀 NEXT STEPS FOR COMPLIANCE${colors.reset}`);
  console.log(`${colors.blue}=============================${colors.reset}\n`);

  if (criticalIssues > 0) {
    console.log(
      `1. ${colors.bright}Fix critical violations${colors.reset}: Address ${criticalIssues} images with missing alt text`
    );
  }
  console.log(
    `2. ${colors.bright}Improve alt text quality${colors.reset}: Enhance descriptions for better context`
  );
  console.log(
    `3. ${colors.bright}Add SEO optimization${colors.reset}: Include relevant wellness and location keywords`
  );
  console.log(
    `4. ${colors.bright}Implement lazy loading${colors.reset}: Optimize performance for non-critical images`
  );
  console.log(
    `5. ${colors.bright}Regular monitoring${colors.reset}: Set up automated accessibility testing\n`
  );

  return {
    totalImages,
    compliantImages,
    criticalIssues,
    averageScore,
    complianceRate: Math.round((compliantImages / totalImages) * 100),
  };
}

/**
 * Main execution function
 */
function main() {
  console.log(
    `${colors.cyan}${colors.bright}♿ Vital Ice Image Accessibility Validator${colors.reset}`
  );
  console.log(`${colors.cyan}=========================================${colors.reset}\n`);

  try {
    const srcFiles = scanDirectory('./src');
    const allImages = [];

    // Scan all files for images
    for (const file of srcFiles) {
      const images = scanFileForImageAccessibility(file);
      allImages.push(...images);
    }

    console.log(
      `${colors.blue}🔍 Analyzing ${allImages.length} images for accessibility compliance...${colors.reset}\n`
    );

    // Validate each image
    const validationResults = allImages.map(image => validateImageAccessibility(image));

    // Generate report
    const summary = generateAccessibilityReport(validationResults);

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary,
      validationResults,
      wcagVersion: '2.1 AA',
      guidelines: WCAG_GUIDELINES,
    };

    fs.writeFileSync('./image-accessibility-report.json', JSON.stringify(reportData, null, 2));

    console.log(
      `${colors.green}✅ Detailed report saved to: image-accessibility-report.json${colors.reset}\n`
    );

    // Exit with appropriate code
    process.exit(summary.criticalIssues > 0 ? 1 : 0);
  } catch (error) {
    console.error(`${colors.red}❌ Error during validation:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  validateImageAccessibility,
  scanFileForImageAccessibility,
  WCAG_GUIDELINES,
};
