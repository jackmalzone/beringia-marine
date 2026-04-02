# Troubleshooting Guide - Vital Ice

## Overview

This guide provides solutions to common issues encountered during development and deployment of the Vital Ice website. It consolidates resolved bugs and provides quick fixes for typical problems.

## 🚨 Critical Issues

### **Modal Z-Index Problems**

**Problem**: Mindbody modal appears behind footer despite high z-index

**Root Cause**: Modal rendered within component stacking context

**Solution**:

1. Use global modal state management
2. Render modal at document level
3. Apply maximum z-index and isolation

**Files**:

- `src/components/providers/ModalProvider.tsx`
- `src/components/ui/MindbodyModal/MindbodyModal.module.css`

**Quick Fix**:

```css
.modalOverlay {
  z-index: 2147483647; /* Maximum z-index */
  isolation: isolate; /* New stacking context */
}
```

### **Widget Duplication**

**Problem**: Newsletter widget appears twice on page

**Root Cause**: Widget creation logic running multiple times

**Solution**:

1. Add widget creation tracking with `useRef`
2. Prevent duplicate creation
3. Centralize widget creation logic

**Files**: `src/components/sections/Newsletter/Newsletter.tsx`

**Quick Fix**:

```typescript
const widgetCreatedRef = useRef(false);

if (widgetCreatedRef.current) {
  return;
}
```

## 🎨 Visual Issues

### **Text Touching in Panels**

**Problem**: Text elements touching/overlapping in panel headers

**Root Cause**: Dynamic panel width based on content length

**Solution**: Add invisible spacer with margin

**Files**: `src/app/experience/page.tsx`

**Quick Fix**:

```tsx
<span style={{ marginLeft: '1rem' }}>&nbsp;</span>
```

### **Background Images Not Displaying**

**Problem**: Background images show black background only

**Root Cause**: Global CSS black background covering images

**Solution**: Comment out global background color

**Files**: `src/app/globals.css`

**Quick Fix**:

```css
/* background: var(--color-background); */ /* Comment out when using background images */
```

### **React Child Errors**

**Problem**: "Objects are not valid as a React child" error

**Root Cause**: Complex Map component returning objects instead of JSX

**Solution**: Remove complex Map component, use simple Google Maps link

**Files**: `src/components/layout/Footer/Footer.tsx`

**Quick Fix**:

```tsx
<a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
  <address>{address}</address>
</a>
```

## 🔧 Development Issues

### **Build Failures**

**Common Causes**:

1. TypeScript errors
2. Missing dependencies
3. Environment variables not set

**Solutions**:

```bash
# Check TypeScript errors
npm run type-check

# Install missing dependencies
npm install

# Set environment variables
cp .env.example .env.local
```

### **Performance Issues**

**Symptoms**:

- Slow page loads
- Choppy animations
- High memory usage

**Solutions**:

```bash
# Analyze bundle size
npm run analyze

# Check performance
npm run build && npm run start

# Optimize images
# Use WebP format with fallbacks
```

### **Hot Reload Not Working**

**Causes**:

1. File watcher limits
2. Large node_modules
3. Antivirus interference

**Solutions**:

```bash
# Increase file watcher limits (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

## 📱 Mobile Issues

### **Touch Interactions**

**Problem**: Buttons not responding to touch

**Solution**: Add proper touch targets

```css
.button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}
```

### **Performance on Mobile**

**Problem**: Slow loading on mobile devices

**Solutions**:

1. Use adaptive media loading
2. Optimize images for mobile
3. Reduce animation complexity

```typescript
// Check device capabilities
const capabilities = detectDeviceCapabilities();
const loadHeavyMedia = shouldLoadHeavyMedia();
```

### **Viewport Issues**

**Problem**: Layout breaks on mobile

**Solution**: Ensure proper viewport meta tag

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

## 🌐 Browser Compatibility

### **Safari Issues**

**Common Problems**:

1. Video autoplay not working
2. CSS backdrop-filter not supported
3. Flexbox layout issues

**Solutions**:

```css
/* Video autoplay fallback */
video {
  -webkit-playsinline: true;
  playsinline: true;
}

/* Backdrop filter fallback */
.element {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5); /* Fallback */
}
```

### **Firefox Issues**

**Common Problems**:

1. CSS Grid layout issues
2. Animation performance
3. Font rendering

**Solutions**:

```css
/* Grid fallback */
.grid {
  display: grid;
  display: -ms-grid; /* IE fallback */
}

