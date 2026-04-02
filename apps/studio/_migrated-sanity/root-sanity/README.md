# Sanity CMS Setup

This directory contains the Sanity CMS configuration for the Vital Ice website.

## Setup Instructions

1. **Create a Sanity Project**

   - Go to [sanity.io](https://sanity.io) and create a new project
   - Note your Project ID

2. **Configure Environment Variables**
   Update `.env.local` with your Sanity credentials:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token
   ```

3. **Generate API Token**

   - Go to your Sanity project dashboard
   - Navigate to API → Tokens
   - Create a new token with Editor permissions
   - Copy the token to your `.env.local` file

4. **Access Sanity Studio**
   - Run `npm run dev`
   - Navigate to `http://localhost:3000/studio`
   - Login with your Sanity account

## Directory Structure

```
sanity/
├── schemas/           # Content type definitions
│   ├── documents/     # Document schemas (pages, services, etc.)
│   ├── objects/       # Reusable object schemas
│   └── index.ts       # Schema exports
├── components/        # Custom Studio components
└── README.md         # This file
```

## Development Workflow

1. **Schema Development**: Create and modify schemas in `sanity/schemas/`
2. **Content Management**: Use the Studio at `/studio` to manage content
3. **Preview**: Use Next.js draft mode for content preview
4. **Deploy**: Content changes are automatically reflected via ISR

## Key Features

- **Visual Editing**: Real-time preview of content changes
- **SEO Optimization**: Built-in SEO fields and validation
- **Image Optimization**: Automatic image processing and optimization
- **Version Control**: Built-in content versioning and rollback
- **Access Control**: Role-based permissions for content editors
