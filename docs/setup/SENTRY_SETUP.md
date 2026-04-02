# Sentry Setup for Vital Ice - Page Reload Tracking

## Overview

Sentry has been configured to track and debug the automatic page reload issues, especially on Safari and Chrome. This setup will help identify the root causes of the reloads.

## Configuration Files Created

### 1. Sentry Configuration Files

- `sentry.client.config.ts` - Client-side error tracking and performance monitoring
- `sentry.server.config.ts` - Server-side error tracking for API routes
- `sentry.edge.config.ts` - Edge runtime error tracking

### 2. Error Boundary

- `src/components/providers/SentryErrorBoundary.tsx` - Catches unhandled errors that might cause reloads

### 3. Middleware

- `src/middleware.ts` - Tracks page navigation and detects potential reloads

### 4. Tracking Utilities

- `src/lib/utils/sentryTracking.ts` - Specific tracking for reload issues and performance problems

## Key Features Implemented

### 🔍 **Page Reload Detection**

- Tracks navigation type (reload vs navigation)
- Monitors page visibility changes
- Detects browser-specific issues

### 🎥 **Video Performance Tracking**

- Monitors video loading errors
- Tracks video playback issues
- Captures browser-specific video problems

### 🧭 **Smooth Scroll Monitoring**

- Tracks Lenis smooth scroll setup
- Monitors scroll performance issues
- Captures scroll-related errors

### 📧 **Mindbody Widget Tracking**

- Monitors widget loading failures
- Tracks script loading issues
- Captures widget-specific errors

### 💾 **Memory Usage Monitoring**

- Tracks JavaScript heap usage
- Alerts on high memory consumption
- Monitors for memory leaks

### 🌐 **Browser-Specific Tracking**

- Safari-specific issue detection
- Chrome-specific problem tracking
- User agent analysis

## Critical Issues Fixed

### 1. **Dev Server Configuration**

```json
// FIXED: Invalid port configuration was causing server crashes
"dev": "next dev --port 3000 --hostname 0.0.0.0"
```

### 2. **Error Boundaries**

- Added SentryErrorBoundary to catch unhandled errors
- Prevents crashes from causing reloads

### 3. **Performance Monitoring**

- Video loading performance tracking
- Memory usage monitoring
- Browser-specific optimizations

## What Sentry Will Track

### 🚨 **Page Reloads**

- Automatic detection of page reloads
- Navigation timing analysis
- Browser-specific reload patterns

### 🎯 **Performance Issues**

- Video loading failures
- Memory usage spikes
- Animation performance problems

### 🔧 **Component Errors**

- VideoBackground component issues
- SmoothScrollProvider problems
- Mindbody widget failures

### 🌍 **Browser Issues**

- Safari autoplay restrictions
- Chrome memory management
- Mobile Safari specific problems

## How to Monitor

### 1. **Sentry Dashboard**

- Check the Sentry dashboard for real-time error reports
- Look for patterns in page reloads
- Monitor browser-specific issues

### 2. **Key Metrics to Watch**

- Page reload frequency
- Video loading error rates
- Memory usage patterns
- Browser-specific error rates

### 3. **Alerts to Set Up**

- High page reload frequency
- Video loading failures
- Memory usage spikes
- Browser-specific issues

## Next Steps

### 1. **Deploy and Monitor**

- Deploy the changes
- Monitor Sentry for 24-48 hours
- Collect data on reload patterns

### 2. **Analyze Patterns**

- Identify most common error types
- Look for browser-specific patterns
- Find correlation with user actions

### 3. **Implement Fixes**

- Based on Sentry data, implement targeted fixes
- Focus on the most common issues first
- Test fixes in development

## Expected Benefits

### 📊 **Better Visibility**

- Real-time error tracking
- Performance monitoring
- User experience insights

### 🎯 **Targeted Fixes**

- Data-driven problem solving
- Browser-specific optimizations
- Performance improvements

### 🚀 **Reduced Reloads**

- Proactive error prevention
- Better error handling
- Improved user experience

## DSN Configuration

```
https://87a54d85ac4fa0d12bba04869c5fa53e@o4509843732496384.ingest.us.sentry.io/4509843734265856
```

This setup will provide comprehensive tracking of the page reload issues and help identify the root causes for targeted fixes.
