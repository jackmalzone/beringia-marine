# Spring-Based Animation System

## Overview

The Vital Ice website uses a physics-based animation system built with Framer Motion and spring physics. This creates natural, organic animations that feel responsive and engaging, perfect for a wellness brand focused on recovery and transformation.

## Spring Configurations

### Available Spring Types

```typescript
import { springConfigs } from '@/lib/utils/animations';

// Gentle, organic spring for subtle animations
springConfigs.gentle = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

// Responsive spring for interactive elements
springConfigs.responsive = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

// Bouncy spring for playful animations
springConfigs.bouncy = {
  type: 'spring',
  stiffness: 400,
  damping: 15,
  mass: 0.8,
};

// Smooth spring for page transitions
springConfigs.smooth = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
  mass: 1,
};

// Quick spring for micro-interactions
springConfigs.quick = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.3,
};

// Heavy spring for dramatic effects
springConfigs.heavy = {
  type: 'spring',
  stiffness: 80,
  damping: 18,
  mass: 1.2,
};
```

### Spring Physics Explained

- **Stiffness**: How "tight" the spring is (higher = faster, more rigid)
- **Damping**: How much the spring bounces (higher = less bounce)
- **Mass**: How "heavy" the element feels (higher = slower, more momentum)

## Pre-built Animation Variants

### Text Animations

```typescript
import { textRevealVariants, staggerTextVariants } from '@/lib/utils/animations';

// Simple text reveal
<motion.h1 variants={textRevealVariants}>
  Your Text Here
</motion.h1>

// Staggered text for paragraphs
<motion.div variants={staggerTextVariants}>
  <motion.p variants={textRevealVariants}>First paragraph</motion.p>
  <motion.p variants={textRevealVariants}>Second paragraph</motion.p>
</motion.div>
```

### Slide Animations

```typescript
import { slideVariants } from '@/lib/utils/animations';

// Slide from different directions
<motion.div variants={slideVariants.slideLeft}>From left</motion.div>
<motion.div variants={slideVariants.slideRight}>From right</motion.div>
<motion.div variants={slideVariants.slideUp}>From bottom</motion.div>
<motion.div variants={slideVariants.slideDown}>From top</motion.div>
```

### Scale Animations

```typescript
import { scaleVariants } from '@/lib/utils/animations';

// Scale with hover and tap states
<motion.div
  variants={scaleVariants}
  whileHover="hover"
  whileTap="tap"
>
  Interactive Element
</motion.div>
```

### Card Animations

```typescript
import { cardVariants } from '@/lib/utils/animations';

// Card with hover effects
<motion.div
  variants={cardVariants}
  whileHover="hover"
  whileTap="tap"
>
  Card Content
</motion.div>
```

### Button Animations

```typescript
import { buttonVariants } from '@/lib/utils/animations';

// Interactive button
<motion.button
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  Click Me
</motion.button>
```

## AnimatedSection Component

The `AnimatedSection` component provides a convenient wrapper for spring-based animations:

```typescript
import AnimatedSection from '@/components/ui/AnimatedSection';

// Basic usage
<AnimatedSection animation="fadeIn">
  <h2>Your Content</h2>
</AnimatedSection>

// With custom spring configuration
<AnimatedSection
  animation="slideUp"
  springConfig="bouncy"
  delay={0.2}
>
  <p>Bouncy animation</p>
</AnimatedSection>

// Available animations
<AnimatedSection animation="fadeIn">Fade in</AnimatedSection>
<AnimatedSection animation="slideLeft">Slide from left</AnimatedSection>
<AnimatedSection animation="slideRight">Slide from right</AnimatedSection>
<AnimatedSection animation="slideUp">Slide from bottom</AnimatedSection>
<AnimatedSection animation="slideDown">Slide from top</AnimatedSection>
<AnimatedSection animation="scale">Scale with hover</AnimatedSection>
<AnimatedSection animation="parallax">Parallax effect</AnimatedSection>
```

## Button Component

The spring-based Button component includes multiple variants and physics animations:

```typescript
import Button from '@/components/shared/Button/Button';

// Primary button with default spring
<Button variant="primary" onClick={handleClick}>
  Primary Action
</Button>

// Secondary button with custom spring
<Button
  variant="secondary"
  springConfig="bouncy"
  size="lg"
>
  Secondary Action
</Button>

// Outline button
<Button variant="outline" size="sm">
  Outline Button
</Button>

// Ghost button
<Button variant="ghost">
  Ghost Button
</Button>

// Full width button
<Button variant="primary" fullWidth>
  Full Width
</Button>
```

