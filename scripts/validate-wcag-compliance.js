#!/usr/bin/env node

/**
 * WCAG 2.1 AA Compliance Validation Script
 *
 * This script validates the website against WCAG 2.1 AA accessibility standards
 * including heading structure, keyboard navigation, and zoom functionality.
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

// WCAG 2.1 AA Success Criteria
const WCAG_CRITERIA = {
  '1.1.1': {
    name: 'Non-text Content',
    level: 'A',
    description: 'All non-text content has text alternatives',
  },
  '1.3.1': {
    name: 'Info and Relationships',
    level: 'A',
    description: 'Information and relationships are programmatically determinable',
  },
  '1.4.3': {
    name: 'Contrast (Minimum)',
    level: 'AA',
    description: 'Text has contrast ratio of at least 4.5:1',
  },
  '1.4.10': {
    name: 'Reflow',
    level: 'AA',
    description: 'Content can be presented without horizontal scrolling at 320px width',
  },
  '2.1.1': {
    name: 'Keyboard',
    level: 'A',
    description: 'All functionality is available from keyboard',
  },
  '2.4.1': {
    name: 'Bypass Blocks',
    level: 'A',
    description: 'Skip links or other bypass mechanisms are available',
  },
  '2.4.6': {
    name: 'Headings and Labels',
    level: 'AA',
    description: 'Headings and labels describe topic or purpose',
  },
  '3.2.3': {
    name: 'Consistent Navigation',
    level: 'AA',
    description: 'Navigation is consistent across pages',
  },
  '4.1.2': {
    name: 'Name, Role, Value',
    level: 'A',
    description: 'UI components have accessible names and roles',
  },
};

/**
 * Scan file for accessibility issues
 */
function scanFileForAccessibility(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    const recommendations = [];

    // Check heading structure (WCAG 2.4.6)
    const headingIssues = checkHeadingStructure(content, filePath);
    issues.push(...headingIssues.issues);
    recommendations.push(...headingIssues.recommendations);

    // Check keyboard navigation (WCAG 2.1.1)
    const keyboardIssues = checkKeyboardNavigation(content, filePath);
    issues.push(...keyboardIssues.issues);
    recommendations.push(...keyboardIssues.recommendations);

    // Check focus management (WCAG 2.4.7)
    const focusIssues = checkFocusManagement(content, filePath);
    issues.push(...focusIssues.issues);
    recommendations.push(...focusIssues.recommendations);

    // Check semantic HTML (WCAG 1.3.1)
    const semanticIssues = checkSemanticHTML(content, filePath);
    issues.push(...semanticIssues.issues);
    recommendations.push(...semanticIssues.recommendations);

    // Check ARIA usage (WCAG 4.1.2)
    const ariaIssues = checkARIAUsage(content, filePath);
    issues.push(...ariaIssues.issues);
    recommendations.push(...ariaIssues.recommendations);

    return {
      filePath,
      issues,
      recommendations,
      totalChecks: 5,
      passedChecks: 5 - issues.length,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Check heading structure for proper hierarchy
 */
function checkHeadingStructure(content, filePath) {
  const issues = [];
  const recommendations = [];

  // Find all heading tags
  const headingRegex = /<h([1-6])[^>]*>/gi;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const line = content.substring(0, match.index).split('\n').length;
    headings.push({ level, line, tag: match[0] });
  }

  if (headings.length === 0) {
    recommendations.push('Consider adding headings for better content structure');
    return { issues, recommendations };
  }

  // Check for H1
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push('Missing H1 heading (WCAG 2.4.6 violation)');
  } else if (h1Count > 1) {
    issues.push('Multiple H1 headings found - should have only one per page');
  }

  // Check heading hierarchy
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];

    if (current.level > previous.level + 1) {
      issues.push(
        `Heading hierarchy skip from H${previous.level} to H${current.level} at line ${current.line}`
      );
    }
  }

  // Check for empty headings
  const emptyHeadingRegex = /<h[1-6][^>]*>\s*<\/h[1-6]>/gi;
  if (emptyHeadingRegex.test(content)) {
    issues.push('Empty heading tags found');
  }

  return { issues, recommendations };
}

