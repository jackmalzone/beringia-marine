# Beringia Marine

A Next.js 15 application with Sanity CMS integration for managing comprehensive client data and interactive 3D content.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Sanity CMS** for content management with comprehensive client schema
- **CSS Modules** with BEM methodology
- **Incremental Static Regeneration (ISR)** for dynamic content
- **Responsive design**
- **Interactive 3D model support** (Sketchfab integration)
- **Rich media gallery** (images, videos, 3D models)
- **Comprehensive client profiles** with selling points, use cases, and value propositions

## Project Structure

```
├── src/                          # Next.js application
│   ├── app/
│   │   ├── clients/
│   │   │   ├── page.tsx          # Clients listing page
│   │   │   ├── page.module.css   # Styles for clients listing
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Individual client page
│   │   │       └── page.module.css # Styles for client page
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── page.module.css       # Home page styles
│   ├── lib/
│   │   └── sanity.ts             # Sanity client configuration
│   └── types/
│       ├── index.ts              # Main types export
│       └── cms.ts/
│           └── index.ts          # TypeScript types for CMS data
├── cms/                          # Sanity Studio
│   └── studio-beringia-marine/
│       ├── schemas/
│       │   ├── client.ts         # Comprehensive client schema
│       │   └── index.ts          # Schema exports
│       ├── sanity.config.ts      # Sanity configuration
│       ├── deskStructure.ts      # Studio desk structure
│       └── package.json          # Studio dependencies
└── public/                       # Static assets
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=rq9avsrj
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Optional: Sanity Studio URL (if hosted separately)
NEXT_PUBLIC_SANITY_STUDIO_URL=https://beringia-marine.sanity.studio
```

## Getting Started

### 1. Install Dependencies

```bash
# Install Next.js app dependencies
npm install

# Install Sanity Studio dependencies
cd cms/studio-beringia-marine
npm install
cd ../..
```

### 2. Set up Environment Variables

Copy the environment variables from `.env.example` to `.env.local` and fill in your Sanity API token.

### 3. Start Development Servers

```bash
# Start Next.js development server
npm run dev

# In another terminal, start Sanity Studio
cd cms/studio-beringia-marine
npm run dev
```

### 4. Access the Applications

- **Next.js App**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3333](http://localhost:3333)

## Client Schema Features

The comprehensive client schema includes:

- **Basic Information**: Name, slug, logo with website link
- **SEO**: Title, description, OG image
- **Overview**: Title, description, header image
- **Selling Points**: Features with icons, documentation links
- **Use Cases**: Detailed case studies with key points
- **Interactive 3D Models**: Sketchfab integration
- **Value Proposition**: Highlights and benefits
- **Demo Content**: Video demonstrations
- **Media Links**: Website, YouTube, LinkedIn, Sketchfab, Email
- **Gallery**: Images, videos, and 3D models with options

## Data Fetching

The application uses Server Components for data fetching with ISR:

- **Static Generation**: Client pages are pre-rendered at build time
- **ISR**: Pages are revalidated every hour (3600 seconds)
- **Dynamic Routes**: New clients are automatically added when they're created in Sanity
- **Rich Queries**: Comprehensive GROQ queries for all client data

## CSS Architecture

- **CSS Modules**: Co-located with components
- **BEM Methodology**: For consistent naming conventions
- **Responsive Design**: Mobile-first approach with grid layouts
- **Interactive Elements**: Hover effects and transitions

## Deployment

### Next.js App

The application is ready for deployment on Vercel or any other Next.js-compatible platform.

### Sanity Studio

Deploy the Sanity Studio to Sanity's hosting:

```bash
cd cms/studio-beringia-marine
npm run deploy
```

## TypeScript Configuration

The project includes optimized TypeScript configuration for Next.js 15 and React 19 with:

- Strict type checking
- Path mapping (`@/*` for `src/*`)
- Next.js specific types
- React 19 compatibility
- Comprehensive type definitions for Sanity data

## Content Management

Use the Sanity Studio to:

1. **Create Client Profiles**: Add new clients with comprehensive information
2. **Manage Media**: Upload images, videos, and link 3D models
3. **Organize Content**: Structure selling points, use cases, and value propositions
4. **SEO Optimization**: Set meta titles, descriptions, and OG images
5. **Preview Changes**: See updates in real-time

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
