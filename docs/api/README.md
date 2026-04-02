# API Documentation - Vital Ice

## Overview

This document provides comprehensive API documentation for the Vital Ice website, including Mindbody integration and internal utilities.

## 🔗 API Endpoints

### **Base URL**

- **Development**: `http://localhost:3000/api`
- **Production**: `https://vitalicesf.com/api`

### **Authentication**

Most endpoints use API keys or environment variables for authentication. See [Environment Configuration](../deployment/ENVIRONMENT.md) for setup details.

## 🏋️ Mindbody Integration

### **Booking Widget**

**Component**: `MindbodyModal`

**Configuration**:

```typescript
interface MindbodyConfig {
  siteId: string;
  apiKey: string;
  widgetId: string;
  partner: string;
}
```

**Environment Variables**:

```bash
MINDBODY_SITE_ID=your_site_id
MINDBODY_API_KEY=your_api_key
MINDBODY_WIDGET_ID=ec59331b5f7
MINDBODY_PARTNER=object
```

**Usage**:

```typescript
import { useModal } from '@/components/providers/ModalProvider';

const { openModal } = useModal();

// Open booking modal
openModal();
```

### **Mindbody API Endpoints**

**Base URL**: `https://api.mindbodyonline.com/public/v6/`

**Authentication**: API Key in headers

```javascript
headers: {
  'Api-Key': process.env.MINDBODY_API_KEY,
  'SiteId': process.env.MINDBODY_SITE_ID
}
```

**Available Endpoints**:

- `GET /class/classes` - Get class schedule
- `GET /client/clients` - Get client information
- `POST /appointment/addappointment` - Create appointment
- `GET /site/locations` - Get location information

**📚 Complete Documentation**: See [Mindbody Integration Documentation](../mindbody/README.md) for comprehensive API documentation, tutorials, and best practices.

## 🎨 Service Data API

### **Service Information**

**File**: `src/lib/data/services.ts`

**Data Structure**:

```typescript
interface Service {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  specs: {
    temperature?: string;
    duration: string;
    type: string;
  };
  benefits: string[];
  process: string[];
  color: string;
  heroImage: string;
  gallery: string[];
}
```

**Available Services**:

1. **Cold Plunge** (`cold-plunge`)
2. **Infrared Sauna** (`infrared-sauna`)
3. **Traditional Sauna** (`traditional-sauna`)
4. **Compression Boots** (`compression-boots`)
5. **Percussion Massage** (`percussion-massage`)
6. **Red Light Therapy** (`red-light-therapy`)

**Usage**:

```typescript
import { services } from '@/lib/data/services';

// Get all services
const allServices = services;

// Get specific service
const coldPlunge = services.find(s => s.slug === 'cold-plunge');

// Get service by ID
const serviceById = services.find(s => s.id === 'cold-plunge');
```

## 🎬 Media API

### **Video Assets**

**CDN Base URL**: `https://pub-3fd38cef83ec4139b038b229662d7717.r2.dev/`

**Video Inventory**:

- **Hero Videos**: 8 ambient videos (4 cold, 4 hot)
- **About Videos**: San Francisco marina footage
- **Timeline Videos**: Ancient hot spring content
- **Performance Videos**: Local demo assets

**Video Formats**:

- **Primary**: MP4 (H.264)
- **Fallback**: WebM (VP9)
- **Mobile**: Optimized for mobile networks

**Usage**:

```typescript
// Video background component
<VideoBackground
  videos={[
    '/videos/cold-ambient-1.mp4',
    '/videos/hot-ambient-1.mp4'
  ]}
  rotationInterval={8000}
/>
```

### **Image Assets**

**Base Path**: `/public/images/`

**Categories**:

- **Hero Images**: High-resolution hero backgrounds
- **Service Images**: Service-specific imagery
- **Texture Images**: Background textures and overlays
- **Logo Assets**: Brand logos and icons

**Optimization**:

- **Format**: WebP with JPEG fallback
- **Responsive**: Multiple sizes for different devices
- **Lazy Loading**: Automatic lazy loading implementation

## 🎭 Animation API

### **Spring Animation System**

**File**: `src/lib/utils/animations.ts`

**Spring Configurations**:

```typescript
const springConfigs = {
  gentle: { stiffness: 100, damping: 20, mass: 0.8 },
  responsive: { stiffness: 300, damping: 25, mass: 0.5 },
  bouncy: { stiffness: 400, damping: 15, mass: 0.8 },
  smooth: { stiffness: 150, damping: 30, mass: 1 },
  quick: { stiffness: 500, damping: 35, mass: 0.3 },
  heavy: { stiffness: 80, damping: 18, mass: 1.2 },
};
```

