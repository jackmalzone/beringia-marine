# TypeScript and Prettier Build Fixes

## **Problem:**

The Vercel build was failing due to TypeScript errors and Prettier formatting issues that prevented successful compilation.

## **Root Cause:**

1. **TypeScript Error**: The `setExpandedFounders` callback functions in `AboutPageClient.tsx` had implicit `any` types for the `prev` parameter
2. **Prettier Error**: Long lines exceeded Prettier's line length limits and had incorrect indentation

## **Solution:**

### **TypeScript Fix:**

Added explicit type annotations to the callback functions:

```typescript
// Before:
setExpandedFounders(prev => prev.filter(i => i !== index));
setExpandedFounders(prev => [...prev, index]);

// After:
setExpandedFounders((prev: number[]) => prev.filter(i => i !== index));
setExpandedFounders((prev: number[]) => [...prev, index]);
```

### **Prettier Fix:**

Broke long lines and corrected indentation:

```typescript
// Before (too long):
onClick={() => setExpandedFounders((prev: number[]) => [...prev, index])}

// After (properly formatted):
onClick={() =>
  setExpandedFounders((prev: number[]) => [...prev, index])
}
```

## **Why This Works:**

- **TypeScript**: Explicit type annotations satisfy TypeScript's strict mode requirements
- **Prettier**: Proper line breaks and indentation comply with Prettier formatting rules

## **Key Learning:**

When using Zustand state setters with callback functions, always provide explicit type annotations to avoid TypeScript compilation errors in production builds.

## **Files Modified:**

- `src/app/about/AboutPageClient.tsx`

## **Date Fixed:**

December 2024

## **Build Status:**

✅ Vercel build now completes successfully
