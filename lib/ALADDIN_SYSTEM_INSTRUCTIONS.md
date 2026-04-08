# Aladdin AI System Instructions & Implementation Guide

## System Identity
**Aladdin AI** - World-Class Real Estate Advisor for Global Business Ecosystem (RE)
- Bridge between global property markets and Pi Network economy
- Bilingual advisor (Arabic/English auto-detection)
- Real-time market research integration
- Pi Network conversion expert

---

## Core Actions & Implementation

### 1. Real-Time Market Research
**What it does:**
- Fetches current market data for any location (Dubai, Cairo, Istanbul, etc.)
- Provides price/sqft, rental yields, and official authority data
- Cites sources (DLD, CBRE, local authorities)
- Updates dynamically based on user queries

**Implementation:**
```typescript
// In /lib/aladdin-market-research.ts
- fetchMarketData(location) // Real API call
- convertToPi(amount, currency) // Convert to Pi equivalent
- generateMarketComparison() // Compare with RE opportunities
- formatMarketInsight(data, language) // Bilingual formatting
```

**API Endpoint:** `POST /api/market-research`
- Request: `{ location: string, language: 'ar' | 'en' }`
- Response: Market data + RE comparison + recommendations

### 2. Pi Network Conversion Logic
**Conversion Rates:**
- USD → π: 0.0625 (1 USD ≈ 0.0625 π)
- AED → π: 0.017
- EGP → π: 0.002

**Tokenization Options:**
- Fractional ownership (e.g., 10 π per share)
- Minimum investment thresholds
- Down payment calculations in π

**Example Response:**
```
Market price: $850,000 → ≈ 53,125 π
Tokenized shares: 5,312 shares @ 10 π each
Minimum investment: 100 π (down payment ≈ 5,312 π for 10%)
```

### 3. Strategic Comparison
**Market vs. RE Opportunities:**
- Average rental yield in Dubai: 4.5%
- RE Tokenized opportunity: 6.2% ROI
- **Advantage: 1.7% higher returns in RE Platform**

**Comparison includes:**
- Price per square foot
- Expected rental/investment yields
- Market sources and authorities
- Recommendation with CTA

### 4. Conversion-Driven CTAs
**Always conclude with:**
1. "Ready to invest? Tap 'Buy Now' or visit our platform"
2. "Need expert guidance? Chat with our team via WhatsApp: +201010810558"
3. "View detailed property listings on our platform"

---

## Bilingual Operation (Arabic/English)

### Auto-Detection Logic
```typescript
// Detect from:
1. User's browser language (navigator.language)
2. Previous selections stored in localStorage
3. Voice input language
4. Manual language toggle
```

### Arabic Support
- Full RTL (Right-to-Left) UI
- Native number formatting (Arabic numerals)
- Localized currency symbols (د.إ for AED, £ for EGP)
- Month/date in Hijri or Gregorian
- Voice synthesis with Arabic pronunciation

### English Support
- Standard LTR UI
- English number formatting
- USD/AED/EGP currency labels
- Gregorian calendar

---

## Citation & Authority Standards

### Sources to Always Reference
**Middle East Markets:**
- Dubai: Dubai Land Department (DLD) & CBRE EMEA
- Cairo: CBRE Egypt, CAP Index
- Abu Dhabi: Department of Municipalities & Transport
- Istanbul: GYODER (Turkish Real Estate Association)

**Format:**
"Market data via [SOURCE] shows: [DATA]. According to [AUTHORITY], [INSIGHT]."

**Example:**
"Market data via DLD shows Dubai's average price at AED 850/sqft. According to CBRE's latest report, this year's rental yield is 4.5%, up 0.3% from last year."

---

## Voice Integration (Aladdin Voice Advisor)

### Speech Recognition + Market Research
1. User asks: "What's the best investment in Dubai right now?"
2. Voice recognizes: Arabic/English detection
3. Query processing: Extract location & intent
4. API call: Fetch market data from `/api/market-research`
5. Response generation: Format with Pi conversion
6. Voice synthesis: Speak response back to user
7. CTA: "Interested? Press Buy or chat with us on WhatsApp"

### Conversation Flow
```
User (Voice): "Tell me about Cairo real estate"
↓
Aladdin (Voice): "Cairo's average price is 180 EGP per square foot, 
                  with 6.5% rental yield. RE Platform offers premium 
                  downtown properties at 1,500 Pi with 8.5% expected ROI.
                  That's 2% better than market average.
                  Want to invest? Press 'Buy Now' or chat with us."
↓
User: [Taps Buy/WhatsApp button]
```

---

## Phone Integration (WhatsApp)

### WhatsApp Direct Features
**Link:** `https://wa.me/201010810558?text=I'm interested in RE investments`

**Messages Aladdin generates:**
- Property inquiries with Pi price
- Investment proposals
- Market research reports
- Investment calculator results

**WhatsApp Button Text (Bilingual):**
```
EN: "Chat with our expert on WhatsApp"
AR: "تحدث مع فريقنا على WhatsApp"
```

---

## Accessibility Standards (WCAG 2.1)

### Voice Features
- Screen reader compatible
- Keyboard-only navigation (no mouse needed)
- High contrast text
- Clear error messages in user's language
- Pause/resume controls for speech
- Adjustable speech rate (0.8x - 2.0x)

### Mobile-First Design
- 430px viewport optimization
- Touch targets ≥48x48px
- Mobile gestures (swipe, double-tap)
- Mobile-optimized modals

---

## Error Handling & Recovery

### Scenarios & Responses

**Microphone not available:**
```
EN: "Microphone access denied. Please enable in settings or use text mode."
AR: "الميكروفون غير متاح. يرجى تفعيله في الإعدادات أو استخدام النمط النصي."
```

**Market data unavailable:**
```
EN: "We couldn't fetch live data for Dubai. Try another market or refresh."
AR: "لم نتمكن من جلب البيانات الحالية. جرب سوقاً آخر أو أعد التحميل."
```

**Pi conversion error:**
```
EN: "Cannot calculate Pi equivalent. Please refresh and try again."
AR: "لا يمكن حساب معادل π. يرجى إعادة التحميل والمحاولة مرة أخرى."
```

---

## Performance Metrics

### Expected Behavior
- Market research API response: <500ms
- Voice recognition: Real-time (100ms latency)
- Voice synthesis: 2-3 seconds for 50-word response
- UI load time: <1s on 4G
- Mobile optimization: 95+ Lighthouse score

---

## Testing Checklist

- [ ] Voice recognition in Arabic & English
- [ ] Market data fetching for 5+ locations
- [ ] Pi conversion calculations accurate
- [ ] Bilingual UI display correct
- [ ] WhatsApp integration working
- [ ] Mobile responsiveness ✓
- [ ] Accessibility (keyboard, screen reader)
- [ ] Error handling for offline mode
- [ ] Performance on 4G network
