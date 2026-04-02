# Mindbody Widget Scroll Reload Solution

## **Problem:**

The Mindbody registration widget was reloading/disappearing every time the user scrolled, making the form unusable.

## **Root Cause:**

The `BookPageClient` component was subscribing to the entire Zustand store using `useNavigation()`. When other components (like `RollingBookButton`) updated Zustand state on scroll events (specifically `isRollingButtonNearFooter`), it caused the entire `BookPageClient` to re-render, which in turn caused the Mindbody widget to reload.

## **Solution:**

Changed from subscribing to the entire store to selective state subscription:

### **Before:**

```tsx
const { showRegistration, setShowRegistration } = useNavigation();
```

### **After:**

```tsx
const showRegistration = useAppStore(state => state.showRegistration);
const setShowRegistration = useAppStore(state => state.setShowRegistration);
```

## **Why This Works:**

- **Selective subscription**: Component only re-renders when `showRegistration` state changes
- **Isolated from scroll events**: No longer affected by other Zustand state changes
- **Stable widget**: Mindbody widget remains stable during scroll events
- **Better performance**: Fewer unnecessary re-renders

## **Key Learning:**

When using Zustand with components containing third-party widgets or heavy DOM manipulations, always use selective state subscriptions to prevent unnecessary re-renders that can cause widget reloading issues.

## **Files Modified:**

- `src/app/book/BookPageClient.tsx`

## **Date Fixed:**

December 2024
