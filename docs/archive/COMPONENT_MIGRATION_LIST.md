# Complete Component Migration List

## Overview

This document provides a comprehensive list of all components that need to be migrated from local state to the centralized Zustand store.

---

## 📊 **Migration Priority Overview**

| Priority   | Count | Components                                                           | Status         |
| ---------- | ----- | -------------------------------------------------------------------- | -------------- |
| **HIGH**   | 3     | Header ✅, Widgets ✅, LoadingScreen ✅                              | 3/3 Complete   |
| **MEDIUM** | 4     | Hero ✅, Testimonials ✅, ServiceNavigation ✅, RollingBookButton ✅ | 4/4 Complete   |
| **LOW**    | 7     | Pages (4), Utilities (3)                                             | 5/7 Complete   |
| **TOTAL**  | 14    | All components                                                       | 12/14 Complete |

---

## 🎯 **Detailed Component List**

### **🔴 HIGH PRIORITY (Core Functionality)**

#### **1. Header Component** ✅ **COMPLETED**

- **File**: `src/components/layout/Header/Header.tsx`
- **Current State**: `useState` for menu open/close
- **Migration**: ✅ **DONE** - Using `useNavigation()` hook
- **Benefits**: Menu state persists across navigation

#### **2. Widget Components** ✅ **COMPLETED**

- **Files**:
  - `src/components/ui/Widget/Widget.tsx` ✅ **DONE** - Using `useWidgets()` hook
  - `src/components/sections/Newsletter/Newsletter.tsx` ✅ **DONE** - Using Widget component
  - `src/app/book/page.tsx` ✅ **DONE** - Using `useNavigation()` hook for registration state
- **Migration**: ✅ **COMPLETED** - All widget-related state now centralized
- **Benefits**: Centralized widget state management, registration state persistence

#### **3. LoadingScreen Component** ✅ **COMPLETED**

- **File**: `src/components/ui/LoadingScreen/LoadingScreen.tsx`
- **Current State**: `useState` for progress and visibility
- **Migration**: ✅ **DONE** - Using `useLoading()` hook
- **Benefits**: Consistent loading state across app, centralized loading management

---

### **🟡 MEDIUM PRIORITY (User Experience)**

#### **4. Hero Component** ✅ **COMPLETED**

- **File**: `src/components/sections/Hero/Hero.tsx`
- **Current State**: `useState` for video rotation
- **Migration**: ✅ **DONE** - Using `usePerformance()` hook
- **Benefits**: Performance-aware video loading, video index persists across navigation

#### **5. Testimonials Component** ✅ **COMPLETED**

- **File**: `src/components/sections/Testimonials/Testimonials.tsx`
- **Current State**: `useState` for carousel index
- **Migration**: ✅ **DONE** - Using `useNavigation()` hook
- **Benefits**: Carousel state persists across navigation, testimonial index remembered

#### **6. ServiceNavigation Component** ✅ **COMPLETED**

- **File**: `src/components/ui/ServiceNavigation/ServiceNavigation.tsx`
- **Current State**: `useState` for sidebar open/close
- **Migration**: ✅ **DONE** - Using `useNavigation()` hook
- **Benefits**: Consistent navigation state, sidebar state persists across navigation

#### **7. RollingBookButton Component** ✅ **COMPLETED**

- **File**: `src/components/ui/RollingBookButton/RollingBookButton.tsx`
- **Current State**: `useState` for footer proximity
- **Migration**: ✅ **DONE** - Using `useNavigation()` hook
- **Benefits**: Button position state persists across navigation, footer proximity detection remembered

---

### **🟢 LOW PRIORITY (Page-Specific)**

#### **8. About Page** ✅ **COMPLETED**

- **File**: `src/app/about/page.tsx`
- **Current State**: `useState` for expanded founders
- **Migration**: ✅ **DONE** - Using `useUserPreferences()` hook
- **Benefits**: Remember expanded state, founder bio expansion persists across navigation

#### **9. FAQ Page** ✅ **COMPLETED**

- **File**: `src/app/faq/page.tsx`
- **Current State**: `useState` for open items
- **Migration**: ✅ **DONE** - Using `useUserPreferences()` hook
- **Benefits**: Remember open FAQ items, expanded FAQ state persists across navigation

#### **10. Careers Page** ✅ **COMPLETED**

- **File**: `src/app/careers/page.tsx`
- **Current State**: `useState` for expanded jobs
- **Migration**: ✅ **DONE** - Using `useUserPreferences()` hook
- **Benefits**: Remember expanded job listings, job expansion state persists across navigation