/* Animation optimization */
.animated {
  will-change: transform, opacity;
}
```

### **Internet Explorer**

**Note**: IE is not supported, but if needed:

```typescript
// Check browser support
const isIE =
  navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;

if (isIE) {
  // Show unsupported message
  showUnsupportedMessage();
}
```

## 🔗 Third-Party Integration Issues

### **Mindbody Widget**

**Common Problems**:

1. Widget not loading
2. API errors
3. Styling conflicts

**Solutions**:

```typescript
// Error suppression for Mindbody
const originalJSONParse = JSON.parse;
JSON.parse = function (text) {
  try {
    return originalJSONParse.call(this, text);
  } catch (error) {
    console.warn('Mindbody widget JSON parse error suppressed:', error);
    return null;
  }
};
```

### **CDN Issues**

**Common Problems**:

1. Video not loading
2. Slow CDN response
3. CORS errors

**Solutions**:

```typescript
// CDN fallback
const cdnUrl = process.env.CDN_BASE_URL || 'https://fallback-cdn.com';
const videoUrl = `${cdnUrl}/videos/${filename}`;
```

## 📊 Performance Monitoring

### **Lighthouse Issues**

**Common Problems**:

1. Low performance score
2. Accessibility issues
3. SEO problems

**Solutions**:

```bash
# Run Lighthouse audit
npx lighthouse https://vitalicesf.com --output html --output-path ./lighthouse-report.html

# Check specific metrics
npx lighthouse https://vitalicesf.com --only-categories=performance
```

### **Core Web Vitals**

**Targets**:

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

**Monitoring**:

```typescript
// Monitor Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## 🐛 Debugging Tools

### **Development Tools**

```bash
# Enable React DevTools
npm install -g react-devtools

# Enable Next.js debugging
NODE_OPTIONS='--inspect' npm run dev

# Check bundle size
npm run analyze
```

### **Browser DevTools**

```javascript
// Performance monitoring
performance.mark('start');
// ... code ...
performance.mark('end');
performance.measure('operation', 'start', 'end');

// Memory usage
console.log(performance.memory);
```

### **Error Tracking**

```typescript
// Global error handler
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

## 🔄 Common Workflows

### **Issue Resolution Process**

1. **Identify the Problem**

   - Check browser console for errors
   - Review network tab for failed requests
   - Test in different browsers/devices

2. **Isolate the Issue**

   - Comment out components one by one
   - Check if issue persists in development
   - Verify environment variables

3. **Implement Fix**

   - Apply solution from this guide
   - Test thoroughly
   - Update documentation

4. **Prevent Recurrence**
   - Add tests if applicable
   - Update development guidelines
   - Document the solution

### **Performance Optimization**

1. **Measure Current Performance**

   - Run Lighthouse audit
   - Check Core Web Vitals
   - Analyze bundle size

2. **Identify Bottlenecks**

   - Large images/videos
   - Unoptimized code
   - Third-party scripts

3. **Implement Optimizations**

   - Optimize media assets
   - Code splitting
   - Lazy loading

4. **Verify Improvements**
   - Re-run performance tests
   - Monitor user experience
   - Track metrics over time

## 📞 Getting Help

### **Internal Resources**

- **Documentation**: Check relevant docs in `/docs/`
- **Code Examples**: Review existing implementations
- **Team Knowledge**: Ask team members

### **External Resources**

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion/
- **Vercel Support**: https://vercel.com/support

### **Emergency Contacts**

- **Critical Issues**: Contact development team immediately
- **Client Issues**: Escalate to project manager
- **Infrastructure**: Contact hosting provider

## 📋 Troubleshooting Checklist

### **Before Starting**

- [ ] Check if issue is documented here
- [ ] Verify environment setup
- [ ] Test in different browsers
- [ ] Check console for errors

### **During Debugging**

- [ ] Isolate the problem
- [ ] Test potential solutions
- [ ] Document findings
- [ ] Update this guide if needed

### **After Resolution**

- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Share solution with team
- [ ] Monitor for recurrence

## 🔄 Maintenance

### **Regular Tasks**

- **Weekly**: Review error logs
- **Monthly**: Update troubleshooting guide
- **Quarterly**: Review performance metrics
- **Annually**: Audit documentation

### **Documentation Updates**

- Add new issues and solutions
- Remove outdated information
- Update links and references
- Improve organization

---

**Last Updated**: December 2024  
**Maintained by**: Development Team  
**Next Review**: January 2025
