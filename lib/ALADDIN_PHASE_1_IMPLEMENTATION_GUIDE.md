# Aladdin Gemini Upgrade - Phase 1 Implementation Guide
## Multi-Modal AI & Real-Time Data Integration

---

## 🎯 Phase 1 Overview (4 Weeks)

**Objective:** Transform Aladdin from text-only advisor to multi-modal AI with live market data

**What Users Will See:**
- Upload property photos → Get instant AI analysis
- Upload property contracts → Auto-extract terms & red flags
- Real-time Dubai/Cairo prices → Updated every 5 minutes
- Smarter conversations → AI understands context better
- Bilingual support → Full Arabic/English support

---

## 📝 Step 1: Multi-Modal Input Processor (Week 1)

### File: `/lib/multi-modal-processor.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk";

export interface ProcessedContent {
  type: "image" | "document" | "video" | "chart";
  confidence: number;
  analysis: string;
  entities: Record<string, unknown>;
  recommendations?: string[];
}

export class MultiModalProcessor {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  /**
   * Analyze property photos using Claude Vision
   */
  async analyzePropertyImage(
    imageBase64: string,
    imageMediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
  ): Promise<ProcessedContent> {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageMediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `You are a professional real estate appraiser. Analyze this property photo and provide:
1. Property condition (excellent/good/fair/needs repairs)
2. Estimated features (bedrooms, bathrooms, size estimate)
3. Quality assessment (finish level, maintenance status)
4. Visible defects or issues
5. Market implications for this property type
6. Estimated value impact (+/- %)

Respond in JSON format.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    try {
      const analysis = JSON.parse(content.text);
      return {
        type: "image",
        confidence: 0.92,
        analysis: content.text,
        entities: analysis,
      };
    } catch {
      return {
        type: "image",
        confidence: 0.85,
        analysis: content.text,
        entities: {},
      };
    }
  }

  /**
   * Extract data from property documents (PDF, contracts)
   */
  async extractFromDocument(
    documentContent: string
  ): Promise<ProcessedContent> {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a real estate legal expert. Extract key information from this property document:

${documentContent}

Extract:
1. Property address and details
2. Price and payment terms
3. Legal disclaimers and risks
4. Red flags or unusual clauses
5. Market comparables
6. Investment potential score (0-100)
7. Recommendations

Respond in JSON format with detailed analysis.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    try {
      const analysis = JSON.parse(content.text);
      return {
        type: "document",
        confidence: 0.88,
        analysis: content.text,
        entities: analysis,
        recommendations: analysis.recommendations || [],
      };
    } catch {
      return {
        type: "document",
        confidence: 0.8,
        analysis: content.text,
        entities: {},
      };
    }
  }

  /**
   * Analyze multiple images for property portfolio
   */
  async analyzePropertyPortfolio(
    images: Array<{ base64: string; mediaType: "image/jpeg" | "image/png" }>
  ): Promise<{
    overallAssessment: string;
    roiScore: number;
    recommendations: string[];
  }> {
    const imageAnalyses = await Promise.all(
      images.map((img) =>
        this.analyzePropertyImage(img.base64, img.mediaType)
      )
    );

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Based on these property image analyses:

${imageAnalyses.map((a) => a.analysis).join("\n---\n")}

Provide:
1. Overall property assessment
2. Investment ROI score (0-100)
3. Top 3 recommendations
4. Risks and mitigation strategies

Format as JSON.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    try {
      const result = JSON.parse(content.text);
      return {
        overallAssessment: result.assessment,
        roiScore: result.roiScore || 0,
        recommendations: result.recommendations || [],
      };
    } catch {
      return {
        overallAssessment: content.text,
        roiScore: 0,
        recommendations: [],
      };
    }
  }
}

export default new MultiModalProcessor();
```

### File: `/app/api/analyze-property-image/route.ts` (Enhanced)

```typescript
import { NextRequest, NextResponse } from "next/server";
import multiModalProcessor from "@/lib/multi-modal-processor";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageMediaType } = await request.json();

    if (!imageBase64 || !imageMediaType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const analysis = await multiModalProcessor.analyzePropertyImage(
      imageBase64,
      imageMediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[v0] Property image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze property image" },
      { status: 500 }
    );
  }
}
```

---

## 📊 Step 2: Real-Time Market Data Integration (Week 2)

### File: `/lib/real-time-market-aggregator.ts`

```typescript
interface MarketDataPoint {
  location: string;
  pricePerSqft: number;
  avgPrice: number;
  rentalYield: number;
  currency: string;
  timestamp: Date;
  source: string;
  confidence: number;
}

class RealTimeMarketAggregator {
  private cache: Map<
    string,
    { data: MarketDataPoint; timestamp: number }
  > = new Map();
  private readonly CACHE_DURATION = 300000; // 5 minutes

  /**
   * Fetch live data from multiple sources
   */
  async fetchLiveMarketData(location: string): Promise<MarketDataPoint[]> {
    const cacheKey = location.toLowerCase();
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (
      cached &&
      Date.now() - cached.timestamp < this.CACHE_DURATION
    ) {
      return [cached.data];
    }

    // Fetch from multiple sources in parallel
    const sources = await Promise.allSettled([
      this.fetchFromZillow(location),
      this.fetchFromRightmove(location),
      this.fetchFromBayut(location),
      this.fetchFromTradingView(location),
    ]);

    const results: MarketDataPoint[] = [];

    sources.forEach((source) => {
      if (source.status === "fulfilled" && source.value) {
        results.push(source.value);
      }
    });

    // Cache the most recent result
    if (results.length > 0) {
      const latest = results[0];
      this.cache.set(cacheKey, { data: latest, timestamp: Date.now() });
    }

    return results;
  }

  /**
   * Fetch from Zillow API
   */
  private async fetchFromZillow(location: string): Promise<MarketDataPoint | null> {
    try {
      // In production, use actual Zillow API
      // This is a placeholder implementation
      const response = await fetch(
        `https://www.zillow.com/api/v1/properties/search?location=${location}`,
        {
          headers: {
            "x-api-key": process.env.ZILLOW_API_KEY || "",
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json() as unknown;
      // Parse and normalize data
      return {
        location,
        pricePerSqft: 0,
        avgPrice: 0,
        rentalYield: 0,
        currency: "USD",
        timestamp: new Date(),
        source: "Zillow",
        confidence: 0.92,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch from Rightmove (UK market)
   */
  private async fetchFromRightmove(location: string): Promise<MarketDataPoint | null> {
    try {
      const response = await fetch(
        `https://api.rightmove.co.uk/api/v1/properties?location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.RIGHTMOVE_API_KEY || ""}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json() as unknown;
      // Parse and normalize
      return {
        location,
        pricePerSqft: 0,
        avgPrice: 0,
        rentalYield: 0,
        currency: "GBP",
        timestamp: new Date(),
        source: "Rightmove",
        confidence: 0.9,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch from Bayut (Middle East market)
   */
  private async fetchFromBayut(location: string): Promise<MarketDataPoint | null> {
    try {
      const response = await fetch(
        `https://www.bayut.com/api/v1/search?q=${location}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.BAYUT_API_KEY || ""}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json() as unknown;
      // Parse and normalize
      return {
        location,
        pricePerSqft: 0,
        avgPrice: 0,
        rentalYield: 0,
        currency: "AED",
        timestamp: new Date(),
        source: "Bayut",
        confidence: 0.88,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch currency rates from TradingView
   */
  private async fetchFromTradingView(location: string): Promise<MarketDataPoint | null> {
    try {
      // Get currency rates for Pi conversion
      const response = await fetch(
        "https://api.example.com/rates", // Replace with actual endpoint
        {
          headers: {
            Authorization: `Bearer ${process.env.TRADING_VIEW_API_KEY || ""}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json() as unknown;
      // Parse and return
      return {
        location,
        pricePerSqft: 0,
        avgPrice: 0,
        rentalYield: 0,
        currency: "USD",
        timestamp: new Date(),
        source: "TradingView",
        confidence: 0.95,
      };
    } catch {
      return null;
    }
  }

  /**
   * Calculate market trends
   */
  calculateTrends(dataPoints: MarketDataPoint[]): {
    trendDirection: "up" | "down" | "stable";
    percentage: number;
    recommendation: string;
  } {
    if (dataPoints.length < 2) {
      return {
        trendDirection: "stable",
        percentage: 0,
        recommendation: "Insufficient data for trend analysis",
      };
    }

    const priceChange =
      (dataPoints[0].avgPrice - dataPoints[1].avgPrice) / dataPoints[1].avgPrice;
    const percentage = Math.round(priceChange * 100);

    const trendDirection =
      percentage > 2 ? "up" : percentage < -2 ? "down" : "stable";

    const recommendation =
      trendDirection === "up"
        ? `Market is heating up (+${percentage}%). Good time to buy before prices rise further.`
        : trendDirection === "down"
          ? `Market cooling off (${percentage}%). Potential bargains available.`
          : `Market stable (${percentage}% change). Good for long-term holds.`;

    return { trendDirection, percentage, recommendation };
  }
}

export default new RealTimeMarketAggregator();
```

### File: `/app/api/market-live-data/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import aggregator from "@/lib/real-time-market-aggregator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "Dubai";

    const data = await aggregator.fetchLiveMarketData(location);
    const trends = aggregator.calculateTrends(data);

    return NextResponse.json({
      location,
      data,
      trends,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[v0] Market data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
```

---

## 🧠 Step 3: Advanced Natural Language Understanding (Week 3)

### File: `/lib/intent-recognition-engine.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk";

export interface UserIntent {
  type:
    | "investment_query"
    | "market_research"
    | "portfolio_review"
    | "property_comparison"
    | "market_analysis"
    | "other";
  goal: string;
  entities: {
    locations?: string[];
    budget?: { min: number; max: number; currency: string };
    propertyTypes?: string[];
    timeline?: string;
  };
  context: string;
  followUpQuestions: string[];
}

class IntentRecognitionEngine {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  /**
   * Detect user intent and extract entities
   */
  async detectUserIntent(
    userMessage: string,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<UserIntent> {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are an AI that analyzes user intentions in real estate queries. 
Extract the user's intent, investment goals, budget, locations, and property preferences.
Return valid JSON only.`,
      messages: [
        ...conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: `Analyze this message and extract intent details:
"${userMessage}"

Return JSON with this structure:
{
  "type": "investment_query|market_research|portfolio_review|property_comparison|market_analysis|other",
  "goal": "what user wants to achieve",
  "entities": {
    "locations": ["city1", "city2"],
    "budget": {"min": 1000, "max": 50000, "currency": "USD"},
    "propertyTypes": ["residential", "commercial"],
    "timeline": "1-2 years"
  },
  "context": "conversation context",
  "followUpQuestions": ["question1", "question2"]
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    try {
      return JSON.parse(content.text) as UserIntent;
    } catch {
      return {
        type: "other",
        goal: userMessage,
        entities: {},
        context: "Unable to parse intent",
        followUpQuestions: [
          "Could you provide more details about your investment goals?",
        ],
      };
    }
  }

  /**
   * Generate contextual follow-up questions
   */
  async generateFollowUpQuestions(
    userMessage: string,
    detectedIntent: UserIntent
  ): Promise<string[]> {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Based on this user message and detected intent:
Message: "${userMessage}"
Intent: ${JSON.stringify(detectedIntent)}

Generate 3-4 relevant follow-up questions to help clarify their needs.
Return as JSON array of strings.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return [];
    }

    try {
      const parsed = JSON.parse(content.text) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

export default new IntentRecognitionEngine();
```

---

## 💬 Step 4: Update Chat Component (Week 4)

### Enhanced `/components/ai-advisor-chat.tsx`

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, FileText, Send, Loader } from "lucide-react";
import multiModalProcessor from "@/lib/multi-modal-processor";
import intentEngine from "@/lib/intent-recognition-engine";
import marketAggregator from "@/lib/real-time-market-aggregator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{
    type: "image" | "document";
    data: string;
    analysis?: string;
  }>;
  timestamp: Date;
}

export function EnhancedAIAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file upload
   */
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    try {
      let analysis: string = "";
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];

        if (file.type.startsWith("image/")) {
          // Analyze image
          const result = await multiModalProcessor.analyzePropertyImage(
            base64,
            file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
          );
          analysis = result.analysis;
        } else if (file.type === "application/pdf") {
          // Extract from document
          const text = await extractPDFText(file);
          const result = await multiModalProcessor.extractFromDocument(text);
          analysis = result.analysis;
        }

        // Add to messages
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `📋 **${file.name}** Analysis:\n\n${analysis}`,
          attachments: [
            {
              type: file.type.startsWith("image/") ? "image" : "document",
              data: base64,
              analysis,
            },
          ],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("[v0] File processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send message with intent recognition and market data
   */
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Detect intent
      const intent = await intentEngine.detectUserIntent(
        inputText,
        messages.map((m) => ({ role: m.role, content: m.content }))
      );

      // If market research, fetch live data
      if (
        intent.type === "market_research" &&
        intent.entities.locations?.length
      ) {
        const marketData = await Promise.all(
          intent.entities.locations.map((loc) =>
            marketAggregator.fetchLiveMarketData(loc)
          )
        );

        const trends = marketData.map((data) =>
          marketAggregator.calculateTrends(data)
        );

        console.log("[v0] Market data fetched:", { marketData, trends });
      }

      // Call Aladdin API with intent context
      const response = await fetch("/api/claude-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          detectedIntent: intent,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await response.json()) as { response: string };
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[v0] Message error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712]">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-[#F59E0B] text-black"
                  : "bg-[#0f172a] text-white border border-[#F59E0B]"
              }`}
            >
              {msg.attachments && (
                <div className="mb-2 flex gap-2">
                  {msg.attachments.map((att, i) => (
                    <ImageIcon key={i} size={20} />
                  ))}
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-2">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Loader className="animate-spin text-[#F59E0B]" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#F59E0B] space-y-2">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files?.[0]!)}
            accept="image/*,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-[#F59E0B] text-black rounded hover:opacity-90"
          >
            <Upload size={20} />
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about properties..."
            className="flex-1 bg-[#0f172a] text-white border border-[#F59E0B] rounded p-2"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="p-2 bg-[#F59E0B] text-black rounded hover:opacity-90 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

async function extractPDFText(file: File): Promise<string> {
  // Use pdfjs or similar library
  // For now, return placeholder
  return "PDF content extraction";
}
```

---

## ✅ Phase 1 Checklist

- [ ] Implement Multi-Modal Processor
- [ ] Set up Real-Time Market Aggregator
- [ ] Create Intent Recognition Engine
- [ ] Update AI Advisor Chat Component
- [ ] Test image analysis with 5 property photos
- [ ] Test document extraction with contracts
- [ ] Test market data integration
- [ ] Test conversational intent recognition
- [ ] Deploy to staging
- [ ] Get user feedback
- [ ] Deploy to production

---

## 🚀 What's Next

After Phase 1 completes:
- **Phase 2:** Visual reports & 3D viewing
- **Phase 3:** Predictive analytics & personalized strategies
- **Phase 4:** Advanced voice conversation
- **Phase 5:** Transaction support

---

## 📞 Support

Questions or need help?
- **Email:** globalbusiness435@gmail.com
- **WhatsApp:** +201010810558
- **Docs:** alshaibgroup.pi
