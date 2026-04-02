# Sanity CMS Migration Scripts

This directory contains scripts for migrating existing content from hardcoded data structures to Sanity CMS. The migration process is designed to be safe, reversible, and thoroughly validated.

## Overview

The migration consists of three main phases:

1. **Content Migration** - Migrate services, business info, and SEO metadata
2. **Asset Migration** - Upload and organize media assets
3. **Validation** - Verify data integrity and content rendering

## Scripts

### 1. Content Migration (`migrate-to-sanity.js`)

Migrates existing content from TypeScript files to Sanity documents.

**Features:**

- Migrates services data from `src/lib/data/services.ts`
- Migrates business information from `src/lib/config/business-info.ts`
- Migrates SEO metadata from `src/lib/seo/metadata.ts`
- Supports dry-run mode for safe testing
- Validates data integrity during migration
- Creates proper Sanity document structure

**Usage:**

```bash
# Dry run to see what would be migrated
node scripts/migrate-to-sanity.js --dry-run

# Migrate all content types
node scripts/migrate-to-sanity.js

# Migrate specific content type
node scripts/migrate-to-sanity.js --type=services
node scripts/migrate-to-sanity.js --type=business
node scripts/migrate-to-sanity.js --type=seo
```

### 2. Asset Migration (`migrate-assets.js`)

Uploads existing media assets to Sanity and updates document references.

**Features:**

- Downloads images from existing URLs
- Uploads to Sanity with proper metadata
- Organizes assets with tags and naming
- Updates document references automatically
- Handles rate limiting and error recovery

**Usage:**

```bash
# Dry run to see what would be uploaded
node scripts/migrate-assets.js --dry-run

# Upload assets only
node scripts/migrate-assets.js

# Upload assets and update document references
node scripts/migrate-assets.js --update-refs
```

### 3. Asset Organization (`organize-assets.js`)

Organizes uploaded assets with proper naming, tagging, and cleanup.

**Features:**

- Analyzes current asset organization
- Generates proper titles and alt text
- Adds descriptive tags for categorization
- Identifies and removes unused assets
- Creates comprehensive usage reports

**Usage:**

```bash
# Analyze and organize assets (dry run)
node scripts/organize-assets.js --dry-run

# Organize assets
node scripts/organize-assets.js

# Organize and cleanup unused assets
node scripts/organize-assets.js --cleanup
```

### 4. Migration Validation (`validate-migration.js`)

Validates migrated content for data integrity and proper rendering.

**Features:**

- Validates schema compliance
- Checks required fields and data types
- Tests content rendering and asset references
- Identifies missing or invalid data
- Provides detailed error reporting

**Usage:**

```bash
# Validate all migrated content
node scripts/validate-migration.js

# Validate specific content type
node scripts/validate-migration.js --type=services
node scripts/validate-migration.js --type=business
node scripts/validate-migration.js --type=seo

# Attempt to fix issues automatically
node scripts/validate-migration.js --fix
```

## Environment Setup

Before running any migration scripts, ensure you have the required environment variables:

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token-with-write-permissions
```

### Getting Your Sanity API Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to "API" tab
4. Create a new token with "Editor" permissions
5. Copy the token to your `.env.local` file

## Migration Process

Follow this step-by-step process for a complete migration:

### Step 1: Prepare Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Sanity credentials
```

### Step 2: Test Migration (Dry Run)

```bash
# Test content migration
node scripts/migrate-to-sanity.js --dry-run

# Test asset migration
node scripts/migrate-assets.js --dry-run

# Test asset organization
node scripts/organize-assets.js --dry-run
```

### Step 3: Run Content Migration

```bash
# Migrate all content
node scripts/migrate-to-sanity.js

# Verify migration was successful
node scripts/validate-migration.js --type=all
```

### Step 4: Run Asset Migration

```bash
# Upload assets and update references
node scripts/migrate-assets.js --update-refs

# Organize assets
node scripts/organize-assets.js
```

### Step 5: Final Validation

```bash
# Comprehensive validation
node scripts/validate-migration.js

# Test content rendering
node scripts/validate-migration.js --type=all
```

## Asset Organization

Assets are organized using the following structure:

### Tags

- **service**: Service-related images
- **seo**: Social media preview images
- **hero**: Primary service images
- **background**: Background images
- **texture**: Texture/pattern images
- **cold-plunge**, **infrared-sauna**, etc.: Service-specific tags

### Naming Convention

- Service images: `{service-name}-{type}` (e.g., `cold-plunge-hero`)
- SEO images: `seo-{page}-preview` (e.g., `seo-home-preview`)

### Alt Text Generation

- Service images: "{Service Name} {type} at Vital Ice"
- SEO images: "{Page Name} social media preview"

## Data Mapping

### Services Migration

```typescript
// From: src/lib/data/services.ts
export const servicesData: Record<string, ServiceData>

// To: Sanity service documents
{
  _type: 'service',
  title: string,
  slug: { current: string },
  subtitle: string,
  description: string,
  heroImage: { asset: { _ref: string }, alt: string },
  backgroundImage: { asset: { _ref: string }, alt: string },
  accentColor: { hex: string },
  benefits: Array<{ title: string, description: string }>,
  process: Array<{ step: string, title: string, description: string }>,
  // ... additional fields
}
```

### Business Info Migration

```typescript
// From: src/lib/config/business-info.ts
export const VITAL_ICE_BUSINESS: BusinessInfo

// To: Sanity globalSettings document
{
  _type: 'globalSettings',
  businessInfo: {
    name: string,
    phone: string,
    email: string,
    address: { street, city, state, zipCode, country },
    coordinates: { latitude, longitude },
    hours: Array<{ day, open, close, closed }>,
    // ... additional fields
  }
}
```

### SEO Metadata Migration

```typescript
// From: src/lib/seo/metadata.ts
export const pageMetadata: Record<string, Metadata>

// To: Sanity page documents
{
  _type: 'page',
  title: string,
  slug: { current: string },
  seo: {
    title: string,
    description: string,
    keywords: string[],
    openGraph: { title, description, image },
    twitter: { title, description, image }
  }
}
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**

   ```
   ❌ Missing required environment variables:
      - NEXT_PUBLIC_SANITY_PROJECT_ID
   ```

   **Solution**: Add the missing variables to your `.env.local` file

2. **API Token Permissions**

   ```
   ❌ Failed to create service: Insufficient permissions
   ```

   **Solution**: Ensure your API token has "Editor" permissions

3. **Network Timeouts**

   ```
   ❌ Failed to upload asset: Request timeout
   ```

   **Solution**: Check your internet connection and try again

4. **Schema Validation Errors**
   ```
   ❌ Field 'title' exceeds max length (150/100)
   ```
   **Solution**: Review and shorten the content, or adjust schema validation rules

### Recovery Options

If migration fails partway through:

1. **Check what was migrated**:

   ```bash
   node scripts/validate-migration.js
   ```

2. **Clean up partial migration**:

   ```bash
   # Remove all migrated documents (be careful!)
   # This requires manual cleanup in Sanity Studio
   ```

3. **Resume migration**:
   ```bash
   # Scripts are idempotent - you can re-run them safely
   node scripts/migrate-to-sanity.js --type=services
   ```

## Validation Rules

The validation script checks for:

### Services

- Required fields: title, slug, subtitle, description, heroImage, etc.
- Field length limits: title ≤ 100 chars, subtitle ≤ 200 chars
- Array constraints: 1-8 benefits, 1-10 process steps
- Valid slug format: lowercase letters, numbers, hyphens only
- Valid color format: hex colors (#RRGGBB)
- Asset references: hero and background images must have valid asset refs

### Global Settings

- Required business info fields
- Valid email format
- Valid coordinate ranges
- Proper time format for business hours
- Valid URLs for social media

### Pages

- Required fields: title, slug
- SEO field length limits: title ≤ 60 chars, description ≤ 160 chars
- Valid URLs for canonical and social media images

## Performance Considerations

- **Rate Limiting**: Asset uploads include 1-second delays to avoid rate limits
- **Memory Usage**: Large assets are streamed to avoid memory issues
- **Batch Processing**: Content is processed in batches for efficiency
- **Error Recovery**: Failed operations can be retried without affecting successful ones

## Security Notes

- API tokens should have minimal required permissions
- Never commit API tokens to version control
- Use separate datasets for development and production
- Validate all migrated content before going live

## Support

If you encounter issues during migration:

1. Check the console output for detailed error messages
2. Run validation scripts to identify specific problems
3. Use dry-run mode to test changes safely
4. Review the Sanity Studio to verify migrated content
5. Check the Next.js application to ensure content renders correctly

For additional help, refer to:

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Migration Guide](https://www.sanity.io/docs/migrating-data)
- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
