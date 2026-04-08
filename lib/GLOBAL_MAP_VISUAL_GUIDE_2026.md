# 🗺️ Global Map Visual Guide

## Map Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Hide/Show] ▼        Global Market: 📈 BULLISH 📈     │  ← Toggle & Market Status
├─────────────────────────────────────────────────────────┤
│  [📍 46]  [🌍 27]  [💰 850K]  [📈 28]  [📉 12]  [⚡85%] │  ← Quick Stats
├─────────────────────────────────────────────────────────┤
│  Regional Performance:                                  │
│  [AS: 9·14% 📈] [EU: 15·7% ➡️] [AM: 8·9% 📈]          │  ← Region Cards
│  [AF: 4·13% 📈] [ME: 6·14% 📈]                        │
├─────────────────────────────────────────────────────────┤
│  🔍 Search properties...          [Filter] 🎛️         │  ← Search & Filter
│  [All] [Buy] [Rent] [Hotel] [Invest]                  │  ← Type Filter
│  [📍 Markers] [🔥 Heatmap] [👥 Clusters]             │  ← View Modes
├─────────────────────────────────────────────────────────┤
│  [🌍 Global Tour]  [⭐ Top ROI]  [AS][EU][AM][AF][ME] │  ← Navigation
│  [📍] [🔥] [👥] [👁️ Stats]                            │  ← Controls
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ◆ Property Markers (Color-Coded by Type)            │
│   ━━━━━ INTERACTIVE MAP ━━━━━                          │
│   • Click any marker for details                       │
│   • Pan with mouse/touch                               │
│   • Zoom with + - buttons                              │
│                                                         │
│   Legend:                                              │
│   🔵 Blue = Buy       🟣 Purple = Rent                 │
│   🟠 Orange = Hotel   🟢 Green = Invest                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## View Modes Visualization

### 1️⃣ MARKER VIEW (📍)
```
Shows individual properties with colored dots

🔵━━━━━🟣━━━━━🟠
  ┊      ┊     ┊
  Buy    Rent  Hotel
  
━━━━🟢━━━━━━━━━
    ┊
   Invest

Each dot represents 1 property
Click to see details
```

### 2️⃣ HEATMAP VIEW (🔥)
```
Shows opportunity density with gradient

🔴🟠🟡🟢🔵

Red (Hot) = Highest opportunity
Yellow (Warm) = Good opportunity
Green (Moderate) = Decent opportunity
Blue (Cold) = Lower opportunity

Size of colored area = Property concentration
Intensity = Average ROI score
```

### 3️⃣ CLUSTER VIEW (👥)
```
Groups nearby properties

Large Circle = Many properties
Medium Circle = Some properties
Small Circle = Few properties

Color intensity = Average ROI
Number shown = Property count
Click to zoom into cluster
```

## Statistics Dashboard

```
┌─ GLOBAL STATISTICS ─────────────────────┐
│                                         │
│  📍 PROPERTIES          🌍 COUNTRIES   │
│  46 Available          27 Covered      │
│  ────────────          ─────────────   │
│                                         │
│  💰 VOLUME             ⚡ AVG ROI      │
│  850,000 π             85%             │
│  ────────────          ─────────────   │
│                                         │
│  📈 BULLISH            📉 BEARISH      │
│  28 Trending Up        12 Trending Dn  │
│  ────────────          ─────────────   │
│                                         │
└─────────────────────────────────────────┘
```

## Regional Cards

```
┌─ ASIA ────────────────┐
│ 📍 9 Properties        │
│ ⚡ ROI: 14%            │
│ 📈 Trend: UP           │
│ 🏙️ Top: Bangkok       │
└────────────────────────┘

┌─ EUROPE ──────────────┐
│ 📍 15 Properties       │
│ ⚡ ROI: 7%             │
│ ➡️ Trend: STABLE      │
│ 🏙️ Top: London        │
└────────────────────────┘
```

## Color Coding System

### By Property Type
```
🔵 BUY        Purchase Properties
🟣 RENT       Rental Properties
🟠 HOTEL      Hotel Investments
🟢 INVEST     Business Investment
```

### By Market Trend
```
📈 GREEN      Prices Rising (Bullish)
➡️ AMBER      Prices Stable (Neutral)
📉 RED        Prices Falling (Bearish)
```

### By ROI Level
```
🟢 GREEN (90-100%)  Excellent return
🟡 YELLOW (75-89%)  Very good return
🟠 ORANGE (60-74%)  Good return
🔴 RED (Below 60%)  Fair return
```

## Navigation Flow

```
Start
  ↓
[Choose View Mode]
  ├→ 📍 Markers (see individual properties)
  ├→ 🔥 Heatmap (see opportunities)
  └→ 👥 Clusters (see distribution)
  ↓
[Apply Filters]
  ├→ Type (Buy/Rent/Hotel/Invest)
  ├→ Price Range (slider)
  ├→ Country (multi-select)
  └→ Region (quick buttons)
  ↓
[Sort Results]
  ├→ By Price (low to high)
  ├→ By ROI (high to low)
  └→ By Trend (bullish first)
  ↓
[Explore Properties]
  ├→ Click markers for details
  ├→ Compare statistics
  └→ Check ROI & trend
  ↓
[Take Action]
  ├→ Add to favorites
  ├→ Contact seller
  └→ Share property
```

## Regional Map Boundaries

```
NORTH AMERICA
  └─ [USA] [CANADA]
     └─ NYC, LA, Denver, Miami

SOUTH AMERICA
  └─ [BRAZIL]
     └─ São Paulo

EUROPE
  ├─ [UK] → London
  ├─ [FRANCE] → Paris
  ├─ [GERMANY] → Berlin
  ├─ [SPAIN] → Barcelona, Madrid
  └─ ... 7 more countries

AFRICA
  ├─ [EGYPT] → Cairo
  ├─ [KENYA] → Nairobi
  └─ [S. AFRICA] → Cape Town

MIDDLE EAST
  ├─ [UAE] → Dubai, Abu Dhabi
  ├─ [IRAQ] → Baghdad
  ├─ [SAUDI ARABIA] → Riyadh
  ├─ [QATAR] → Doha
  └─ [JORDAN] → Amman

ASIA
  ├─ [THAILAND] → Bangkok, Phuket
  ├─ [INDONESIA] → Bali
  ├─ [VIETNAM] → Hanoi
  ├─ [SINGAPORE]
  ├─ [HONG KONG]
  └─ [JAPAN] → Tokyo
```

## Feature Buttons Reference

```
┌─ TOUR BUTTONS ─────────────────────┐
│ [🌍] Global Tour      View all 46  │
│ [⭐] Top ROI          Best return  │
└─────────────────────────────────────┘

┌─ REGION BUTTONS ───────────────────┐
│ [AS] Asia             13-15% ROI   │
│ [EU] Europe           6-8% ROI     │
│ [AM] Americas         8-10% ROI    │
│ [AF] Africa           12-15% ROI   │
│ [ME] Middle East      11-18% ROI   │
└─────────────────────────────────────┘

┌─ VIEW BUTTONS ─────────────────────┐
│ [📍] Markers          Precise locs │
│ [🔥] Heatmap          Opportunity │
│ [👥] Clusters         Distribution│
└─────────────────────────────────────┘

┌─ CONTROL BUTTONS ──────────────────┐
│ [👁️] Stats            Show/Hide   │
│ [🎛️] Filter           Advanced    │
│ [▼] Collapse          Save space  │
└─────────────────────────────────────┘
```

## Market Sentiment Indicator

```
BULLISH (📈)
┌─────────────────────┐
│ ✓ More up trends    │
│ ✓ Positive momentum │
│ ✓ Good time to buy  │
└─────────────────────┘
  Percentage: 60-100% positive

NEUTRAL (➡️)
┌─────────────────────┐
│ ≈ Balanced trends   │
│ ≈ Steady momentum   │
│ ≈ Hold positions    │
└─────────────────────┘
  Percentage: 40-60% positive

BEARISH (📉)
┌─────────────────────┐
│ ✗ More down trends  │
│ ✗ Negative momentum │
│ ✗ Wait for dip      │
└─────────────────────┘
  Percentage: 0-40% positive
```

## Mobile Layout

```
┌───────────────┐
│  [▼] Hide     │  ← Toggle
├───────────────┤
│ 📍46 🌍27    │
│ 💰850K ⚡85% │  ← Compact Stats
├───────────────┤
│ AS·9·14% 📈  │
│ EU·15·7% ➡️  │  ← Regional Cards
│ AM·8·9% 📈   │
│ AF·4·13% 📈  │
│ ME·6·14% 📈  │
├───────────────┤
│ 🔍 Search    │
│ [All] [Buy]  │  ← Filters
│ [Rent] [Hot] │
│ [Inv]        │
├───────────────┤
│              │
│              │
│   MAP VIEW   │  ← Full screen
│              │
│              │
├───────────────┤
│ [🌍][⭐][AS] │  ← Controls
│ [EU][AM][AF] │
│ [ME][📍][🔥] │
│ [👥][👁️]     │
└───────────────┘
```

## Interaction Gestures

```
DESKTOP                    MOBILE
────────────────────────────────────
Click on marker     →      Tap on marker
Drag to pan         →      Swipe to pan
Scroll to zoom      →      Pinch to zoom
Hover for preview   →      Long press
Double-click zoom   →      Double tap

Mouse           →         Touch
────────────────────────────────────
Left click      →         Tap
Hover           →         Hover (if supported)
Right-click     →         Long press
Scroll wheel     →         Pinch
```

## Keyboard Shortcuts (Coming Soon)

```
[G] → Global Tour
[R] → Refresh Data
[S] → Toggle Stats
[H] → Toggle Header
[M] → Switch View Modes
[1] → Markers View
[2] → Heatmap View
[3] → Clusters View
[ESC] → Close Details
```

## Screen Size Breakpoints

```
┌─ MOBILE (< 768px) ─────────────────┐
│ • Single column stats              │
│ • Compact buttons                  │
│ • Scrollable controls              │
│ • Touch-optimized                  │
└─────────────────────────────────────┘

┌─ TABLET (768px - 1024px) ──────────┐
│ • 3-column stats                   │
│ • Medium buttons                   │
│ • Flex layout                      │
│ • Balanced design                  │
└─────────────────────────────────────┘

┌─ DESKTOP (> 1024px) ───────────────┐
│ • 6-column stats                   │
│ • Full controls visible            │
│ • Horizontal scrolling             │
│ • Optimal experience               │
└─────────────────────────────────────┘
```

---

**Visual Guide Version**: 1.0
**Updated**: March 2026
**UI Framework**: Tailwind CSS + shadcn/ui
**Map Library**: Leaflet
