# Luxury VR Tour Component - Premium Real Estate Solution

## Overview

The **LuxuryVRTour** component is a high-end, production-ready 360° panoramic viewer built for the RE Platform. It delivers an immersive property viewing experience with luxury dark theme styling, interactive hotspots, gyroscope support, and AI-enhanced design toggles.

## Key Features

### 🎬 Core Capabilities
- **360° Equirectangular Panoramas**: High-quality spherical image rendering
- **Dynamic Hotspots**: Gold pulse markers with smooth animations
- **Multi-Scene Management**: Seamless transitions between rooms
- **Design Toggle**: Switch between "Current State" and "Furnished/AI-Enhanced" versions
- **Gyroscope Support**: Mobile device orientation sensors for immersive look-around
- **Cross-Platform Controls**: Mouse, touch, and keyboard support

### 🎨 Luxury Design
- **Dark Luxury Theme**: Pure black background (#000000)
- **Gold Accents**: Premium gold color (#FFD700)
- **Minimalist UI**: Clean, elegant overlay controls
- **Smooth Animations**: Cross-fade and pulse effects
- **Professional Typography**: Clear, readable overlays

### 📱 Mobile Optimization
- **Responsive Canvas**: Adapts to all screen sizes
- **Touch Gestures**: Swipe-based camera control
- **Gyroscope Integration**: Native device orientation support
- **Full-screen Mode**: Immersive viewing experience

### ⚡ Performance
- **Canvas-based Rendering**: Optimized 2D projection
- **Efficient Hotspot Calculation**: Real-time marker positioning
- **Image Preloading**: Smooth scene transitions
- **Smooth Animation Loop**: 60fps target performance

## Architecture

### Component Structure

```
LuxuryVRTour (Main Component)
├── Canvas (360° Panorama Renderer)
├── Hotspot Markers (Interactive Elements)
├── UI Overlays
│   ├── Scene Info Panel (Top-Left)
│   ├── Design Variant Toggle (Top-Center)
│   ├── Control Panel (Bottom-Right)
│   ├── Navigation Bar (Bottom-Center)
│   ├── Purchase Button (Bottom-Left)
│   └── Help Text (Bottom-Center)
└── Event Handlers
    ├── Mouse Controls
    ├── Touch Gestures
    ├── Gyroscope Integration
    ├── Keyboard Support
    └── Hotspot Interactions
```

### Type System

```typescript
// Main configuration object
interface VRTourConfig {
  scenes: VRScene[];
  propertyId: string;
  propertyName: string;
  defaultSceneId: string;
  enableGyroscope?: boolean;
  enableAutoRotate?: boolean;
  autoRotateSpeed?: number;
}

// Individual scene/room
interface VRScene {
  id: string;
  title: string;
  imageUrl: string;
  furnishedImageUrl?: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  hotspots: Hotspot[];
  description?: string;
}

// Interactive marker
interface Hotspot {
  id: string;
  pitch: number;      // Vertical angle in degrees
  yaw: number;        // Horizontal angle in degrees
  targetRoom: string; // Scene ID to navigate to
  title: string;      // Display text
  icon?: string;      // Optional emoji
}
```

## Usage

### Basic Implementation

```tsx
import { LuxuryVRTour } from '@/components/luxury-vr-tour';
import { EXAMPLE_LUXURY_PROPERTY } from '@/lib/luxury-vr-config';

export default function PropertyPage() {
  const [showVR, setShowVR] = useState(false);

  if (showVR) {
    return (
      <LuxuryVRTour
        config={EXAMPLE_LUXURY_PROPERTY}
        onClose={() => setShowVR(false)}
        onBuyClick={() => handlePurchase()}
        price={250000}
        currency="π"
      />
    );
  }

  return (
    <button onClick={() => setShowVR(true)}>
      Launch VR Tour
    </button>
  );
}
```

### Custom Configuration

```tsx
import { createVRTourConfig } from '@/lib/luxury-vr-config';

const config = createVRTourConfig('prop-123', 'Beachfront Villa', [
  {
    title: 'Living Room',
    description: 'Spacious oceanview living area',
    imageUrl: '/tours/villa-living-room.jpg',
    furnishedImageUrl: '/tours/villa-living-room-furnished.jpg',
    hotspots: [
      {
        id: 'hs1',
        pitch: 0,
        yaw: 90,
        targetRoom: 'bedroom',
        title: 'Master Bedroom',
        icon: '🛏️',
      },
    ],
  },
  // ... more scenes
]);

<LuxuryVRTour config={config} onClose={() => {}} />;
```

## Controls & Interactions

### Mouse/Desktop
- **Drag**: Rotate view (look around)
- **Scroll**: Zoom in/out
- **Click Hotspot**: Navigate to room
- **Fullscreen Button**: Enter immersive mode

### Touch/Mobile
- **Swipe**: Rotate view
- **Pinch**: Zoom (if supported)
- **Tap Hotspot**: Navigate to room
- **Device Tilt**: Gyroscope control (if enabled)

### Hotspot Coordinates

Hotspots use spherical coordinates (pitch/yaw in degrees):

```
Yaw (Horizontal):     Pitch (Vertical):
0°    = Center       0°    = Center (horizon)
90°   = Right       90°   = Up
180°  = Back        -90°  = Down
270°  = Left
```

Example hotspot in different directions:

```javascript
const hotspots = [
  { yaw: 0, pitch: 0, title: 'Front' },      // Center
  { yaw: 90, pitch: 0, title: 'Right' },     // Right side
  { yaw: 0, pitch: -30, title: 'Door' },     // Lower area
  { yaw: 180, pitch: 45, title: 'Ceiling' }, // Upper back
];
```

## Styling & Theming

### Color Palette

```css
--gold: #FFD700;          /* Primary accent */
--dark-bg: #000000;       /* Background */
--semi-transparent: rgba(0, 0, 0, 0.6);
--gold-light: #FFF8DC;    /* Highlights */
```

### Customizable Elements

All UI elements use Tailwind classes and can be customized:

- Button colors: `bg-gold`, `text-gold`
- Transparency: `bg-black/60`, `border-gold/30`
- Spacing: Standard Tailwind scale
- Typography: Size and weight variants

## Gyroscope Integration

### Device Orientation API

The component automatically:
1. Detects device gyroscope capability
2. Requests user permission (iOS 13+)
3. Maps device tilt to camera rotation
4. Updates view continuously

### Mobile Permission Flow

```javascript
// iOS 13+: Requires explicit permission
const permission = await DeviceOrientationEvent.requestPermission();
if (permission === 'granted') {
  window.addEventListener('deviceorientation', handleOrientation);
}

// Android: Automatic (with FEATURE_SENSOR permission in manifest)
window.addEventListener('deviceorientation', handleOrientation);
```

## Design Toggle Implementation

The component supports two design variants via `designVariant` state:

```typescript
// Component switches between images based on selection
const imageUrl =
  designVariant === 'furnished' && scene.furnishedImageUrl
    ? scene.furnishedImageUrl
    : scene.imageUrl;
```

This enables:
- **Current State**: Original property photos
- **Furnished Design**: AI-enhanced staging or before/after comparisons

## Performance Optimization

### Image Preloading

```tsx
import { preloadTourConfig } from '@/lib/luxury-vr-config';

useEffect(() => {
  preloadTourConfig(config).then(() => {
    setImagesReady(true);
  });
}, [config]);
```

### Canvas Rendering

- Uses 2D context for efficient panorama projection
- Updates only when camera orientation changes
- Throttles hotspot calculations
- Implements smooth animation loop

### Memory Management

- Cleanup event listeners on unmount
- Reuses canvas context
- Stops animation loops when component unmounts

## Accessibility

- **Keyboard Navigation**: Arrow keys for rotation (extensible)
- **ARIA Labels**: All buttons have descriptive labels
- **Focus Management**: Proper focus handling for controls
- **Screen Reader**: Scene information announced
- **Touch Targets**: 44px minimum touch area

## Browser Support

- Chrome/Edge 80+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

### Requirements

- Canvas 2D support
- CSS backdrop-filter (graceful degradation)
- Optional: Gyroscope API (iOS 13+, modern Android)

## Advanced Usage

### Custom Hotspot Styling

```tsx
// Inside component, customize hotspot rendering:
const renderHotspots = (ctx: CanvasRenderingContext2D) => {
  hotspots.forEach((hotspot) => {
    // Custom gradient, size, animation
    const gradient = ctx.createRadialGradient(...);
    // Custom rendering logic
  });
};
```

### Event Hooks

```tsx
// Add custom handlers for interactions
const handleSceneChange = (sceneId: string) => {
  console.log('User navigated to:', sceneId);
  // Track analytics, update URL, etc.
};

const handleDesignToggle = (variant: 'current' | 'furnished') => {
  console.log('User switched to:', variant);
};
```

### Dynamic Scene Updates

```tsx
// Update scenes at runtime
setConfig((prev) => ({
  ...prev,
  scenes: [...prev.scenes, newScene],
}));
```

## Troubleshooting

### Hotspots Not Appearing

- Verify `showHotspots` is `true`
- Check coordinates are within valid ranges (-90 to 90 pitch, 0 to 360 yaw)
- Ensure scene hotspots array is populated

### Gyroscope Not Working

- Verify device has accelerometer/gyroscope
- Check permission is granted (iOS)
- Ensure page is served over HTTPS
- Verify `enableGyroscope` is `true` in config

### Image Quality Issues

- Use equirectangular format (2:1 aspect ratio)
- Minimum resolution 2048x1024 recommended
- Verify CORS headers allow image loading
- Check image URLs are accessible

### Performance Issues

- Reduce number of hotspots per scene
- Preload images before showing tour
- Disable auto-rotate if not needed
- Check browser console for errors

## API Reference

### LuxuryVRTour Props

```typescript
interface LuxuryVRTourProps {
  config: VRTourConfig;              // Tour configuration
  onClose: () => void;                // Close handler
  onBuyClick?: () => void;            // Purchase handler
  price?: number;                     // Property price
  currency?: string;                  // Currency symbol (default: 'π')
}
```

### Configuration Helpers

```typescript
// Create config from properties
createVRTourConfig(propertyId, propertyName, scenes);

// Convert equirectangular coords to spherical
equirectangularToSpherical(yaw, pitch);

// Project 3D point to screen coordinates
sphericalToScreen(phi, theta, cameraX, cameraY, width, height);

// Preload images for smooth transitions
preloadImage(url);
preloadTourConfig(config);
```

## Related Components

- **VRPropertyTour**: Pannellum-based alternative (legacy support)
- **PanoramicViewer**: Generic panorama viewer
- **UltraPanoramicViewer**: Premium 4K panorama viewer

## Support & Documentation

- Configuration: See `luxury-vr-config.ts`
- Type Definitions: See `vr-tour-types.ts`
- Example Implementation: See `vr-tour-demo-premium.tsx`

## License & Attribution

Built for RE Platform (GlobalBusiness) - Premium real estate marketplace on Pi Network

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready
