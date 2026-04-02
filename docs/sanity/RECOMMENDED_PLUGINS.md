# Recommended Sanity Plugins for Vital Ice

## Currently Installed

- ✅ `@sanity/vision` - GraphQL playground (for developers)
- ✅ `@sanity/color-input` - Color picker for theme colors
- ✅ `deskTool` - Document management (built-in)

## Highly Recommended for Blog/Article Management

### 1. **Code Input Plugin** ⭐ Essential

**Package:** `@sanity/code-input`

**Why:** Allows code blocks in article content (useful for technical articles, examples, etc.)

**Install:**

```bash
cd apps/studio
pnpm add @sanity/code-input
```

**Usage:**
Add code blocks to your Portable Text content array in the article schema.

---

### 2. **Table Plugin** ⭐ Essential

**Package:** `sanity-plugin-table`

**Why:** Add tables to article content (comparison tables, data tables, etc.)

**Install:**

```bash
cd apps/studio
pnpm add sanity-plugin-table
```

**Usage:**
Add table blocks to your Portable Text content array.

---

### 3. **Orderable Document List** ⭐ Highly Recommended

**Package:** `@sanity/orderable-document-list`

**Why:** Drag-and-drop ordering of articles (useful for featured articles, homepage ordering)

**Install:**

```bash
cd apps/studio
pnpm add @sanity/orderable-document-list
```

**Usage:**
Configure in desk tool structure to allow ordering articles by priority/featured status.

---

### 4. **Media Plugin** ⭐ Recommended

**Package:** `sanity-plugin-media`

**Why:** Better media library with search, filters, and organization

**Install:**

```bash
cd apps/studio
pnpm add sanity-plugin-media
```

**Usage:**
Replaces default image picker with enhanced media library.

---

### 5. **Tabs Plugin** ⭐ Recommended

**Package:** `sanity-plugin-tabs`

**Why:** Organize article fields into tabs (Content, SEO, Metadata, etc.) for better UX

**Install:**

```bash
cd apps/studio
pnpm add sanity-plugin-tabs
```

**Usage:**
Wrap fields in tab groups to organize the editor interface.

---

### 6. **Dashboard Widgets** ⭐ Recommended

**Packages:**

- `sanity-plugin-dashboard-widget-structure-menu`
- `sanity-plugin-dashboard-widget-document-list`

**Why:** Better overview of content, quick access to documents

**Install:**

```bash
cd apps/studio
pnpm add sanity-plugin-dashboard-widget-structure-menu sanity-plugin-dashboard-widget-document-list
```

---

### 7. **Asset Source Plugins** (Optional)

**Packages:**

- `@sanity/asset-source-unsplash` - Search Unsplash images
- `@sanity/asset-source-cloudinary` - If using Cloudinary

**Why:** Easy access to stock photos without leaving the editor

**Install:**

```bash
cd apps/studio
pnpm add @sanity/asset-source-unsplash
```

---

## Nice to Have

### 8. **Slug Validation**

**Package:** `sanity-plugin-slug-validation`

**Why:** Validates slugs are unique and URL-friendly

### 9. **Preview Plugin**

**Package:** `@sanity/preview-kit` (if not already using)

**Why:** Preview articles before publishing

### 10. **Document Internationalization** (Future)

**Package:** `@sanity/document-internationalization`

**Why:** Multi-language support (only if needed)

---

## Priority Installation Order

1. **Code Input** - Essential for technical content
2. **Table Plugin** - Essential for data-rich articles
3. **Orderable Document List** - Very useful for content organization
4. **Tabs Plugin** - Improves editor UX significantly
5. **Media Plugin** - Better asset management
6. **Dashboard Widgets** - Better overview

---

## Installation Script

Run this to install all recommended plugins:

```bash
cd apps/studio
pnpm add @sanity/code-input sanity-plugin-table @sanity/orderable-document-list sanity-plugin-media sanity-plugin-tabs sanity-plugin-dashboard-widget-structure-menu sanity-plugin-dashboard-widget-document-list @sanity/asset-source-unsplash
```
