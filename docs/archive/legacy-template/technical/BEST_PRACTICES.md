# Vital Ice Project Best Practices & Architecture

## Technology Stack

### Core Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - For type-safe development
- **CSS Modules** - For component-scoped, maintainable styling
- **EmailJS/Resend** - For contact form handling
- **Sanity.io** (optional) - For content management

### Key Features

- Server-side rendering (SSR)
- Client-side navigation
- Responsive design
- Progressive enhancement
- Type safety
- Component-based architecture
- Clean, readable CSS with proper scoping

## Design Philosophy

### Core Principles

1. **Immersive, Dark-Themed Design**

   - High-contrast typography and imagery
   - Dark backgrounds to make content pop
   - Singular focus on key visuals
   - Premium, luxury aesthetic
   - Reduced eye strain in low-light environments

2. **Smooth, Scroll-Driven Experience**

   - Single-page application feel
   - Scroll-triggered animations
   - Parallax effects for depth
   - Micro-interactions for engagement
   - Hardware-accelerated animations

3. **Focused Visual Hierarchy**

   - One large hero image/video at a time
   - Optional split-screen layouts (max)
   - No four-quadrant grids
   - Ample whitespace
   - Clear content progression

4. **Immersive Multimedia**
   - Ambient video backgrounds
   - Muted, looped video content
   - Parallax scrolling elements
   - Animated SVG accents
   - Mobile-optimized media

### Visual Identity Anchors

- **Mood**: Calm, powerful, revitalizing
- **Aesthetic**: Minimal with ambient energy
- **Themes**: Water, breath, cold, renewal, community
- **Visual Metaphors**: Flowing surfaces, shimmering gradients, reflective textures

### Content Flow Strategy

1. **Narrative Structure**

   - What → Why → How → Where → When
   - Brand essence at the top
   - Services/benefits overview
   - Facility features
   - Social proof
   - Call-to-action

2. **User Journey**

   - Single-page design
   - Digestible sections
   - Clear messaging
   - Emotional storytelling
   - Natural content progression

3. **Navigation Aids**
   - Sticky menu
   - Back-to-top button
   - Progress indicators
   - Visual scroll cues
   - Section markers

### Technical Implementation

#### Animation & Motion

1. **Scroll Effects**

   ```typescript
   // Example scroll animation with GSAP
   gsap.from('.section', {
     scrollTrigger: {
       trigger: '.section',
       start: 'top center',
       toggleActions: 'play none none reverse',
     },
     y: 50,
     opacity: 0,
     duration: 1,
     ease: 'power2.out',
   });
   ```

2. **Parallax Backgrounds**

   ```typescript
   // Example parallax effect
   const parallax = () => {
     const scrolled = window.pageYOffset;
     const rate = scrolled * 0.5;
     element.style.transform = `translate3d(0, ${rate}px, 0)`;
   };
   ```

3. **Video Backgrounds**
   ```tsx
   // Example video background component
   const VideoBackground = () => (
     <div className="video-container">
       <video autoPlay muted loop playsInline poster="/static/fallback.jpg">
         <source src="/videos/ambient.mp4" type="video/mp4" />
       </video>
       <div className="overlay" />
     </div>
   );
   ```

#### Booking Integration

1. **Mindbody Widget Implementation**

   ```tsx
   // Example booking button component
   const BookingButton = () => (
     <button
       className="booking-button"
       onClick={() => {
         // Load Mindbody widget
         window.mindbody.openWidget();
       }}
     >
       Book Now
     </button>
   );
   ```

2. **Performance Optimization**
   - Lazy load booking widget
   - Loading placeholders
   - Mobile-first approach
   - Fallback content

### Color System

```css
:root {
  /* Brand Colors */
  --color-mist: #9ec7c5; /* Mist */
  --color-arctic: #00b7b5; /* Arctic */
  --color-deluge: #0000e6; /* Deluge */
  --color-sunray: #f56f0d; /* Sun Ray */
  --color-void: #000000; /* Void (Black) */
  --color-bone: #ebede5; /* Bone (Neutral) */

  /* Gradients */
  --gradient-immersion: linear-gradient(45deg, var(--color-mist), var(--color-arctic));
  --gradient-evaporate: linear-gradient(45deg, var(--color-arctic), var(--color-mist));
  --gradient-flow: linear-gradient(90deg, var(--color-deluge), var(--color-arctic));
}
```

### Typography

- Primary: TOT-雫花ゴシック StdN (with Arial Bold fallback)
- Clean, readable fonts
- Consistent scale
- Proper hierarchy
- Responsive sizing

## Vital Ice Style Guide

This style guide outlines the principles, tools, and technical approaches for achieving a smooth, immersive, and visually stunning website experience that aligns with the Vital Ice brand.

---

### ✧ Animation & Motion Principles

#### 1. **Background Animations**

- Use video backgrounds or canvas-based fluid simulations to create a living atmosphere.
- Ideal background tools:

  - High-res `.mp4` or `.webm` loops (e.g. slow ripples or cold fog)
  - HTML5 Canvas with fluid dynamics (e.g. `WebGL-Fluid-Simulation`)
  - Three.js shaders for reactive depth and flow

#### 2. **Component Animations**

