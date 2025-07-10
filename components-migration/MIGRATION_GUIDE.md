# Components Migration Guide

## 📁 What's Included

This `components-migration/` folder contains all the necessary files to migrate from Vite React to Next.js 15:

### **Core Components**

- `components/` - All React components with their CSS files
- `hooks/` - Custom React hooks
- `contexts/` - React Context providers
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `assets/` - Images, icons, and static assets
- `styles/` - Global styles and CSS variables
- `vendor/` - Third-party styles (fonts, normalize.css)

### **Data & API**

- `sanity.ts` - Sanity client configuration (needs environment variable fix)
- `fetchClients.ts` - Data fetching functions (ready for Next.js)

## 🚀 Migration Strategy

### **Phase 1: Environment Setup**

**1. Fix Sanity Client:**

```typescript
// sanity.ts - LINE 7 needs updating
// Current: token: import.meta.env.VITE_SANITY_TOKEN
// Target: token: process.env.NEXT_PUBLIC_SANITY_TOKEN
```

**2. Create Environment File:**

```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=rq9avsrj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_TOKEN=your_token_here
```

### **Phase 2: Component Migration**

**1. Convert CSS to CSS Modules:**

```bash
# Rename all .css files to .module.css
Header.css → Header.module.css
Client.css → Client.module.css
# etc.
```

**2. Update Component Imports:**

```typescript
// Current
import "./Header.css";

// Target
import styles from "./Header.module.css";
```

**3. Update Class Names:**

```typescript
// Current
className="header header--scrolled"

// Target
className={`${styles.header} ${styles.headerScrolled}`}
```

### **Phase 3: Routing Migration**

**1. React Router → Next.js App Router:**

```typescript
// Current (React Router)
import { useParams, useLocation } from 'react-router-dom'
const params = useParams<{ clientSlug: string }>()

// Target (Next.js App Router)
export default function ClientPage({ params }: { params: { slug: string } }) {
```

**2. Link Components:**

```typescript
// Current
import { Link } from 'react-router-dom'
<Link to="/about">About</Link>

// Target
import Link from 'next/link'
<Link href="/about">About</Link>
```

## 📋 Component Migration Checklist

### **High Priority (Core Navigation)**

- [ ] **Header** - Update routing, keep all styling
- [ ] **Navigation** - Convert to Next.js Link components
- [ ] **Layout** - Create `src/app/layout.tsx`

### **Medium Priority (Page Components)**

- [ ] **Home** - Convert to `src/app/page.tsx`
- [ ] **About** - Convert to `src/app/about/page.tsx`
- [ ] **Contact** - Convert to `src/app/contact/page.tsx`
- [ ] **Client Pages** - Convert to `src/app/clients/[slug]/page.tsx`

### **Low Priority (Utility Components)**

- [ ] **Modal System** - Keep context, update routing
- [ ] **Error Boundaries** - Keep as-is
- [ ] **Loading Components** - Keep as-is

## 🎨 Styling Migration

### **CSS Architecture (Ready to Copy)**

- ✅ BEM methodology implemented
- ✅ Responsive design with mobile-first approach
- ✅ Consistent color system
- ✅ Typography system (Domitian + Inter fonts)

### **Color System:**

```css
:root {
  --color-light-blue: #00d8e3;
  --color-dark-blue-black: #214751;
  --color-dark-blue-teal: #1b444e;
  --color-dark-blue-dark: #052533;
}
```

### **Typography System:**

```css
/* Headings */
font-family: "Domitian", serif;

/* Body text */
font-family: "Inter", sans-serif;
```

## 🔧 Critical Fixes Needed

### **1. Environment Variables**

```typescript
// sanity.ts - LINE 7
// ❌ Current (Vite)
token: import.meta.env.VITE_SANITY_TOKEN,

// ✅ Target (Next.js)
token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
```

### **2. Image Handling**

```typescript
// ❌ Current
<img src={logo} alt="Logo" />

// ✅ Target (Next.js Image)
import Image from 'next/image'
<Image src={logo} alt="Logo" width={200} height={100} />
```

### **3. Routing Logic**

```typescript
// ❌ Current (React Router)
const params = useParams<{ clientSlug: string }>()
const location = useLocation()

// ✅ Target (Next.js App Router)
export default function Page({ params, searchParams }: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
```

## 📁 File Structure for Next.js

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/
│   │   └── page.tsx
│   ├── clients/
│   │   ├── page.tsx       # Client listing
│   │   └── [slug]/
│   │       └── page.tsx   # Dynamic client pages
│   └── contact/
│       └── page.tsx
├── components/            # Migrated components
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   └── Client/
│       ├── Client.tsx
│       └── Client.module.css
├── lib/                   # Utility functions
│   ├── sanity.ts         # Fixed Sanity client
│   └── fetchClients.ts   # Data fetching
├── types/                 # TypeScript types
├── hooks/                 # Custom hooks
├── contexts/              # React contexts
├── styles/               # Global styles
└── assets/               # Static assets
```

## 🚀 Quick Start Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest beringia-next --typescript --tailwind false --src-dir --app --import-alias

# 2. Copy components
cp -r components-migration/* beringia-next/src/

# 3. Fix environment variables
# Update sanity.ts and create .env.local

# 4. Convert CSS to CSS Modules
# Rename .css files to .module.css

# 5. Update component imports
# Change className usage to use styles object
```

## 📊 Component Complexity

**High Priority (Complex):**

- Header (navigation, mobile menu, scroll behavior)
- Client (dynamic data, 3D models, galleries)
- Modal System (context providers, animations)

**Medium Priority:**

- Contact Forms (form validation, EmailJS)
- Home Page (hero sections, animations)

**Low Priority (Simple):**

- About (static content)
- Footer (simple layout)
- Error Boundaries (error handling)

## 🎯 Success Metrics

- [ ] All components render without errors
- [ ] Navigation works with Next.js App Router
- [ ] Sanity CMS integration functional
- [ ] Responsive design maintained
- [ ] Performance optimized for Next.js
- [ ] TypeScript types resolved

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React 19 Migration Guide](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024)

---

**Note:** This migration preserves all existing functionality while adapting to Next.js 15 patterns. The BEM methodology and responsive design are maintained throughout the migration process.
