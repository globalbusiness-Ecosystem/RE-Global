'use client';

import { Building2, Home, Hotel, TrendingUp, Globe, FileText, MapPin, Users, Zap, BarChart3, ShoppingCart, Video, Bot, Glasses } from 'lucide-react';
import { useState } from 'react';
import HeroSlider from '@/components/hero-slider';
import PanoramicBanner from '@/components/panoramic-banner';
import { UnifiedPaymentButton } from '@/components/unified-payment-button';
import AIAdvisorChat from '@/components/ai-advisor-chat';
import AIAdvisorVoiceChat from '@/components/ai-advisor-voice-chat';
import { VRPropertyTourViewer } from '@/components/vr-property-tour-viewer';
import { DEMO_PROPERTY } from '@/lib/vr-tour-config';

interface HomePageProps {
  language: 'en' | 'ar';
  onCategoryClick?: (categoryId: string) => void;
}

const categories = [
  {
    id: 'buy',
    titleEn: 'Buy',
    titleAr: 'شراء',
    icon: Home,
    color: 'from-accent to-secondary',
  },
  {
    id: 'rent',
    titleEn: 'Rent',
    titleAr: 'إيجار',
    icon: Building2,
    color: 'from-secondary to-accent',
  },
  {
    id: 'hotel',
    titleEn: 'Hotel',
    titleAr: 'فندق',
    icon: Hotel,
    color: 'from-accent via-secondary to-accent',
  },
  {
    id: 'invest',
    titleEn: 'Invest',
    titleAr: 'استثمر',
    icon: TrendingUp,
    color: 'from-secondary to-accent',
  },
  {
    id: 'tokenized',
    titleEn: 'Tokenized',
    titleAr: 'رمزية',
    icon: Zap,
    color: 'from-accent to-secondary',
  },
  {
    id: 'abroad',
    titleEn: 'Abroad',
    titleAr: 'بالخارج',
    icon: Globe,
    color: 'from-secondary to-accent',
  },
  {
    id: 'offplan',
    titleEn: 'Off-Plan',
    titleAr: 'قيد الإنشاء',
    icon: FileText,
    color: 'from-accent to-secondary',
  },
  {
    id: 'map',
    titleEn: 'Map',
    titleAr: 'الخريطة',
    icon: MapPin,
    color: 'from-secondary to-accent',
  },
  {
    id: 'partners',
    titleEn: 'Partners',
    titleAr: 'الشركاء',
    icon: Users,
    color: 'from-accent to-secondary',
  },
  {
    id: 'analytics',
    titleEn: 'Analytics',
    titleAr: 'إحصائيات',
    icon: BarChart3,
    color: 'from-secondary to-accent',
  },
  {
    id: 'vr-tour',
    titleEn: 'VR Tour',
    titleAr: 'جولة واقع معزز',
    icon: Glasses,
    color: 'from-accent to-secondary',
  },
  {
    id: 'ai-tour',
    titleEn: 'AI Tour',
    titleAr: 'جولة ذكية',
    icon: Video,
    color: 'from-accent to-secondary',
  },
  {
    id: 'ai-advisor',
    titleEn: 'Aladdin',
    titleAr: 'علاء الدين',
    icon: Bot,
    color: 'from-secondary to-accent',
  },
];

