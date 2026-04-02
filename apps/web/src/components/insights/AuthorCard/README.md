# AuthorCard Component

A flexible component for displaying author information in the Insights blog system. Supports both simple string author names and rich Author objects with full details.

## Features

- **Dual Mode Support**: Handles both string author names and full Author objects
- **Rich Author Details**: Displays avatar, name, role, bio, and social links
- **Glassmorphism Design**: Modern, elevated card design with backdrop blur
- **Social Integration**: Twitter, LinkedIn, and website links with icons
- **Responsive**: Adapts to mobile and desktop layouts
- **Accessible**: ARIA labels, keyboard navigation, and screen reader support
- **Error Handling**: Graceful fallback for failed avatar images

## Usage

### Simple String Author

```tsx
import AuthorCard from '@/components/insights/AuthorCard/AuthorCard';

<AuthorCard author="John Doe" />;
```

### Full Author Object

```tsx
import AuthorCard from '@/components/insights/AuthorCard/AuthorCard';

const author = {
  name: 'Dr. Sarah Chen',
  role: 'Sports Medicine Specialist',
  bio: 'Dr. Chen specializes in recovery science and has published over 30 peer-reviewed papers.',
  avatar: 'https://example.com/avatar.jpg',
  social: {
    twitter: 'https://twitter.com/drsarahchen',
    linkedin: 'https://linkedin.com/in/sarahchen-md',
    website: 'https://sarahchenmd.com',
  },
};

<AuthorCard author={author} />;
```

### With Custom Styling

```tsx
<AuthorCard author={author} className={styles.customAuthorCard} />
```

## Props

| Prop        | Type               | Required | Description                                 |
| ----------- | ------------------ | -------- | ------------------------------------------- |
| `author`    | `string \| Author` | Yes      | Author name as string or full Author object |
| `className` | `string`           | No       | Additional CSS class for custom styling     |

## Author Interface

```typescript
interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  role?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}
```

## Visual Design

### Simple Mode (String Author)

- Minimal card with just the author name
- Subtle background and border
- Compact padding

### Full Mode (Author Object)

- Avatar with circular border and glow effect
- Name in heading font (Bebas Neue)
- Role in brand color (#00b7b5)
- Bio text with proper line height
- Social links as circular icon buttons
- Hover effects on all interactive elements

## Accessibility

- **ARIA Labels**: All social links have descriptive labels
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: Proper semantic HTML and ARIA attributes
- **High Contrast**: Enhanced borders in high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Integration

The AuthorCard is integrated into the ArticleHero component:

```tsx
import AuthorCard from '@/components/insights/AuthorCard/AuthorCard';

<AuthorCard author={article.author} className={styles.hero__authorCard} />;
```

## Styling

The component uses CSS modules with the following key classes:

- `.authorCard`: Main container with glassmorphism effect
- `.authorCard--simple`: Simplified version for string authors
- `.authorCard__avatar`: Avatar image styling
- `.authorCard__avatarPlaceholder`: Fallback when avatar fails to load
- `.authorCard__name`: Author name styling
- `.authorCard__role`: Role/title styling
- `.authorCard__bio`: Biography text styling
- `.authorCard__social`: Social links container
- `.authorCard__socialLink`: Individual social link button

## Error Handling

- Avatar loading errors are handled gracefully with a placeholder icon
- Missing optional fields (bio, role, social) are simply not rendered
- Component works with both string and object author types

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Fallback background for browsers without backdrop-filter

## Performance

- Uses Next.js Image component for optimized avatar loading
- Lazy loading for avatar images
- Minimal re-renders with proper React patterns
- GPU-accelerated animations with CSS transforms
