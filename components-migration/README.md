# 🚀 Beringia Marine - Components Migration Package

## 📦 What's Included

This folder contains **everything needed** to migrate from Vite React to Next.js 15:

### **Core Files**

- ✅ **All React Components** (with CSS files)
- ✅ **Custom Hooks** (useScroll, useModal, etc.)
- ✅ **React Contexts** (ModalContext, NavigationContext, etc.)
- ✅ **TypeScript Types** (complete type definitions)
- ✅ **Utility Functions** (constants, helpers)
- ✅ **Assets** (images, icons, fonts)
- ✅ **Styles** (global CSS, variables, vendor styles)
- ✅ **Sanity Integration** (client config + data fetching)

## 🎯 Critical Issues to Fix

### **1. Environment Variables (HIGH PRIORITY)**

```typescript
// sanity.ts - LINE 7
// ❌ Current (Vite)
token: import.meta.env.VITE_SANITY_TOKEN,

// ✅ Target (Next.js)
token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
```

### **2. Routing Migration**

```typescript
// ❌ Current (React Router)
import { useParams, useLocation } from 'react-router-dom'
const params = useParams<{ clientSlug: string }>()

// ✅ Target (Next.js App Router)
export default function Page({ params }: { params: { slug: string } }) {
```

### **3. CSS Modules Conversion**

```bash
# Rename all .css files to .module.css
Header.css → Header.module.css
Client.css → Client.module.css
```

## 🚀 Quick Migration Steps

1. **Create Next.js Project:**

   ```bash
   npx create-next-app@latest beringia-next --typescript --tailwind false --src-dir --app --import-alias
   ```

2. **Copy Components:**

   ```bash
   cp -r components-migration/* beringia-next/src/
   ```

3. **Fix Environment Variables:**

   - Update `sanity.ts` (line 7)
   - Create `.env.local` with Sanity credentials

4. **Convert CSS to CSS Modules:**

   - Rename `.css` → `.module.css`
   - Update imports: `import styles from './Component.module.css'`
   - Update className usage: `className={styles.componentName}`

5. **Update Routing:**
   - Convert React Router → Next.js App Router
   - Update Link components
   - Create `src/app/` directory structure

## 📊 Component Priority

**🔥 HIGH PRIORITY:**

- Header (navigation, mobile menu)
- Client (dynamic pages, 3D models)
- Modal System (context providers)

**⚡ MEDIUM PRIORITY:**

- Contact Forms (EmailJS integration)
- Home Page (hero sections)

**✅ LOW PRIORITY:**

- About (static content)
- Footer (simple layout)
- Error Boundaries

## 🎨 Styling Architecture

**✅ Ready to Copy:**

- BEM methodology (consistent naming)
- Responsive design (mobile-first)
- Color system (CSS variables)
- Typography (Domitian + Inter fonts)
- Animations (CSS transitions)

## 📁 File Structure

```
components-migration/
├── components/     # All React components
├── hooks/         # Custom React hooks
├── contexts/      # React Context providers
├── types/         # TypeScript definitions
├── utils/         # Utility functions
├── assets/        # Images, icons, fonts
├── styles/        # Global styles
├── vendor/        # Third-party styles
├── sanity.ts      # Sanity client (needs fix)
├── fetchClients.ts # Data fetching (ready)
└── MIGRATION_GUIDE.md # Detailed guide
```

## 🔧 Key Features Preserved

- ✅ **Responsive Design** (mobile-first approach)
- ✅ **BEM CSS Architecture** (consistent naming)
- ✅ **TypeScript Types** (complete type safety)
- ✅ **Sanity CMS Integration** (data fetching ready)
- ✅ **Modal System** (context-based)
- ✅ **Error Boundaries** (error handling)
- ✅ **Custom Hooks** (reusable logic)
- ✅ **Asset Management** (images, fonts)

## 📚 Documentation

- **MIGRATION_GUIDE.md** - Comprehensive step-by-step guide
- **README.md** - Quick reference (this file)

## 🎯 Success Checklist

- [ ] Environment variables configured
- [ ] CSS Modules conversion complete
- [ ] Routing migration finished
- [ ] Sanity integration working
- [ ] All components render without errors
- [ ] Responsive design maintained
- [ ] TypeScript types resolved

---

**Ready for migration!** All components are preserved with their styling and functionality intact. Just need to adapt to Next.js 15 patterns.
