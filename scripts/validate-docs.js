#!/usr/bin/env node

/**
 * Documentation Validation Script
 * Checks for broken links, outdated information, and consistency
 */

const fs = require('fs');
const path = require('path');

class DocValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsPath = path.join(this.projectRoot, 'docs');
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Validating documentation...\n');

    await this.checkFileStructure();
    await this.validateMarkdownFiles();
    await this.checkInternalLinks();
    await this.validateCodeBlocks();

    this.printResults();
  }

  async checkFileStructure() {
    const requiredDirs = ['api', 'architecture', 'technical', 'fixes', 'troubleshooting'];
    const requiredFiles = ['README.md', 'DEVELOPMENT.md', 'CONTRIBUTING.md'];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.docsPath, dir);
      if (!fs.existsSync(dirPath)) {
        this.errors.push(`Missing required directory: docs/${dir}`);
      }
    }

    for (const file of requiredFiles) {
      const filePath = path.join(this.docsPath, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing required file: docs/${file}`);
      }
    }
  }

  async validateMarkdownFiles() {
    const markdownFiles = this.findMarkdownFiles(this.docsPath);

    for (const file of markdownFiles) {
      await this.validateMarkdownFile(file);
    }
  }

  findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (item.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async validateMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.docsPath, filePath);

    // Check for required sections in main docs
    if (relativePath === 'README.md') {
      this.checkRequiredSections(content, relativePath, [
        'Documentation Structure',
        'Quick Start',
        'Documentation Standards',
      ]);
    }

    // Check for outdated dates
    const dateMatches = content.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/g
    );
    if (dateMatches) {
      const currentYear = new Date().getFullYear();
      for (const dateMatch of dateMatches) {
        const year = parseInt(dateMatch.match(/\d{4}/)[0]);
        if (year < currentYear - 1) {
          this.warnings.push(`Potentially outdated date in ${relativePath}: ${dateMatch}`);
        }
      }
    }

    // Check for TODO items
    const todoMatches = content.match(/TODO|FIXME|XXX/gi);
    if (todoMatches) {
      this.warnings.push(`${relativePath} contains ${todoMatches.length} TODO items`);
    }

    // Check for empty sections
    const emptyHeaders = content.match(/^#{1,6}\s+.+\n\s*$/gm);
    if (emptyHeaders) {
      this.warnings.push(`${relativePath} has ${emptyHeaders.length} empty sections`);
    }
  }

  checkRequiredSections(content, filePath, requiredSections) {
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        this.errors.push(`${filePath} missing required section: ${section}`);
      }
    }
  }

  async checkInternalLinks() {
    const markdownFiles = this.findMarkdownFiles(this.docsPath);

    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.docsPath, file);

      // Find markdown links
      const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (linkMatches) {
        for (const link of linkMatches) {
          const urlMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (urlMatch) {
            const url = urlMatch[2];

            // Check internal links (relative paths)
            if (!url.startsWith('http') && !url.startsWith('#')) {
              const linkedFile = path.resolve(path.dirname(file), url);
              if (!fs.existsSync(linkedFile)) {
                this.errors.push(`Broken internal link in ${relativePath}: ${url}`);
              }
            }
          }
        }
      }
    }
  }

  async validateCodeBlocks() {
    const markdownFiles = this.findMarkdownFiles(this.docsPath);

    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.docsPath, file);

      // Find code blocks
      const codeBlocks = content.match(/```[\s\S]*?```/g);
      if (codeBlocks) {
        for (const block of codeBlocks) {
          // Check for language specification
          const firstLine = block.split('\n')[0];
          if (firstLine === '```') {
            this.warnings.push(`Code block without language specification in ${relativePath}`);
          }

          // Check for common syntax errors in TypeScript/JavaScript blocks
          if (
            firstLine.includes('typescript') ||
            firstLine.includes('tsx') ||
            firstLine.includes('javascript')
          ) {
            const code = block.replace(/```[\w]*\n/, '').replace(/```$/, '');

            // Basic syntax checks
            const openBraces = (code.match(/{/g) || []).length;
            const closeBraces = (code.match(/}/g) || []).length;

            if (openBraces !== closeBraces) {
              this.warnings.push(`Unmatched braces in code block in ${relativePath}`);
            }
          }
        }
      }
    }
  }

  printResults() {
    console.log('\n📊 Validation Results\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All documentation is valid!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`  • ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
      console.log('');
    }

    console.log(`📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);

    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Run validation
async function main() {
  const validator = new DocValidator();
  await validator.validate();
}

if (require.main === module) {
  main();
}

module.exports = DocValidator;
