# Aladdin AI - Device Integration Guide
Complete device media integration for Aladdin voice advisor

## Features Integrated

### 1. Camera Access (iOS, Android, Desktop)
- Real-time camera capture from device
- Rear camera preference on mobile
- High-quality photo capture (1280x720+)
- Automatic device type detection

### 2. Gallery Selection
- Select existing photos from device
- File validation (image type, size)
- Image dimension detection
- 10MB size limit with user feedback

### 3. Microphone Integration (Voice)
- Echo cancellation
- Noise suppression
- Auto gain control
- Bilingual recognition (Arabic/English)

### 4. Image Upload
- Secure server upload with token generation
- 15MB file size limit
- Unique filename generation
- Metadata preservation

### 5. AI Image Analysis
- Property type detection
- Condition assessment
- Feature extraction
- Investment potential rating
- Market fit analysis
- Pi Network valuation
- Immediate recommendations

## File Structure

```
/lib
  ├── device-media-service.ts       # Core media handling
  ├── voice-service.ts              # Voice recognition/synthesis
  └── aladdin-system-config.ts      # System instructions

/components
  ├── media-capture.tsx             # UI component
  ├── ai-advisor-voice-chat.tsx    # Integrated voice chat
  └── ai-advisor-chat.tsx          # Text fallback

/app/api
  ├── upload-media/route.ts         # Image upload
  ├── analyze-property-image/route.ts # AI analysis
  ├── claude-advisor/route.ts       # Chat API
  └── market-research/route.ts      # Market data
```

## Usage Example

```typescript
import { MediaCapture } from '@/components/media-capture';

function PropertyInspector() {
  const handleMediaCapture = (media: CapturedMedia) => {
    console.log('Captured:', media);
    // Send to Aladdin for analysis
  };

  const handleUpload = (result: { url: string; id: string; analysis?: any }) => {
    console.log('Analysis:', result.analysis);
    // Process property insights
  };

  return (
    <MediaCapture 
      language="en"
      onMediaCapture={handleMediaCapture}
      onMediaUpload={handleUpload}
    />
  );
}
```

## Device Permissions Required

### iOS
- Camera: NSCameraUsageDescription
- Microphone: NSMicrophoneUsageDescription
- Photos: NSPhotoLibraryUsageDescription

### Android
- android.permission.CAMERA
- android.permission.RECORD_AUDIO
- android.permission.READ_EXTERNAL_STORAGE

## Aladdin Voice Chat Integration

The voice advisor now supports:
1. **Voice Input** - Speak in Arabic or English
2. **Photo Capture** - Show property to Aladdin
3. **Gallery Upload** - Upload existing photos
4. **AI Analysis** - Get instant property insights
5. **Voice Output** - Listen to recommendations
6. **WhatsApp Integration** - Direct contact button

## Image Analysis Output

```json
{
  "propertyType": "luxury villa",
  "condition": "new",
  "features": ["private pool", "garden", "garage"],
  "location": "beachfront",
  "investmentPotential": "high",
  "priceRange": "$400k - $600k",
  "marketFit": "Dubai",
  "piInvestment": "Start from 50,000π",
  "recommendations": [
    "Excellent beach location",
    "High rental yield potential",
    "Consider tokenized ownership"
  ]
}
```

## Error Handling

All device access errors are user-friendly:
- Camera denied → "Enable camera in Settings"
- No microphone → "Connect microphone to device"
- Network error → "Check internet connection"
- File too large → "Image exceeds 10MB limit"

## Performance Optimizations

1. **Image Compression** - JPEG quality: 0.9 (90%)
2. **Lazy Loading** - Components load on demand
3. **Caching** - Device capabilities cached
4. **Streaming** - Large files streamed, not buffered
5. **Memory** - Proper blob cleanup

## Mobile Browser Support

✓ iOS Safari (iOS 14.5+)
✓ Android Chrome
✓ Android Firefox
✓ Samsung Internet
✓ Opera Mobile
✗ Android default browser (limited support)

## Accessibility Features

- Alt text for all images
- Keyboard navigation support
- Screen reader labels
- High contrast mode support
- Voice command fallbacks
- Error messages in user language

## Security Considerations

1. File validation on client and server
2. Unique filename generation (no path traversal)
3. Size limits enforced
4. MIME type checking
5. Uploaded files served with proper headers
6. No direct file execution

## Future Enhancements

- [ ] Video property tours
- [ ] 360 panoramic capture
- [ ] Real-time property comparison
- [ ] AR property visualization
- [ ] Multi-image batch upload
- [ ] Drone footage integration