- Use [**Framer Motion**](https://www.framer.com/motion/) for declarative, smooth animations:

  - Hero title fade-ins
  - Section entrance animations
  - Layout transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  About Vital Ice
</motion.div>
```

#### 3. **Advanced Scroll Effects**

- Pair `Lenis` (smooth scroll) + `GSAP ScrollTrigger` for:

  - Parallax backgrounds
  - Horizon/fade curves
  - Scroll-synced text overlays

---

### ✧ Typography & Color

#### Typography

- **Primary**: `TOT-雫花ゴシック StdN`
- **Fallbacks**: `Arial Bold`, `Inter`, or similar clean sans-serifs
- Kerning: Adjust by ~25% for visual spacing consistency

#### Colors

- **Mist**: `#9EC7C5`
- **Arctic**: `#00B7B5`
- **Deluge**: `#0000E6`
- **Sun Ray**: `#F56F0D`
- **Void (Black)**: `#000000`
- **Bone (Neutral)**: `#EBEDE5`
- Use gradients like `Immersion`, `Evaporate`, and `Directional Flow` to express energy and transition

---

### ✧ Structural Patterns

#### Component Styling

- CSS Modules, colocated with components
- Naming: `Hero.module.css`, `About.module.css`, etc.
- Use BEM-style conventions inside modules

```css
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
}
.hero__headline {
  font-size: 3rem;
  color: var(--color-mist);
}
```

#### Responsive Design

- Prioritize fluid layouts for mobile → desktop
- Maintain readability and motion integrity across breakpoints
- Avoid abrupt jumps; all transitions should feel hydrated

---

### ✧ Technical Stack Summary (Styling + Motion)

| Purpose              | Library / Tool            |
| -------------------- | ------------------------- |
| Component animation  | Framer Motion             |
| Scroll animations    | GSAP + ScrollTrigger      |
| Smooth scroll engine | Lenis                     |
| 3D / shader visuals  | Three.js or ShaderPark    |
| Video backgrounds    | Native HTML5 <video> tags |
| Styling methodology  | CSS Modules (colocated)   |
| Layout transitions   | Framer Motion (layoutId)  |

---

This guide ensures all motion and styling is cohesive, clean, and emotionally resonant. Every visual decision should support the themes of clarity, energy, and recovery.

## Component Architecture

### Best Practices

1. **Component Organization**

   - Feature-based directory structure
   - Clear separation of concerns
   - Reusable components in shared directory
   - Page-specific components in page directories

2. **State Management**

   - Local state with React hooks
   - Context for global state
   - Form state with React Hook Form
   - Booking state management

3. **Animation Patterns**
   - Smooth page transitions
   - Micro-interactions
   - Loading states
   - Progressive reveals

### Example Component Structure

```typescript
// Component organization
components/
  ├── shared/           // Reusable components
  │   ├── Button/
  │   ├── Card/
  │   └── Layout/
  ├── features/         // Feature-specific components
  │   ├── Booking/
  │   ├── Contact/
  │   └── Testimonials/
  ├── layout/          // Layout components
  │   ├── Header/
  │   ├── Footer/
  │   └── Navigation/
  └── ui/              // UI primitives
      ├── Typography/
      ├── Icons/
      └── Forms/
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px) {
  /* sm - Small devices */
}
@media (min-width: 768px) {
  /* md - Tablets */
}
@media (min-width: 1024px) {
  /* lg - Laptops */
}
@media (min-width: 1280px) {
  /* xl - Desktops */
}
```

### Best Practices

1. **Mobile First**

   - Start with mobile layout
   - Progressive enhancement
   - Touch-friendly interactions
   - Appropriate text sizes

2. **Flexible Layouts**
   - Grid and Flexbox
   - Relative units
   - Fluid typography
   - Responsive images

## Performance Optimization

### Image Optimization

- Use Next.js Image component
- Proper image sizing
- Lazy loading
- WebP format
- Responsive srcset

### Code Optimization

- Code splitting
- Tree shaking
- Bundle analysis
- Performance monitoring

## Accessibility

### Guidelines

1. **Semantic HTML**

   - Proper heading hierarchy
   - ARIA labels
   - Keyboard navigation
   - Focus management

2. **Color Contrast**
   - WCAG 2.1 compliance
   - Sufficient contrast ratios
   - Color-blind considerations
   - Text readability

## Testing Strategy

### Types of Tests

1. **Unit Tests**

   - Component testing
   - Utility functions
   - State management
   - Event handlers

2. **Integration Tests**

   - Page flows
   - Form submissions
   - Booking integration
   - User interactions

3. **E2E Tests**
   - Critical user paths
   - Cross-browser testing
   - Performance testing
   - Accessibility testing

## Deployment & CI/CD

### Best Practices

1. **Version Control**

   - Semantic versioning
   - Feature branches
   - Pull request reviews
   - Automated checks

2. **Deployment**
   - Vercel deployment
   - Staging environment
   - Production checks
   - Rollback strategy

## Documentation

### Requirements

1. **Code Documentation**

   - JSDoc comments
   - Type definitions
   - Component props
   - Usage examples

2. **Project Documentation**
   - Setup instructions
   - Architecture decisions
   - Best practices
   - Contributing guidelines

## Security

### Best Practices

1. **Form Security**

   - Input validation
   - CSRF protection
   - Rate limiting
   - Secure headers

2. **Data Protection**
   - Input validation
   - XSS prevention
   - Secure headers
   - Privacy compliance

## Monitoring & Analytics

### Tools

1. **Performance**

   - Core Web Vitals
   - Error tracking
   - User behavior
   - Conversion metrics

2. **Analytics**
   - Plausible/GA integration
   - User engagement
   - Booking conversions
   - Content performance