/**
 * Check keyboard navigation support
 */
function checkKeyboardNavigation(content, filePath) {
  const issues = [];
  const recommendations = [];

  // Check for interactive elements without keyboard support
  const interactiveElements = [
    { regex: /<div[^>]*onClick/gi, element: 'div with onClick' },
    { regex: /<span[^>]*onClick/gi, element: 'span with onClick' },
    { regex: /<img[^>]*onClick/gi, element: 'img with onClick' },
  ];

  interactiveElements.forEach(({ regex, element }) => {
    if (regex.test(content)) {
      // Check if tabIndex or role is present
      const hasTabIndex = content.includes('tabIndex') || content.includes('tabindex');
      const hasRole = content.includes('role=');

      if (!hasTabIndex && !hasRole) {
        issues.push(`${element} may not be keyboard accessible (missing tabIndex or role)`);
      }
    }
  });

  // Check for skip links
  const hasSkipLink = /skip.*to.*content|skip.*navigation/i.test(content);
  if (!hasSkipLink && filePath.includes('layout')) {
    recommendations.push('Consider adding skip links for keyboard navigation');
  }

  // Check for focus management in modals/dialogs
  if (content.includes('modal') || content.includes('dialog')) {
    const hasFocusManagement = content.includes('focus()') || content.includes('autoFocus');
    if (!hasFocusManagement) {
      recommendations.push('Modal/dialog components should manage focus');
    }
  }

  return { issues, recommendations };
}

/**
 * Check focus management and visibility
 */
function checkFocusManagement(content, filePath) {
  const issues = [];
  const recommendations = [];

  // Check for focus styles
  const hasFocusStyles = content.includes(':focus') || content.includes('focus-visible');
  if (!hasFocusStyles && (content.includes('button') || content.includes('link'))) {
    recommendations.push('Add visible focus indicators for interactive elements');
  }

  // Check for focus trapping in modals
  if (content.includes('modal') || content.includes('Modal')) {
    const hasFocusTrap = content.includes('trap') || content.includes('focus-trap');
    if (!hasFocusTrap) {
      recommendations.push('Implement focus trapping for modal components');
    }
  }

  return { issues, recommendations };
}

/**
 * Check semantic HTML usage
 */
function checkSemanticHTML(content, filePath) {
  const issues = [];
  const recommendations = [];

  // Check for semantic landmarks
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
  const hasLandmarks = landmarks.some(
    landmark => content.includes(`<${landmark}`) || content.includes(`role="${landmark}"`)
  );

  if (!hasLandmarks && filePath.includes('layout')) {
    recommendations.push('Use semantic HTML landmarks (main, nav, header, footer)');
  }

  // Check for list markup
  const hasListItems = content.includes('<li>');
  const hasListContainers = content.includes('<ul>') || content.includes('<ol>');

  if (hasListItems && !hasListContainers) {
    issues.push('List items found without proper list containers');
  }

  // Check for form labels
  const hasInputs = /<input[^>]*>/gi.test(content);
  const hasLabels = /<label[^>]*>/gi.test(content);

  if (hasInputs && !hasLabels) {
    const hasAriaLabel = content.includes('aria-label');
    if (!hasAriaLabel) {
      issues.push('Form inputs without associated labels or aria-label');
    }
  }

  return { issues, recommendations };
}

/**
 * Check ARIA usage and accessibility
 */
function checkARIAUsage(content, filePath) {
  const issues = [];
  const recommendations = [];

  // Check for ARIA labels on interactive elements
  const buttons = content.match(/<button[^>]*>/gi) || [];
  buttons.forEach(button => {
    const hasAriaLabel = button.includes('aria-label');
    const hasText = !button.includes('/>') && !button.includes('></button>');

    if (!hasAriaLabel && !hasText) {
      issues.push('Button without accessible name (missing aria-label or text content)');
    }
  });

  // Check for proper ARIA roles
  const customComponents = content.match(/<[A-Z][^>]*>/g) || [];
  if (customComponents.length > 0) {
    recommendations.push('Ensure custom components have appropriate ARIA roles');
  }

  // Check for ARIA live regions for dynamic content
  if (content.includes('useState') || content.includes('useEffect')) {
    const hasLiveRegion = content.includes('aria-live') || content.includes('role="status"');
    if (!hasLiveRegion) {
      recommendations.push('Consider ARIA live regions for dynamic content updates');
    }
  }

  return { issues, recommendations };
}

