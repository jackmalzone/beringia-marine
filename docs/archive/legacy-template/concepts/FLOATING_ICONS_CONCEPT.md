# Floating Icons Concept - Vital Ice

## Overview

This document preserves the floating icons concept that was originally implemented in the Mission Statement section. The concept features ambient, animated icons that float on the sides of content sections to add visual interest and thematic elements.

## Implementation

### Icon Set

The concept uses a curated set of icons representing elemental and wellness themes:

```typescript
const symbols = [
  { icon: GiFire, label: 'Fire' },
  { icon: GiSun, label: 'Sun' },
  { icon: FaWater, label: 'Water' },
  { icon: TbPlant2, label: 'Growth' },
  { icon: GiCaduceus, label: 'Healing' },
  { icon: TbSnowflake, label: 'Ice' },
  { icon: RxLightningBolt, label: 'Energy' },
  { icon: GiDiamonds, label: 'Strength' },
];
```

### Required Imports

```typescript
import { GiFire, GiCaduceus, GiDiamonds, GiSun } from 'react-icons/gi';
import { TbPlant2, TbSnowflake } from 'react-icons/tb';
import { RxLightningBolt } from 'react-icons/rx';
import { FaWater } from 'react-icons/fa';
```

### JSX Implementation

```tsx
{
  /* Floating ambient symbols */
}
<div className={styles.symbols}>
  {symbols.map((symbol, i) => {
    const IconComponent = symbol.icon;
    return (
      <motion.div
        key={i}
        className={styles.symbol}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.8,
        }}
        style={{
          left: i % 2 === 0 ? '8%' : '88%',
          top: `${15 + Math.floor(i / 2) * 25}%`,
        }}
      >
        <IconComponent />
      </motion.div>
    );
  })}
</div>;
```

## CSS Styling

### Base Styles

```css
.symbols {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.symbol {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.1);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.symbol:hover {
  opacity: 0.6;
  transform: scale(1.1);
}
```

### Responsive Adjustments

```css
@media (max-width: 768px) {
  .symbol {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .symbol {
    font-size: 1rem;
  }
}
```

## Animation Details

### Breathing Effect

- **Opacity**: Cycles between 0.3 and 0.7
- **Vertical Movement**: Subtle 5px up and down motion
- **Duration**: 4-8 seconds per cycle (staggered)
- **Delay**: 0.8s between each icon
- **Easing**: `easeInOut` for smooth transitions

### Positioning Strategy

- **Left Side**: Even-indexed icons (0, 2, 4, 6)
- **Right Side**: Odd-indexed icons (1, 3, 5, 7)
- **Vertical Distribution**: 25% spacing between rows
- **Starting Position**: 15% from top

## Potential Use Cases

### 1. Service Pages

Add floating icons to individual service pages that match the service theme:

- **Cold Plunge**: Snowflake, Water, Ice crystals
- **Sauna**: Fire, Sun, Heat waves
- **Compression Boots**: Lightning bolt, Energy, Strength

### 2. About Page

Use icons to represent the founders' values and mission:

- **Community**: People icons, Connection symbols
- **Wellness**: Healing, Growth, Balance
- **Recovery**: Energy, Strength, Renewal

### 3. Historical Timeline

Add period-appropriate icons to different historical sections:

- **Ancient**: Fire, Water, Earth elements
- **Traditional**: Healing symbols, Cultural icons
- **Modern**: Technology, Innovation symbols

### 4. Newsletter Section

Subtle floating elements to enhance the underwater theme:

- **Water**: Bubbles, Waves, Sea creatures
- **Ambient**: Light rays, Particles, Flow

## Customization Options

### Icon Themes

#### Elemental Theme

```typescript
const elementalSymbols = [
  { icon: GiFire, label: 'Fire' },
  { icon: FaWater, label: 'Water' },
  { icon: TbPlant2, label: 'Earth' },
  { icon: GiSun, label: 'Air' },
];
```

#### Wellness Theme

```typescript
const wellnessSymbols = [
  { icon: GiCaduceus, label: 'Healing' },
  { icon: TbSnowflake, label: 'Recovery' },
  { icon: RxLightningBolt, label: 'Energy' },
  { icon: GiDiamonds, label: 'Strength' },
];
```

#### Community Theme

```typescript
const communitySymbols = [
  { icon: GiPeople, label: 'Connection' },
  { icon: GiHeart, label: 'Care' },
  { icon: GiHandshake, label: 'Support' },
  { icon: GiStar, label: 'Excellence' },
];
```

### Animation Variations

#### Gentle Float

```typescript
animate={{
  opacity: [0.2, 0.5, 0.2],
  y: [0, -3, 0],
}}
transition={{
  duration: 6,
  repeat: Infinity,
  ease: 'easeInOut',
}}
```

#### Pulsing Glow

```typescript
animate={{
  opacity: [0.1, 0.8, 0.1],
  scale: [1, 1.2, 1],
}}
transition={{
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut',
}}
```

#### Rotating Orbit

```typescript
animate={{
  rotate: [0, 360],
  opacity: [0.3, 0.7, 0.3],
}}
transition={{
  duration: 20,
  repeat: Infinity,
  ease: 'linear',
}}
```

## Performance Considerations

### Optimization Tips

1. **Limit Icon Count**: Use 4-8 icons maximum per section
2. **Reduce Animation Complexity**: Simple opacity/position changes
3. **Use CSS Transforms**: Hardware-accelerated animations
4. **Conditional Rendering**: Only show on larger screens
5. **Lazy Loading**: Load icons when section comes into view

### Mobile Considerations

```typescript
const shouldShowIcons = !isMobile && window.innerWidth > 768;
```

## Integration Examples

### Service Page Integration

```tsx
const ColdPlungePage = () => {
  const coldIcons = [
    { icon: TbSnowflake, label: 'Ice' },
    { icon: FaWater, label: 'Water' },
    { icon: GiCaduceus, label: 'Recovery' },
    { icon: RxLightningBolt, label: 'Energy' },
  ];

  return (
    <section className={styles.servicePage}>
      <FloatingIcons icons={coldIcons} />
      {/* Service content */}
    </section>
  );
};
```

### Reusable Component

```tsx
interface FloatingIconsProps {
  icons: Array<{ icon: IconType; label: string }>;
  className?: string;
  animationType?: 'float' | 'pulse' | 'orbit';
}

const FloatingIcons: FC<FloatingIconsProps> = ({ icons, className, animationType = 'float' }) => {
  // Implementation
};
```

## Conclusion

This floating icons concept adds subtle visual interest and thematic depth to content sections. The implementation is flexible and can be adapted for different contexts while maintaining the Vital Ice brand aesthetic of calm, ambient energy.

**Last Updated**: December 2024  
**Status**: Archived for future use
