'use client';

import { MapPin, Bed, Maximize2, MapPin as MapIcon, Video, Heart } from 'lucide-react';
import { useState, useMemo, memo } from 'react';
import { UnifiedPaymentButton } from '@/components/unified-payment-button';
import { SimplePiPaymentButton } from '@/components/simple-pi-payment-button';
import { VRPropertyTourViewer } from '@/components/vr-property-tour-viewer';
import { DEMO_PROPERTY } from '@/lib/vr-tour-config';

interface BuyPageProps {
  language: 'en' | 'ar';
  currency: 'PI' | 'USD';
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const buyProperties = [
  {
    id: 'buy-1',
    titleEn: 'Luxury Downtown Penthouse',
    titleAr: 'بنتهاوس فاخر وسط المدينة',
    price: 850000,
    city: 'Dubai',
    country: 'AE',
    countryFlag: '🇦🇪',
    bedrooms: 3,
    area: 280,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-2',
    titleEn: 'Modern Apartment Manhattan',
    titleAr: 'شقة حديثة في مانهاتن',
    price: 650000,
    city: 'New York',
    country: 'US',
    countryFlag: '🇺🇸',
    bedrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1613490493576-4d884d0b7f2e?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-3',
    titleEn: 'Beachfront Villa Thailand',
    titleAr: 'فيلا على الشاطئ في تايلاند',
    price: 450000,
    city: 'Phuket',
    country: 'TH',
    countryFlag: '🇹🇭',
    bedrooms: 4,
    area: 320,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-4',
    titleEn: 'Contemporary House London',
    titleAr: 'منزل معاصر في لندن',
    price: 750000,
    city: 'London',
    country: 'GB',
    countryFlag: '🇬🇧',
    bedrooms: 3,
    area: 200,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-5',
    titleEn: 'Urban Condo Tokyo',
    titleAr: 'شقة حضرية في طوكيو',
    price: 520000,
    city: 'Tokyo',
    country: 'JP',
    countryFlag: '🇯🇵',
    bedrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-6',
    titleEn: 'Hillside Estate Paris',
    titleAr: 'عقار على التل في باريس',
    price: 920000,
    city: 'Paris',
    country: 'FR',
    countryFlag: '🇫🇷',
    bedrooms: 4,
    area: 350,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
  {
    id: 'buy-7',
    titleEn: 'Seaside Retreat Sydney',
    titleAr: 'ملاذ ساحلي في سيدني',
    price: 580000,
    city: 'Sydney',
    country: 'AU',
    countryFlag: '🇦🇺',
    bedrooms: 3,
    area: 240,
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop',
    panoramaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg',
  },
];

// Memoized property card to prevent unnecessary re-renders
const PropertyCard = memo(({ 
  property, 
  language, 
  currency, 
  isFavorite, 
  onToggleFavorite,
  onTourClick,
}: {
  property: typeof buyProperties[0];
  language: 'en' | 'ar';
  currency: 'PI' | 'USD';
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onTourClick: () => void;
}) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition">
    <div className="relative aspect-video overflow-hidden bg-muted">
      <img
        loading="lazy"
        src={property.image}
        alt={language === 'en' ? property.titleEn : property.titleAr}
        className="w-full h-full object-cover hover:scale-105 transition-transform"
      />
      <button
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite ? 'fill-accent text-accent' : 'text-white'
          }`}
        />
      </button>
      <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm font-semibold">
        {property.countryFlag}
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div>
        <h3 className="font-bold text-lg line-clamp-1">
          {language === 'en' ? property.titleEn : property.titleAr}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          <span>
            {property.city}, {property.country}
          </span>
        </div>
      </div>

      <div className="flex gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Bed className="w-4 h-4" />
          <span>{property.bedrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Maximize2 className="w-4 h-4" />
          <span>{property.area} m²</span>
        </div>
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {language === 'en' ? 'Price' : 'السعر'}
          </p>
          <p className="text-xl font-bold text-accent">
            {property.price.toLocaleString()} {currency}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <SimplePiPaymentButton
          propertyId={property.id}
          language={language}
          className="col-span-1"
        />
        <button 
          onClick={() => {
            sessionStorage.setItem('focusProperty', JSON.stringify({
              lat: 0,
              lng: 0,
              title: language === 'en' ? property.titleEn : property.titleAr,
              price: property.price,
              category: 'buy',
              id: property.id,
              city: property.city,
              country: property.country,
              countryFlag: property.countryFlag,
              bedrooms: property.bedrooms,
              area: property.area,
              image: property.image,
            }));
            window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'map' }));
          }}
          className="border border-accent text-accent py-2 rounded-lg font-semibold hover:bg-accent/10 transition text-sm"
          title={language === 'en' ? 'View on Map' : 'اعرض على الخريطة'}
        >
          📍
        </button>
        <button 
          onClick={onTourClick}
          className="border border-accent text-accent py-2 rounded-lg font-semibold hover:bg-accent/10 transition text-sm"
          title={language === 'en' ? 'Virtual Tour' : 'جولة افتراضية'}
        >
          <Video className="w-4 h-4 mx-auto" />
        </button>
      </div>
    </div>
  </div>
));

PropertyCard.displayName = 'PropertyCard';

export default function BuyPage({ language, currency, favorites, toggleFavorite }: BuyPageProps) {
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  
  // Memoize favorites lookup for better performance
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const activeTourProperty = buyProperties.find((p) => p.id === activeTourId);

  // If viewing tour, show VR Tour viewer
  if (activeTourId) {
    return (
      <VRPropertyTourViewer
        property={DEMO_PROPERTY}
        onClose={() => setActiveTourId(null)}
        onBuyClick={() => {
          // Integrate with Pi payment here
          alert('Buy with Pi feature - Integrate with Pi payment SDK');
        }}
      />
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent mb-2">
          {language === 'en' ? 'Buy Properties' : 'شراء العقارات'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en' ? 'Discover premium properties worldwide' : 'اكتشف العقارات الفاخرة في جميع أنحاء العالم'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buyProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            language={language}
            currency={currency}
            isFavorite={favoriteSet.has(property.id)}
            onToggleFavorite={() => toggleFavorite(property.id)}
            onTourClick={() => setActiveTourId(property.id)}
          />
        ))}
      </div>
    </div>
  );
}
