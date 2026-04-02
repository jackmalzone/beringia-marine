#!/usr/bin/env node

/**
 * Documentation Index Generator
 * Creates a comprehensive index of all documentation files
 */

const fs = require('fs');
const path = require('path');

class DocsIndexGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsPath = path.join(this.projectRoot, 'docs');
    this.index = {
      categories: {},
      totalFiles: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  }

  async generate() {
    console.log('📚 Generating documentation index...\n');

    await this.scanDocumentation();
    await this.generateIndexFile();
    await this.generateQuickReference();

    console.log('✅ Documentation index generated successfully!');
  }

  async scanDocumentation() {
    const categories = fs.readdirSync(this.docsPath, { withFileTypes: true });

    for (const category of categories) {
      if (category.isDirectory()) {
        this.index.categories[category.name] = await this.scanCategory(
          path.join(this.docsPath, category.name)
        );
      } else if (category.name.endsWith('.md')) {
        // Root level files
        if (!this.index.categories.root) {
          this.index.categories.root = { files: [], description: 'Root documentation files' };
        }

        const fileInfo = await this.getFileInfo(path.join(this.docsPath, category.name));
        this.index.categories.root.files.push(fileInfo);
        this.index.totalFiles++;
      }
    }
  }

  async scanCategory(categoryPath) {
    const files = fs.readdirSync(categoryPath, { withFileTypes: true });
    const category = {
      files: [],
      description: this.getCategoryDescription(path.basename(categoryPath)),
    };

    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const fileInfo = await this.getFileInfo(path.join(categoryPath, file.name));
        category.files.push(fileInfo);
        this.index.totalFiles++;
      }
    }

    return category;
  }

  async getFileInfo(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.docsPath, filePath);
    const fileName = path.basename(filePath, '.md');

    // Extract title from first heading or filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : fileName.replace(/_/g, ' ');

    // Extract description from first paragraph
    const descMatch = content.match(/^(?!#)(.+)$/m);
    const description = descMatch ? descMatch[1].substring(0, 100) + '...' : '';

    // Get file stats
    const stats = fs.statSync(filePath);

    return {
      name: fileName,
      title,
      description,
      path: relativePath,
      size: this.formatFileSize(stats.size),
      lastModified: stats.mtime.toISOString().split('T')[0],
    };
  }

  getCategoryDescription(categoryName) {
    const descriptions = {
      api: 'API documentation and integration guides',
      architecture: 'System architecture and design decisions',
      concepts: 'Future ideas and design concepts',
      deployment: 'Deployment guides and configuration',
      fixes: 'Bug fixes and solutions with detailed explanations',
      migration: 'Component migration plans and progress',
      setup: 'Setup and configuration guides',
      technical: 'Technical documentation and best practices',
      troubleshooting: 'Common issues and troubleshooting guides',
      updates: 'Update logs and change documentation',
    };

    return descriptions[categoryName] || 'Documentation files';
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  }

  async generateIndexFile() {
    const indexContent = this.generateIndexMarkdown();
    const indexPath = path.join(this.docsPath, 'INDEX.md');

    fs.writeFileSync(indexPath, indexContent);
    console.log('📄 Generated INDEX.md');
  }

  generateIndexMarkdown() {
    let content = `# Documentation Index

*Generated on ${this.index.lastUpdated}*

This index contains all ${this.index.totalFiles} documentation files in the project.

## 📊 Overview

`;

    // Add category overview
    const categoryNames = Object.keys(this.index.categories).sort();
    for (const categoryName of categoryNames) {
      const category = this.index.categories[categoryName];
      content += `- **${categoryName === 'root' ? 'Root Files' : categoryName}**: ${category.files.length} files - ${category.description}\n`;
    }

    content += '\n---\n\n';

    // Add detailed sections
    for (const categoryName of categoryNames) {
      const category = this.index.categories[categoryName];
      const displayName =
        categoryName === 'root'
          ? 'Root Documentation'
          : categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

      content += `## 📁 ${displayName}\n\n`;
      content += `*${category.description}*\n\n`;

      if (category.files.length === 0) {
        content += '*No files in this category*\n\n';
        continue;
      }

      // Sort files by name
      const sortedFiles = category.files.sort((a, b) => a.name.localeCompare(b.name));

      for (const file of sortedFiles) {
        content += `### [${file.title}](${file.path})\n\n`;
        if (file.description) {
          content += `${file.description}\n\n`;
        }
        content += `*Size: ${file.size} | Last modified: ${file.lastModified}*\n\n`;
      }

      content += '---\n\n';
    }

    content += `## 📈 Statistics

- **Total Files**: ${this.index.totalFiles}
- **Categories**: ${Object.keys(this.index.categories).length}
- **Last Updated**: ${this.index.lastUpdated}

## 🔍 Quick Navigation

- [Main README](README.md) - Project overview and getting started
- [Development Guide](DEVELOPMENT.md) - Development setup and workflow
- [Best Practices](technical/BEST_PRACTICES.md) - Coding standards and guidelines
- [Architecture Overview](architecture/WEBSITE_STRUCTURE.md) - System architecture
- [Troubleshooting](troubleshooting/README.md) - Common issues and solutions

---

*This index is automatically generated. Run \`npm run docs:update\` to refresh.*
`;

    return content;
  }

  async generateQuickReference() {
    const quickRefContent = `# Quick Reference

## 🚀 Common Commands

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run linting

# Documentation
npm run docs:update     # Update documentation
npm run docs:validate   # Validate documentation
npm run docs:dashboard  # Open documentation dashboard
\`\`\`

## 📁 Key Files

- \`docs/README.md\` - Main documentation overview
- \`docs/DEVELOPMENT.md\` - Development guide
- \`docs/technical/BEST_PRACTICES.md\` - Coding standards
- \`docs/architecture/WEBSITE_STRUCTURE.md\` - Architecture overview

## 🔧 Troubleshooting

Common issues and their solutions are documented in:
- \`docs/fixes/\` - Specific bug fixes
- \`docs/troubleshooting/\` - General troubleshooting

## 📊 Project Status

Check the current project status:
- Component migration progress
- SEO implementation status
- Documentation coverage

*Last updated: ${this.index.lastUpdated}*
`;

    const quickRefPath = path.join(this.docsPath, 'QUICK_REFERENCE.md');
    fs.writeFileSync(quickRefPath, quickRefContent);
    console.log('📄 Generated QUICK_REFERENCE.md');
  }
}

// Run the generator
async function main() {
  const generator = new DocsIndexGenerator();
  await generator.generate();
}

if (require.main === module) {
  main();
}

module.exports = DocsIndexGenerator;