#### **11. Experience Page** ✅ **COMPLETED**

- **File**: `src/app/experience/page.tsx`
- **Current State**: `useState` for hover states and layout
- **Migration**: ✅ **DONE** - Using `useUserPreferences()` hook
- **Benefits**: Remember layout preferences, service hover state persists across navigation

#### **12. AdaptiveMedia Component** ✅ **COMPLETED**

- **File**: `src/components/ui/AdaptiveMedia/AdaptiveMedia.tsx`
- **Current State**: `useState` for format preference and error states
- **Migration**: ✅ **DONE** - Using `usePerformance()` hook
- **Benefits**: Performance-aware media loading, video format preferences persist across navigation

#### **13. VideoBackground Component**

- **File**: `src/components/ui/VideoBackground/VideoBackground.tsx`
- **Current State**: `useState` for video states (loaded, error, playing)
- **Migration Target**: Use `usePerformance()` hook
- **Benefits**: Performance-aware video loading

#### **14. PhotoGallery Component**

- **File**: `src/components/ui/PhotoGallery/PhotoGallery.tsx`
- **Current State**: `useState` for current image index ✅ **COMPLETED**
- **Migration Target**: Use `useNavigation()` hook
- **Benefits**: Remember current image position

---

## 🔄 **Migration Process for Each Component**

### **Step 1: Analyze Current State**

```typescript
// Example: Widget Component
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [widgetHTML, setWidgetHTML] = useState('');
```

### **Step 2: Choose Store Hook**

```typescript
// Choose appropriate hook based on state type
import { useWidgets } from '@/lib/store/AppStore';
const { widgetStates, setWidgetState } = useWidgets();
```

### **Step 3: Replace State Management**

```typescript
// Before: Local state
setIsLoading(true);
setHasError(false);

// After: Store actions
setWidgetState(widgetId, { isLoading: true, hasError: false });
```

### **Step 4: Update Component Logic**

```typescript
// Before: Local state checks
if (isLoading) return <LoadingSpinner />;
if (hasError) return <ErrorMessage />;

// After: Store state checks
const widgetState = widgetStates[widgetId] || { isLoading: false, hasError: false };
if (widgetState.isLoading) return <LoadingSpinner />;
if (widgetState.hasError) return <ErrorMessage />;
```

---

## 📋 **Migration Checklist Template**

### **For Each Component:**

- [ ] **Identify current state usage**
- [ ] **Choose appropriate store hook**
- [ ] **Replace `useState` with store hook**
- [ ] **Update state access patterns**
- [ ] **Update state mutation patterns**
- [ ] **Test component functionality**
- [ ] **Verify no regressions**
- [ ] **Update component documentation**

### **Store Hooks Available:**

1. **`useNavigation()`** - Page, menu, navigation state
2. **`useWidgets()`** - Widget loading/error states
3. **`useUserPreferences()`** - User settings and preferences
4. **`usePerformance()`** - Performance profile and media settings

---

## 🎯 **Migration Timeline**

### **Week 1: High Priority**

- [x] Header Component ✅
- [x] Widget Components ✅
- [x] LoadingScreen Component ✅

### **Week 2: Medium Priority**

- [x] Hero Component ✅
- [x] Testimonials Component ✅
- [x] ServiceNavigation Component ✅
- [x] RollingBookButton Component ✅

### **Week 3-4: Low Priority**

- [x] Page Components (4/4 files) ✅ About Page, FAQ Page, Careers Page, Experience Page
- [x] Utility Components (2/2 files) ✅ AdaptiveMedia Component, PhotoGallery Component (VideoBackground kept local)

---

## 📊 **Expected Results**

### **After Complete Migration:**

- **Centralized State**: All 15 components using Zustand
- **Reduced Bundle Size**: Fewer context providers
- **Better Performance**: Efficient state updates
- **Improved UX**: Persistent user preferences
- **Easier Debugging**: Single source of truth

### **Performance Improvements:**

- **Faster Initial Load**: Reduced provider overhead
- **Better Memory Usage**: Efficient state management
- **Reduced Re-renders**: Only affected components update

---

## 📞 **Migration Support**

### **Reference Documentation**

- **Store Structure**: `src/lib/store/AppStore.ts`
- **Migration Example**: `src/components/layout/Header/Header.tsx`
- **Migration Guide**: `docs/migration/COMPONENT_MIGRATION_PLAN.md`

### **Available Hooks**

- `useNavigation()` - Page, menu, navigation state
- `useWidgets()` - Widget loading/error states
- `useUserPreferences()` - User settings and preferences
- `usePerformance()` - Performance profile and media settings