/**
 * Check CSS for accessibility issues
 */
function checkCSSAccessibility(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    const recommendations = [];

    // Check for zoom/reflow support (WCAG 1.4.10)
    const hasResponsiveUnits = /rem|em|%|vw|vh|fr/g.test(content);
    if (!hasResponsiveUnits) {
      recommendations.push('Use relative units (rem, em, %) for better zoom support');
    }

    // Check for focus styles
    const hasFocusStyles = /:focus|focus-visible/g.test(content);
    if (!hasFocusStyles) {
      recommendations.push('Add focus styles for keyboard navigation');
    }

    // Check for reduced motion support
    const hasReducedMotion = /prefers-reduced-motion/g.test(content);
    if (content.includes('animation') && !hasReducedMotion) {
      recommendations.push('Add prefers-reduced-motion support for animations');
    }

    // Check for high contrast support
    const hasHighContrast = /prefers-contrast|forced-colors/g.test(content);
    if (!hasHighContrast) {
      recommendations.push('Consider high contrast mode support');
    }

    return { issues, recommendations };
  } catch (error) {
    return { issues: [], recommendations: [] };
  }
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(
  dirPath,
  extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.module.css']
) {
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
function generateAccessibilityReport(results) {
  console.log(`${colors.blue}${colors.bright}♿ WCAG 2.1 AA COMPLIANCE REPORT${colors.reset}`);
  console.log(`${colors.blue}=================================${colors.reset}\n`);

  const totalFiles = results.length;
  const filesWithIssues = results.filter(r => r.issues.length > 0).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalRecommendations = results.reduce((sum, r) => sum + r.recommendations.length, 0);

  // Summary statistics
  console.log(`${colors.cyan}📊 ACCESSIBILITY SUMMARY${colors.reset}`);
  console.log(`Files analyzed: ${colors.bright}${totalFiles}${colors.reset}`);
  console.log(`Files with issues: ${colors.red}${colors.bright}${filesWithIssues}${colors.reset}`);
  console.log(`Total violations: ${colors.red}${colors.bright}${totalIssues}${colors.reset}`);
  console.log(
    `Recommendations: ${colors.yellow}${colors.bright}${totalRecommendations}${colors.reset}`
  );
  console.log(
    `Compliance rate: ${colors.green}${colors.bright}${Math.round(((totalFiles - filesWithIssues) / totalFiles) * 100)}%${colors.reset}\n`
  );

  // Critical issues
  const criticalResults = results.filter(r => r.issues.length > 0);
  if (criticalResults.length > 0) {
    console.log(`${colors.red}${colors.bright}🚨 ACCESSIBILITY VIOLATIONS${colors.reset}`);
    console.log(`${colors.red}===========================${colors.reset}\n`);

    criticalResults.forEach((result, index) => {
      console.log(`${colors.red}${index + 1}. ${path.basename(result.filePath)}${colors.reset}`);
      console.log(`   File: ${result.filePath}`);
      result.issues.forEach(issue => {
        console.log(`   ${colors.red}• ${issue}${colors.reset}`);
      });
      console.log();
    });
  }

  // WCAG Success Criteria Checklist
  console.log(`${colors.green}${colors.bright}✅ WCAG 2.1 AA SUCCESS CRITERIA${colors.reset}`);
  console.log(`${colors.green}================================${colors.reset}\n`);

  const criteriaChecks = [
    {
      id: '1.1.1',
      name: 'Non-text Content',
      passed: !results.some(r => r.issues.some(i => i.includes('alt text'))),
    },
    {
      id: '1.3.1',
      name: 'Info and Relationships',
      passed: !results.some(r => r.issues.some(i => i.includes('heading') || i.includes('list'))),
    },
    {
      id: '2.1.1',
      name: 'Keyboard',
      passed: !results.some(r => r.issues.some(i => i.includes('keyboard'))),
    },
    {
      id: '2.4.6',
      name: 'Headings and Labels',
      passed: !results.some(r => r.issues.some(i => i.includes('H1') || i.includes('heading'))),
    },
    {
      id: '4.1.2',
      name: 'Name, Role, Value',
      passed: !results.some(r =>
        r.issues.some(i => i.includes('aria-label') || i.includes('accessible name'))
      ),
    },
  ];

  criteriaChecks.forEach(check => {
    const status = check.passed
      ? `${colors.green}✅ PASS${colors.reset}`
      : `${colors.red}❌ FAIL${colors.reset}`;
    console.log(`${check.id} ${check.name}: ${status}`);
  });

  console.log();

  // Recommendations summary
  if (totalRecommendations > 0) {
    console.log(`${colors.yellow}${colors.bright}💡 ACCESSIBILITY RECOMMENDATIONS${colors.reset}`);
    console.log(`${colors.yellow}==================================${colors.reset}\n`);

    const allRecommendations = results.flatMap(r => r.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];

    uniqueRecommendations.slice(0, 10).forEach((rec, index) => {
      const count = allRecommendations.filter(r => r === rec).length;
      console.log(`${index + 1}. ${rec} (${count} files)`);
    });

    if (uniqueRecommendations.length > 10) {
      console.log(`   ... and ${uniqueRecommendations.length - 10} more recommendations\n`);
    } else {
      console.log();
    }
  }

  // Next steps
  console.log(`${colors.blue}${colors.bright}🚀 ACCESSIBILITY ACTION PLAN${colors.reset}`);
  console.log(`${colors.blue}=============================${colors.reset}\n`);

  if (totalIssues > 0) {
    console.log(
      `1. ${colors.bright}Fix critical violations${colors.reset}: Address ${totalIssues} accessibility issues`
    );
  }
  console.log(
    `2. ${colors.bright}Implement recommendations${colors.reset}: Apply ${totalRecommendations} accessibility improvements`
  );
  console.log(
    `3. ${colors.bright}Add automated testing${colors.reset}: Set up accessibility testing in CI/CD`
  );
  console.log(
    `4. ${colors.bright}User testing${colors.reset}: Conduct testing with assistive technologies`
  );
  console.log(
    `5. ${colors.bright}Regular audits${colors.reset}: Schedule monthly accessibility reviews\n`
  );

  return {
    totalFiles,
    filesWithIssues,
    totalIssues,
    totalRecommendations,
    complianceRate: Math.round(((totalFiles - filesWithIssues) / totalFiles) * 100),
  };
}

/**
 * Main execution function
 */
function main() {
  console.log(
    `${colors.cyan}${colors.bright}♿ Vital Ice WCAG 2.1 AA Compliance Validator${colors.reset}`
  );
  console.log(`${colors.cyan}=============================================${colors.reset}\n`);

  try {
    const srcFiles = scanDirectory('./src');
    console.log(
      `${colors.blue}🔍 Analyzing ${srcFiles.length} files for WCAG 2.1 AA compliance...${colors.reset}\n`
    );

    const results = [];

    // Analyze each file
    for (const file of srcFiles) {
      if (file.endsWith('.css') || file.endsWith('.module.css')) {
        const cssResult = checkCSSAccessibility(file);
        if (cssResult.issues.length > 0 || cssResult.recommendations.length > 0) {
          results.push({
            filePath: file,
            issues: cssResult.issues,
            recommendations: cssResult.recommendations,
          });
        }
      } else {
        const result = scanFileForAccessibility(file);
        if (result) {
          results.push(result);
        }
      }
    }

    // Generate report
    const summary = generateAccessibilityReport(results);

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary,
      results,
      wcagVersion: '2.1 AA',
      criteria: WCAG_CRITERIA,
    };

    fs.writeFileSync('./wcag-compliance-report.json', JSON.stringify(reportData, null, 2));

    console.log(
      `${colors.green}✅ Detailed report saved to: wcag-compliance-report.json${colors.reset}\n`
    );

    // Exit with appropriate code
    process.exit(summary.totalIssues > 0 ? 1 : 0);
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
  scanFileForAccessibility,
  checkHeadingStructure,
  checkKeyboardNavigation,
  WCAG_CRITERIA,
};
