# Component Migration Plan for Zustand State Management

## Overview

This document outlines the systematic migration of all components from local state to the centralized Zustand store.

---

## 📊 **Migration Priority Matrix**

| Priority   | Components         | Impact | Effort | Status             |
| ---------- | ------------------ | ------ | ------ | ------------------ |
| **HIGH**   | Header, Widgets    | High   | Low    | ✅ Header Complete |
| **MEDIUM** | Hero, Testimonials | Medium | Medium | 🔄 In Progress     |
| **LOW**    | Pages, Utilities   | Low    | High   | ⏳ Pending         |

---

## 🎯 **Component Migration List**

### **🔴 HIGH PRIORITY (Core Functionality)**

#### **1. Header Component** ✅ **COMPLETED**

- **File**: `src/components/layout/Header/Header.tsx`
- **Current State**: `useState` for menu open/close
- **Migration**: ✅ **DONE** - Using `useNavigation()` hook
- **Benefits**: Menu state persists across navigation

#### **2. Widget Components** 🔄 **NEXT**

- **Files**:
  - `src/components/ui/Widget/Widget.tsx`
  - `src/components/sections/Newsletter/Newsletter.tsx`
  - `src/app/book/page.tsx`
- **Current State**: `useState` for loading/error states
- **Migration Target**: Use `useWidgets()` hook
- **Benefits**: Centralized widget state management

#### **3. LoadingScreen Component**

- **File**: `src/components/ui/LoadingScreen/LoadingScreen.tsx`
- **Current State**: `useState` for progress and visibility
- **Migration Target**: Use `useNavigation()` hook
- **Benefits**: Consistent loading state across app

---

### **🟡 MEDIUM PRIORITY (User Experience)**

#### **4. Hero Component**

- **File**: `src/components/sections/Hero/Hero.tsx`
- **Current State**: `useState` for video rotation
- **Migration Target**: Use `usePerformance()` hook
- **Benefits**: Performance-aware video loading

#### **5. Testimonials Component**

- **File**: `src/components/sections/Testimonials/Testimonials.tsx`
- **Current State**: `useState` for carousel index
- **Migration Target**: Use `useNavigation()` hook
- **Benefits**: Carousel state persists across navigation

#### **6. ServiceNavigation Component**

- **File**: `src/components/ui/ServiceNavigation/ServiceNavigation.tsx`
- **Current State**: `useState` for sidebar open/close
- **Migration Target**: Use `useNavigation()` hook
- **Benefits**: Consistent navigation state

#### **7. RollingBookButton Component**

- **File**: `src/components/ui/RollingBookButton/RollingBookButton.tsx`
- **Current State**: `useState` for footer proximity
- **Migration Target**: Use `useNavigation()` hook
- **Benefits**: Button state management

---

### **🟢 LOW PRIORITY (Page-Specific)**

#### **8. Page Components**

- **Files**:
  - `src/app/about/page.tsx` - `useState` for expanded founders
  - `src/app/contact/page.tsx` - `useState` for form data
  - `src/app/faq/page.tsx` - `useState` for open items
  - `src/app/careers/page.tsx` - `useState` for expanded jobs
  - `src/app/experience/page.tsx` - `useState` for hover states
- **Migration Target**: Use `useUserPreferences()` hook
- **Benefits**: User preferences persistence

#### **9. Utility Components**

- **Files**:
  - `src/components/ui/AdaptiveMedia/AdaptiveMedia.tsx` - `useState` for format preference
  - `src/components/ui/VideoBackground/VideoBackground.tsx` - `useState` for video states
  - `src/components/ui/PhotoGallery/PhotoGallery.tsx` - `useState` for current image
- **Migration Target**: Use `usePerformance()` hook
- **Benefits**: Performance-aware media loading

---

## 🔄 **Migration Process**

### **Step 1: Analyze Component**

```typescript
// Before: Local state
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);

// After: Centralized state
const { widgetStates, setWidgetState } = useWidgets();
const widgetState = widgetStates[widgetId] || { isLoading: false, hasError: false };
```

### **Step 2: Replace State Management**

```typescript
// Before: Direct state updates
setIsLoading(true);
setHasError(false);

// After: Store actions
setWidgetState(widgetId, { isLoading: true, hasError: false });
```

### **Step 3: Update Component Logic**

```typescript
// Before: Local state checks
if (isLoading) return <LoadingSpinner />;
if (hasError) return <ErrorMessage />;

// After: Store state checks
if (widgetState.isLoading) return <LoadingSpinner />;
if (widgetState.hasError) return <ErrorMessage />;
```

---

## 📋 **Migration Checklist**

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

## 🎯 **Migration Benefits by Component Type**

### **Navigation Components**

- **State Persistence**: Menu state survives navigation
- **Consistency**: Same state across all pages
- **Performance**: Reduced re-renders

### **Widget Components**

- **Centralized Management**: All widget states in one place
- **Error Handling**: Consistent error states
- **Loading States**: Coordinated loading indicators

### **Media Components**

- **Performance Awareness**: Adapt to device capabilities
- **User Preferences**: Remember format preferences
- **Caching**: Persistent performance profiles

### **Page Components**

- **User Preferences**: Remember user choices
- **Form State**: Persistent form data
- **UI State**: Remember expanded/collapsed states

---

## 🚨 **Migration Risks & Mitigation**

| Risk                       | Probability | Impact | Mitigation                           |
| -------------------------- | ----------- | ------ | ------------------------------------ |
| **Breaking functionality** | Low         | High   | Test thoroughly after each migration |
| **Performance regression** | Very Low    | Low    | Zustand is optimized for performance |
| **State conflicts**        | Low         | Medium | Use unique IDs for widget states     |
| **Migration complexity**   | Medium      | Medium | Migrate one component at a time      |

---

## 📊 **Expected Results**

### **After Complete Migration:**

- **Centralized State**: All app state in one place
- **Reduced Bundle Size**: Fewer context providers
- **Better Performance**: Efficient state updates
- **Improved UX**: Persistent user preferences
- **Easier Debugging**: Single source of truth

### **Performance Improvements:**

- **Faster Initial Load**: Reduced provider overhead
- **Better Memory Usage**: Efficient state management
- **Reduced Re-renders**: Only affected components update

---

## 🎯 **Next Steps**

1. **Migrate Widget Components** (High Priority)
2. **Migrate Hero Component** (Medium Priority)
3. **Migrate Testimonials Component** (Medium Priority)
4. **Migrate Page Components** (Low Priority)
5. **Migrate Utility Components** (Low Priority)

---

## 📞 **Migration Support**

- **Reference**: `src/lib/store/AppStore.ts` for store structure
- **Examples**: `src/components/layout/Header/Header.tsx` for migration pattern
- **Testing**: Test each component after migration
- **Documentation**: Update component docs with new patterns
