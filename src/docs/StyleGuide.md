# Style Guide - Futuristic Website

## Color Palette

| Usage | Color | CSS Variable | Hex Value | Notes |
|-------|-------|--------------|-----------|--------|
| Background | Pure Black | `--background` | #000000 | Main background |
| Text | Pure White | `--foreground` | #FFFFFF | Primary text |
| Brand Primary | Purple | `--brand-primary` | #A700F5 | Gradient start |
| Brand Secondary | Pink | `--brand-secondary` | #DF308D | Gradient end |
| Brand Glow | Light Purple | `--brand-glow` | Lighter #A700F5 | Glows/highlights |
| Accent (Optional) | Cyan | N/A | #10FFCB | Special accents |
| Muted | Gray | `--muted-foreground` | #808080 | Secondary text |

## Typography Scale (Orbitron)

| Element | Size/Line Height | CSS Class | Usage |
|---------|------------------|-----------|--------|
| H1 | 64px/72px | `.text-hero` | Hero headlines |
| H2 | 40px/48px | `.text-title` | Section titles |
| H3 | 28px/36px | N/A | Card titles |
| Body | 18px/28px | `.text-subtitle` | Body text |
| Caption | 14px/22px | N/A | Small text |

## Spacing System

- **Grid**: 8px base unit
- **Section padding**: 88-120vh min-height for cinematic feel
- **Card padding**: 24-32px (p-6 to p-8)
- **Button padding**: 12-24px vertical, 24-64px horizontal
- **Max content width**: ~1200px

## Motion Design

| Property | Value | Usage |
|----------|-------|--------|
| Default ease | `power2.inOut` | Standard transitions |
| Duration (standard) | 0.6-1.2s | Section reveals, card animations |
| Duration (micro) | 0.2-0.3s | Hover states, button feedback |
| Hover scale | Max 1.06 | Subtle enhancement only |

## Component Variants

### Buttons (.btn system)

```css
.btn            /* Base button with visible text */
.btn--primary   /* Gradient fill, white text */
.btn--ghost     /* Transparent, brand border/text */
```

### Cards
- `.card-3d` - 2.5D depth effect with hover transforms
- `.neon-glow` - Subtle glow border on hover
- Always show titles and content by default

### Background Effects
- `.particles` - Animated gradient particles
- `.gradient-mesh` - Layered gradient backgrounds
- `.floating` - Gentle float animation for decorative elements

## Accessibility Standards

- **Contrast**: WCAG AA (≥4.5:1) for all text
- **Focus**: Visible focus rings on all interactive elements
- **Motion**: `prefers-reduced-motion` support built-in
- **Keyboard**: Full keyboard navigation support

## Performance Guidelines

- Use `will-change: transform` for animated elements
- Limit to CSS transforms and filters (no heavy box-shadows)
- Compress all assets and lazy-load below-the-fold content
- Target 60fps on desktop, graceful degradation on mobile