export default function HomePage({ language, onCategoryClick }: HomePageProps) {
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [useVoiceAdvisor, setUseVoiceAdvisor] = useState(false);
  const [showVRTour, setShowVRTour] = useState(false);
  return (
    <main 
      className="min-h-screen relative overflow-hidden pb-4"
    >
      {/* Hero Slider */}
      <HeroSlider 
        language={language}
        onInvestClick={() => onCategoryClick?.('invest')}
        onTokenizedClick={() => onCategoryClick?.('tokenized')}
      />

      {/* Panoramic Banner */}
      <PanoramicBanner />

      {/* Content Section */}
      <div className="px-4 py-8 max-w-md mx-auto relative z-10 bg-black">
        {/* Stats - Horizontal Compact Row */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-3 pb-2 min-w-min">
            <div className="flex-shrink-0 rounded-lg p-3 flex flex-col items-center gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
              <p className="text-gray-400 text-xs">
                {language === 'en' ? 'Properties' : 'العقارات'}
              </p>
              <p className="text-xl font-bold text-accent">12.5K</p>
            </div>
            <div className="flex-shrink-0 rounded-lg p-3 flex flex-col items-center gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
              <p className="text-gray-400 text-xs">
                {language === 'en' ? 'Countries' : 'الدول'}
              </p>
              <p className="text-xl font-bold text-accent">195</p>
            </div>
            <div className="flex-shrink-0 rounded-lg p-3 flex flex-col items-center gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
              <p className="text-gray-400 text-xs">
                {language === 'en' ? 'Investors' : 'المستثمرون'}
              </p>
              <p className="text-xl font-bold text-accent">45.2K</p>
            </div>
            <div className="flex-shrink-0 rounded-lg p-3 flex flex-col items-center gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
              <p className="text-gray-400 text-xs">
                {language === 'en' ? 'Volume' : 'الحجم'}
              </p>
              <p className="text-xl font-bold text-accent">$2.3B</p>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <h3 className="text-lg font-semibold text-white mb-6 tracking-wide" id="investListings">
          {language === 'en' ? 'Explore Categories' : 'استكشف الفئات'}
        </h3>
        <div className="grid grid-cols-3 gap-5 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'vr-tour') {
                    setShowVRTour(true);
                  } else if (cat.id === 'ai-tour') {
                    setShowVRTour(true);
                  } else if (cat.id === 'ai-advisor') {
                    setShowAdvisor(true);
                  } else {
                    onCategoryClick?.(cat.id);
                  }
                }}
                className="rounded-lg p-5 flex flex-col items-center gap-3 hover:shadow-xl transition duration-300 group border border-gray-800 hover:border-accent"
                style={{ backgroundColor: '#1a2332' }}
              >
                <div className="rounded-lg p-4 transition duration-300" style={{ backgroundColor: '#1a2332' }}>
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <span className="text-xs font-medium text-white text-center leading-tight">
                  {language === 'en' ? cat.titleEn : cat.titleAr}
                </span>
              </button>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeft: '3px solid rgba(212, 175, 55, 0.8)' }}>
          <h3 className="text-lg font-semibold text-white mb-4">
            {language === 'en' ? 'Why Choose RE?' : 'لماذا تختار RE؟'}
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-sm text-gray-300">
                {language === 'en' ? '360° Virtual Tours' : 'جولات افتراضية بزاوية 360 درجة'}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-sm text-gray-300">
                {language === 'en' ? 'Pi Network Payments' : 'دفع عبر شبكة Pi'}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-sm text-gray-300">
                {language === 'en' ? 'Tokenized Real Estate' : 'عقارات رمزية'}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-sm text-gray-300">
                {language === 'en' ? 'Global Coverage' : 'تغطية عالمية'}
              </span>
            </li>
          </ul>
        </div>

        {/* Pi Payment Showcase */}
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderLeft: '3px solid rgba(212, 175, 55, 1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-accent">
              {language === 'en' ? 'Pay with Pi' : 'ادفع بـ Pi'}
            </h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            {language === 'en' 
              ? 'Experience seamless property transactions powered by Pi Network'
              : 'اختبر معاملات العقارات السلسة المدعومة بشبكة Pi'}
          </p>
          <UnifiedPaymentButton
            propertyId="showcase-property-001"
            propertyTitle={language === 'en' ? 'Sample Luxury Property' : 'عقار فاخر للعينة'}
            price={50}
            transactionType="buy"
            language={language}
            currency="PI"
            className="w-full"
            onSuccess={() => {
              // Handle successful payment
            }}
            onError={(error) => {
              console.error('Payment error:', error);
            }}
          />
          <p className="text-xs text-gray-400 mt-3 text-center">
            {language === 'en'
              ? 'Secure • Fast • Decentralized'
              : 'آمن • سريع • لامركزي'}
          </p>
        </div>
      </div>

      {/* VR Tour Modal */}
      {showVRTour && (
        <VRPropertyTourViewer
          property={DEMO_PROPERTY}
          onClose={() => setShowVRTour(false)}
          onBuyClick={() => {
            // Integrate with Pi payment here
            alert('Buy with Pi feature - Integrate with Pi payment SDK');
          }}
        />
      )}

      {/* AI Advisor Chat Modal */}
      {showAdvisor && (
        useVoiceAdvisor ? (
          <AIAdvisorVoiceChat 
            language={language}
            onClose={() => {
              setShowAdvisor(false);
              setUseVoiceAdvisor(false);
            }}
            enableVoice={true}
          />
        ) : (
          <AIAdvisorChat 
            language={language}
            onClose={() => setShowAdvisor(false)}
          />
        )
      )}
    </main>
  );
}
