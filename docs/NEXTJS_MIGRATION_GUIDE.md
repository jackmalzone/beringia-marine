# Next.js Migration Guide

## Overview

This guide outlines the step-by-step process for migrating the Beringia Marine project from Vite to Next.js 14, while maintaining the existing functionality and design principles.

## Prerequisites

- Node.js 18.17 or later
- Git
- Sanity CLI (if using Sanity)
- Vercel account (recommended for deployment)

## Phase 1: Project Setup

### 1. Create New Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest beringia-next
```

Select the following options:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: No (we're using CSS Modules)
- `src/` directory: Yes
- App Router: Yes
- Import alias: Yes

### 2. Project Structure

```bash
beringia-next/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── components/            # React components
│   │   ├── shared/           # Shared components
│   │   └── client/           # Client-specific components
│   ├── lib/                   # Utility functions
│   │   ├── sanity.ts         # Sanity client
│   │   └── fetchClients.ts   # Data fetching
│   ├── styles/               # Global styles
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── .env.local               # Environment variables
```

### 3. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=rq9avsrj
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

## Phase 2: Core Configuration

### 1. Sanity Client Setup

Update `src/lib/sanity.ts`:

```typescript
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-19",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
});
```

### 2. Data Fetching

Update `src/lib/fetchClients.ts` to use Next.js patterns:

```typescript
import { SanityClient, ClientData } from "../types";
import { client as sanityClient } from "./sanity";

// Keep existing transformSanityClient function

export async function fetchClients(): Promise<ClientData[]> {
  try {
    const query = `*[_type == "client"]{${clientFields}}`;
    const clients = await sanityClient.fetch(query);
    return clients.map(transformSanityClient);
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients");
  }
}

export async function fetchClientBySlug(
  slug: string
): Promise<ClientData | null> {
  try {
    const query = `*[_type == "client" && slug.current == $slug][0]{${clientFields}}`;
    const client = await sanityClient.fetch(query, { slug });
    return client ? transformSanityClient(client) : null;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw new Error("Failed to fetch client");
  }
}
```

## Phase 3: Component Migration

### 1. Layout Components

Create `src/app/layout.tsx`:

```typescript
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Beringia Marine',
  description: 'Marine Technology Solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### 2. Page Components

Example for `src/app/clients/[slug]/page.tsx`:

```typescript
import { fetchClientBySlug } from '@/lib/fetchClients'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const client = await fetchClientBySlug(params.slug)
  if (!client) return {}

  return {
    title: client.seo.title,
    description: client.seo.description,
    openGraph: {
      images: [client.seo.ogImage],
    },
  }
}

export default async function ClientPage({ params }: { params: { slug: string } }) {
  const client = await fetchClientBySlug(params.slug)

  if (!client) {
    notFound()
  }

  return (
    <div>
      {/* Client component content */}
    </div>
  )
}
```

## Phase 4: Styling Migration

### 1. CSS Modules

Keep existing BEM methodology but update to CSS Modules:

```css
/* src/components/Client/Client.module.css */
.client {
  /* Base styles */
}

.client__header {
  /* Header styles */
}

.client__content {
  /* Content styles */
}
```

### 2. Global Styles

Move global styles to `src/app/globals.css`:

```css
:root {
  --color-light-blue: #00d8e3;
  --color-dark-blue-black: #214751;
  /* ... other color variables ... */
}

/* Global styles */
```

## Phase 5: Performance Optimization

### 1. Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

export function ClientLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={100}
      priority
    />
  )
}
```

### 2. Loading States

Implement loading states:

```typescript
// src/app/clients/[slug]/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

## Phase 6: Testing & Deployment

### 1. Testing Setup

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create `jest.config.js`:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
```

### 2. Deployment

1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## Migration Checklist

- [ ] Create new Next.js project
- [ ] Set up project structure
- [ ] Configure environment variables
- [ ] Migrate Sanity client
- [ ] Migrate data fetching
- [ ] Migrate components
- [ ] Migrate styles
- [ ] Set up testing
- [ ] Configure deployment
- [ ] Test thoroughly
- [ ] Deploy

## Common Issues & Solutions

1. **Environment Variables**

   - Use `NEXT_PUBLIC_` prefix for client-side variables
   - Keep sensitive variables server-side only

2. **Image Optimization**

   - Use Next.js Image component
   - Configure domains in `next.config.js`

3. **Data Fetching**
   - Use Server Components for data fetching
   - Implement proper loading states
   - Handle errors appropriately

## Next Steps

1. Start with the basic project setup
2. Migrate one component at a time
3. Test thoroughly after each migration
4. Deploy incrementally

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
