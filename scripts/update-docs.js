#!/usr/bin/env node

/**
 * Documentation Update Script
 * Automatically updates documentation based on project changes
 */

const fs = require('fs');
const path = require('path');

class DocUpdater {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsPath = path.join(this.projectRoot, 'docs');
  }

  // Update component migration status
  async updateMigrationStatus() {
    const srcPath = path.join(this.projectRoot, 'src');
    const components = await this.findComponents(srcPath);
    const migrationStatus = await this.checkMigrationStatus(components);

    await this.updateMigrationDoc(migrationStatus);
  }

  // Find all components in the project
  async findComponents(dir) {
    const components = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        components.push(...(await this.findComponents(fullPath)));
      } else if (file.name.endsWith('.tsx') && !file.name.includes('.test.')) {
        components.push(fullPath);
      }
    }

    return components;
  }

  // Check which components use Zustand hooks
  async checkMigrationStatus(components) {
    const status = {
      migrated: [],
      pending: [],
      total: components.length,
    };

    for (const component of components) {
      const content = fs.readFileSync(component, 'utf8');
      const hasMigration = /use(Navigation|Widgets|UserPreferences|Performance|Loading)\(\)/.test(
        content
      );

      if (hasMigration) {
        status.migrated.push(path.relative(this.projectRoot, component));
      } else {
        status.pending.push(path.relative(this.projectRoot, component));
      }
    }

    return status;
  }

  // Update the migration documentation
  async updateMigrationDoc(status) {
    const migrationDoc = path.join(this.docsPath, 'DOCUMENTATION_SUMMARY.md');
    let content = fs.readFileSync(migrationDoc, 'utf8');

    const progressPercent = Math.round((status.migrated.length / status.total) * 100);
    const statusLine = `**Status**: 🔄 **${status.migrated.length}/${status.total} components migrated (${progressPercent}%)**`;

    // Update the status line
    content = content.replace(
      /\*\*Status\*\*: 🔄 \*\*\d+\/\d+ components migrated \(\d+%\)\*\*/,
      statusLine
    );

    fs.writeFileSync(migrationDoc, content);
    console.log(
      `✅ Updated migration status: ${status.migrated.length}/${status.total} components migrated`
    );
  }

  // Generate component inventory
  async generateComponentInventory() {
    const components = await this.findComponents(path.join(this.projectRoot, 'src/components'));
    const inventory = this.categorizeComponents(components);

    const inventoryDoc = path.join(this.docsPath, 'COMPONENT_INVENTORY.md');
    const content = this.generateInventoryMarkdown(inventory);

    fs.writeFileSync(inventoryDoc, content);
    console.log('✅ Generated component inventory');
  }

  categorizeComponents(components) {
    const categories = {
      layout: [],
      ui: [],
      features: [],
      pages: [],
    };

    components.forEach(comp => {
      const relativePath = path.relative(this.projectRoot, comp);
      if (relativePath.includes('/layout/')) categories.layout.push(relativePath);
      else if (relativePath.includes('/ui/')) categories.ui.push(relativePath);
      else if (relativePath.includes('/features/')) categories.features.push(relativePath);
      else if (relativePath.includes('/app/')) categories.pages.push(relativePath);
    });

    return categories;
  }

  generateInventoryMarkdown(inventory) {
    return `# Component Inventory

Generated: ${new Date().toISOString().split('T')[0]}

## Layout Components (${inventory.layout.length})
${inventory.layout.map(comp => `- ${comp}`).join('\n')}

## UI Components (${inventory.ui.length})
${inventory.ui.map(comp => `- ${comp}`).join('\n')}

## Feature Components (${inventory.features.length})
${inventory.features.map(comp => `- ${comp}`).join('\n')}

## Page Components (${inventory.pages.length})
${inventory.pages.map(comp => `- ${comp}`).join('\n')}

## Summary
- **Total Components**: ${Object.values(inventory).flat().length}
- **Layout**: ${inventory.layout.length}
- **UI**: ${inventory.ui.length}
- **Features**: ${inventory.features.length}
- **Pages**: ${inventory.pages.length}
`;
  }
}

// Run the updater
async function main() {
  const updater = new DocUpdater();

  try {
    await updater.updateMigrationStatus();
    await updater.generateComponentInventory();
    console.log('📚 Documentation updated successfully!');
  } catch (error) {
    console.error('❌ Error updating documentation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = DocUpdater;