**Animation Variants**:

```typescript
// Text reveal animation
const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Slide animations
const slideVariants = {
  slideLeft: { x: -50, opacity: 0 },
  slideRight: { x: 50, opacity: 0 },
  slideUp: { y: 50, opacity: 0 },
  slideDown: { y: -50, opacity: 0 },
};
```

**Usage**:

```typescript
import { motion } from 'framer-motion';
import { springConfigs, textRevealVariants } from '@/lib/utils/animations';

<motion.div
  variants={textRevealVariants}
  transition={springConfigs.gentle}
>
  Animated content
</motion.div>
```

## 📊 Performance API

### **Performance Detection**

**File**: `src/lib/utils/performanceDetection.ts`

**Capabilities**:

- Device performance assessment
- Network speed detection
- Memory availability check
- Battery level monitoring

**Usage**:

```typescript
import {
  detectDeviceCapabilities,
  shouldLoadHeavyMedia,
  getOptimalVideoQuality,
} from '@/lib/utils/performanceDetection';

// Check device capabilities
const capabilities = detectDeviceCapabilities();

// Determine media loading strategy
const loadHeavyMedia = shouldLoadHeavyMedia();

// Get optimal video quality
const videoQuality = getOptimalVideoQuality();
```

### **Adaptive Media Loading**

**Component**: `AdaptiveMedia`

**Props**:

```typescript
interface AdaptiveMediaProps {
  src: string;
  webmSrc?: string;
  poster?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: 'low' | 'medium' | 'high';
}
```

**Usage**:

```typescript
<AdaptiveMedia
  src="/videos/ambient-water-high.mp4"
  webmSrc="/videos/ambient-water-high.webm"
  poster="/images/ambient-water-poster.jpg"
  alt="Ambient water background"
  quality="high"
/>
```

## 🔧 Utility APIs

### **Service Color Hook**

**File**: `src/lib/hooks/useServiceColor.ts`

**Usage**:

```typescript
import { useServiceColor } from '@/lib/hooks/useServiceColor';

const { getServiceColor, getLogoColor } = useServiceColor();

// Get service-specific color
const color = getServiceColor('cold-plunge'); // Returns #00B7B5

// Get logo color based on current page
const logoColor = getLogoColor(); // Returns appropriate color
```

### **Scroll Position Hook**

**File**: `src/lib/hooks/useScrollPosition.ts`

**Usage**:

```typescript
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';

const { scrollY, scrollDirection } = useScrollPosition();

// Use scroll position for animations
useEffect(() => {
  if (scrollY > 100) {
    // Trigger animation
  }
}, [scrollY]);
```

## 🛡️ Error Handling

### **API Error Responses**

**Standard Error Format**:

```typescript
interface ApiError {
  error: string;
  message: string;
  code: number;
  details?: any;
}
```

**Common Error Codes**:

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Missing or invalid API key
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server-side error

### **Error Handling Examples**

```typescript
// API error handling
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('API request failed:', error);
  // Handle error appropriately
}
```

## 📈 Analytics API

### **Event Tracking**

**File**: `src/lib/analytics.ts`

**Available Events**:

- Page views
- Button clicks
- Form submissions
- Video interactions
- Service page visits

**Usage**:

```typescript
import { trackEvent } from '@/lib/analytics';

// Track custom events
trackEvent('button_click', {
  button_name: 'book_now',
  page: 'home',
});

trackEvent('form_submit', {
  form_type: 'contact',
  success: true,
});
```

## 🔄 API Versioning

### **Current Version**: v1

**Versioning Strategy**:

- URL-based versioning: `/api/v1/`
- Backward compatibility maintained
- Deprecation notices for breaking changes

**Migration Guide**:

- Breaking changes announced 3 months in advance
- Migration scripts provided for major updates
- Documentation updated for each version

## 📞 Support

### **API Support**

- **Documentation Issues**: Create GitHub issue
- **Technical Problems**: Check troubleshooting guide
- **Feature Requests**: Submit via GitHub issues
- **Emergency**: Contact development team

### **Rate Limits**

- **Mindbody API**: 1000 requests/day
- **Media API**: No limits (CDN-based)

### **Monitoring**

- **Uptime**: 99.9% target
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1% target
- **Availability**: 24/7 monitoring
