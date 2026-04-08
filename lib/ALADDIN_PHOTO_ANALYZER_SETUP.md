# Aladdin Smart Property Photo Analyzer - Setup Guide

## Environment Variables Required

To enable the smart property photo analyzer in Aladdin, add the following environment variable to your `.env.local` file:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### How to Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select your project or create a new one
4. Copy the API key
5. Add it to your `.env.local` file

### Features Enabled

- ✅ **Photo Upload in Aladdin Chat** - Camera icon in input area
- ✅ **Room Type Detection** - Automatically identifies bedroom, living room, kitchen, etc.
- ✅ **Condition Assessment** - Rates property condition (Excellent/Good/Fair/Needs Repair)
- ✅ **Amenities Recognition** - Detects visible amenities (AC, appliances, finishes, etc.)
- ✅ **Feature Extraction** - Identifies key features (lighting, space, design quality)
- ✅ **Price Estimation** - Suggests USD and Pi price ranges based on condition
- ✅ **Investment Grading** - Rates as A+/A/B/C investment grade
- ✅ **Smart Recommendations** - Provides investment insights
- ✅ **Market Insight** - Gives localized market context

## How It Works

1. **User uploads property photo** in Aladdin chat
2. **System detects selected city** (Dubai, Cairo, New York, etc.)
3. **Gemini Vision API analyzes image** for room type, condition, amenities
4. **Results displayed in stylish card** with gold theme matching app design
5. **Users can proceed to Buy/Rent/Invest** with AI-powered insights

## Component Integration

### In Aladdin Chat
- New camera icon button in input toolbar
- City selector dropdown
- Photo analysis results display
- Direct integration with investment flows

### Buy/Rent/Invest Pages
- Results can be shared to property listings
- Price suggestions update recommendations
- Investment grade influences visibility

## Bilingual Support

All features support both English and Arabic:
- Analysis card displays in user's language
- Recommendations are culturally relevant
- Market insights specific to selected city

## Mobile Optimization

- Photo upload works on mobile devices
- Touch-friendly camera button
- Responsive analysis card layout
- City selector works smoothly on all screens

---

**Note:** The Gemini Vision API has usage limits. Check [Google's pricing page](https://ai.google.dev/pricing) for current quota details.