## Card Component

The Card component supports multiple variants with spring physics:

```typescript
import Card from '@/components/shared/Card/Card';

// Default card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Elevated card with custom spring
<Card
  variant="elevated"
  springConfig="heavy"
  delay={0.3}
>
  Elevated content
</Card>

// Glass card
<Card variant="glass">
  Glass effect content
</Card>

// Gradient card
<Card variant="gradient">
  Gradient background
</Card>

// Interactive card
<Card
  variant="elevated"
  interactive
  onClick={handleCardClick}
>
  Clickable card
</Card>
```

## Custom Spring Animations

Create custom spring animations for specific use cases:

```typescript
import { createSpringAnimation } from '@/lib/utils/animations';

// Custom spring configuration
const customSpring = createSpringAnimation(200, 15, 0.8);

// Use in motion component
<motion.div
  animate={{ scale: 1 }}
  transition={customSpring}
>
  Custom spring animation
</motion.div>
```

## Staggered Animations

Create staggered animations for lists or groups of elements:

```typescript
import { createStaggerAnimation } from '@/lib/utils/animations';

// Custom staggered animation
const staggeredAnimation = createStaggerAnimation(0.1, textRevealVariants);

<motion.div variants={staggeredAnimation}>
  {items.map((item, index) => (
    <motion.div key={index} variants={textRevealVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## Performance Best Practices

### 1. Use `will-change` CSS Property

```css
.animated-element {
  will-change: transform, opacity;
}
```

### 2. Optimize Spring Configurations

- Use `gentle` for subtle animations
- Use `quick` for micro-interactions
- Use `heavy` sparingly for dramatic effects

### 3. Limit Concurrent Animations

```typescript
// Good: Stagger animations
<motion.div variants={staggerContainer}>
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
</motion.div>

// Avoid: Too many simultaneous animations
<motion.div animate={{ scale: 1.1, rotate: 360, y: -10 }}>
  Complex animation
</motion.div>
```

### 4. Use `viewport` for Performance

```typescript
<motion.div
  variants={fadeInVariants}
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
>
  Only animate when in view
</motion.div>
```

## Accessibility Considerations

### 1. Respect Reduced Motion

```typescript
import { useReducedMotion } from 'framer-motion';

const Component = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { scale: 1.1 }}
      transition={shouldReduceMotion ? {} : springConfigs.gentle}
    >
      Content
    </motion.div>
  );
};
```

### 2. Provide Alternative Content

```typescript
<motion.div
  variants={fadeInVariants}
  aria-label="Animated content loading"
>
  Content
</motion.div>
```

## Common Patterns

### 1. Hero Section Animation

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }}
>
  <motion.h1 variants={textRevealVariants}>Title</motion.h1>
  <motion.p variants={textRevealVariants}>Subtitle</motion.p>
  <motion.button variants={buttonVariants}>CTA</motion.button>
</motion.div>
```

### 2. Card Grid Animation

```typescript
<motion.div
  variants={staggerFadeInVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {cards.map((card, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
    >
      {card.content}
    </motion.div>
  ))}
</motion.div>
```

### 3. Page Transition

```typescript
import { pageTransitionVariants } from '@/lib/utils/animations';

<motion.div
  variants={pageTransitionVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Page content
</motion.div>
```

## Troubleshooting

### Animation Not Working

1. Check if Framer Motion is properly imported
2. Verify spring configuration syntax
3. Ensure variants are properly defined
4. Check for CSS conflicts

### Performance Issues

1. Reduce spring stiffness for smoother animations
2. Use `will-change` CSS property
3. Limit concurrent animations
4. Use `viewport` to trigger animations only when needed

### Spring Physics Tuning

- **Too bouncy**: Increase damping
- **Too slow**: Increase stiffness, decrease mass
- **Too fast**: Decrease stiffness, increase mass
- **No bounce**: Decrease damping

## Examples in Vital Ice

### Hero Section

- Logo: `gentle` spring with 0.8s duration
- Headline: `responsive` spring with 0.8s duration
- Subtitle: `gentle` spring with 0.8s duration
- Button: `responsive` spring with hover/tap states

### Benefits Cards

- Cards: `responsive` spring with hover effects
- Content: `gentle` spring with staggered reveal

### Newsletter Section

- Container: `smooth` spring for page transitions
- Form elements: `quick` spring for micro-interactions

This spring-based animation system creates a cohesive, organic feel throughout the Vital Ice website, enhancing the user experience while maintaining performance and accessibility.
