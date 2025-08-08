# How to Add a New Project

## Quick Guide

### 1. Prepare Project Assets

**Image Requirements:**
- Size: 1200x800px (3:2 aspect ratio)
- Format: JPG/PNG, optimized for web (<500KB)
- Content: High-quality project screenshot or mockup
- Save to: `src/assets/projects/`

### 2. Update Project Data

Edit `src/components/PortfolioSection.tsx`:

```typescript
const projects = [
  // Add new project object:
  {
    title: 'Your Project Name',
    category: 'AR', // 'AR', 'VR', or 'Gaming'
    description: 'Brief description of the project (2-3 lines max)',
    image: yourProjectImage, // Import at top of file
    tech: ['Unity', 'ARCore', 'React Native'], // 3-5 tech items
    status: 'Live' // 'Live', 'In Development', or 'Coming Soon'
  },
  // ... existing projects
]
```

### 3. Import Your Image

At the top of `PortfolioSection.tsx`:

```typescript
import yourProjectImage from '@/assets/projects/your-project.jpg'
```

### 4. Copy Fields Reference

**Required Fields:**
- `title`: Project name (keep under 30 characters)
- `category`: Must be exactly 'AR', 'VR', or 'Gaming'
- `description`: 1-2 sentences describing the project
- `image`: Imported image asset
- `tech`: Array of 3-5 technology keywords
- `status`: Project status badge text

**Category Guidelines:**
- **AR**: Augmented reality apps, mobile AR, web AR
- **VR**: Virtual reality experiences, training simulations
- **Gaming**: Games, interactive entertainment, game engines

### 5. Tech Stack Examples

**AR Projects:** ARCore, ARKit, WebXR, Unity, React Native, Computer Vision

**VR Projects:** Oculus SDK, Unity, Unreal Engine, SteamVR, WebXR, C#

**Gaming:** Unity, Unreal Engine, Multiplayer, Physics, AI, Mobile

### 6. Optional: Add Parallax Layer

For enhanced visual depth, you can add decorative background elements in the section:

```typescript
{/* Background decorations */}
<div className="absolute top-40 right-20 w-40 h-40 bg-gradient-glow rounded-full opacity-5 animate-floating" />
```

## Best Practices

### Image Optimization
- Use tools like TinyPNG or ImageOptim before adding images
- Consider WebP format for better compression
- Always provide meaningful alt text for accessibility

### Content Guidelines
- Keep descriptions concise and impact-focused
- Use active voice: "Built AR navigation system" vs "AR navigation system was built"
- Highlight unique technical achievements or user impact

### Performance Considerations
- Limit to 6-8 projects max for optimal loading
- Consider lazy loading for images below the fold
- Test on mobile devices for responsive behavior

## File Structure
```
src/
  assets/
    projects/          ← Add new project images here
      project-1.jpg
      project-2.jpg
  components/
    PortfolioSection.tsx  ← Update project data here
```

That's it! The new project will automatically appear in the portfolio grid with hover effects, proper contrast, and responsive behavior.
